import React from "react";
import styles from "./registrationBoard.module.css";

import lightBulbPNG from "@images/light-bulb.png";
import userInfoPNG from "@images/user-info.png";
import schoolBoardPNG from "@images/school-board.png";

interface onBoardingProps {
  title: string;
  image: string;
  alt: string;
  description: string;
}

export const onBoarding = [
  {
    title: "Добро пожаловать в SkillSwap!",
    image: lightBulbPNG,
    alt: "Лампочка",
    description:
      "Присоединяйтесь к SkillSwap и обменивайтесь знаниями и навыками с другими людьми",
  },
  {
    title: "Расскажите немного о себе",
    image: userInfoPNG,
    alt: "Человек говорит сообщение",
    description:
      "Это поможет другим людям лучше вас узнать, чтобы выбрать для обмена",
  },
  {
    title: "Укажите, чем вы готовы поделиться",
    image: schoolBoardPNG,
    alt: "Маркерная доска с заданиями",
    description:
      "Так другие люди смогут увидеть ваши предложения и предложить вам обмен!",
  },
];

export const RegistrationOnBoarding: React.FC<onBoardingProps> = ({
  title,
  image,
  alt,
  description,
}) => {
  return (
    <div className={styles.constent}>
      <div className={styles.onboarding}>
        <img src={image} alt={alt} className={styles.image} />
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description} role="status" aria-live="polite" aria-atomic="true">
          {description}
        </p>
      </div>
    </div>
  );
};
