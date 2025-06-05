import { LoginForm } from "../../ui/Form/LoginForm";
import { RegisterForm } from "../../ui/Form/RegisterForm";
import s from "./LoginRegister.module.css";

export const LoginRegister = () => {
  return (
    <div className={s.container}>
      <div className={s.loginContainer}>
        <LoginForm />
      </div>
      <div className={s.registerContainer}>
        <RegisterForm />
      </div>
    </div>
  );
};
