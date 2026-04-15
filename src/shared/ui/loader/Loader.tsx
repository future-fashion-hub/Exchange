// src\shared\ui\loader\Loader.tsx

import styles from './Loader.module.css';

export const Loader = () => {
  return (
    <div className={styles.loader}>
      <div className={styles.spinner}></div>
      <p>Загрузка...</p>
    </div>
  );
};