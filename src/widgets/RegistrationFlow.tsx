import { useState } from "react";
import { AuthForm } from "@features";
import { RegisterStep2 } from "../features/auth/RegisterStep2";
import { SkillForm } from "./skillForm/SkillForm";
import { RegistrationProgress } from "../shared/ui/RegistrationProgress/RegistrationProgress";

export const RegistrationFlow = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const nextStep = () => setStep((prev) => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div>
      {/* Плашка сверху */}
      <RegistrationProgress currentStep={step} totalSteps={totalSteps} />

      {/* Содержимое шага */}
      {step === 1 && <AuthForm onContinue={nextStep} />}
      {step === 2 && <RegisterStep2 onBack={prevStep} onContinue={nextStep} />}
      {step === 3 && <SkillForm onBack={prevStep} onContinue={() => alert("Регистрация завершена")} />}
    </div>
  );
};