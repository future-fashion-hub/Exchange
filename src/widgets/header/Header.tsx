import { FC, useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { NotificationWidget } from "../notification-widget/NotificationWidget";
import { Icon } from "../../shared/ui/icon/Icon";
import { getImageUrl } from "../../shared/lib/helpers";
import { Popup } from "../popup/Popup";
import { SkillMenu } from "../SkillMenu/SkillMenu";
import { getCurrentUser } from "../../services/user/user-slice";
import { RootState, useDispatch, useSelector } from "@store";
import { applySearchQuery } from "../../services/filters/actions";
import { logoutThunk } from "../../services/user/actions";
import clsx from "clsx";
import { RegistrationModal } from "../../features/registration/RegistrationModal";
import { LuBell, LuMessageSquare } from "react-icons/lu";

export const POPUP_TYPES = {
  SKILLS: "skills",
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

export const Header: FC<{ onOpenRegistration?: () => void }> = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [isOpenPopup, setOpenPopup] = useState<PopupType>(null);
  const [isRegistrationModalOpen, setIsRegistrationModalOpen] = useState(false);
  const closeModalRef = useRef(() => setIsRegistrationModalOpen(false));

  const currentUser = useSelector(getCurrentUser);
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

  const handleRegistrationComplete = useCallback(() => {
    closeModalRef.current();
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logoutThunk());
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [dispatch, navigate]);

  const navLinkClass = (path: string) =>
    clsx(
      "text-sm font-medium transition-colors hover:text-primary",
      location.pathname === path
        ? "text-primary border-b-2 border-primary pb-1"
        : "text-gray-600 dark:text-gray-300",
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
                <Link to="/profile/exchanges" className={navLinkClass("/profile/exchanges")}>
                  Мои обмены
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
            <Link
              to="/profile/chat"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors"
              aria-label="Открыть чат"
            >
              <LuMessageSquare size={18} aria-hidden="true" />
            </Link>

            <div className="relative" onMouseDown={(e) => e.stopPropagation()}>
              <button
                className="relative flex h-9 w-9 items-center justify-center rounded-lg text-slate-700 hover:text-primary dark:text-gray-300 dark:hover:text-white transition-colors"
                onClick={() => togglePopup(POPUP_TYPES.NOTIFICATIONS)}
                aria-label="Открыть уведомления"
              >
                <LuBell size={18} aria-hidden="true" />
                <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500" />
              </button>

              <Popup
                isOpen={isOpenPopup === POPUP_TYPES.NOTIFICATIONS}
                onClose={closePopup}
                align="right"
              >
                <NotificationWidget onNavigate={closePopup} />
              </Popup>
            </div>

            <Link to="/profile" className="flex items-center gap-3 cursor-pointer ml-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden lg:block">
                {currentUser.name}
              </span>
              <img
                src={getImageUrl(currentUser.photo)}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover border border-gray-200 dark:border-gray-700"
              />
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="text-sm font-semibold text-gray-700 hover:text-primary dark:text-gray-200 transition-colors ml-2"
            >
              Выйти
            </button>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link
              replace
              to="/auth/login"
              className="text-sm font-semibold text-gray-700 hover:text-primary dark:text-gray-200 transition-colors"
            >
              Войти
            </Link>
            <Link
              to="/registration/step1"
              className="bg-primary hover:bg-secondary text-white text-sm font-semibold py-2 px-5 rounded-full shadow-md transition-colors"
            >
              Регистрация
            </Link>
          </div>
        )}
      </div>

      <Popup isOpen={isOpenPopup === POPUP_TYPES.SKILLS} onClose={closePopup}>
        <SkillMenu />
      </Popup>

      <RegistrationModal
        isOpen={isRegistrationModalOpen}
        onClose={closeModalRef.current}
        onRegistrationComplete={handleRegistrationComplete}
      />
    </header>
  );
};
