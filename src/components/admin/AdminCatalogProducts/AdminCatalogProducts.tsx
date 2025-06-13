import { useEffect, useState } from "react";
import { AdminCardProduct } from "../AdminCardProduct/AdminCardProduct";
import { useProductStore } from "../../../hooks/useProductStore";
import s from "./AdminCatalogProducts.module.css";
import { AddProductModal } from "../AddProductModal/AddProductModal";

type StatusFilter = "all" | "active" | "inactive" | "deleted";
type ViewMode = "list" | "grid4";

export const AdminCatalogProducts = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("active");
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const { 
    items: products, 
    loading, 
    error, 
    fetchAll,
    fetchActive,
    fetchInactive,
    fetchSoftDeleted
  } = useProductStore();
  
  const [displayProducts, setDisplayProducts] = useState(products);

  // Cargar productos según el filtro de estado
  useEffect(() => {
    const loadProducts = async () => {
      switch (statusFilter) {
        case "active":
          await fetchActive();
          break;
        case "inactive":
          await fetchInactive();
          break;
        case "deleted":
          await fetchSoftDeleted();
          break;
        default:
          await fetchAll();
          break;
      }
    };

    loadProducts();
  }, [statusFilter, fetchAll, fetchActive, fetchInactive, fetchSoftDeleted]);

  // Actualizar productos mostrados cuando cambian los productos
  useEffect(() => {
    setDisplayProducts(products);
  }, [products]);

  const handleCloseModal = async () => {
    setIsModalOpen(false);
    switch (statusFilter) {
      case "active":
        await fetchActive();
        break;
      case "inactive":
        await fetchInactive();
        break;
      case "deleted":
        await fetchSoftDeleted();
        break;
      default:
        await fetchActive();
        break;
    }
  };

  if (loading) {
    return (
      <div className={s.container}>
        <div className={s.loadingContainer}>
          <div className={s.spinner}></div>
          <p>Cargando productos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={s.container}>
        <div className={s.errorContainer}>
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  const getStatusLabel = () => {
    switch (statusFilter) {
      case "active":
        return "Activos";
      case "inactive":
        return "Inactivos";
      case "deleted":
        return "Eliminados";
      default:
        return "Activos";
    }
  };

  // Determinar el fetch correspondiente al filtro actual
  const getFetchForFilter = () => {
    switch (statusFilter) {
      case "active":
        return fetchActive;
      case "inactive":
        return fetchInactive;
      case "deleted":
        return fetchSoftDeleted;
      default:
        return fetchActive;
    }
  };

  return (
    <div className={s.container}>
      <div className={s.header}>
        <div className={s.titleContainer}>
          <h2>Productos {getStatusLabel()}</h2>
          <span className={s.productCount}>({displayProducts.length} productos total)</span>
        </div>
        
        <div className={s.headerControls}>
          <div className={s.statusFilter}>
            <label htmlFor="status-select">Filtrar por Estado:</label>
            <select 
              id="status-select"
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className={s.statusSelect}
            >
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
              <option value="deleted">Eliminados</option>
            </select>
          </div>
          
          <div className={s.viewOptions}>
            <button
              className={`${s.viewButton} ${viewMode === "list" ? s.active : ""}`}
              onClick={() => setViewMode("list")}
              title="Vista de lista"
            >
              <span className="material-symbols-outlined">list</span>
            </button>
            <button
              className={`${s.viewButton} ${viewMode === "grid4" ? s.active : ""}`}
              onClick={() => setViewMode("grid4")}
              title="Vista de cuadrícula 4 columnas"
            >
              <span className="material-symbols-outlined">grid_view</span>
            </button>
            <button
              className={s.addButton}
              onClick={() => setIsModalOpen(true)}
              title="Agregar Nuevo Producto"
            >
              <span className="material-symbols-outlined">add</span>
            </button>
          </div>
        </div>
      </div>

      <div className={`${s.productsContainer} ${s[viewMode]}`}>
        {displayProducts.length === 0 ? (
          <div className={s.emptyState}>
            <p>No se encontraron productos</p>
          </div>
        ) : (
          displayProducts.map((product) => (
            <AdminCardProduct key={product.id} product={product} viewMode={viewMode} fetchList={getFetchForFilter()} />
          ))
        )}
      </div>

      <AddProductModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  );
};
