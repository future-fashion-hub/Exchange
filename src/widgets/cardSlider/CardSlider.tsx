import { useState } from "react";
import { UserCard } from "../../features/users/userCard/UserCard";
import { TUser } from "../../api/types";
import { Icon } from "../../shared/ui/icon/Icon";
import { Loader } from "../../shared/ui/loader/Loader";
import styles from "./CardSlider.module.css";
import clsx from "clsx";

type CardSliderProps = {
  users: TUser[];
};

export const CardSlider = ({ users }: CardSliderProps) => {
  const [page, setPage] = useState(0);
  const itemsPerPage = 4;

  const totalPages = Math.ceil(users.length / itemsPerPage);

  const handlePrev = () => {
    setPage((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setPage((prev) => (prev < totalPages - 1 ? prev + 1 : prev));
  };

  const startIndex = page * itemsPerPage;
  const visibleUsers = users.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className={styles.slider}>
      <div className={styles.cardsWrapper}>
        {!visibleUsers && Loader}
        
        {visibleUsers.map((user) => (
          <UserCard
            key={user.id}
            user={user}
          />
        ))}
      </div>

      {users.length > itemsPerPage && (
        <>
            <button 
              onClick={handlePrev}
              disabled={page === 0}
              className={clsx(styles.chevronLeft, styles.chevron)}
            >
              <Icon
                name='chevronRight'
                size={16}
                className={styles.iconChevronLeft}
              />
            </button>
            <button 
              onClick={handleNext}
              disabled={page === totalPages - 1}
              className={clsx(styles.chevronRight, styles.chevron)}
            >
              <Icon
                name="chevronRight"
                size={16}
              />
            </button>
        </>
      )}
    </div>
  );
};
