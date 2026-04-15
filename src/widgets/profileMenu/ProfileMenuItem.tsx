import React from "react";
import styles from "./ProfileMenu.module.css";
import { Icon } from "../../shared/ui/icon/Icon";
import { IconName } from "../../shared/ui/icon/icons";

type TabType = "requests" | "exchanges" | "favorites" | "skills" | "personal";

interface ProfileMenuItemProps {
  tab: TabType;
  label: string;
  iconName: IconName;
  isActive: boolean;
  onClick: (tab: TabType) => void;
}

// const iconMap: Record<TabType, string> = {
//   requests: "requests",
//   exchanges: "messagetext",
//   favorites: "like",
//   skills: "idea",
//   personal: "user",
// };

export const ProfileMenuItem: React.FC<ProfileMenuItemProps> = ({
  tab,
  label,
  iconName,
  isActive,
  onClick,
}) => {
  return (
    <li className={styles.menuItem}>
      <button
        className={`${styles.menuButton} ${isActive ? styles.active : ""}`}
        onClick={() => onClick(tab)}
      >
        <div className={styles.menuItemContent}>
          <Icon
            name={iconName}
            size={24}
            strokeWidth={1.5}
            className={styles.menuIcon}
          />
          <span className={styles.menuLabel}>{label}</span>
        </div>
      </button>
    </li>
  );
};
