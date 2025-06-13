import { useEffect, useState } from "react";
import { useCategoryStore } from "../../../hooks/useCategoryStore";
import { useSizeStore } from "../../../hooks/useSizeStore";
import { useColourStore } from "../../../hooks/useColourStore";
import { useBrandStore } from "../../../hooks/useBrandStore";
import { useTypeStore } from "../../../hooks/useTypeStore";
import { AddFilterModal } from "../AddFilterModal/AddFilterModal";
import { FilterDetailsModal } from "../FilterDetailsModal/FilterDetailsModal";
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

  const {
    items: categories,
    fetchAll: fetchAllCategories,
    delete: deleteCategory,
    update: updateCategory,
  } = useCategoryStore();
  const {
    items: sizes,
    fetchAll: fetchAllSizes,
  } = useSizeStore();
  const {
    items: colours,
    fetchAll: fetchAllColours,
    delete: deleteColour,
  } = useColourStore();
  const {
    items: brands,
    fetchAll: fetchAllBrands,
    delete: deleteBrand,
  } = useBrandStore();
  const {
    items: types,
    fetchAll: fetchAllTypes,
    delete: deleteType,
  } = useTypeStore();

  useEffect(() => {
    fetchAllCategories();
    fetchAllSizes();
    fetchAllColours();
    fetchAllBrands();
    fetchAllTypes();
  }, [
    fetchAllCategories,
    fetchAllSizes,
    fetchAllColours,
    fetchAllBrands,
    fetchAllTypes,
  ]);

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
    fetchAllCategories();
    fetchAllSizes();
    fetchAllColours();
    fetchAllBrands();
    fetchAllTypes();
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
    fetchAllCategories();
    fetchAllSizes();
    fetchAllColours();
    fetchAllBrands();
    fetchAllTypes();
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
            // Luego eliminamos la categoría
            await deleteCategory(filter.id);
          }
          break;
        case "brand":
          if (isBrand(filter)) {
            await deleteBrand(filter.id);
          }
          break;
        case "type":
          if (isType(filter)) {
            await deleteType(filter.id);
          }
          break;
        case "size":
          if (isSize(filter)) {
            await axios.put(`http://localhost:9000/api/v1/sizes/${filter.id}/soft-delete`);
          }
          break;
        case "colour":
          if (isColour(filter)) {
            await deleteColour(filter.id);
          }
          break;
      }

      // Actualizamos las listas
      fetchAllCategories();
      fetchAllSizes();
      fetchAllColours();
      fetchAllBrands();
      fetchAllTypes();
    } catch (error) {
      console.error("Error al eliminar:", error);
      alert("Error al eliminar el elemento");
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
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className={s.container}>
      <div className={s.section}>
        <div className={s.sectionHeader}>
          <h2>Marcas</h2>
          <button
            className={s.addButton}
            onClick={() => handleAddClick("brand")}
          >
            <span className="material-symbols-outlined">add</span>
            Agregar
          </button>
        </div>
        {renderFilterList(brands, "brand", (brand) =>
          isBrand(brand) ? <span>{brand.name}</span> : null
        )}
      </div>

      <div className={s.section}>
        <div className={s.sectionHeader}>
          <h2>Tipos</h2>
          <button
            className={s.addButton}
            onClick={() => handleAddClick("type")}
          >
            <span className="material-symbols-outlined">add</span>
            Agregar
          </button>
        </div>
        {renderFilterList(types, "type", (type) =>
          isType(type) ? <span>{type.name}</span> : null
        )}
      </div>

      <div className={s.section}>
        <div className={s.sectionHeader}>
          <h2>Categorías</h2>
          <button
            className={s.addButton}
            onClick={() => handleAddClick("category")}
          >
            <span className="material-symbols-outlined">add</span>
            Agregar
          </button>
        </div>
        {renderFilterList(categories, "category", (category) =>
          isCategory(category) ? <span>{category.name}</span> : null
        )}
      </div>

      <div className={s.section}>
        <div className={s.sectionHeader}>
          <h2>Talles</h2>
          <button
            className={s.addButton}
            onClick={() => handleAddClick("size")}
          >
            <span className="material-symbols-outlined">add</span>
            Agregar
          </button>
        </div>
        {renderFilterList(sizes, "size", (size) =>
          isSize(size) ? <span>{size.number}</span> : null
        )}
      </div>

      <div className={s.section}>
        <div className={s.sectionHeader}>
          <h2>Colores</h2>
          <button
            className={s.addButton}
            onClick={() => handleAddClick("colour")}
          >
            <span className="material-symbols-outlined">add</span>
            Agregar
          </button>
        </div>
        {renderFilterList(colours, "colour", (colour) =>
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

      {selectedFilterType && (
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
