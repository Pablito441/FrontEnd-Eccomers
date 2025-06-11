import { useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { useCartStore } from "../../../hooks/useCartStore";
import { useCategoryStore } from "../../../hooks/useCategoryStore";
import { useUserStore } from "../../../hooks/useUserStore";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const navigate = useNavigate();
  const { items } = useCartStore();
  const { items: categories, fetchAll: fetchAllCategories } =
    useCategoryStore();
  const { currentUser, isAuthenticated, logout } = useUserStore();
  const [searchTerm, setSearchTerm] = useState("");
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  useEffect(() => {
    fetchAllCategories();
  }, [fetchAllCategories]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(searchTerm.trim())}`);
      window.scrollTo(0, 0);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className={styles.NavbarContainerMain}>
      <div className={styles.NavContainerSecondary}>
        <div className={styles.navbarContainerLoggin}>
          {isAuthenticated ? (
            <>
              <div
                className={styles.NavbarLoggin}
                onClick={() => navigate("/userCount")}
              >
                <span className="material-symbols-outlined">person</span>
                {currentUser?.name}
              </div>
              {currentUser?.role === "ADMIN" && (
                <div
                  className={`${styles.NavbarLoggin} ${styles.adminButton}`}
                  onClick={() => navigate("/admin")}
                >
                  <span className="material-symbols-outlined">
                    admin_panel_settings
                  </span>
                  ADMIN
                </div>
              )}
              <div className={styles.NavbarLoggin} onClick={handleLogout}>
                <span className="material-symbols-outlined">logout</span>
                CERRAR SESIÓN
              </div>
            </>
          ) : (
            <div
              className={styles.NavbarLoggin}
              onClick={() => navigate("/loginRegister")}
            >
              <span className="material-symbols-outlined">person</span>
              INICIAR SESIÓN
            </div>
          )}
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
            <form
              className={styles.NavbarSearchContainer}
              onSubmit={handleSearch}
            >
              <span
                className={`material-symbols-outlined ${styles.NavbarSearchIcon}`}
              >
                search
              </span>
              <input
                type="text"
                placeholder="Buscar"
                className={styles.NavbarSearchInput}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
