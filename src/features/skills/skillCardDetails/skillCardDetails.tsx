import React from "react";
import { RootState } from "@store";

import { Gallery } from "../../../shared/ui/gallery/Gallery";
import { useExchangeNotification } from "../../../shared/ui/notification/useExchangeNotification";
import { ExchangeNotification } from "../../../shared/ui/notification/ExchangeNotification";
import { Icon } from "../../../shared/ui/icon/Icon";
import { Button } from "../../../shared/ui/button/Button";
import photoPlaceholder from "../../../shared/assets/images/school-board.svg?.svg";
import { useSelector } from "@store";
import { isOfferCreated } from "../../../services/offers/offers-slice";
import styles from './skillCardDetails.module.css';

type SkillCardDetailsProps = {
  checkEdit?: boolean;
  title: string;
  subtitle: string;
  description: string;
  images?: string[];
  buttonText?: string;
  onExchange?: () => void;
  requireRegistration?: boolean;
};

export const SkillCardDetails: React.FC<SkillCardDetailsProps> = ({
  checkEdit,
  title,
  subtitle,
  description,
  images = [],
  buttonText = "Предложить обмен",
  onExchange,
  requireRegistration = true,
}) => {
  const { isNotificationOpen, openNotification, closeNotification } = useExchangeNotification();
  const isOfferReady = useSelector(isOfferCreated);

  // Получаем пользователя из Redux
  const currentUser = useSelector((s: RootState) => s.user.user);
  const isUserLoggedIn = !!currentUser;

  // Клик по кнопке обмена
  const handleExchangeClick = () => {
    console.log('SkillCardDetails: Exchange button clicked, user logged in:', isUserLoggedIn);
    
    // Всегда вызываем onExchange - пусть родительский компонент решает что делать
    onExchange?.();
    
    // Если пользователь авторизован, показываем уведомление
    if (isUserLoggedIn) {
      openNotification({
        type: "info",
        title: "Ваше предложение создано",
        message: "Теперь вы можете предложить обмен",
        buttonText: "Готово",
      });
    }
  };

  // Хендлеры кнопок
  const likeHandle = () => console.log("Liked!");
  const shareHandle = () => console.log("Shared!");
  const moreHandle = () => console.log("More...");
  const editHandle = () => console.log("Edit...");

  // ----------------- Рендер без кнопки редактирования -----------------
  if (!checkEdit) {
    return (
      <>
        <div className={styles.skillCard}>

        <div className={styles.iconsBar}>
          <button className={styles.buttonIcon} onClick={likeHandle}>
            <Icon name="like" />
          </button>
          <button className={styles.buttonIcon} onClick={shareHandle}>
            <Icon name="share" />
          </button>
          <button className={styles.buttonIcon} onClick={moreHandle}>
            <Icon name="more" />
          </button>
        </div>

        <div className={styles.mainSection}>

          <div className={styles.leftSection}>
            <div className={styles.info}>
              <h2 className={styles.title}>{title}</h2>
              <h3 className={styles.subtitle}>{subtitle}</h3>
              <p className={styles.description}>{description}</p>
            </div>
              {!isOfferReady && (
                <Button className={styles.buttonOffer}
                  colored
                  onClick={handleExchangeClick}
                >
                  {buttonText}
                </Button>
              )}
              {isOfferReady && (
                <Button
                  className={(styles.buttonOffer, styles.buttonOfferReady)}
                  onClick={handleExchangeClick}
              >
                  <Icon name='clock'/> Обмен предложен
              </Button>
              )}
          </div>
          
          <div className={styles.rightSection}>
            {images && (
              <Gallery images={images} placeholder={photoPlaceholder} />
            )}
          </div>
          
          </div>
        </div>

        <ExchangeNotification
          isOpen={isNotificationOpen}
          onClose={closeNotification}
          type="info"
          title="Ваше предложение создано"
          message="Теперь вы можете предложить обмен"
          buttonText="Готово"
        />
      </>
    );
  }

  // ----------------- Рендер с кнопкой редактирования -----------------
  return (
    <>
      <div className={styles.skillCard} style={{ padding: '2.75em 3.75em 4.5em' }}>
        <div className={styles.headSection}>
          <h3 className={styles.headTitle}>Ваше предложение</h3>
          <p className={styles.headText}>
            Пожалуйста, проверьте и подтвердите правильность данных
          </p>
        </div>

        <div className={styles.mainSection}>
          <div className={styles.leftSection}>
            <div className={styles.info}>
              <h2 className={styles.title}>{title}</h2>
              <h3 className={styles.subtitle}>{subtitle}</h3>
              <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.buttonsContainer}>
              <Button className={styles.buttonEdit} onClick={editHandle}>
                Редактировать <Icon name="edit" />
              </Button>
              <Button colored onClick={handleExchangeClick}>
                {buttonText}
              </Button>
            </div>
          </div>

          <div className={styles.rightSection}>
            {images && <Gallery images={images} placeholder={photoPlaceholder} />}
          </div>
        </div>

        <ExchangeNotification
          isOpen={isNotificationOpen}
          onClose={closeNotification}
          type="info"
          title="Ваше предложение создано"
          message="Теперь вы можете предложить обмен"
          buttonText="Готово"
        />
      </div>
    </>
  );
};