import React from "react";
import styles from "./ExchangeNotification.module.css";
import { Button } from "../button/Button";
import { Icon } from "../icon/Icon";
import { IconName } from "../icon/icons";
import { Modal } from "../modal/Modal";

interface ExchangeNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "info" | "notification";
  title?: string;
  message?: string;
  buttonText?: string;
  onNavigateToExchange?: () => void;
}

export const ExchangeNotification: React.FC<ExchangeNotificationProps> = ({
  isOpen,
  onClose,
  type = "success",
  title,
  message,
  buttonText,
  onNavigateToExchange,
}) => {
  const notificationContent = {
    success: {
      icon: "done" as IconName,
      defaultTitle: "Ваше предложение создано",
      defaultMessage: "Теперь вы можете предложить обмен",
      defaultButtonText: "Готово",
    },
    notification: {
      icon: "notification" as IconName,
      defaultTitle: "Вы предложили обмен",
      defaultMessage: "Теперь дождитесь подтверждения. Вам придет уведомление",
      defaultButtonText: "Готово",
    },
    info: {
      icon: "userCircle" as IconName,
      defaultTitle: "Ваше предложение создано",
      defaultMessage: "Теперь вы можете предложить обмен",
      defaultButtonText: "Готово",
    },
  };

  const content = notificationContent[type];
  const isAlert = type === "success";
  const notificationId = `exchange-notification-${type}-${Date.now()}`;
  const titleId = `${notificationId}-title`;
  const messageId = `${notificationId}-message`;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div
        className={styles.modalContent}
        role={isAlert ? "alertdialog" : "dialog"}
        aria-labelledby={titleId}
        aria-describedby={messageId}
        aria-modal="true"
      >
        <div className={styles.iconContainer}>
          <Icon
            name={content.icon}
            size="l"
            className={styles.icon}
            data-icon={content.icon}
            strokeWidth={type === "notification" ? 1.5 : 0.5}
            aria-hidden="true"
          />
        </div>
        <div className={styles.content}>
          <div className={styles.textContent}>
            <h2 id={titleId} className={styles.title}>{title || content.defaultTitle}</h2>
            <span
              id={messageId}
              className={styles.messageText}
              role={isAlert ? "alert" : "status"}
              aria-live={isAlert ? "assertive" : "polite"}
              aria-atomic="true"
            >
              {message || content.defaultMessage}
            </span>
          </div>

          <Button
            onClick={() => {
              onNavigateToExchange?.();
              onClose();
            }}
            colored
          >
            {buttonText || content.defaultButtonText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};
