import { FC, useEffect, useState, useCallback, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
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
  const location = useLocation();
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

  // For Nav links styling
  const navLinkClass = (path: string) => clsx(
    "text-sm font-medium transition-colors hover:text-primary",
    location.pathname === path ? "text-primary border-b-2 border-primary pb-1" : "text-gray-600 dark:text-gray-300"
  );

  return (
    <header className="w-full flex justify-between items-center px-4 md:px-8 py-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 z-50 sticky top-0">
      <div className="flex items-center gap-8">
        <Link to="/">
          <div className="flex items-center text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            <span className="text-primary italic mr-1">Exchange</span>
          </div>
        </Link>
        <nav className="hidden md:block">
          <ul className="flex items-center gap-6">
            <li>
              <Link to="/skills" className={navLinkClass("/skills")}>
                Каталог
              </Link>
            </li>
            {currentUser && (
               <li>
                 <Link to="/requests" className={navLinkClass("/requests")}>
                   Мои запросы
                 </Link>
               </li>
            )}
            <li>
              <Link to="/about" className={navLinkClass("/about")}>
                О сервисе
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className="flex-1 max-w-lg mx-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon name="search" size="s" className="text-gray-400" />
          </div>
          <input
            type="search"
            className="block w-full pl-10 pr-3 py-2 border-none rounded-full leading-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white sm:text-sm"
            placeholder="Поиск навыков..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {currentUser ? (
          <>
            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors">
              <Icon name="moon" size="s" />
            </button>
            <button
              className="relative p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors"
              onClick={() => togglePopup(POPUP_TYPES.NOTIFICATIONS)}
            >
              <Icon name="notification" size={20} />
            </button>
            <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white transition-colors">
              <Icon name="like" size="s" />
            </button>
            <div
              className="flex items-center gap-3 cursor-pointer ml-2"
              onClick={() => togglePopup(POPUP_TYPES.PROFILE)}
            >
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden lg:block">{currentUser.name}</span>
              <img
                src={getImageUrl(currentUser.photo)}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
              />
            </div>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogin} 
              className="text-sm font-semibold text-gray-700 hover:text-primary dark:text-gray-200 transition-colors"
            >
              Войти
            </button>
            <Link 
              to="/registration/step1"
              className="bg-primary hover:bg-secondary text-white text-sm font-semibold py-2 px-5 rounded-full shadow-md transition-colors"
            >
               Регистрация
            </Link>
          </div>
        )}
      </div>

      {currentUser ? (
        <Popup isOpen={isOpenPopup === POPUP_TYPES.NOTIFICATIONS} onClose={closePopup}>
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
