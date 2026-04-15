// src\widgets\header\Header.tsx

import { FC, useEffect, useState, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import { Logo } from "../../shared/ui/logo/Logo";
import { Button } from "../../shared/ui/button/Button";
import { NotificationWidget } from "../notification-widget/NotificationWidget";
import { Icon } from "../../shared/ui/icon/Icon";
import { getImageUrl } from "../../shared/lib/helpers";
import { SearchBar } from "../../shared/ui/search-bar/SearchBar";
import { Popup } from "../popup/Popup";
import { SkillMenu } from "../SkillMenu/SkillMenu";
import { getCurrentUser, setUser } from "../../services/user/user-slice";
import { ProfilePopup } from "../profile-popup/ProfilePopup";
import { getPlainUsers } from "../../services/users/users-slice";
import { useDispatch, useSelector } from "@store";
import { applySearchQuery } from "../../services/filters/actions";
import { RootState } from "@store";
import clsx from "clsx";
import { RegistrationModal } from "../../features/registration/RegistrationModal";

// type PopupType = "skills" | "profile" | "notifications" | null;
export const POPUP_TYPES = {
  SKILLS: "skills",
  PROFILE: "profile",
  NOTIFICATIONS: "notifications",
} as const;

export type PopupType = (typeof POPUP_TYPES)[keyof typeof POPUP_TYPES] | null;

function useDebounced<T>(value: T, ms = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

export const Header: FC<{ onOpenRegistration?: () => void }> = ({
  onOpenRegistration,
}) => {
  const dispatch = useDispatch();
  const [isOpenPopup, setOpenPopup] = useState<PopupType>(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
 const closeModalRef = useRef(() => setIsRegistrationModalOpen(false));

  const currentUser = useSelector(getCurrentUser);
  const plainUsers = useSelector(getPlainUsers);

  const currentQuery = useSelector((s: RootState) => s.filters.q);
  const [query, setQuery] = useState(currentQuery || "");
  const debounced = useDebounced(query, 300);

  useEffect(() => {
    dispatch(applySearchQuery(debounced));
  }, [debounced, dispatch]);

  const togglePopup = (popup: PopupType) => {
    setOpenPopup((prev) => (prev === popup ? null : popup));
  };

  const closePopup = () => setOpenPopup(null);

  const handleLogin = () => {
    if (plainUsers.length === 0) {
      console.warn("Нет загруженных пользователей для входа");
      return;
    }
    const randomIndex = Math.floor(Math.random() * plainUsers.length);
    const randomUser = plainUsers[randomIndex];
    dispatch(setUser(randomUser));
  };

  const handleRegistration = () => {
    setIsRegistrationModalOpen(true);
  };

  const handleRegistrationComplete = useCallback(() => {
    closeModalRef.current();
  }, []);

  return (
    <header
      className={styles.header}
      style={
        currentUser
          ? { maxHeight: "116px", padding: "42px 36px 26px" }
          : { maxHeight: "104px", padding: "36px 36px 20px" }
      }
    >
      <Link to="/">
        <Logo />
      </Link>

      <nav>
        <ul className={styles.navList}>
          <li className={styles.li}>
            <Link
              to="/about"
              className={styles.link}
              onClick={() => console.log("Click on About link")}
            >
              О проекте
            </Link>
          </li>
          <li className={styles.li}>
            <button
              className={clsx(styles.link, styles.dropButton)}
              onClick={() => togglePopup(POPUP_TYPES.SKILLS)}
            >
              Все навыки
              <Icon
                name={
                  isOpenPopup === POPUP_TYPES.SKILLS
                    ? "chevronUp"
                    : "chevronDown"
                }
                size="s"
                className={styles.iconChevron}
              />
            </button>
          </li>
        </ul>
      </nav>

      {/* Используем компонент SearchBar с разной шириной */}
      <SearchBar
        maxWidth={currentUser ? 648 : 527}
        value={query}
        onChange={setQuery}
      />

      {!currentUser && (
        <button className={styles.moonButton}>
          <Icon name="moon" size="s" />
        </button>
      )}

      <div className={styles.rightSection}>
        {/* Иконки уведомлений и лайков только для авторизованных */}
        {currentUser && (
          <>
            <button className={styles.moonButton}>
              <Icon name="moon" size="s" />
            </button>
            <button
              className={styles.notificationButton}
              onClick={() => togglePopup(POPUP_TYPES.NOTIFICATIONS)}
            >
              <div className={styles.iconWrapper}>
                <Icon name="notification" size={20} strokeWidth={5} />
              </div>
            </button>
            <button className={styles.likeButton}>
              <Icon name="like" size="s" />
            </button>
          </>
        )}

        {/* Блок пользователя или кнопки входа */}
        {currentUser ? (
          <div
            className={styles.userAuthWrapper}
            onClick={() => togglePopup(POPUP_TYPES.PROFILE)}
            style={{ cursor: "pointer" }}
          >
            <span className={styles.userName}>{currentUser.name}</span>
            <img
              src={getImageUrl(currentUser.photo)}
              alt={currentUser.name}
              className={styles.userAvatar}
            />
          </div>
        ) : (
          <div className={styles.buttonsWrapper}>
            <Button size={92} onClick={handleLogin}>
              Войти
            </Button>
            <Button size={208} onClick={handleRegistration} colored>
              Зарегистрироваться
            </Button>
          </div>
        )}
      </div>

      {/* Попапы */}
      {currentUser ? (
        <Popup
          isOpen={isOpenPopup === POPUP_TYPES.NOTIFICATIONS}
          onClose={closePopup}
        >
          <NotificationWidget />
        </Popup>
      ) : null}

      <Popup isOpen={isOpenPopup === POPUP_TYPES.SKILLS} onClose={closePopup}>
        <SkillMenu />
      </Popup>

      <Popup isOpen={isOpenPopup === POPUP_TYPES.PROFILE} onClose={closePopup}>
        <ProfilePopup onClose={closePopup} />
      </Popup>

      <RegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={closeModalRef.current} 
        onRegistrationComplete={handleRegistrationComplete}
      />
    </header>
  );
};
