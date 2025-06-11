import s from "./FilterDetailsModal.module.css";
import type { IBrand } from "../../../types/IBrand";
import type { ICategory } from "../../../types/ICategory";
import type { IColour } from "../../../types/IColour";
import type { ISize } from "../../../types/ISize";
import type { IType } from "../../../types/IType";

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

interface FilterDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterType: FilterType;
  filter: Filter;
}

export const FilterDetailsModal = ({
  isOpen,
  onClose,
  filterType,
  filter,
}: FilterDetailsModalProps) => {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "No disponible";
    return new Date(dateString).toLocaleString();
  };

  const getTitle = () => {
    switch (filterType) {
      case "brand":
        return "Detalles de la Marca";
      case "type":
        return "Detalles del Tipo";
      case "category":
        return "Detalles de la Categoría";
      case "size":
        return "Detalles del Talle";
      case "colour":
        return "Detalles del Color";
      default:
        return "Detalles del Filtro";
    }
  };

  const renderCommonDetails = () => (
    <>
      <div className={s.detailRow}>
        <span className={s.label}>ID:</span>
        <span className={s.value}>{filter.id}</span>
      </div>
      <div className={s.detailRow}>
        <span className={s.label}>Estado:</span>
        <span className={s.value}>
          {filter.isActive ? "Activo" : "Inactivo"}
        </span>
      </div>
      <div className={s.detailRow}>
        <span className={s.label}>Creado:</span>
        <span className={s.value}>{formatDate(filter.createdAt)}</span>
      </div>
      <div className={s.detailRow}>
        <span className={s.label}>Actualizado:</span>
        <span className={s.value}>{formatDate(filter.updatedAt)}</span>
      </div>
      <div className={s.detailRow}>
        <span className={s.label}>Eliminado:</span>
        <span className={s.value}>{formatDate(filter.deletedAt)}</span>
      </div>
    </>
  );

  const renderSpecificDetails = () => {
    if (filterType === "brand" && isBrand(filter)) {
      return (
        <div className={s.detailRow}>
          <span className={s.label}>Nombre:</span>
          <span className={s.value}>{filter.name}</span>
        </div>
      );
    }

    if (filterType === "type" && isType(filter)) {
      return (
        <div className={s.detailRow}>
          <span className={s.label}>Nombre:</span>
          <span className={s.value}>{filter.name}</span>
        </div>
      );
    }

    if (filterType === "category" && isCategory(filter)) {
      return (
        <>
          <div className={s.detailRow}>
            <span className={s.label}>Nombre:</span>
            <span className={s.value}>{filter.name}</span>
          </div>
          <div className={s.detailRow}>
            <span className={s.label}>Tipo:</span>
            <span className={s.value}>
              {filter.type ? filter.type.name : "No asignado"}
            </span>
          </div>
        </>
      );
    }

    if (filterType === "size" && isSize(filter)) {
      return renderSizeDetails(filter);
    }

    if (filterType === "colour" && isColour(filter)) {
      return (
        <>
          <div className={s.detailRow}>
            <span className={s.label}>Nombre:</span>
            <span className={s.value}>{filter.name}</span>
          </div>
          <div className={s.detailRow}>
            <span className={s.label}>Color:</span>
            <div className={s.colorValue}>
              <div
                className={s.colorBox}
                style={{ backgroundColor: filter.value }}
              />
              <span>{filter.value}</span>
            </div>
          </div>
        </>
      );
    }

    return null;
  };

  const renderSizeDetails = (size: ISize) => (
    <>
      <div className={s.detailRow}>
        <span className={s.label}>Número:</span>
        <span className={s.value}>{size.number}</span>
      </div>
      <div className={s.detailRow}>
        <span className={s.label}>Sistema:</span>
        <span className={s.value}>{size.systemType}</span>
      </div>
    </>
  );

  if (!isOpen) return null;

  return (
    <div className={s.modalOverlay}>
      <div className={s.modal}>
        <div className={s.modalHeader}>
          <h2>{getTitle()}</h2>
          <button className={s.closeButton} onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className={s.modalContent}>
          {renderSpecificDetails()}
          {renderCommonDetails()}
        </div>
        <div className={s.modalActions}>
          <button className={s.closeButton} onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
