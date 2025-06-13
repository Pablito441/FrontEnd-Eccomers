import { useState } from "react";
import { AdminCatalogProducts } from "../../components/admin/AdminCatalogProducts/AdminCatalogProducts";
import { AdminFilters } from "../../components/admin/AdminFilters/AdminFilters";
import { AdminCatalogFilters } from "../../components/admin/AdminCatalogFilters/AdminCatalogFilters";
import { AddProductModal } from "../../components/admin/AddProductModal/AddProductModal";
import s from "./AdminProducts.module.css";
import { useProductStore } from "../../hooks/useProductStore";

export const AdminProducts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { items: products } = useProductStore();

  const handleCloseModal = () => {
    setIsModalOpen(false);
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
          <button className={s.addButton} onClick={() => setIsModalOpen(true)}>
            <span className="material-symbols-outlined">add</span>
            Agregar Nuevo Producto
          </button>
        </div>
      </div>

      <div className={s.content}>
        <div className={s.sidebar}>
          <AdminCatalogFilters />
          <AdminFilters />
        </div>
        <div className={s.catalog}>
          <AdminCatalogProducts />
        </div>
      </div>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};
