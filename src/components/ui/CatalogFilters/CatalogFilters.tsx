import { useEffect, useState } from "react";
import { Dropdown } from "../../ui/Dropdown/Dropdown";
import styles from "./CatalogFilters.module.css";
import { useCategoryStore } from "../../../hooks/useCategoryStore";
import { useSizeStore } from "../../../hooks/useSizeStore";
import { useColourStore } from "../../../hooks/useColourStore";
import { useProductSizeStore } from "../../../hooks/useProductSizeStore";

export const CatalogFilters = () => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [price, setPrice] = useState({ min: "", max: "" });
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  const toggleSize = (size: string) => {
    const newSelectedSize = selectedSize === size ? null : size;
    setSelectedSize(newSelectedSize);

    // Emitir evento con el talle seleccionado
    const event = new CustomEvent("sizeChange", { detail: newSelectedSize });
    window.dispatchEvent(event);
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  // ESTADOS GLOBALES
  const { items: categories, fetchAll: fetchAllCategories } =
    useCategoryStore();
  const { items: sizes, fetchAll: fetchAllSizes } = useSizeStore();
  const { items: colours, fetchAll: fetchAllColours } = useColourStore();
  const { items: productSizes, fetchAll: fetchAllProductSizes } =
    useProductSizeStore();

  useEffect(() => {
    fetchAllCategories();
    fetchAllSizes();
    fetchAllColours();
    fetchAllProductSizes();
  }, [
    fetchAllCategories,
    fetchAllSizes,
    fetchAllColours,
    fetchAllProductSizes,
  ]);

  const isSizeAvailable = (sizeNumber: string) => {
    const sizeId = sizes.find((s) => s.number === sizeNumber)?.id;
    if (!sizeId) return false;

    return productSizes.some((ps) => ps.idSize === sizeId && ps.stock > 0);
  };

  return (
    <div className={styles.container}>
      <div className={styles.title}>CLASSICS</div>
      <Dropdown title="Shoes" options={categories.map((cat) => cat.name)} />
      <Dropdown title="Talle Calzado">
        <div className={styles.sizesGrid}>
          {sizes.map((size) => {
            const isAvailable = isSizeAvailable(size.number);
            return (
              <button
                key={size.id}
                className={`${styles.sizeBtn} ${
                  selectedSize === size.number ? styles.selected : ""
                } ${!isAvailable ? styles.unavailable : ""}`}
                onClick={() => isAvailable && toggleSize(size.number)}
                disabled={!isAvailable}
                type="button"
              >
                {size.number}
              </button>
            );
          })}
        </div>
      </Dropdown>
      <Dropdown title="Precios">
        <div className={styles.priceInputs}>
          <input
            className={styles.priceInput}
            type="number"
            placeholder="Mín"
            value={price.min}
            min={0}
            onChange={(e) => setPrice({ ...price, min: e.target.value })}
          />
          <span>-</span>
          <input
            className={styles.priceInput}
            type="number"
            placeholder="Máx"
            value={price.max}
            min={0}
            onChange={(e) => setPrice({ ...price, max: e.target.value })}
          />
        </div>
      </Dropdown>
      <Dropdown title="Color">
        <div className={styles.colorsGrid}>
          {colours.map((color) => (
            <label key={color.name} className={styles.colorCheck}>
              <input
                type="checkbox"
                checked={selectedColors.includes(color.name)}
                onChange={() => toggleColor(color.name)}
                style={{ accentColor: color.value }}
              />
              <span
                className={styles.colorBox}
                style={{ background: color.value, borderColor: "#aaa" }}
              />
              <span className={styles.nameColor}>{color.name}</span>
            </label>
          ))}
        </div>
      </Dropdown>
    </div>
  );
};
