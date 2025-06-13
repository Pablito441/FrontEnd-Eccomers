import { useEffect, useState } from "react";
import { useCategoryStore } from "../../../hooks/useCategoryStore";
import { useSizeStore } from "../../../hooks/useSizeStore";
import { useColourStore } from "../../../hooks/useColourStore";
import { useBrandStore } from "../../../hooks/useBrandStore";
import { useTypeStore } from "../../../hooks/useTypeStore";
import { useProductStore } from "../../../hooks/useProductStore";
import { AddFilterModal } from "../AddFilterModal/AddFilterModal";
import { FilterDetailsModal } from "../FilterDetailsModal/FilterDetailsModal";
import { categoryService } from "../../../http/CategoryService";
import { sizeService } from "../../../http/SizeService";
import { colourService } from "../../../http/ColourService";
import { brandService } from "../../../http/BrandService";
import { typeService } from "../../../http/TypeService";
import type { IBrand } from "../../../types/IBrand";
import type { ICategory } from "../../../types/ICategory";
import type { IColour } from "../../../types/IColour";
import type { ISize } from "../../../types/ISize";
import type { IType } from "../../../types/IType";
import s from "./AdminFilters.module.css";
import axios from "axios";

type FilterType = "brand" | "type" | "category" | "size" | "colour";
type Filter = IBrand | IType | ICategory | ISize | IColour;

const isBrand = (filter: Filter): filter is IBrand =>
  "name" in filter && !("number" in filter);
const isType = (filter: Filter): filter is IType =>
  "name" in filter && !("number" in filter);
const isCategory = (filter: Filter): filter is ICategory =>
  "name" in filter && !("number" in filter);
const isSize = (filter: Filter): filter is ISize => "number" in filter;
const isColour = (filter: Filter): filter is IColour => "value" in filter;

