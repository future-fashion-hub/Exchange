import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { decideOfferApi, getOffersApi } from '../../api/Api';
import { TExchange } from '../../api/types';
import { connectSocket } from '../../shared/lib/socketClient';
import { toAbsoluteServerUrl } from '../../shared/lib/helpers';
import skillPlaceholder from '../../shared/assets/images/school-board.png';

const STATUS_LABEL: Record<TExchange['status'], string> = {
  PENDING: 'Ожидает решения',
  ACCEPTED: 'Принят',
  REJECTED: 'Отклонен',
  COMPLETED: 'Завершен',
};

export const MyExchangesPage: React.FC = () => {
  const navigate = useNavigate();
  const [incoming, setIncoming] = useState<TExchange[]>([]);
  const [outgoing, setOutgoing] = useState<TExchange[]>([]);
  const [accepted, setAccepted] = useState<TExchange[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const loadExchanges = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getOffersApi();
      setIncoming(data.incoming);
      setOutgoing(data.outgoing);
      setAccepted(data.accepted);
    } catch (error) {
      console.error('Failed to load exchanges:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/auth/login');
      return;
    }

    void loadExchanges();
  }, [loadExchanges, navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    const socket = connectSocket(token);
    const refresh = () => void loadExchanges();
    socket.on('notify:new', refresh);

    return () => {
      socket.off('notify:new', refresh);
    };
  }, [loadExchanges]);

  const incomingPending = useMemo(
    () => incoming.filter((item) => item.status === 'PENDING'),
    [incoming],
  );

  const handleDecision = async (offerId: string, action: 'approve' | 'reject') => {
    setProcessingId(offerId);
    try {
      const updated = await decideOfferApi(offerId, action);
      await loadExchanges();

      if (updated.status === 'ACCEPTED') {
        navigate(`/profile/chat?peerId=${updated.peer.id}`);
      }
    } catch (error) {
      console.error('Offer decision error:', error);
      alert('Не удалось сохранить решение по обмену.');
    } finally {
      setProcessingId(null);
    }
  };

  const openChat = (peerId: string) => {
    navigate(`/profile/chat?peerId=${peerId}`);
  };

  const renderCard = (item: TExchange, actions?: React.ReactNode) => {
    const avatar = item.peer.avatarUrl
      ? toAbsoluteServerUrl(item.peer.avatarUrl)
      : skillPlaceholder;

    return (
      <article
        key={item.id}
        className="rounded-2xl border border-[#dfe2f0] bg-white p-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3 min-w-0">
          <img
            src={avatar}
            alt={item.peer.fullName}
            className="w-12 h-12 rounded-full object-cover border border-[#d8deef]"
            onError={(e) => {
              (e.target as HTMLImageElement).src = skillPlaceholder;
            }}
          />
          <div className="min-w-0">
            <p className="font-bold text-slate-800 truncate">{item.peer.fullName}</p>
            <p className="text-sm text-slate-500 truncate">{item.peer.email}</p>
            <p className="text-xs text-slate-400 mt-1">
              Статус: {STATUS_LABEL[item.status]}
            </p>
          </div>
        </div>
        {actions && <div className="flex gap-2 shrink-0">{actions}</div>}
      </article>
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen bg-gray-50">
      <header className="mb-8">
        <h1 className="text-4xl font-black text-slate-900">Мои обмены</h1>
        <p className="text-slate-500 mt-2">
          Здесь отображаются входящие запросы, ваши предложения и принятые обмены.
        </p>
      </header>

      {isLoading && <p className="text-slate-500 mb-6">Загрузка обменов...</p>}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-[#dfe2f0] bg-[#f7f8fe] p-5">
          <h2 className="text-2xl font-black text-slate-900 mb-4">Входящие запросы</h2>
          <div className="space-y-3">
            {incomingPending.length === 0 && (
              <p className="text-sm text-slate-500">Пока нет новых входящих запросов.</p>
            )}
            {incomingPending.map((item) =>
              renderCard(
                item,
                <>
                  <button
                    type="button"
                    disabled={processingId === item.id}
                    onClick={() => void handleDecision(item.id, 'reject')}
                    className="px-4 py-2 rounded-xl bg-[#ffe9ee] text-[#c0234b] text-sm font-semibold disabled:opacity-60"
                  >
                    Отклонить
                  </button>
                  <button
                    type="button"
                    disabled={processingId === item.id}
                    onClick={() => void handleDecision(item.id, 'approve')}
                    className="px-4 py-2 rounded-xl bg-primary text-white text-sm font-semibold disabled:opacity-60"
                  >
                    Принять
                  </button>
                </>,
              ),
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-[#dfe2f0] bg-[#f7f8fe] p-5">
          <h2 className="text-2xl font-black text-slate-900 mb-4">Запрошенные обмены</h2>
          <div className="space-y-3">
            {outgoing.length === 0 && (
              <p className="text-sm text-slate-500">
                Вы еще не отправляли запросы. <Link to="/skills" className="text-primary font-semibold">Перейти в каталог</Link>
              </p>
            )}
            {outgoing.map((item) => renderCard(item))}
          </div>
        </div>

        <div className="rounded-2xl border border-[#dfe2f0] bg-[#f7f8fe] p-5">
          <h2 className="text-2xl font-black text-slate-900 mb-4">Принятые обмены</h2>
          <div className="space-y-3">
            {accepted.length === 0 && (
              <p className="text-sm text-slate-500">Пока нет принятых обменов.</p>
            )}
            {accepted.map((item) =>
              renderCard(
                item,
                <button
                  type="button"
                  onClick={() => openChat(item.peer.id)}
                  className="px-4 py-2 rounded-xl bg-[#e8f0ff] text-primary text-sm font-semibold"
                >
                  Открыть чат
                </button>,
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
