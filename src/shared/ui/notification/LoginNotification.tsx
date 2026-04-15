import React from "react";
import styles from "./LoginNotification.module.css";
import { Button } from "../button/Button";
import { Icon } from "../icon/Icon";

import { Modal } from "../modal/Modal";

interface LoginNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onCancel?: () => void;
}

export const LoginNotification: React.FC<LoginNotificationProps> = ({
  isOpen,
  onClose,
  onLogin,
  onCancel,
}) => {
  const handleCancel = () => {
    onCancel?.();
    onClose();
  };

  const handleLogin = () => {
    onLogin();
    onClose();
  };

  const notificationId = `login-notification-${Date.now()}`;
  const titleId = `${notificationId}-title`;
  const messageId = `${notificationId}-message`;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div
        className={styles.modalContent}
        role="dialog"
        aria-labelledby={titleId}
        aria-describedby={messageId}
        aria-modal="true"
      >
        <div className={styles.iconContainer}>
          <Icon
            name="userCircle"
            size="l"
            className={styles.icon}
            strokeWidth={0.5}
            aria-hidden="true"
          />
        </div>

        <div className={styles.content}>
          <div className={styles.textContent}>
            <h2 id={titleId} className={styles.title}>
              Пожалуйста, войдите в аккаунт
            </h2>
            <div
              id={messageId}
              role="status"
              aria-live="polite"
              aria-atomic="true"
            >
              <p className={styles.message}>
                Присоединяйтесь к SkillSwap и обменивайтесь
              </p>
              <p className={styles.message}>
                знаниями и навыками с другими людьми
              </p>
            </div>
          </div>
          <div className={styles.buttons}>
            <Button onClick={handleCancel} className={styles.cancelButton}>
              Отмена
            </Button>
            <Button
              onClick={handleLogin}
              colored
              className={styles.loginButton}
            >
              Войти
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
