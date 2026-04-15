import { ReactNode } from "react";
import clsx from "clsx";
import styles from "./Button.module.css";

type ButtonProps = {
  children: ReactNode;
  size?: "s" | "m" | "l" | number;
  colored?: boolean;
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit" | "reset"; 
  disabled?: boolean; // Добавляем возможность отключения
};

export const Button = ({
  children,
  size,
  colored,
  onClick,
  className,
  type = "button",  
  disabled = false  
}: ButtonProps) => {
  const sizeMap = {
    s: 24, // маленький
    m: 147, // средний
    l: 200, // большой
  };

  const width =
    size === undefined
      ? "100%" // по умолчанию
      : typeof size === "number"
      ? size
      : sizeMap[size];

  return (
    <button
      onClick={onClick}
      className={clsx(styles.button, colored && styles.colored, className)}
      style={{ width }}
      type={type}
      disabled={disabled}  
    >
      {children}
    </button>
  );
};
