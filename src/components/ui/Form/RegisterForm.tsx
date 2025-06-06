import { useState } from "react";
import { Input } from "../Input/Input";
import styles from "./RegisterForm.module.css";
import Swal from "sweetalert2";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  name: Yup.string()
    .required("El nombre es obligatorio")
    .min(2, "Mínimo 2 caracteres"),
  surname: Yup.string()
    .required("El apellido es obligatorio")
    .min(2, "Mínimo 2 caracteres"),
  email: Yup.string()
    .required("El correo es obligatorio")
    .email("Correo inválido"),
  birthdate: Yup.string().required("La fecha de nacimiento es obligatoria"),
  password: Yup.string()
    .required("La contraseña es obligatoria")
    .min(6, "Mínimo 6 caracteres"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Las contraseñas no coinciden")
    .required("Confirme su contraseña"),
});

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    birthdate: "",
    password: "",
    confirmPassword: "",
  });
  type FormErrors = {
    name?: string;
    surname?: string;
    email?: string;
    birthdate?: string;
    password?: string;
    confirmPassword?: string;
    [key: string]: string | undefined;
  };
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData, [name]: value };
    setFormData(updatedFormData);

    try {
      await validationSchema.validateAt(name, updatedFormData);
      setErrors((prev: FormErrors) => ({ ...prev, [name]: undefined }));
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        setErrors((prev: FormErrors) => ({ ...prev, [name]: err.message }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await validationSchema.validate(formData, { abortEarly: false });
      Swal.fire("Registro exitoso", "", "success");
      setFormData({
        name: "",
        surname: "",
        email: "",
        birthdate: "",
        password: "",
        confirmPassword: "",
      });
      setErrors({});
    } catch (err) {
      if (err instanceof Yup.ValidationError) {
        const validationErrors: FormErrors = {};
        err.inner.forEach((e) => {
          if (e.path) validationErrors[e.path] = e.message;
        });
        setErrors(validationErrors);
      }
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Vans® | Registrarse</h2>
      <div className={styles.inputContainer}>
        <Input
          label="Nombre"
          name="name"
          type="text"
          value={formData.name}
          placeholder="Ingrese su nombre"
          handleChange={handleChange}
          error={errors.name}
        />
        <Input
          label="Apellido"
          name="surname"
          type="text"
          value={formData.surname}
          placeholder="Ingrese su apellido"
          handleChange={handleChange}
          error={errors.surname}
        />
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
          label="Fecha de nacimiento"
          name="birthdate"
          type="date"
          value={formData.birthdate}
          placeholder=""
          handleChange={handleChange}
          error={errors.birthdate}
        />
        <Input
          label="Contraseña"
          name="password"
          type="password"
          value={formData.password}
          placeholder="Ingrese una contraseña"
          handleChange={handleChange}
          error={errors.password}
        />
        <Input
          label="Repetir Contraseña"
          name="confirmPassword"
          type="password"
          value={formData.confirmPassword}
          placeholder="Repita la contraseña"
          handleChange={handleChange}
          error={errors.confirmPassword}
        />
      </div>
      <div className={styles.buttonContainer}>
        <button className={styles.button} type="submit">
          Registrarse
        </button>
      </div>
    </form>
  );
};