export const AdminFilters = () => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedFilterType, setSelectedFilterType] =
    useState<FilterType | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<Filter | null>(null);
  const [filterToEdit, setFilterToEdit] = useState<Filter | null>(null);
  const [showDeleted, setShowDeleted] = useState(false);

  // Estados locales para elementos eliminados (no afectan stores globales)
  const [deletedCategories, setDeletedCategories] = useState<ICategory[]>([]);
  const [deletedSizes, setDeletedSizes] = useState<ISize[]>([]);
  const [deletedColours, setDeletedColours] = useState<IColour[]>([]);
  const [deletedBrands, setDeletedBrands] = useState<IBrand[]>([]);
  const [deletedTypes, setDeletedTypes] = useState<IType[]>([]);
  const [loading, setLoading] = useState(false);

  // Stores globales (solo para elementos activos)
  const {
    items: categories,
    fetchAll: fetchAllCategories,
    update: updateCategory,
    restore: restoreCategory,
  } = useCategoryStore();
  const {
    items: sizes,
    fetchAll: fetchAllSizes,
    restore: restoreSize,
  } = useSizeStore();
  const {
    items: colours,
    fetchAll: fetchAllColours,
    restore: restoreColour,
  } = useColourStore();
  const {
    items: brands,
    fetchAll: fetchAllBrands,
    restore: restoreBrand,
  } = useBrandStore();
  const {
    items: types,
    fetchAll: fetchAllTypes,
    restore: restoreType,
  } = useTypeStore();

  // Store de productos para actualizar después de restaurar filtros
  const { fetchActive: fetchActiveProducts } = useProductStore();

  // Función para cargar elementos eliminados directamente desde la API (sin afectar estado global)
  const fetchDeletedElements = async () => {
    setLoading(true);
    try {
      // Usar directamente los servicios de API para obtener elementos eliminados
      const [deletedCats, deletedSzs, deletedCols, deletedBrds, deletedTps] = await Promise.all([
        categoryService.getSoftDeleted(),
        sizeService.getSoftDeleted(),
        colourService.getSoftDeleted(),
        brandService.getSoftDeleted(),
        typeService.getSoftDeleted(),
      ]);

      // Actualizar solo el estado local (no afecta stores globales)
      setDeletedCategories(deletedCats);
      setDeletedSizes(deletedSzs);
      setDeletedColours(deletedCols);
      setDeletedBrands(deletedBrds);
      setDeletedTypes(deletedTps);
    } catch (error) {
      console.error('Error al cargar elementos eliminados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showDeleted) {
      fetchDeletedElements();
    } else {
      // Cargar elementos activos en stores globales
      fetchAllCategories();
      fetchAllSizes();
      fetchAllColours();
      fetchAllBrands();
      fetchAllTypes();
    }
  }, [
    showDeleted,
    fetchAllCategories,
    fetchAllSizes,
    fetchAllColours,
    fetchAllBrands,
    fetchAllTypes,
  ]);

  const refreshData = () => {
    if (showDeleted) {
      fetchDeletedElements();
    } else {
      fetchAllCategories();
      fetchAllSizes();
      fetchAllColours();
      fetchAllBrands();
      fetchAllTypes();
    }
  };

  const handleAddClick = (filterType: FilterType) => {
    setSelectedFilterType(filterType);
    setFilterToEdit(null);
    setIsAddModalOpen(true);
  };

  const handleEditClick = (filterType: FilterType, filter: Filter) => {
    setSelectedFilterType(filterType);
    setFilterToEdit(filter);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    setIsAddModalOpen(false);
    setSelectedFilterType(null);
    setFilterToEdit(null);
    refreshData();
  };

  const handleViewDetails = (filterType: FilterType, filter: Filter) => {
    setSelectedFilterType(filterType);
    setSelectedFilter(filter);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setSelectedFilterType(null);
    setSelectedFilter(null);
    refreshData();
  };

  const handleDelete = async (filterType: FilterType, filter: Filter) => {
    if (
      !window.confirm("¿Estás seguro de que deseas eliminar este elemento?")
    ) {
      return;
    }

    try {
      switch (filterType) {
        case "category":
          if (isCategory(filter)) {
            // Primero actualizamos el tipo a undefined
            await updateCategory(filter.id, { ...filter, typeId: undefined });
            // Luego soft delete
            await axios.put(`http://localhost:9000/api/v1/categories/${filter.id}/soft-delete`);
          }
          break;
        case "brand":
          if (isBrand(filter)) {
            await axios.put(`http://localhost:9000/api/v1/brands/${filter.id}/soft-delete`);
          }
          break;
        case "type":
          if (isType(filter)) {
            await axios.put(`http://localhost:9000/api/v1/types/${filter.id}/soft-delete`);
          }
          break;
        case "size":
          if (isSize(filter)) {
            await axios.put(`http://localhost:9000/api/v1/sizes/${filter.id}/soft-delete`);
          }
          break;
        case "colour":
          if (isColour(filter)) {
            await axios.put(`http://localhost:9000/api/v1/colours/${filter.id}/soft-delete`);
          }
          break;
      }

      refreshData();

      // Actualizar productos después de eliminar el filtro
      await fetchActiveProducts();
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar el elemento");
    }
  };

  const handleRestore = async (filterType: FilterType, filter: Filter) => {
    if (
      !window.confirm("¿Estás seguro de que deseas restaurar este elemento?")
    ) {
      return;
    }

    try {
      switch (filterType) {
        case "category":
          if (isCategory(filter)) {
            await restoreCategory(filter.id);
          }
          break;
        case "brand":
          if (isBrand(filter)) {
            await restoreBrand(filter.id);
          }
          break;
        case "type":
          if (isType(filter)) {
            await restoreType(filter.id);
          }
          break;
        case "size":
          if (isSize(filter)) {
            await restoreSize(filter.id);
          }
          break;
        case "colour":
          if (isColour(filter)) {
            await restoreColour(filter.id);
          }
          break;
      }

      refreshData();

      // Actualizar productos después de restaurar el filtro
      await fetchActiveProducts();
    } catch (error) {
      console.error("Error al restaurar:", error);
      alert("Error al restaurar el elemento");
    }
  };

  const renderFilterList = (
    items: Filter[],
    filterType: FilterType,
    getDisplayValue: (item: Filter) => React.ReactNode
  ) => (
    <div className={s.list}>
      {items.map((item) => (
        <div key={item.id} className={s.item}>
          {getDisplayValue(item)}
          <div className={s.actions}>
            {!showDeleted && (
              <>
                <button
                  className={s.actionButton}
                  onClick={() => handleEditClick(filterType, item)}
                >
                  <span className="material-symbols-outlined">edit</span>
                </button>
                <button
                  className={s.actionButton}
                  onClick={() => handleViewDetails(filterType, item)}
                >
                  <span className="material-symbols-outlined">visibility</span>
                </button>
                <button
                  className={`${s.actionButton} ${s.deleteButton}`}
                  onClick={() => handleDelete(filterType, item)}
                >
                  <span className="material-symbols-outlined">delete</span>
                </button>
              </>
            )}
            {showDeleted && (
              <>
                <button
                  className={s.actionButton}
                  onClick={() => handleViewDetails(filterType, item)}
                >
                  <span className="material-symbols-outlined">visibility</span>
                </button>
                <button
                  className={`${s.actionButton} ${s.restoreButton}`}
                  onClick={() => handleRestore(filterType, item)}
                  title="Restaurar elemento"
                >
                  <span className="material-symbols-outlined">restore</span>
                </button>
              </>
            )}
          </div>
        </div>
      ))}
      {items.length === 0 && (
        <div className={s.emptyMessage}>
          {showDeleted ? "No hay elementos eliminados" : "No hay elementos"}
        </div>
      )}
    </div>
  );

  // Determinar qué elementos mostrar según el estado del toggle
  const currentCategories = showDeleted ? deletedCategories : categories;
  const currentSizes = showDeleted ? deletedSizes : sizes;
  const currentColours = showDeleted ? deletedColours : colours;
  const currentBrands = showDeleted ? deletedBrands : brands;
  const currentTypes = showDeleted ? deletedTypes : types;

  if (loading) {
    return (
      <div className={s.container}>
        <div className={s.header}>
          <h1>Gestión de Filtros</h1>
          <div className={s.toggleContainer}>
            <label className={s.toggle}>
              <input
                type="checkbox"
                checked={showDeleted}
                onChange={(e) => setShowDeleted(e.target.checked)}
              />
              <span className={s.toggleSlider}></span>
              <span className={s.toggleLabel}>
                {showDeleted ? "Elementos Eliminados" : "Elementos Activos"}
              </span>
            </label>
          </div>
        </div>
        <div className={s.loadingContainer}>
          <div className={s.spinner}></div>
          <p>Cargando elementos eliminados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={s.container}>
      <div className={s.header}>
        <h1>Gestión de Filtros</h1>
        <div className={s.toggleContainer}>
          <label className={s.toggle}>
            <input
              type="checkbox"
              checked={showDeleted}
              onChange={(e) => setShowDeleted(e.target.checked)}
            />
            <span className={s.toggleSlider}></span>
            <span className={s.toggleLabel}>
              {showDeleted ? "Elementos Eliminados" : "Elementos Activos"}
            </span>
          </label>
        </div>
      </div>

      <div className={s.section}>
        <div className={s.sectionHeader}>
          <h2>Marcas</h2>
          {!showDeleted && (
            <button
              className={s.addButton}
              onClick={() => handleAddClick("brand")}
            >
              <span className="material-symbols-outlined">add</span>
              Agregar
            </button>
          )}
        </div>
        {renderFilterList(currentBrands, "brand", (brand) =>
          isBrand(brand) ? <span>{brand.name}</span> : null
        )}
      </div>

      <div className={s.section}>
        <div className={s.sectionHeader}>
          <h2>Tipos</h2>
          {!showDeleted && (
            <button
              className={s.addButton}
              onClick={() => handleAddClick("type")}
            >
              <span className="material-symbols-outlined">add</span>
              Agregar
            </button>
          )}
        </div>
        {renderFilterList(currentTypes, "type", (type) =>
          isType(type) ? <span>{type.name}</span> : null
        )}
      </div>

      <div className={s.section}>
        <div className={s.sectionHeader}>
          <h2>Categorías</h2>
          {!showDeleted && (
            <button
              className={s.addButton}
              onClick={() => handleAddClick("category")}
            >
              <span className="material-symbols-outlined">add</span>
              Agregar
            </button>
          )}
        </div>
        {renderFilterList(currentCategories, "category", (category) =>
          isCategory(category) ? <span>{category.name}</span> : null
        )}
      </div>

      <div className={s.section}>
        <div className={s.sectionHeader}>
          <h2>Talles</h2>
          {!showDeleted && (
            <button
              className={s.addButton}
              onClick={() => handleAddClick("size")}
            >
              <span className="material-symbols-outlined">add</span>
              Agregar
            </button>
          )}
        </div>
        {renderFilterList(currentSizes, "size", (size) =>
          isSize(size) ? <span>{size.number}</span> : null
        )}
      </div>

      <div className={s.section}>
        <div className={s.sectionHeader}>
          <h2>Colores</h2>
          {!showDeleted && (
            <button
              className={s.addButton}
              onClick={() => handleAddClick("colour")}
            >
              <span className="material-symbols-outlined">add</span>
              Agregar
            </button>
          )}
        </div>
        {renderFilterList(currentColours, "colour", (colour) =>
          isColour(colour) ? (
            <div className={s.colorInfo}>
              <div
                className={s.colorBox}
                style={{ backgroundColor: colour.value }}
              />
              <span>{colour.name}</span>
            </div>
          ) : null
        )}
      </div>

      {selectedFilterType && !showDeleted && (
        <AddFilterModal
          isOpen={isAddModalOpen}
          onClose={handleCloseAddModal}
          filterType={selectedFilterType}
          filterToEdit={filterToEdit || undefined}
        />
      )}

      {selectedFilterType && selectedFilter && (
        <FilterDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={handleCloseDetailsModal}
          filterType={selectedFilterType}
          filter={selectedFilter}
        />
      )}
    </div>
  );
};
