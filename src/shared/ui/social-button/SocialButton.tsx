import { FC } from "react";
import styles from "./SocialButton.module.css";
import clsx from "clsx";
import { Icon } from "../icon/Icon";

interface SocialButtonProps {
  provider: "google" | "apple" | "github";
  onClick?: () => void;
  children: string;
  className?: string;
}

export const SocialButton: FC<SocialButtonProps> = ({
  provider,
  onClick,
  children,
  className,
}) => {
  return (
    <button
      className={clsx(styles.socialButton, styles[`${provider}Button`], className)}
      onClick={onClick}
      type="button"
    >
      <Icon name={provider} size="s" />
      {children}
    </button>
  );
};