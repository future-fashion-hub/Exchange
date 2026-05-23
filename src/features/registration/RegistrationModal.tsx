import React, { useState } from "react";
import { Modal } from "../../shared/ui/modal/Modal";
import { RegistrationStep1 } from "../../pages/registration/RegistrationStep1";
import { RegistrationStepMerged } from "../../pages/registration/RegistrationStepMerged";
import { RegistrationStep3Merged } from "../../pages/registration/RegistrationStep3Merged";
import { registerApi } from "../../api/Api";
import styles from './RegistrationModal.module.css';

interface RegistrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistrationComplete: () => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  isOpen,
  onClose,
  onRegistrationComplete,
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [step1Data, setStep1Data] = useState({ fullName: "", email: "", password: "" });

  const handleStep1Continue = async (fullName: string, email: string, password: string) => {
    try {
      await registerApi({ fullName, email, password });
      setStep1Data({ fullName, email, password });
      setCurrentStep(2);
    } catch (error) {
      console.error("Registration step 1 error:", error);
      alert("Не удалось зарегистрироваться. Проверьте данные и повторите попытку.");
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <RegistrationStep1 onContinue={handleStep1Continue} onClose={onClose}/>;
      case 2:
        return (
          <RegistrationStepMerged
            onBack={handleBack}
            onComplete={() => setCurrentStep(3)}
            onClose={onClose}
          />
        );
      case 3:
        return (
          <RegistrationStep3Merged
            onBack={handleBack}
            onComplete={() => {
              onRegistrationComplete();
              onClose();
              window.location.href = '/profile';
            }}
            onClose={onClose}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className={styles.registrationModal}
      overlayClassName={styles.registrationOverlay}
    >
      <div>{renderStep()}</div>
    </Modal>
  );
};
