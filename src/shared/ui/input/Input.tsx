import React, { useState } from "react";
import styles from "./Input.module.css";
import clsx from "clsx";
import { FormMessage, MESSAGE_TYPES } from "../form-message/FormMessage";
import { Icon } from "../icon/Icon";

export const INPUT_STATUS = {
  ERROR: "error",
  DEFAULT: "default",
  SUCCESS: "success",
  HINT: "hint",
} as const;

type InputStatus = (typeof INPUT_STATUS)[keyof typeof INPUT_STATUS];

interface InputProps {
  label?: string;
  className?: string;
  placeholder?: string;
  errorMessage?: string;
  successMessage?: string;
  status?: InputStatus;
  id?: string;
  icon?: string;
  type?: "text" | "search" | "tel" | "email" | "password";
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  showPasswordToggle?: boolean;
  showEditIcon?: boolean;
  disabled?: boolean;
}

export const Input = ({
  label,
  placeholder,
  errorMessage,
  successMessage,
  status = INPUT_STATUS.DEFAULT,
  id,
  type = "text",
  icon,
  className,
  value,
  onChange,
  onBlur,
  required = false,
  showPasswordToggle = false,
  showEditIcon = false,
  disabled = false,
  ...otherProps
}: InputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const actualType = type === "password" && isPasswordVisible ? "text" : type;
  const isError = status === INPUT_STATUS.ERROR;
  const isSuccess = status === INPUT_STATUS.SUCCESS;
  const messageId = id ? `${id}-message` : undefined;

  const message = isError
    ? errorMessage
    : isSuccess
    ? successMessage
    : undefined;
  const messageType = isError
    ? MESSAGE_TYPES.ERROR
    : isSuccess
    ? MESSAGE_TYPES.SUCCESS
    : MESSAGE_TYPES.HINT;

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
          {required && <span aria-hidden="true">*</span>}
        </label>
      )}
      <div className={styles.inputContainer}>
        {icon && (
          <div className={styles.iconContainer}>
            <img src={icon} alt="input icon" aria-hidden="true" />
          </div>
        )}
        <input
          className={clsx(
            styles.input,
            {
              [styles.error]: isError,
              [styles.success]: isSuccess,
              [styles.withIcon]: icon,
              [styles.withRightIcon]: showPasswordToggle || showEditIcon,
              [styles.disabled]: disabled,
            },
            className
          )}
          placeholder={placeholder}
          id={id}
          type={actualType}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          aria-invalid={isError}
          aria-describedby={messageId}
          {...otherProps}
        />

        {/* Кнопка переключения видимости пароля */}
        {showPasswordToggle && type === "password" && (
          <button
            type="button"
            className={styles.eyeButton}
            onClick={togglePasswordVisibility}
            aria-label={isPasswordVisible ? "Скрыть пароль" : "Показать пароль"}
            aria-pressed={isPasswordVisible}
          >
            <Icon
              name={isPasswordVisible ? "eyeSlash" : "eye"}
              size="s"
              className={styles.eyeIcon}
              aria-hidden="true"
            />
          </button>
        )}
        {/* Иконка редактирования (статическая) */}
        {showEditIcon && (
          <div className={styles.editIconContainer}>
            <Icon
              name="edit"
              size="s"
              className={styles.editIcon}
              aria-hidden="true"
            />
          </div>
        )}
      </div>
      <FormMessage message={message} type={messageType} id={messageId} />
    </div>
  );
};
