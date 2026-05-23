import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { decideAdminModerationApi, getAdminModerationQueueApi, TAdminModerationUser } from '../../api/Api';
import { useNavigate } from 'react-router-dom';

type AdminTab = 'dashboard' | 'users' | 'moderation' | 'taxonomy';

const menuItems: Array<{ key: AdminTab; label: string }> = [
  { key: 'dashboard', label: 'Дашборд' },
  { key: 'users', label: 'Пользователи' },
  { key: 'moderation', label: 'Модерация' },
  { key: 'taxonomy', label: 'Таксономия' },
];

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<AdminTab>('moderation');
  const [queue, setQueue] = useState<TAdminModerationUser[]>([]);
  const [isLoadingQueue, setIsLoadingQueue] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadQueue = useCallback(async () => {
    setIsLoadingQueue(true);
    try {
      const data = await getAdminModerationQueueApi();
      setQueue(data);
    } catch (error) {
      console.error('Failed to load moderation queue:', error);
      alert('Не удалось загрузить очередь модерации');
    } finally {
      setIsLoadingQueue(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'moderation') {
      void loadQueue();
    }
  }, [activeTab, loadQueue]);

  const handleDecision = async (userId: string, action: 'approve' | 'reject') => {
    setProcessingId(userId);
    try {
      await decideAdminModerationApi(userId, action);
      setQueue((prev) => prev.filter((item) => item.id !== userId));
    } catch (error) {
      console.error('Failed moderation decision:', error);
      alert('Не удалось сохранить решение модератора');
    } finally {
      setProcessingId(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/auth/login');
  };

  const stats = useMemo(
    () => ({
      pending: queue.length,
      totalUsers: '1,284',
      activeSessions: '412',
    }),
    [queue.length],
  );

  return (
    <div className="min-h-screen bg-[#f3f2fb] text-slate-800 font-sans">
      <div className="mx-auto max-w-[1400px] px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-5">
          <aside className="rounded-2xl bg-[#eceaf7] border border-[#dfddf0] p-5 flex flex-col min-h-[86vh]">
            <div className="mb-8">
              <h1 className="text-2xl font-black text-[#1f43bf]">Exchange</h1>
              <p className="text-xs tracking-wide text-slate-500 mt-1 uppercase">Панель управления</p>
            </div>

            <nav className="space-y-2 flex-1">
              {menuItems.map((item) => (
                <button
                  key={item.key}
                  onClick={() => setActiveTab(item.key)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    activeTab === item.key
                      ? 'bg-white text-[#1f43bf] shadow-sm'
                      : 'text-slate-600 hover:bg-white/70'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>

            <button
              type="button"
              onClick={handleLogout}
              className="mt-6 w-full rounded-xl border border-[#d1cee8] bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Выйти
            </button>
          </aside>

          <main className="rounded-2xl border border-[#dfddf0] bg-[#f7f6fc] p-6 lg:p-8">
            <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h2 className="text-4xl font-black text-[#232f60]">Админ-панель</h2>
                <p className="text-slate-500 mt-2">
                  Управление модерацией пользователей, доступами и каталогом платформы.
                </p>
              </div>
              <div className="grid grid-cols-3 gap-3 w-full md:w-auto">
                <div className="rounded-xl border border-[#d9d6eb] bg-white px-4 py-3">
                  <p className="text-xs uppercase text-slate-500">На модерации</p>
                  <p className="text-xl font-black text-[#ce2d55]">{stats.pending}</p>
                </div>
                <div className="rounded-xl border border-[#d9d6eb] bg-white px-4 py-3">
                  <p className="text-xs uppercase text-slate-500">Пользователи</p>
                  <p className="text-xl font-black text-[#1f43bf]">{stats.totalUsers}</p>
                </div>
                <div className="rounded-xl border border-[#d9d6eb] bg-white px-4 py-3">
                  <p className="text-xs uppercase text-slate-500">Сессии</p>
                  <p className="text-xl font-black text-[#1d9d62]">{stats.activeSessions}</p>
                </div>
              </div>
            </header>

            {activeTab !== 'moderation' && (
              <section className="rounded-2xl border border-[#ddd9ef] bg-white p-8">
                <h3 className="text-2xl font-black text-[#232f60] mb-3">
                  {activeTab === 'dashboard' && 'Обзор системы'}
                  {activeTab === 'users' && 'Управление пользователями'}
                  {activeTab === 'taxonomy' && 'Управление таксономией'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="h-28 rounded-xl bg-[#eff1ff] border border-[#d5daf8]" />
                  <div className="h-28 rounded-xl bg-[#f4efff] border border-[#ddd2ff]" />
                  <div className="h-28 rounded-xl bg-[#eef9f3] border border-[#ccecd9]" />
                </div>
              </section>
            )}

            {activeTab === 'moderation' && (
              <section className="rounded-2xl border border-[#ddd9ef] bg-white p-6">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-2xl font-black text-[#232f60]">Очередь модерации</h3>
                  <button
                    type="button"
                    onClick={() => void loadQueue()}
                    className="rounded-xl border border-[#d5d1eb] px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Обновить
                  </button>
                </div>

                {isLoadingQueue && <p className="text-slate-500">Загрузка...</p>}

                {!isLoadingQueue && queue.length === 0 && (
                  <div className="rounded-xl border border-dashed border-[#d6d2e8] bg-[#faf9ff] p-8 text-center text-slate-500">
                    Сейчас нет пользователей в статусе «На модерации».
                  </div>
                )}

                {!isLoadingQueue && queue.length > 0 && (
                  <div className="space-y-4">
                    {queue.map((user) => (
                      <article
                        key={user.id}
                        className="rounded-xl border border-[#e6e3f2] bg-[#fcfbff] p-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
                      >
                        <div className="min-w-0">
                          <p className="text-sm text-slate-500">ID: {user.id}</p>
                          <h4 className="text-lg font-black text-[#253268] truncate">{user.fullName}</h4>
                          <p className="text-sm text-slate-600">{user.email}</p>
                          <p className="text-xs text-slate-500 mt-1">Дата регистрации: {formatDate(user.createdAt)}</p>
                          <p className="text-xs text-slate-500 mt-1">
                            Навыки: {(user.offerTags || []).slice(0, 3).join(', ') || 'не указаны'}
                          </p>
                        </div>

                        <div className="flex gap-2 shrink-0">
                          <button
                            type="button"
                            disabled={processingId === user.id}
                            onClick={() => void handleDecision(user.id, 'reject')}
                            className="rounded-xl bg-[#ffe9ee] text-[#c0234b] px-4 py-2 text-sm font-semibold hover:bg-[#ffdbe4] disabled:opacity-60"
                          >
                            Отклонить
                          </button>
                          <button
                            type="button"
                            disabled={processingId === user.id}
                            onClick={() => void handleDecision(user.id, 'approve')}
                            className="rounded-xl bg-[#1f43bf] text-white px-4 py-2 text-sm font-semibold hover:bg-[#1a38a3] disabled:opacity-60"
                          >
                            Подтвердить
                          </button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
