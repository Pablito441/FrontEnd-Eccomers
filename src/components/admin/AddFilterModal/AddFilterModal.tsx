import { useState, useEffect } from "react";
import { useBrandStore } from "../../../hooks/useBrandStore";
import s from "./AddFilterModal.module.css";
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

interface AddFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filterType: FilterType;
  filterToEdit?: Filter;
}

export const AddFilterModal = ({
  isOpen,
  onClose,
  filterType,
  filterToEdit,
}: AddFilterModalProps) => {
  const { create: createBrand, update: updateBrand } = useBrandStore();
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    system: "ARG",
    value: "#000000",
  });

  useEffect(() => {
    if (!isOpen) {
      resetForm();
    }
  }, [isOpen]);

  useEffect(() => {
    if (filterToEdit) {
      if (filterType === "brand" && isBrand(filterToEdit)) {
        setFormData((prev) => ({ ...prev, name: filterToEdit.name }));
      } else if (filterType === "type" && isType(filterToEdit)) {
        setFormData((prev) => ({ ...prev, name: filterToEdit.name }));
      } else if (filterType === "category" && isCategory(filterToEdit)) {
        setFormData((prev) => ({ ...prev, name: filterToEdit.name }));
      } else if (filterType === "size" && isSize(filterToEdit)) {
        setFormData((prev) => ({
          ...prev,
          number: filterToEdit.number,
          system: filterToEdit.system,
        }));
      } else if (filterType === "colour" && isColour(filterToEdit)) {
        setFormData((prev) => ({
          ...prev,
          name: filterToEdit.name,
          value: filterToEdit.value,
        }));
      }
    }
  }, [filterToEdit, filterType]);

  const resetForm = () => {
    setFormData({
      name: "",
      number: "",
      system: "ARG",
      value: "#000000",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (filterToEdit) {
        // Modo edición
        if (filterType === "brand" && isBrand(filterToEdit)) {
          await updateBrand(filterToEdit.id, { name: formData.name });
        }
        // Otros tipos se implementarán después
      } else {
        // Modo creación
        if (filterType === "brand") {
          await createBrand({ name: formData.name });
        }
        // Otros tipos se implementarán después
      }

      resetForm();
      onClose();
    } catch (error) {
      console.error("Error al procesar el filtro:", error);
    }
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const renderForm = () => {
    if (
      filterType === "brand" ||
      filterType === "type" ||
      filterType === "category"
    ) {
      return (
        <div className={s.formGroup}>
          <label htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder={`Ingrese el nombre del ${filterType}`}
            required
          />
        </div>
      );
    }

    if (filterType === "size") {
      return (
        <>
          <div className={s.formGroup}>
            <label htmlFor="number">Número</label>
            <input
              type="text"
              id="number"
              value={formData.number}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, number: e.target.value }))
              }
              placeholder="Ingrese el número"
              required
            />
          </div>
          <div className={s.formGroup}>
            <label htmlFor="system">Sistema</label>
            <select
              id="system"
              value={formData.system}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, system: e.target.value }))
              }
            >
              <option value="ARG">ARG</option>
              <option value="US">US</option>
              <option value="UK">UK</option>
              <option value="CM">CM</option>
            </select>
          </div>
        </>
      );
    }

    if (filterType === "colour") {
      return (
        <>
          <div className={s.formGroup}>
            <label htmlFor="name">Nombre</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              placeholder="Ingrese el nombre del color"
              required
            />
          </div>
          <div className={s.formGroup}>
            <label htmlFor="value">Color</label>
            <input
              type="color"
              id="value"
              value={formData.value}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, value: e.target.value }))
              }
              className={s.colorPicker}
            />
          </div>
        </>
      );
    }

    return null;
  };

  const getTitle = () => {
    const action = filterToEdit ? "Editar" : "Agregar";
    switch (filterType) {
      case "brand":
        return `${action} Marca`;
      case "type":
        return `${action} Tipo`;
      case "category":
        return `${action} Categoría`;
      case "size":
        return `${action} Talle`;
      case "colour":
        return `${action} Color`;
      default:
        return `${action} Filtro`;
    }
  };

  if (!isOpen) return null;

  return (
    <div className={s.modalOverlay}>
      <div className={s.modal}>
        <div className={s.modalHeader}>
          <h2>{getTitle()}</h2>
          <button className={s.closeButton} onClick={handleCancel}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {renderForm()}
          <div className={s.modalActions}>
            <button
              type="button"
              className={s.cancelButton}
              onClick={handleCancel}
            >
              Cancelar
            </button>
            <button type="submit" className={s.submitButton}>
              {filterToEdit ? "Guardar" : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
