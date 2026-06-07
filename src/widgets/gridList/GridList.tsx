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
  showSort?: boolean;
  showPagination?: boolean;
  isGuest?: boolean;
};

const GUEST_CATALOG_USERS: TUser[] = [
  {
    id: 'guest-1',
    name: 'Елена Моретти',
    gender: 'unspecified',
    photo: 'https://i.pravatar.cc/100?img=5',
    from: 'Удаленно',
    skill: 'Редакционная верстка и типографика',
    need_subcat: [],
    cat_text: 'ДИЗАЙН',
    sub_text: 'Типографика',
    categoryId: 1,
    subCategoryId: 1,
    description: 'Освойте искусство визуальной иерархии и сложной композиции для современных цифровых изданий.',
    images: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&q=80'],
    birthdate: '1995-01-01',
    email: 'guest1@example.com',
    created_at: new Date().toISOString(),
    about: 'Эксперт по редакционной верстке и типографике.',
    likedByMe: false,
    random: 1,
  },
  {
    id: 'guest-2',
    name: 'Маркус Чен',
    gender: 'unspecified',
    photo: 'https://i.pravatar.cc/100?img=11',
    from: 'Удаленно',
    skill: 'Стратегии роста на основе данных',
    need_subcat: [],
    cat_text: 'МАРКЕТИНГ',
    sub_text: 'Growth',
    categoryId: 2,
    subCategoryId: 2,
    description: 'Узнайте, как использовать аналитику для создания стабильной системы роста продукта.',
    images: ['https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=400&q=80'],
    birthdate: '1993-05-09',
    email: 'guest2@example.com',
    created_at: new Date().toISOString(),
    about: 'Консультант по продуктовой аналитике.',
    likedByMe: false,
    random: 2,
  },
  {
    id: 'guest-3',
    name: 'Сара Дженкинс',
    gender: 'unspecified',
    photo: 'https://i.pravatar.cc/100?img=9',
    from: 'Лондон',
    skill: 'Воркшоп по нарративному нон-фикшн',
    need_subcat: [],
    cat_text: 'ТЕКСТЫ',
    sub_text: 'Нон-фикшн',
    categoryId: 3,
    subCategoryId: 3,
    description: 'Превратите реальный жизненный опыт в сильный и читаемый текст с живой структурой.',
    images: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80'],
    birthdate: '1991-03-11',
    email: 'guest3@example.com',
    created_at: new Date().toISOString(),
    about: 'Редактор и преподаватель письма.',
    likedByMe: false,
    random: 3,
  },
  {
    id: 'guest-4',
    name: 'Дэвид Пак',
    gender: 'unspecified',
    photo: 'https://i.pravatar.cc/100?img=12',
    from: 'Сеул',
    skill: 'Архитектура React & Tailwind',
    need_subcat: [],
    cat_text: 'РАЗРАБОТКА',
    sub_text: 'React',
    categoryId: 4,
    subCategoryId: 4,
    description: 'Создание масштабируемых фронтенд-архитектур для продуктовых команд.',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80'],
    birthdate: '1990-07-21',
    email: 'guest4@example.com',
    created_at: new Date().toISOString(),
    about: 'Frontend Tech Lead и ментор.',
    likedByMe: false,
    random: 4,
  },
  {
    id: 'guest-5',
    name: 'Лиза Вагнер',
    gender: 'unspecified',
    photo: 'https://i.pravatar.cc/100?img=15',
    from: 'Берлин',
    skill: 'Лидерство в удаленных командах',
    need_subcat: [],
    cat_text: 'МЕНЕДЖМЕНТ',
    sub_text: 'Leadership',
    categoryId: 5,
    subCategoryId: 5,
    description: 'Эффективная коммуникация и психологическая безопасность в распределенных командах.',
    images: ['https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=400&q=80'],
    birthdate: '1989-08-14',
    email: 'guest5@example.com',
    created_at: new Date().toISOString(),
    about: 'People manager в международной компании.',
    likedByMe: false,
    random: 5,
  },
];

export const GridList = ({
  users,
  rows = "auto", 
  loading,
  hasMore, 
  onLoadMore,
  showSort = true,
  showPagination = true,
  isGuest = false,
}: GridListProps) => {

  const currentUser = useSelector(getCurrentUser);
  const currentUserId = currentUser?.id;

  const filteredUsers = users
    .filter(u => u.id !== currentUserId)
  const sourceUsers = isGuest && filteredUsers.length === 0 ? GUEST_CATALOG_USERS : filteredUsers;
  const maxItems = typeof(rows) === "number" ? rows * 3 : sourceUsers.length;
  const visibleUsers = sourceUsers.slice(0, maxItems);

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
        {showSort && (
          <div className="mt-4 md:mt-0 flex items-center gap-3">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Сортировать</span>
            <button className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors">
              В тренде
              <svg className="w-4 h-4 ml-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
          </div>
        )}
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
             {isGuest && index === 4 && (
               <li className="w-full h-full flex mt-6 md:mt-0">
                  <div className="w-full h-full min-h-[400px] bg-primary rounded-3xl p-8 flex flex-col items-center justify-center text-center text-white shadow-lg overflow-hidden relative">
                  <div className="mb-6">
                    <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path></svg>
                  </div>
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
      {showPagination && (
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
      )}

      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader />
        </div>
      )}
    </div>
  );
};
