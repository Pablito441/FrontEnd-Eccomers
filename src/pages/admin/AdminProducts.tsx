import { useState } from "react";
import { AdminCatalogProducts } from "../../components/admin/AdminCatalogProducts/AdminCatalogProducts";
import { AdminFilters } from "../../components/admin/AdminFilters/AdminFilters";
import { AdminCatalogFilters } from "../../components/admin/AdminCatalogFilters/AdminCatalogFilters";
import { AdminLanding } from "../../components/admin/AdminLanding/AdminLanding";
import { AddProductModal } from "../../components/admin/AddProductModal/AddProductModal";
import s from "./AdminProducts.module.css";
import { useProductStore } from "../../hooks/useProductStore";

type AdminPanel = "catalog" | "landing";

export const AdminProducts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activePanel, setActivePanel] = useState<AdminPanel>("catalog");
  const { items: products } = useProductStore();

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handlePanelChange = (panel: AdminPanel) => {
    setActivePanel(panel);
  };

  return (
    <div className={s.container}>
      <div className={s.header}>
        <div className={s.titleContainer}>
          <h1>Panel de Administración</h1>
          <span className={s.productCount}>
            ({products?.length || 0} productos)
          </span>
        </div>

        <div className={s.headerActions}>
          <div className={s.panelSwitch}>
            <button
              className={`${s.switchButton} ${
                activePanel === "catalog" ? s.active : ""
              }`}
              onClick={() => handlePanelChange("catalog")}
            >
              Catálogo
            </button>
            <button
              className={`${s.switchButton} ${
                activePanel === "landing" ? s.active : ""
              }`}
              onClick={() => handlePanelChange("landing")}
            >
              Landing
            </button>
          </div>

          {activePanel === "catalog" && (
            <button
              className={s.addButton}
              onClick={() => setIsModalOpen(true)}
            >
              <span className="material-symbols-outlined">add</span>
              Agregar Nuevo Producto
            </button>
          )}
        </div>
      </div>

      <div className={s.content}>
        {activePanel === "catalog" ? (
          <>
            <div className={s.sidebar}>
              <AdminCatalogFilters />
              <AdminFilters />
            </div>
            <div className={s.catalog}>
              <AdminCatalogProducts />
            </div>
          </>
        ) : (
          <AdminLanding />
        )}
      </div>

      <AddProductModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};
