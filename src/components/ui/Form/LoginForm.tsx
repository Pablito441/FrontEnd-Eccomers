import { useState } from "react";
import { Input } from "../Input/Input";
import styles from "./LoginForm.module.css";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { useUserStore } from "../../../hooks/useUserStore";
import { useNavigate } from "react-router-dom";

const validationSchema = Yup.object().shape({
  email: Yup.string()
    .required("El correo es obligatorio")
    .email("Correo inválido"),
  password: Yup.string()
    .required("La contraseña es obligatoria")
    .min(6, "Debe tener al menos 6 caracteres"),
});

export const LoginForm = () => {
  const navigate = useNavigate();
  const { login } = useUserStore();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    try {
      await validationSchema.validateAt(name, updatedFormData);
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setErrors((prev) => ({ ...prev, [name]: err.message }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      const success = await login(formData.email, formData.password);

      if (success) {
        Swal.fire({
          title: "¡Bienvenido!",
          text: "Has iniciado sesión correctamente",
          icon: "success",
        });
        navigate("/");
      } else {
        Swal.fire({
          title: "Error",
          text: "Credenciales inválidas",
          icon: "error",
        });
      }
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors: { email?: string; password?: string } = {};
        err.inner.forEach((e) => {
          if (e.path)
            validationErrors[e.path as "email" | "password"] = e.message;
        });
        setErrors(validationErrors);
      }
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Vans® | Iniciar Sesión</h2>
      <div className={styles.inputContainer}>
        <Input
          label="Correo"
          name="email"
          type="text"
          value={formData.email}
          placeholder="Ingrese su correo"
          handleChange={handleChange}
          error={errors.email}
        />
        <Input
          label="Contraseña"
          name="password"
          type="password"
          value={formData.password}
          placeholder="Ingrese su contraseña"
          handleChange={handleChange}
          error={errors.password}
        />
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.button} type="submit">
          Ingresar
        </button>
      </div>
    </form>
  );
};
