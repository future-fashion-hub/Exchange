import clsx from 'clsx';
import styles from './SkillTagUI.module.css'

// Компонент SkillTag с логикой можно найти в папке features

type SkillTagUIProps = {
  label: string;
  backgroundColor: string;
  className?: string;
};

export const SkillTagUI = ({ label, backgroundColor, className }: SkillTagUIProps) => {
  return (
    <div className={clsx(styles.tag, className)} style={{ backgroundColor }}>
      {label}
    </div>
  );
};
