import { UserCard } from '../../features/users/userCard/UserCard';
import { useInfiniteScroll } from '../../shared/hooks/useInfiniteScroll';
import { Loader } from '../../shared/ui/loader/Loader';
import { TUser } from '@api/types';
import { useSelector, RootState } from '@store';
import { getCurrentUser } from '../../services/user/user-slice';
import React from 'react';

type TRows = 1 | "auto";

type GridListProps = {
  users: TUser[];
  rows?: TRows;
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
};

export const GridList = ({
  users,
  rows = "auto", 
  loading,
  hasMore, 
  onLoadMore,
}: GridListProps) => {

  const maxItems = typeof(rows) === "number" ? rows * 3 : users.length; 
  const currentUser = useSelector(getCurrentUser);
  const currentUserId = currentUser?.id;
  
  const visibleUsers = users
    .filter(u => u.id !== currentUserId)
    .slice(0, maxItems); 

  const lastElementRef = useInfiniteScroll(onLoadMore, hasMore, loading);
  
  if (visibleUsers.length === 0 && !loading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-300 dark:border-gray-600 text-gray-500">
        <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
        <p className="text-xl font-bold">Пользователи не найдены</p>
        <p className="text-sm mt-2 text-gray-400">Попробуйте изменить параметры фильтрации</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Title & Sorting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-gray-200 dark:border-gray-800 pb-6">
        <div>
           <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">Каталог навыков</h2>
           <p className="text-gray-500 dark:text-gray-400">Показано {visibleUsers.length} уникальных предложения для обмена</p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center gap-3">
           <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Сортировать</span>
           <button className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
             В тренде
             <svg className="w-4 h-4 ml-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
           </button>
        </div>
      </div>

      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 list-none p-0 m-0">
        {visibleUsers.map((user, index) => (
          <React.Fragment key={user.id}>
             <li
               className="w-full flex"
               ref={index === visibleUsers.length - 1 ? lastElementRef : undefined}
             >
               <UserCard user={user} />
             </li>
             {/* Insert Promotional Card after the 5th item simulating the mockup */}
             {index === 4 && (
               <li className="w-full h-full flex mt-6 md:mt-0">
                  <div className="w-full h-full min-h-[400px] bg-primary rounded-3xl p-8 flex flex-col items-center justify-center text-center text-white shadow-lg overflow-hidden relative">
                     <div className="absolute top-0 right-0 p-8 opacity-20">
                        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                     </div>
                     <span className="text-4xl mb-6">🎉</span>
                     <h3 className="text-2xl font-bold mb-4">Присоединяйтесь к Exchange</h3>
                     <p className="text-blue-100 mb-8 max-w-xs">Зарегистрируйтесь сегодня, чтобы начать обмен опытом с лучшими творческими умами мира.</p>
                     <button onClick={() => window.location.href='/registration/step1'} className="bg-white text-primary hover:bg-blue-50 font-bold py-3 px-8 rounded-full shadow transition-all duration-300 w-full transform hover:scale-105">
                       Зарегистрироваться
                     </button>
                  </div>
               </li>
             )}
          </React.Fragment>
        ))}
      </ul>

      {/* Mock Pagination */}
      <div className="mt-16 flex justify-center items-center gap-2">
         <button className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-gray-400 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
         </button>
         <button className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-white font-medium shadow">1</button>
         <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 font-medium transition-colors">2</button>
         <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 font-medium transition-colors">3</button>
         <span className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>
         <button className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 text-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 font-medium transition-colors">12</button>
         <button className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
         </button>
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader />
        </div>
      )}
    </div>
  );
};
