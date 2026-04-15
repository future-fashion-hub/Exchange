import { useState, useCallback } from 'react';

export type NotificationType = 'success' | 'info' | 'notification';

export interface NotificationConfig {
  type: NotificationType;
  title?: string;
  message?: string;
  buttonText?: string;
}

export const useExchangeNotification = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [notificationConfig, setNotificationConfig] = useState<NotificationConfig>({
    type: 'success'
  });

  const openNotification = useCallback((config?: Partial<NotificationConfig>) => {
    setNotificationConfig(prev => ({
      ...prev,
      ...config
    }));
    setIsNotificationOpen(true);
  }, []);

  const closeNotification = useCallback(() => {
    setIsNotificationOpen(false);
  }, []);

  const handleNavigateToExchange = useCallback(() => {
    console.log('Переход к обмену');
    closeNotification();
  }, [closeNotification]);

  return {
    isNotificationOpen,
    notificationConfig,
    openNotification,
    closeNotification,
    handleNavigateToExchange
  };
};