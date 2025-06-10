import { useEffect, useState } from "react";
import { Dropdown } from "../../ui/Dropdown/Dropdown";
import styles from "./CatalogFilters.module.css";
import { useCategoryStore } from "../../../hooks/useCategoryStore";
import { useSizeStore } from "../../../hooks/useSizeStore";
import { useColourStore } from "../../../hooks/useColourStore";
import { useProductSizeStore } from "../../../hooks/useProductSizeStore";
import { useProductStore } from "../../../hooks/useProductStore";

export const CatalogFilters = () => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [price, setPrice] = useState({ min: "", max: "" });
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 0 });
  const [colorCounts, setColorCounts] = useState<Record<string, number>>({});

  const toggleSize = (size: string) => {
    const newSelectedSize = selectedSize === size ? null : size;
    setSelectedSize(newSelectedSize);

    // Emitir evento con el talle seleccionado
    const event = new CustomEvent("sizeChange", { detail: newSelectedSize });
    window.dispatchEvent(event);
  };

  const toggleColor = (color: string) => {
    const newSelectedColors = selectedColors.includes(color)
      ? selectedColors.filter((c) => c !== color)
      : [...selectedColors, color];

    setSelectedColors(newSelectedColors);

    // Emitir evento con los colores seleccionados
    const event = new CustomEvent("colorChange", { detail: newSelectedColors });
    window.dispatchEvent(event);
  };

  // ESTADOS GLOBALES
  const { items: categories, fetchAll: fetchAllCategories } =
    useCategoryStore();
  const { items: sizes, fetchAll: fetchAllSizes } = useSizeStore();
  const { items: colours, fetchAll: fetchAllColours } = useColourStore();
  const { items: productSizes, fetchAll: fetchAllProductSizes } =
    useProductSizeStore();
  const { items: products, fetchAll: fetchAllProducts } = useProductStore();

  useEffect(() => {
    fetchAllCategories();
    fetchAllSizes();
    fetchAllColours();
    fetchAllProductSizes();
    fetchAllProducts();
  }, [
    fetchAllCategories,
    fetchAllSizes,
    fetchAllColours,
    fetchAllProductSizes,
    fetchAllProducts,
  ]);

  // Calcular el rango de precios cuando los productos cambian
  useEffect(() => {
    if (products.length > 0) {
      const prices = products.map((p) => p.price);
      const min = Math.min(...prices);
      const max = Math.max(...prices);
      setPriceRange({ min, max });
    }
  }, [products]);

  // Calcular la cantidad de productos por color
  useEffect(() => {
    if (products.length > 0 && colours.length > 0) {
      const counts: Record<string, number> = {};
      colours.forEach((color) => {
        if (color && color.name) {
          counts[color.name] = products.filter(
            (p) => p.colour?.name === color.name
          ).length;
        }
      });
      setColorCounts(counts);
    }
  }, [products, colours]);

  const isSizeAvailable = (sizeNumber: string) => {
    const sizeId = sizes.find((s) => s.number === sizeNumber)?.id;
    if (!sizeId) return false;

    return productSizes.some((ps) => ps.idSize === sizeId && ps.stock > 0);
  };

  const handlePriceChange = (type: "min" | "max", value: string) => {
    const newPrice = { ...price, [type]: value };
    setPrice(newPrice);

    // Emitir evento con el rango de precios
    const event = new CustomEvent("priceChange", {
      detail: {
        min: newPrice.min ? Number(newPrice.min) : null,
        max: newPrice.max ? Number(newPrice.max) : null,
      },
    });
    window.dispatchEvent(event);
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
            placeholder={`$${priceRange.min}`}
            value={price.min}
            min={priceRange.min}
            max={priceRange.max}
            onChange={(e) => handlePriceChange("min", e.target.value)}
          />
          <span>-</span>
          <input
            className={styles.priceInput}
            type="number"
            placeholder={`$${priceRange.max}`}
            value={price.max}
            min={priceRange.min}
            max={priceRange.max}
            onChange={(e) => handlePriceChange("max", e.target.value)}
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
              <span className={styles.nameColor}>
                {color.name} ({colorCounts[color.name] || 0})
              </span>
            </label>
          ))}
        </div>
      </Dropdown>
    </div>
  );
};
