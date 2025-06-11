import { useState } from "react";
import { AdminCatalogProducts } from "../../components/admin/AdminCatalogProducts/AdminCatalogProducts";
import { CatalogFilters } from "../../components/ui/CatalogFilters/CatalogFilters";
import { AddProductModal } from "../../components/admin/AddProductModal/AddProductModal";
import s from "./AdminProducts.module.css";

export const AdminProducts = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className={s.container}>
      <div className={s.header}>
        <h1>Administración de Productos</h1>
        <button className={s.addButton} onClick={() => setIsModalOpen(true)}>
          <span className="material-symbols-outlined">add</span>
          Agregar Nuevo Producto
        </button>
      </div>
      <div className={s.content}>
        <div className={s.sidebar}>
          <CatalogFilters />
        </div>
        <div className={s.catalog}>
          <AdminCatalogProducts />
        </div>
      </div>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
