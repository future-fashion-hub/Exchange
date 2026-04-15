import { FC } from "react";
import { useForm, Controller } from "react-hook-form";
import styles from "./AuthForm.module.css";
import { Button } from "../../shared/ui/button/Button";
import { Input, INPUT_STATUS } from "../../shared/ui/input/Input";
import { SocialButton } from "../../shared/ui/social-button/SocialButton";

type AuthFormProps = {
  onContinue: (email: string, password: string) => void;
};

type FormData = {
  email: string;
  password: string;
};

export const AuthForm: FC<AuthFormProps> = ({ onContinue }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = (data: FormData) => {
    onContinue(data.email, data.password);
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  const handleAppleLogin = () => {
    console.log("Apple login clicked");
  };

  const isPasswordStrong = (password: string): boolean => {
    if (!password) return false;

    return (
      password.length >= 8 &&
      /\d/.test(password) &&
      /[a-zA-Zа-яА-Я]/.test(password) &&
      /[A-ZА-Я]/.test(password)
    );
  };

  return (
    <div className={styles.authForm}>
      <div className={styles.content}>
        {/* Кнопки соц сетей */}
        <SocialButton provider="google" onClick={handleGoogleLogin}>
          Продолжить с Google
        </SocialButton>

        <SocialButton provider="apple" onClick={handleAppleLogin}>
          Продолжить с Apple
        </SocialButton>

        {/* Разделитель */}
        <div className={styles.separator}>
          <span>или</span>
        </div>

        {/* Форма */}
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          {/* Email */}
          <Controller
            name="email"
            control={control}
            rules={{
              required: "Email обязателен",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Введите корректный email",
              },
            }}
            render={({ field }) => (
              <Input
                type="email"
                label="Email"
                id="email"
                placeholder="Введите email"
                {...field}
                status={
                  errors.email ? INPUT_STATUS.ERROR : INPUT_STATUS.DEFAULT
                }
                errorMessage={errors.email?.message}
              />
            )}
          />

          {/* Пароль */}
          <Controller
            name="password"
            control={control}
            rules={{
              required: "Пароль обязателен",
              validate: {
                minLength: (v) =>
                  v.length >= 8 || "Пароль должен быть не менее 8 символов",
                hasNumber: (v) =>
                  /\d/.test(v) || "Пароль должен содержать хотя бы одну цифру",
                hasLetter: (v) =>
                  /[a-zA-Zа-яА-Я]/.test(v) ||
                  "Пароль должен содержать хотя бы одну букву",
                hasCapitalLetter: (v) =>
                  /[A-ZА-Я]/.test(v) ||
                  "Пароль должен содержать хотя бы одну заглавную букву",
              },
            }}
            render={({ field }) => {
              const isStrong = isPasswordStrong(field.value);
              const status = errors.password
                ? INPUT_STATUS.ERROR
                : isStrong
                ? INPUT_STATUS.SUCCESS
                : INPUT_STATUS.DEFAULT;

              return (
                <Input
                  type="password"
                  label="Пароль"
                  id="password"
                  placeholder="Придумайте надёжный пароль"
                  showPasswordToggle
                  {...field}
                  status={status}
                  errorMessage={errors.password?.message}
                  successMessage={isStrong ? "Надёжный" : undefined}
                />
              );
            }}
          />

          <Button colored type="submit" disabled={!isValid}>
            Далее
          </Button>
        </form>
      </div>
    </div>
  );
};
