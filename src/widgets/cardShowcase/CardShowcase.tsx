import React, { ReactElement } from "react";
import styles from "./CardShowcase.module.css";

export const SHOWCASE_TITLES = {
  MATCHING: 'Подходящие предложения: ',
  POPULAR: 'Популярное',
  NEW: 'Новое',
  EXACT: 'Точное совпадение',
  IDEAS: 'Новые идеи',
  RECOMMEND: 'Рекомендуем',
  SIMILAR: 'Похожие предложения',
} as const;

export type TShowcaseTitle = (typeof SHOWCASE_TITLES)[keyof typeof SHOWCASE_TITLES];  

type CardShowcaseProps = {
  children: ReactElement;
  title: TShowcaseTitle;
  buttonTitle?: string;
  icon?: ReactElement;
  isIconFirst?: boolean;
  titleSize?: string;
  onButtonClick?: () => void; // ← вот это добавляем
};



export const CardShowcase = ({
  children,
  title,
  buttonTitle = '',
  icon,
  isIconFirst,
  titleSize = '2em',
  onButtonClick, // ← добавляем сюда
}: CardShowcaseProps) => {

  const showHideRowsHandle = () => {
    for (const [, value] of Object.entries(SHOWCASE_TITLES)) {
      if (title.startsWith(value)) {
        console.log(`Нашли заголовок: ${value}...`);
        break;
      }
    }
  };

  return (
    <div className={styles.cardShowcase}>
      <div className={styles.header}>
        <div>
          <h2
            className={styles.title}
            style={{fontSize: `${titleSize}`}}
          >
            {title}
          </h2>
        </div>
        {buttonTitle && icon && !isIconFirst && (
  <button
    onClick={onButtonClick ?? showHideRowsHandle} 
    className={styles.button}>
    <span>{buttonTitle}</span>
    <span>{icon}</span>
  </button>
)}
{buttonTitle && icon && isIconFirst && (
  <button
    onClick={onButtonClick ?? showHideRowsHandle} 
    className={styles.button}>
    <span>{icon}</span>
    <span>{buttonTitle}</span>
  </button>
)}
      </div>
      <div className={styles.childsWrapper}>
        {children &&
        React.cloneElement(children, {
          // здесь чилдрену можно передать какой-нибудь пропс 
        })}
      </div>
    </div>
  );
};
