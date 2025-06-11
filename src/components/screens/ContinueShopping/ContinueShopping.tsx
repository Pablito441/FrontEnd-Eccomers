import { useNavigate } from "react-router-dom";
import s from "./ContinueShopping.module.css";

export const ContinueShopping = () => {
  const navigate = useNavigate();

  return (
    <div className={s.container}>
      <div className={s.content}>
        <div className={s.section}>
          <h2 className={s.title}>Usuarios registrados</h2>
          <p className={s.description}>
            Ingrese su nombre de usuario y su contraseña para continuar con su
            compra.
          </p>
          <button
            className={s.button}
            onClick={() => navigate("/loginRegister")}
          >
            Loguearse
          </button>
        </div>

        <div className={s.section}>
          <h2 className={s.title}>Registración</h2>
          <p className={s.description}>
            Para comprar en esta web completá los datos que siguen a
            continuación. Y no olvides agregar tu e-mail y una clave personal.
            Registrarse en esta web es totalmente gratis. La próxima vez que nos
            visites, contarás con la ventaja de no volver a ingresar la
            totalidad de los datos solicitados.
          </p>
          <button
            className={s.button}
            onClick={() => navigate("/loginRegister")}
          >
            Registrarse
          </button>
        </div>
      </div>
    </div>
  );
};
