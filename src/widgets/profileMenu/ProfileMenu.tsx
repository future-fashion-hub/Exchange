import React from "react";
import styles from "./ProfileMenu.module.css";
import { ProfileMenuItem } from "./ProfileMenuItem";
import { IconName } from "../../shared/ui/icon/icons";

type TabType = "requests" | "exchanges" | "favorites" | "skills" | "personal";

interface MenuItem {
  key: TabType;
  label: string;
  icon: IconName;
}

interface ProfileMenuProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const ProfileMenu: React.FC<ProfileMenuProps> = ({
  activeTab,
  onTabChange,
}) => {
  const menuItems: MenuItem[] = [
    { key: "requests", label: "Заявки", icon: "requests" },
    { key: "exchanges", label: "Мои обмены", icon: "messagetext" },
    { key: "favorites", label: "Избранное", icon: "like" },
    { key: "skills", label: "Мои навыки", icon: "idea" },
    { key: "personal", label: "Личные данные", icon: "user" },
  ];

  return (
    <nav className={styles.menu}>
      <ul className={styles.menuList}>
        {menuItems.map((item) => (
          <ProfileMenuItem
            key={item.key}
            tab={item.key}
            label={item.label}
            iconName={item.icon}
            isActive={activeTab === item.key}
            onClick={onTabChange}
          />
        ))}
      </ul>
    </nav>
  );
};
