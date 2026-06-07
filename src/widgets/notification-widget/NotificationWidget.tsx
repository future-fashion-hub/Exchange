import { FC, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "@store";
import styles from "./NotificationWidget.module.css";
import { Icon } from "../../shared/ui/icon/Icon";
import { Button } from "../../shared/ui/button/Button";
import {
  markAsSeen,
  deleteAllNotification,
  getNewNotifications,
  getViewedNotifications,
  getIsLoading,
  getUnseenCount,
} from "../../services/notifications/notification-slice";
import { getNotificationThunk } from "../../services/notifications/actions";
import { getCurrentUser } from "../../services/user/user-slice";
import { NotificationTypes, TNotificationEvent } from "@api/types";
import { connectSocket } from "../../shared/lib/socketClient";
import { markAllNotificationsReadApi } from "@api/Api";
import { getNotificationTargetPath } from "./notificationNavigation";

interface NotificationDisplay {
  id: string;
  userName: string;
  action: string;
  details: string;
  time: string;
  targetPath: string | null;
}

export const NotificationWidget: FC<{ onNavigate?: () => void }> = ({ onNavigate }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentUser = useSelector(getCurrentUser);

  if (!currentUser) {
    return <div />;
  }

  const currentUserId = currentUser.id;
  const newNotifications = useSelector(getNewNotifications);
  const viewedNotifications = useSelector(getViewedNotifications);
  const isLoading = useSelector(getIsLoading);
  const unseenCount = useSelector(getUnseenCount);

  useEffect(() => {
    dispatch(getNotificationThunk({ userId: currentUserId }));
  }, [currentUserId, dispatch]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    const socket = connectSocket(token);
    const handler = () => {
      dispatch(getNotificationThunk({ userId: currentUserId }));
    };

    socket.on("notify:new", handler);

    return () => {
      socket.off("notify:new", handler);
    };
  }, [currentUserId, dispatch]);

  const formatDate = (dateString: string): string => {
    const eventDate = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (eventDate.toDateString() === today.toDateString()) {
      return "сегодня";
    }

    if (eventDate.toDateString() === yesterday.toDateString()) {
      return "вчера";
    }

    const day = eventDate.getDate();
    const months = [
      "января", "февраля", "марта", "апреля", "мая", "июня",
      "июля", "августа", "сентября", "октября", "ноября", "декабря",
    ];
    const month = months[eventDate.getMonth()];
    return `${day} ${month}`;
  };

  const handleMarkAllAsRead = () => {
    void markAllNotificationsReadApi();
    dispatch(markAsSeen());
  };

  const handleClearAll = () => {
    dispatch(deleteAllNotification());
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    onNavigate?.();
  };

  const mapToDisplayFormat = (event: TNotificationEvent): NotificationDisplay => {
    let action = "";
    const details = event.message;
    const userName = event.anotherUserName || event.title;

    if (event.type === NotificationTypes.ACCOUNT_ON_MODERATION) {
      action = "ваш аккаунт отправлен на модерацию";
    } else if (event.type === NotificationTypes.ACCOUNT_APPROVED) {
      action = "ваш аккаунт подтвержден";
    } else if (event.type === NotificationTypes.ACCOUNT_REJECTED) {
      action = "ваш аккаунт отклонен";
    } else if (event.type === NotificationTypes.CHAT_MESSAGE) {
      action = event.title.toLowerCase().includes("обмен") ? event.title : "новое сообщение";
    } else {
      action = "новое уведомление";
    }

    return {
      id: event.id,
      userName,
      action,
      details,
      time: formatDate(event.date),
      targetPath: getNotificationTargetPath(event),
    };
  };

  if (isLoading) {
    return (
      <div className={styles.widget}>
        <div className={styles.content}>
          <div className={styles.loading}>Загрузка уведомлений...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.widget}>
      <div className={styles.content}>
        <div className={styles.topRow}>
          <div>
            <p className={styles.caption}>Центр активности</p>
            <h2 className={styles.title}>Уведомления</h2>
          </div>
          {unseenCount > 0 && <span className={styles.badge}>{unseenCount}</span>}
        </div>

        <div className={styles.sectionHeader}>
          <h3 className={styles.sectionTitle}>Новые</h3>
          {newNotifications.length > 0 && (
            <button className={styles.markAllButton} onClick={handleMarkAllAsRead}>
              Прочитать все
            </button>
          )}
        </div>

        <div className={styles.notificationsSection}>
          {newNotifications.length > 0 ? (
            newNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                notification={mapToDisplayFormat(notification)}
                isNew={true}
                onNavigate={handleNavigate}
              />
            ))
          ) : (
            <div className={styles.emptyState}>Нет новых уведомлений</div>
          )}
        </div>

        {viewedNotifications.length > 0 && (
          <>
            <div className={styles.sectionHeader}>
              <h3 className={styles.sectionTitle}>Просмотренные</h3>
              <button className={styles.clearButton} onClick={handleClearAll}>
                Очистить
              </button>
            </div>

            <div className={styles.viewedSection}>
              {viewedNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={mapToDisplayFormat(notification)}
                  isNew={false}
                  onNavigate={handleNavigate}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const NotificationCard: FC<{
  notification: NotificationDisplay;
  isNew: boolean;
  onNavigate: (path: string) => void;
}> = ({ notification, isNew, onNavigate }) => (
  <div className={`${styles.notificationCard} ${isNew ? "" : styles.viewed}`}>
    <div className={styles.iconContainer} aria-hidden="true">
      <Icon name="idea" size={22} strokeWidth={1.6} />
    </div>

    <div className={styles.contentSection}>
      <div className={styles.textSection}>
        <div className={styles.notificationHeader}>
          <span className={styles.userName}>{notification.userName}</span>
          <span className={styles.action}> {notification.action}</span>
        </div>
        <p className={styles.details}>{notification.details}</p>
      </div>

      <div className={styles.timeSection}>
        <span className={styles.time}>{notification.time}</span>
      </div>
    </div>

    {isNew && notification.targetPath && (
      <div className={styles.buttonContainer}>
        <Button
          size={118}
          className="bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => notification.targetPath && onNavigate(notification.targetPath)}
        >
          Перейти
        </Button>
      </div>
    )}
  </div>
);
