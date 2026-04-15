import { UserCard } from '../../features/users/userCard/UserCard';
import { useInfiniteScroll } from '../../shared/hooks/useInfiniteScroll';
import { Loader } from '../../shared/ui/loader/Loader';
import { TUser } from '@api/types';
import { useSelector } from '@store';
import { getCurrentUser } from '../../services/user/user-slice';

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
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 list-none p-0 m-0">
        {visibleUsers.map((user, index) => (
          <li
            key={user.id}
            className="w-full"
            ref={index === visibleUsers.length - 1 ? lastElementRef : undefined}
          >
            <UserCard user={user} />
          </li>
        ))}
      </ul>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <Loader />
        </div>
      )}
    </div>
  );
};
