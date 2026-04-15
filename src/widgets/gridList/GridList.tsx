// src\widgets\gridList\GridList.tsx

import { UserCard } from '../../features/users/userCard/UserCard';
import styles from './GridList.module.css';
import { useInfiniteScroll } from '../../shared/hooks/useInfiniteScroll';
import { Loader } from '../../shared/ui/loader/Loader';
import { TUser } from '@api/types';
import { useSelector } from '@store';
import { getCurrentUser } from '../../services/user/user-slice';

//количество отображаемых в гриде рядов 1 или максимум
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
  rows = "auto", //по умолчанию показывать все ряды(все карточки)
  loading,
  hasMore, //бесконечный скролл/подгрузка данных
  onLoadMore,
}: GridListProps) => {

  // 3 колонки * rows строк
  const maxItems = typeof(rows) === "number" ? rows * 3 : users.length; 
  const currentUser = useSelector(getCurrentUser);
  const currentUserId = currentUser?.id
  const visibleUsers = users
    .filter(u => u.id !== currentUserId) // убираем текущего
    .slice(0, maxItems); 
  // const visibleUsers = users
  //   .slice(0, maxItems); 


  const lastElementRef = useInfiniteScroll(onLoadMore, hasMore, loading);
  if (visibleUsers.length === 0 && !loading) {
    return <div className={styles.empty}>Пользователи не найдены</div>;
  }

  return (
    <div>
      <ul className={styles.grid}>
        {visibleUsers.map((user, index) => (
              <li
              key={user.id}
              className={styles.gridItem}
              ref={index === visibleUsers.length - 1 ? lastElementRef : undefined}
            >
              <UserCard
                user = {user}
              />
            </li>
          ))}
      </ul>

      {loading && (
        <div>
          <Loader />
        </div>
      )}
      
    </div>
  );
};
