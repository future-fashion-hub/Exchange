import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';

export const ProfilePage: React.FC = () => {
  const authUser = useSelector((state: RootState) => state.user.user);
  const userName = authUser?.name || 'Алекс';

  const stats = {
    activeExchanges: authUser?.stats?.activeExchanges ?? 0,
    totalSkills: authUser?.stats?.totalSkills ?? 0,
    reputation: authUser?.stats?.reputation ?? 0,
    notifications: authUser?.stats?.notifications ?? 0,
  };

  const profileSkills =
    (authUser?.skills && authUser.skills.length > 0
      ? authUser.skills.map((skill) => ({
          id: skill.id,
          title: skill.title,
          subtitle: `${skill.type === 'TEACH' ? 'Преподаю' : 'Изучаю'} • ${skill.categoryName}`,
        }))
      : [
          ...(authUser?.offerTags || []).map((tag, index) => ({
            id: `offer-${index}-${tag}`,
            title: tag,
            subtitle: 'Преподаю',
          })),
          ...(authUser?.seekTags || []).map((tag, index) => ({
            id: `seek-${index}-${tag}`,
            title: tag,
            subtitle: 'Изучаю',
          })),
        ]).slice(0, 8);

  return (
    <div className="min-h-screen bg-[#F9FAF7] dark:bg-gray-900 font-sans p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Welcome Banner */}
        <div className="bg-primary rounded-3xl p-8 md:p-12 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Привет, {userName}!</h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8">
              {stats.notifications > 0
                ? `У вас ${stats.notifications} новых уведомлений. Проверьте входящие, чтобы не пропустить важные обмены.`
                : 'Добро пожаловать! Пока новых уведомлений нет, но можно начать первый обмен уже сейчас.'}
            </p>
            <div className="flex gap-4">
              <button className="bg-white text-primary px-6 py-3 rounded-full font-bold shadow-md hover:bg-gray-50 transition-colors">
                Изучить новые навыки
              </button>
              <button className="bg-blue-600 text-white px-6 py-3 rounded-full font-bold shadow-md hover:bg-blue-700 transition-colors">
                Расписание
              </button>
            </div>
          </div>
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl"></div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: 'АКТИВНЫЕ ОБМЕНЫ', value: String(stats.activeExchanges), icon: 'M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4', color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'ВСЕГО НАВЫКОВ', value: String(stats.totalSkills), icon: 'M12 14l9-5-9-5-9 5 9 5z', color: 'text-purple-500', bg: 'bg-purple-50' },
            { label: 'РЕПУТАЦИЯ', value: Number.isFinite(stats.reputation) ? stats.reputation.toFixed(1) : '0.0', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z', color: 'text-green-500', bg: 'bg-green-50' },
            { label: 'УВЕДОМЛЕНИЯ', value: String(stats.notifications), icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', color: 'text-red-500', bg: 'bg-red-50' }
          ].map((stat, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4">
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl hidden sm:block`}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} /></svg>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column (Exchanges & Skills) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Текущие обмены */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold dark:text-white">Текущие обмены</h2>
                <Link to="/profile/exchanges" className="text-primary font-semibold hover:underline">Смотреть все</Link>
              </div>
              <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                {stats.activeExchanges > 0 ? (
                  <p className="text-gray-700 dark:text-gray-200">
                    Сейчас у вас {stats.activeExchanges} активных обменов. Полный список и детали доступны в разделе обменов.
                  </p>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    Пока нет активных обменов. Создайте первый запрос в каталоге навыков.
                  </p>
                )}
              </div>
            </div>

            {/* Мои навыки */}
            <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-3xl border border-gray-100 dark:border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold dark:text-white">Мои навыки</h2>
                  <p className="text-sm text-gray-500">Управляйте компетенциями, которыми вы делитесь с сообществом.</p>
                </div>
                <button className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-xl hover:bg-secondary shadow-md">+</button>
              </div>
              <div className="space-y-3">
                {profileSkills.length === 0 && (
                  <div className="p-4 bg-white dark:bg-gray-700 rounded-xl shadow-sm text-sm text-gray-500 dark:text-gray-300">
                    У вас пока нет добавленных навыков.
                  </div>
                )}
                {profileSkills.map((skill) => (
                  <div key={skill.id} className="flex justify-between items-center p-4 bg-white dark:bg-gray-700 rounded-xl shadow-sm">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-gray-600 flex items-center justify-center text-primary">★</div>
                      <div>
                        <p className="font-bold text-gray-900 dark:text-white">{skill.title}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">{skill.subtitle}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">✎</button>
                  </div>
                ))}
              </div>
            </div>
            
          </div>

          {/* Right Column (Sidebar Recommendations) */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
            <h2 className="text-xl font-bold dark:text-white mb-2">Рекомендуем вам</h2>
            <p className="text-sm text-gray-500 mb-6">Основано на вашем интересе к копирайтингу и стратегии бренда.</p>
            
            <div className="space-y-6">
              {[
                { title: 'Мастерство Brand Voice', desc: 'Узнайте как создавать согласованные тональные руководства для глобальных лайфстайл-брендов.' },
                { title: 'Семантическая стратегия', desc: 'Глубокое погружение в информационную архитектуру и редакционные потоки.' },
                { title: 'Микротексты для мобильных', desc: 'Эффективное письмо для кнопок, подсказок и пустых состояний.' }
              ].map((rec, i) => (
                <div key={i} className="group cursor-pointer">
                  <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl mb-3 overflow-hidden">
                     {/* Image Placeholder */}
                     <div className="w-full h-full bg-gradient-to-r from-blue-200 to-indigo-200 dark:from-slate-600 dark:to-slate-500 group-hover:scale-105 transition-transform duration-300"></div>
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-primary transition-colors">{rec.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{rec.desc}</p>
                </div>
              ))}
            </div>
            
            <button className="w-full py-3 mt-6 border-2 border-gray-200 dark:border-gray-600 rounded-xl font-bold text-gray-700 dark:text-gray-300 hover:border-primary hover:text-primary transition-colors">
              Обновить предложения
            </button>

            {/* Gamification Banner */}
            <div className="mt-8 bg-gradient-to-br from-pink-400 to-purple-500 p-6 rounded-2xl text-white shadow-lg">
              <h3 className="font-bold text-lg mb-2 flex items-center gap-2">🏅 Мастер-контрибьютор</h3>
              <p className="text-sm mb-4 text-purple-100">Вам осталось всего 500 баллов репутации до статуса «Элитный наставник».</p>
              <div className="w-full bg-white/30 rounded-full h-2 mb-2">
                <div className="bg-white h-2 rounded-full" style={{ width: '80%' }}></div>
              </div>
              <div className="flex justify-between text-xs text-purple-100 font-medium">
                <span>4.5k XP</span>
                <span>5k XP</span>
              </div>
            </div>
            
          </div>

        </div>
      </div>
    </div>
  );
};
