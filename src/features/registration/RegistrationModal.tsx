import React, { useState } from "react";
import { Modal } from "../../shared/ui/modal/Modal";
import { RegistrationStep1 } from "../../pages/registration/RegistrationStep1";
import { RegistrationStep2 } from "../../pages/registration/RegistrationStep2";
import { RegistrationStep3 } from "../../pages/registration/RegistrationStep3";
import { RegisterStep2Data } from "../auth/RegisterStep2";
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
  const [step1Data, setStep1Data] = useState({ email: "", password: "" });
  const [step2Data, setStep2Data] = useState<Partial<RegisterStep2Data>>({});

  const handleStep1Continue = (email: string, password: string) => {
    setStep1Data({ email, password });
    setCurrentStep(2);
  };

  const handleStep2Continue = (data: RegisterStep2Data) => {
    setStep2Data(data);
    setCurrentStep(3);
  };

  const handleStep3Complete = () => {
    onRegistrationComplete();
    onClose();
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
          <RegistrationStep2
            onBack={handleBack}
            onContinue={handleStep2Continue}
            initialData={step2Data}
            onClose={onClose}
          />
        );
      case 3:
        return (
          <RegistrationStep3
            onBack={handleBack}
            onComplete={handleStep3Complete}
            onClose={onClose}
          />
        );
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className={styles.registrationModal}>
      <div>{renderStep()}</div>
    </Modal>
  );
};
