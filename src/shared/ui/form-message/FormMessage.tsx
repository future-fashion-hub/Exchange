import styles from './FormMessage.module.css';
import { memo } from 'react';
import clsx from 'clsx';

// Это компонент текста под полями input.
// Может быть как тип ошибка, тип успех, тип подсказка
export const MESSAGE_TYPES = {
  ERROR: 'error',
  SUCCESS: 'success',
  HINT: 'hint',
} as const;

type MessageType = typeof MESSAGE_TYPES[keyof typeof MESSAGE_TYPES]

type FormMessageProps = {
  message?: string;
  type?: MessageType;
  id?: string;
};

/**
 * Компонент для отображения сообщений под полями ввода.
 * Поддерживает типы: ошибка, успех, подсказка.
 * @param message Текст сообщения
 * @param type Тип сообщения ('error', 'success', 'hint')
 */


// export const FormMessage = memo(({ message, type = 'error' }: FormMessageProps) => {
export const FormMessage = memo(function FormMessage({ message, type = MESSAGE_TYPES.ERROR, id }: FormMessageProps) {
  if (!message || message.trim() === '') return null;
  
  return (
    <p className={clsx(
      styles.message,
      type === MESSAGE_TYPES.ERROR && styles.error,
        type === MESSAGE_TYPES.SUCCESS && styles.success,
        type === MESSAGE_TYPES.HINT && styles.hint
      )}
      role={type === MESSAGE_TYPES.ERROR ? 'alert' : 'status'}
      aria-live={type === MESSAGE_TYPES.ERROR ? 'assertive' : 'polite'}
      aria-atomic="true"
      id={id}
    >
      {message}
    </p>
  );
});