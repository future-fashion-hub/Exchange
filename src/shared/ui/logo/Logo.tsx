import { FC } from 'react';
import styles from './Logo.module.css';
import { Icon } from '../icon/Icon';

export const Logo: FC = () => {
  return (
    <div className={styles.logo}>
      <Icon 
        name="logo"
        size={40}
      />
      <h1>SkillSwap</h1>
    </div>
  )
};