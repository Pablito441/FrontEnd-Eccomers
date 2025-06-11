import { useState, useEffect } from "react";
import { useTypeStore } from "../../../hooks/useTypeStore";
import { brandService } from "../../../http/BrandService";
import { typeService } from "../../../http/TypeService";
import { categoryService } from "../../../http/CategoryService";
import { sizeService } from "../../../http/SizeService";
import { colourService } from "../../../http/ColourService";
import type { IBrand } from "../../../types/IBrand";
import type { ICategory } from "../../../types/ICategory";
import type { IColour } from "../../../types/IColour";
import type { ISize } from "../../../types/ISize";
import type { IType } from "../../../types/IType";
import s from "./AddFilterModal.module.css";

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
  const { items: types } = useTypeStore();

  const [formData, setFormData] = useState<{
    name?: string;
    number?: string;
    systemType?: "ARG" | "US" | "UK" | "CM";
    value?: string;
    typeId?: number;
  }>({
    name: "",
    number: "",
    systemType: "ARG",
    value: "",
    typeId: undefined,
  });

  useEffect(() => {
    if (filterToEdit) {
      if (isSize(filterToEdit)) {
        setFormData({
          number: filterToEdit.number,
          systemType: filterToEdit.systemType,
        });
      } else if (isColour(filterToEdit)) {
        setFormData({
          name: filterToEdit.name,
          value: filterToEdit.value,
        });
      } else if (isCategory(filterToEdit)) {
        setFormData({
          name: filterToEdit.name,
          typeId: filterToEdit.typeId,
        });
      } else {
        setFormData({
          name: filterToEdit.name,
        });
      }
    } else {
      setFormData({
        name: "",
        number: "",
        systemType: "ARG",
        value: "",
        typeId: undefined,
      });
    }
  }, [filterToEdit]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (filterToEdit) {
        switch (filterType) {
          case "brand":
            if (isBrand(filterToEdit)) {
              await brandService.update(filterToEdit.id, {
                name: formData.name,
              });
            }
            break;
          case "type":
            if (isType(filterToEdit)) {
              await typeService.update(filterToEdit.id, {
                name: formData.name,
              });
            }
            break;
          case "category":
            if (isCategory(filterToEdit)) {
              await categoryService.update(filterToEdit.id, {
                name: formData.name,
                typeId: formData.typeId,
              });
            }
            break;
          case "size":
            if (isSize(filterToEdit)) {
              await sizeService.update(filterToEdit.id, {
                number: formData.number,
                systemType: formData.systemType,
              });
            }
            break;
          case "colour":
            if (isColour(filterToEdit)) {
              await colourService.update(filterToEdit.id, {
                name: formData.name,
                value: formData.value,
              });
            }
            break;
        }
      } else {
        switch (filterType) {
          case "brand":
            await brandService.create({ name: formData.name });
            break;
          case "type":
            await typeService.create({ name: formData.name });
            break;
          case "category":
            if (!formData.typeId) {
              throw new Error("Debes seleccionar un tipo para la categoría");
            }
            await categoryService.create({
              name: formData.name,
              typeId: formData.typeId,
            });
            break;
          case "size":
            if (!formData.systemType) {
              throw new Error("Debes seleccionar un sistema para el talle");
            }
            await sizeService.create({
              number: formData.number,
              systemType: formData.systemType,
            });
            break;
          case "colour":
            await colourService.create({
              name: formData.name,
              value: formData.value,
            });
            break;
        }
      }

      onClose();
    } catch (error) {
      console.error("Error al guardar:", error);
      alert("Error al guardar el elemento");
    }
  };

  const renderForm = () => {
    switch (filterType) {
      case "size":
        return (
          <>
            <div className={s.formGroup}>
              <label htmlFor="number">Número:</label>
              <input
                type="text"
                id="number"
                value={formData.number}
                onChange={(e) =>
                  setFormData({ ...formData, number: e.target.value })
                }
                required
              />
            </div>
            <div className={s.formGroup}>
              <label htmlFor="systemType">Sistema:</label>
              <select
                id="systemType"
                value={formData.systemType || "ARG"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    systemType: e.target.value as "ARG" | "US" | "UK" | "CM",
                  })
                }
                required
              >
                <option value="ARG">Argentina</option>
                <option value="US">Estados Unidos</option>
                <option value="UK">Reino Unido</option>
                <option value="CM">Centímetros</option>
              </select>
            </div>
          </>
        );
      case "colour":
        return (
          <>
            <div className={s.formGroup}>
              <label htmlFor="name">Nombre:</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className={s.formGroup}>
              <label htmlFor="value">Color:</label>
              <div className={s.colorPickerContainer}>
                <input
                  type="color"
                  id="value"
                  value={formData.value || "#000000"}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                  className={s.colorPicker}
                  required
                />
                <span className={s.colorValue}>
                  {formData.value || "#000000"}
                </span>
              </div>
            </div>
          </>
        );
      case "category":
        return (
          <>
            <div className={s.formGroup}>
              <label htmlFor="name">Nombre:</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className={s.formGroup}>
              <label htmlFor="typeId">Tipo:</label>
              <select
                id="typeId"
                value={formData.typeId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    typeId: Number(e.target.value),
                  })
                }
                required
              >
                <option value="">Seleccione un tipo</option>
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        );
      default:
        return (
          <div className={s.formGroup}>
            <label htmlFor="name">Nombre:</label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
          </div>
        );
    }
  };

  if (!isOpen) return null;

  return (
    <div className={s.modalOverlay}>
      <div className={s.modal}>
        <div className={s.modalHeader}>
          <h2>
            {filterToEdit
              ? `Editar ${filterType === "size" ? "Talle" : filterType}`
              : `Agregar ${filterType === "size" ? "Talle" : filterType}`}
          </h2>
          <button className={s.closeButton} onClick={onClose}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          {renderForm()}
          <div className={s.modalActions}>
            <button type="button" className={s.cancelButton} onClick={onClose}>
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
