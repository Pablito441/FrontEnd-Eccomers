import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
export const Navbar = () => {
  const navigate = useNavigate();
  return (
    <div className={styles.NavbarContainerMain}>
      <div className={styles.NavContainerSecondary}>
        <div className={styles.navbarContainerLoggin}>
          <div
            className={styles.NavbarLoggin}
            onClick={() => navigate("/loginRegister")}
          >
            <span className="material-symbols-outlined">person</span>INICIAR
            SESIÓN
          </div>
          <div
            className={styles.NavbarLoggin}
            onClick={() => navigate("/shoppingCart")}
          >
            <span className="material-symbols-outlined">shopping_cart</span>
            CARRITO
          </div>
        </div>

        <div className={styles.NavbarBody}>
          <div className={styles.NavbarContainerLogo}>
            <img
              src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/6/19/9753806.png"
              onClick={() => navigate("/landing")}
              className={styles.NavbarLogo}
            />
          </div>
          <div className={styles.NavbarContainerCategories}>
            <div className={styles.NavbarMen}>
              HOMBRE
              <span
                className={`material-symbols-outlined ${styles.NavbarDropdownIcon}`}
              >
                arrow_drop_down
              </span>
            </div>
            <div className={styles.NavbarMen}>
              MUJER
              <span
                className={`material-symbols-outlined ${styles.NavbarDropdownIcon}`}
              >
                arrow_drop_down
              </span>
            </div>
            <div className={styles.NavbarSearchContainer}>
              <span
                className={`material-symbols-outlined ${styles.NavbarSearchIcon}`}
              >
                search
              </span>
              <input
                type="text"
                placeholder="Buscar"
                className={styles.NavbarSearchInput}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
