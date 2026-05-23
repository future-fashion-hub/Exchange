import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { LuArrowRight, LuEye, LuEyeOff, LuMail, LuStar } from "react-icons/lu";
import styles from "./AuthForm.module.css";

type AuthFormProps = {
  onContinue: (email: string, password: string) => void | Promise<void>;
};

type FormData = {
  email: string;
  password: string;
};

export const AuthForm: FC<AuthFormProps> = ({ onContinue }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    watch,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormData>({
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = (data: FormData) => {
    onContinue(data.email, data.password);
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate('/');
  };

  const password = watch("password");
  const emailValue = watch("email")?.trim().toLowerCase() || "";
  const isAdminEmail = emailValue === "admin@mail.ru";

  return (
    <section className={styles.authScreen}>
      <div className={styles.backButtonWrap}>
        <button type="button" onClick={handleBack} className={styles.backButton}>
          &larr; Назад
        </button>
      </div>

      <div className={styles.brandIcon} aria-hidden="true">
        <LuStar size={32} />
      </div>
      <h1 className={styles.title}>Exchange</h1>

      <div className={styles.card}>
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.fieldGroup}>
            <label htmlFor="email" className={styles.label}>
              Электронная почта
            </label>
            <div className={styles.inputWrap}>
              <input
                id="email"
                type="email"
                placeholder="vash@email.com"
                className={styles.input}
                {...register("email", {
                  required: "Email обязателен",
                  pattern: {
                    value: /^\S+@\S+\.\S+$/,
                    message: "Введите корректный email",
                  },
                })}
              />
              <LuMail className={styles.trailingIcon} aria-hidden="true" />
            </div>
            {errors.email ? (
              <p className={styles.errorText}>{errors.email.message}</p>
            ) : null}
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="password" className={styles.label}>
              Пароль
            </label>

            <div className={styles.inputWrap}>
              <input
                id="password"
                type={isPasswordVisible ? "text" : "password"}
                placeholder="••••••••"
                className={styles.input}
                {...register("password", {
                  required: "Пароль обязателен",
                  minLength: {
                    value: 4,
                    message: "Пароль должен быть не менее 4 символов",
                  },
                })}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setIsPasswordVisible((prev) => !prev)}
                aria-label={isPasswordVisible ? "Скрыть пароль" : "Показать пароль"}
              >
                {isPasswordVisible ? (
                  <LuEyeOff className={styles.toggleIcon} aria-hidden="true" />
                ) : (
                  <LuEye className={styles.toggleIcon} aria-hidden="true" />
                )}
              </button>
            </div>
            {errors.password ? (
              <p className={styles.errorText}>{errors.password.message}</p>
            ) : null}
            {!errors.password && password?.length > 0 && password.length < 4 ? (
              <p className={styles.errorText}>Пароль должен быть не менее 4 символов</p>
            ) : null}
          </div>

          <button className={styles.submitButton} type="submit" disabled={!isValid}>
            Войти <LuArrowRight aria-hidden="true" />
          </button>
        </form>
      </div>

      <p className={styles.registerLine}>
        {isAdminEmail ? (
          <>Для администратора доступен только вход в существующий аккаунт.</>
        ) : (
          <>Нет аккаунта? <Link to="/registration/step1">Зарегистрироваться</Link></>
        )}
      </p>
    </section>
  );
};
