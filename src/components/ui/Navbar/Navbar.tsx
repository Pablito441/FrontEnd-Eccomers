import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useCartStore } from "../../../hooks/useCartStore";
import { useCategoryStore } from "../../../hooks/useCategoryStore";
import { useEffect } from "react";

export const Navbar = () => {
  const navigate = useNavigate();
  const { items } = useCartStore();
  const { items: categories, fetchAll: fetchAllCategories } =
    useCategoryStore();
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

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
            {totalItems > 0 && (
              <span className={styles.cartBadge}>{totalItems}</span>
            )}
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
            {categories.map((category) => (
              <div
                key={category.id}
                className={styles.NavbarMen}
                onClick={() =>
                  navigate(
                    `/catalog?category=${encodeURIComponent(category.name)}`
                  )
                }
              >
                {category.name}
              </div>
            ))}
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
