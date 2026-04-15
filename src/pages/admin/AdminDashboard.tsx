import React from 'react';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-sans flex">
      {/* Admin Sidebar */}
      <div className="w-64 bg-[#1E293B] text-white flex flex-col shadow-xl">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
            <span className="text-blue-400">Ex</span>Admin
          </h1>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          <a href="#" className="flex items-center gap-3 bg-blue-600/20 text-blue-400 px-4 py-3 rounded-xl font-medium border-l-4 border-blue-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            Дашборд
          </a>
          <a href="#" className="flex items-center gap-3 hover:bg-gray-800 text-gray-300 px-4 py-3 rounded-xl font-medium transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
            Пользователи
          </a>
          <a href="#" className="flex items-center gap-3 hover:bg-gray-800 text-gray-300 px-4 py-3 rounded-xl font-medium transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Обмены
          </a>
          <a href="#" className="flex items-center gap-3 hover:bg-gray-800 text-gray-300 px-4 py-3 rounded-xl font-medium transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
            Жалобы <span className="ml-auto bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">3</span>
          </a>
        </nav>
        <div className="p-4">
          <button className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-red-500/20 hover:text-red-400 text-gray-400 p-3 rounded-xl transition-colors">
            Выйти
          </button>
        </div>
      </div>

      {/* Main Admin Area */}
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Обзор системы</h2>
            <p className="text-gray-500">Последнее обновление: только что</p>
          </div>
          <div className="flex gap-4">
            <input type="text" placeholder="Поиск ID..." className="px-4 py-2 border border-gray-200 dark:border-gray-700 dark:bg-gray-800 rounded-lg shadow-sm" />
          </div>
        </header>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-6 mb-10">
          {[
            { label: 'Всего пользователей', val: '1,245', grow: '+12%', color: 'border-blue-500' },
            { label: 'Активных обменов', val: '320', grow: '+5%', color: 'border-green-500' },
            { label: 'Новых навыков', val: '89', grow: '+24%', color: 'border-purple-500' },
            { label: 'Открытых споров', val: '3', grow: '-2%', color: 'border-red-500' },
          ].map((k, i) => (
             <div key={i} className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border-l-4 ${k.color}`}>
                <p className="text-sm font-semibold text-gray-500 mb-1">{k.label}</p>
                <div className="flex justify-between items-end">
                   <h3 className="text-3xl font-bold dark:text-white">{k.val}</h3>
                   <span className="text-sm font-bold text-green-500 bg-green-50 px-2 py-1 rounded">{k.grow}</span>
                </div>
             </div>
          ))}
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
            <h3 className="text-xl font-bold dark:text-white">Последние регистрации</h3>
            <button className="text-blue-500 font-semibold hover:underline">Смотреть всех</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-4 font-semibold text-sm">ID</th>
                  <th className="px-6 py-4 font-semibold text-sm">Пользователь</th>
                  <th className="px-6 py-4 font-semibold text-sm">Email</th>
                  <th className="px-6 py-4 font-semibold text-sm">Статус</th>
                  <th className="px-6 py-4 font-semibold text-sm">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700 text-gray-700 dark:text-gray-300">
                {[
                  { id: '#4092', name: 'Иван Сергеев', email: 'ivan@example.com', st: 'Активен', c: 'bg-green-100 text-green-700' },
                  { id: '#4091', name: 'Мария В.', email: 'maria@example.com', st: 'Ожидает', c: 'bg-yellow-100 text-yellow-700' },
                  { id: '#4090', name: 'Alex Smith', email: 'alex@example.com', st: 'Заблокирован', c: 'bg-red-100 text-red-700' },
                ].map((u, i) => (
                  <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-sm">{u.id}</td>
                    <td className="px-6 py-4 font-bold">{u.name}</td>
                    <td className="px-6 py-4">{u.email}</td>
                    <td className="px-6 py-4"><span className={`px-3 py-1 text-xs font-bold rounded-full ${u.c}`}>{u.st}</span></td>
                    <td className="px-6 py-4">
                      <button className="text-gray-400 hover:text-primary mx-2">✎</button>
                      <button className="text-gray-400 hover:text-red-500 mx-2">🗑</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
