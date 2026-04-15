import React from 'react';
import styles from './Welcome.module.css';

type WelcomeSectionProps = {
  title?: string;
  subtitle?: string;
};

export const Welcome = ({ 
  title = 'Добро пожаловать в SkillSwap!', 
  subtitle = 'Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми' 
}: WelcomeSectionProps) => {
  return (
    <section className={styles.section}>
      <h1 className={styles.title}>{title}</h1>
      <p className={styles.subtitle}>{subtitle}</p>
    </section>
  );
};