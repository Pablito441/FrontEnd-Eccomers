// import { useState } from "react";
// import { Input } from "../Input/Input";
// import styles from "./LoginForm.module.css";
// import Swal from "sweetalert2";
// import * as Yup from "yup";
// import { useUserStore } from "../../../hooks/useUserStore";
// import { useNavigate } from "react-router-dom";

// const validationSchema = Yup.object().shape({
//   email: Yup.string()
//     .required("El correo es obligatorio")
//     .email("Correo inválido"),
//   password: Yup.string()
//     .required("La contraseña es obligatoria"),
// });

// export const LoginForm = () => {
//   const navigate = useNavigate();
//   const { login, loading } = useUserStore();
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const [errors, setErrors] = useState<{ email?: string; password?: string }>(
//     {}
//   );

//   const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target;
//     const updatedFormData = { ...formData, [name]: value };
//     setFormData(updatedFormData);

//     try {
//       await validationSchema.validateAt(name, updatedFormData);
//       setErrors((prev) => ({ ...prev, [name]: undefined }));
//     } catch (err) {
//       if (err instanceof Yup.ValidationError) {
//         setErrors((prev) => ({ ...prev, [name]: err.message }));
//       }
//     }
//   };
// //
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     try {
//       console.log("Validando formulario...");
//       await validationSchema.validate(formData, { abortEarly: false });

//       console.log("Formulario válido, intentando login...");
//       const success = await login(formData.email, formData.password);
//       console.log("Resultado del login:", success);

//       if (success) {
//         Swal.fire({
//           title: "¡Bienvenido!",
//           text: "Has iniciado sesión correctamente",
//           icon: "success",
//           timer: 2000,
//           showConfirmButton: false,
//         });
//         navigate("/");
//       } else {
//         console.log("Login falló - credenciales incorrectas");
//         Swal.fire({
//           title: "Error de autenticación",
//           text: "Email o contraseña incorrectos. Por favor, verifica tus credenciales.",
//           icon: "error",
//           confirmButtonText: "Intentar de nuevo"
//         });
//       }
//     } catch (err) {
//       console.error("Error en handleSubmit:", err);
//       if (err instanceof Yup.ValidationError) {
//         console.log("Error de validación:", err);
//         const validationErrors: { email?: string; password?: string } = {};
//         err.inner.forEach((e) => {
//           if (e.path)
//             validationErrors[e.path as "email" | "password"] = e.message;
//         });
//         setErrors(validationErrors);
//       } else {
//         // Error inesperado
//         Swal.fire({
//           title: "Error inesperado",
//           text: "Ocurrió un error inesperado. Por favor, intenta de nuevo.",
//           icon: "error",
//           confirmButtonText: "Aceptar"
//         });
//       }
//     }
//   };

//   return (
//     <form className={styles.form} onSubmit={handleSubmit}>
//       <h2 className={styles.title}>Vans® | Iniciar Sesión</h2>
//       <div className={styles.inputContainer}>
//         <Input
//           label="Correo"
//           name="email"
//           type="email"
//           value={formData.email}
//           placeholder="Ingrese su correo"
//           handleChange={handleChange}
//           error={errors.email}
//         />
//         <Input
//           label="Contraseña"
//           name="password"
//           type="password"
//           value={formData.password}
//           placeholder="Ingrese su contraseña"
//           handleChange={handleChange}
//           error={errors.password}
//         />
//       </div>

//       <div className={styles.buttonContainer}>
//         <button
//           className={styles.button}
//           type="submit"
//           disabled={loading}
//         >
//           {loading ? "Iniciando sesión..." : "Ingresar"}
//         </button>
//       </div>
//     </form>
//   );
// };
