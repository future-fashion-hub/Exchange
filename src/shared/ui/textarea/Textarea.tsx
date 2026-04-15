import React from "react";
import styles from "./Textarea.module.css";
import clsx from "clsx";
import { FormMessage } from "../form-message/FormMessage";
import { Icon } from "../icon/Icon";

interface TextareaProps {
  label?: string;
  className?: string;
  placeholder?: string;
  errorMessage?: string;
  status?: "error" | "default" | "success" | "hint";
  id?: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  required?: boolean;
  disabled?: boolean;
  rows?: number;
  maxLength?: number;
  showEditIcon?: boolean;
}

export const Textarea = ({
  label,
  placeholder,
  errorMessage,
  status = "default",
  id,
  className,
  value,
  onChange,
  onBlur,
  required = false,
  disabled = false,
  rows = 4,
  maxLength,
  showEditIcon = false,
  ...otherProps
}: TextareaProps) => {
  const isError = status === "error";

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange?.(e.target.value);
  }

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={id} className={styles.label}>
          {label}
        </label>
      )}

      <div className={styles.textareaContainer}>
        <textarea
          className={clsx(
            styles.textarea,
            {
              [styles.error]: isError,
              [styles.withEditIcon]: showEditIcon,
              [styles.disabled]: disabled,
            },
            className
          )}
          placeholder={placeholder}
          id={id}
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          required={required}
          disabled={disabled}
          rows={rows}
          maxLength={maxLength}
          {...otherProps}
        />

        {/* Иконка редактирования внутри textarea */}
        {showEditIcon && (
          <div className={styles.editIconContainer}>
            <Icon name="edit" size="s" className={styles.editIcon} />
          </div>
        )}
      </div>

      {maxLength && (
        <div className={styles.counter}>
          {value?.length || 0}/{maxLength}
        </div>
      )}

      <FormMessage
        message={errorMessage}
        type={isError ? "error" : status === "success" ? "success" : "hint"}
      />
    </div>
  );
};
