import { useState, useEffect } from "react";
import { AdminStatusFilters, type StatusFilter } from "../../components/admin/AdminStatusFilters/AdminStatusFilters";
import { useCategoryStore } from "../../hooks/useCategoryStore";
import type { ICategory } from "../../types/ICategory";
import s from "./AdminCategories.module.css";

export const AdminCategories = () => {
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  
  const {
    items: categories,
    fetchAll: fetchAllCategories,
    fetchActive: fetchActiveCategories,
    fetchInactive: fetchInactiveCategories,
    fetchSoftDeleted: fetchSoftDeletedCategories,
    activate,
    deactivate,
    softDelete,
    delete: deleteCategory
  } = useCategoryStore();

  // Función para cargar categorías según el filtro de estado
  const loadCategoriesByStatus = async (filter: StatusFilter) => {
    switch (filter) {
      case "active":
        await fetchActiveCategories();
        break;
      case "inactive":
        await fetchInactiveCategories();
        break;
      case "soft-deleted":
        await fetchSoftDeletedCategories();
        break;
      default:
        await fetchAllCategories();
        break;
    }
  };

  useEffect(() => {
    loadCategoriesByStatus(statusFilter);
  }, [statusFilter]);

  const handleStatusFilterChange = (filter: StatusFilter) => {
    setStatusFilter(filter);
  };

  const handleActivate = async (id: number) => {
    try {
      await activate(id);
      await loadCategoriesByStatus(statusFilter);
    } catch (error) {
      console.error("Error al activar la categoría:", error);
    }
  };

  const handleDeactivate = async (id: number) => {
    try {
      await deactivate(id);
      await loadCategoriesByStatus(statusFilter);
    } catch (error) {
      console.error("Error al desactivar la categoría:", error);
    }
  };

  const handleSoftDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta categoría? Esta acción se puede revertir.")) {
      try {
        await softDelete(id);
        await loadCategoriesByStatus(statusFilter);
      } catch (error) {
        console.error("Error al eliminar la categoría:", error);
      }
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar permanentemente esta categoría? Esta acción NO se puede revertir.")) {
      try {
        await deleteCategory(id);
        await loadCategoriesByStatus(statusFilter);
      } catch (error) {
        console.error("Error al eliminar la categoría:", error);
      }
    }
  };

  const getStatusLabel = () => {
    switch (statusFilter) {
      case "active":
        return "Activas";
      case "inactive":
        return "Inactivas";
      case "soft-deleted":
        return "Eliminadas";
      default:
        return "Todas";
    }
  };

  const getCategoryStatus = (category: ICategory) => {
    if (category.deletedAt) return "deleted";
    if (!category.isActive) return "inactive";
    return "active";
  };

  return (
    <div className={s.container}>
      <div className={s.header}>
        <div className={s.titleContainer}>
          <h1>Administración de Categorías</h1>
          <span className={s.categoryCount}>({categories.length} categorías)</span>
        </div>
      </div>

      <div className={s.content}>
        <div className={s.sidebar}>
          <AdminStatusFilters
            currentFilter={statusFilter}
            onFilterChange={handleStatusFilterChange}
          />
        </div>

        <div className={s.mainContent}>
          <div className={s.contentHeader}>
            <h2>Categorías {getStatusLabel()}</h2>
            <span className={s.count}>({categories.length} categorías)</span>
          </div>

          <div className={s.categoriesGrid}>
            {categories.map((category) => {
              const status = getCategoryStatus(category);
              return (
                <div key={category.id} className={`${s.categoryCard} ${s[status]}`}>
                  <div className={s.statusBadge}>
                    {status === "active" && (
                      <span className={`${s.badge} ${s.activeBadge}`}>
                        <span className="material-symbols-outlined">check_circle</span>
                        Activa
                      </span>
                    )}
                    {status === "inactive" && (
                      <span className={`${s.badge} ${s.inactiveBadge}`}>
                        <span className="material-symbols-outlined">cancel</span>
                        Inactiva
                      </span>
                    )}
                    {status === "deleted" && (
                      <span className={`${s.badge} ${s.deletedBadge}`}>
                        <span className="material-symbols-outlined">delete</span>
                        Eliminada
                      </span>
                    )}
                  </div>

                  <div className={s.categoryInfo}>
                    <h3>{category.name}</h3>
                    <p>Tipo: {category.type?.name || "Sin tipo"}</p>
                    <p>ID: {category.id}</p>
                  </div>

                  <div className={s.actions}>
                    {status === "active" && (
                      <button 
                        onClick={() => handleDeactivate(category.id)} 
                        className={s.deactivateButton}
                      >
                        <span className="material-symbols-outlined">pause_circle</span>
                        Desactivar
                      </button>
                    )}

                    {status === "inactive" && (
                      <button 
                        onClick={() => handleActivate(category.id)} 
                        className={s.activateButton}
                      >
                        <span className="material-symbols-outlined">play_circle</span>
                        Activar
                      </button>
                    )}

                    {status !== "deleted" && (
                      <button 
                        onClick={() => handleSoftDelete(category.id)} 
                        className={s.softDeleteButton}
                      >
                        <span className="material-symbols-outlined">delete_outline</span>
                        Eliminar
                      </button>
                    )}

                    <button 
                      onClick={() => handleDelete(category.id)} 
                      className={s.deleteButton}
                    >
                      <span className="material-symbols-outlined">delete_forever</span>
                      Eliminar Permanente
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}; 