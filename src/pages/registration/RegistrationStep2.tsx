import React from "react";
import { useNavigate } from "react-router-dom";
import { RegistrationOnBoarding } from "../../features/onboarding/registrationBoard";
import { onBoarding } from "../../features/onboarding/registrationBoard";
import {
  RegisterStep2,
  RegisterStep2Data,
} from "../../features/auth/RegisterStep2";
import { RegistrationProgress } from "../../shared/ui/RegistrationProgress/RegistrationProgress";
import { Icon } from "../../shared/ui/icon/Icon";
import styles from "./RegistrationPages.module.css";

interface RegistrationStep2Props {
  onBack: () => void;
  onContinue: (data: RegisterStep2Data) => void;
  initialData?: Partial<RegisterStep2Data>;
  onClose?: () => void;
}

export const RegistrationStep2: React.FC<RegistrationStep2Props> = ({
  onBack,
  onContinue,
  initialData,
  onClose,
}) => {
  const navigate = useNavigate();
  return (
    <div className={styles.registrationPage}>
      <div className={styles.registrationHeader}>
        <div className={styles.logo}>
          <Icon name="logo" size={40} />
          <span>SkillSwap</span>
        </div>
        <button className={styles.closeButton} onClick={onClose}>
          Закрыть
          <Icon name="cross" size={24} />
        </button>
      </div>

      <div className={styles.progressSection}>
        <RegistrationProgress currentStep={2} totalSteps={3} />
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.formSection}>
          <RegisterStep2
            onBack={onBack}
            onContinue={onContinue}
            initialData={initialData}
          />
        </div>

        <div className={styles.onboardingSection}>
          <RegistrationOnBoarding {...onBoarding[1]} />
        </div>
      </div>
    </div>
  );
};
