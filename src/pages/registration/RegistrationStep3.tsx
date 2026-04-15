import React from "react";
import { useNavigate } from "react-router-dom";
import { RegistrationOnBoarding } from "../../features/onboarding/registrationBoard";
import { onBoarding } from "../../features/onboarding/registrationBoard";
import { SkillForm } from "../../widgets/skillForm/SkillForm";
import { RegistrationProgress } from "../../shared/ui/RegistrationProgress/RegistrationProgress";
import { Icon } from "../../shared/ui/icon/Icon";
import styles from "./RegistrationPages.module.css";

interface RegistrationStep3Props {
  onBack: () => void;
  onComplete: () => void;
  onClose?: () => void;
}

export const RegistrationStep3: React.FC<RegistrationStep3Props> = ({
  onBack,
  onComplete,
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
        <RegistrationProgress currentStep={3} totalSteps={3} />
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.formSection}>
          <SkillForm onBack={onBack} onContinue={onComplete} />
        </div>

        <div className={styles.onboardingSection}>
          <RegistrationOnBoarding {...onBoarding[2]} />
        </div>
      </div>
    </div>
  );
};
