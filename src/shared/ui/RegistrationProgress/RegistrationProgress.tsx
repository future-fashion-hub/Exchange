import React from "react";
import styles from "./RegistrationProgress.module.css";
import clsx from "clsx";

interface RegistrationProgressProps {
  currentStep: number;
  totalSteps: number;
}

export const RegistrationProgress: React.FC<RegistrationProgressProps> = ({
  currentStep,
  totalSteps,
}) => {
  return (
    <div className={styles.wrapper}>
      <p className={styles.text}>Шаг {currentStep} из {totalSteps}</p>
      <div className={styles.steps}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const step = index + 1;
          return (
            <div
              key={index}
              className={clsx(
                styles.step,
                step < currentStep && styles.completed,
                step === currentStep && styles.active
              )}
            />
          );
        })}
      </div>
    </div>
  );
};
