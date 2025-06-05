import { useState } from "react";
import { Dropdown } from "../../ui/Dropdown/Dropdown";
import styles from "./CatalogFilters.module.css";

const shoeSizes = Array.from({ length: 13 }, (_, i) => (35 + i).toString());
const colors = [
  { name: "Negro", code: "#222" },
  { name: "Blanco", code: "#fff" },
  { name: "Rojo", code: "#e53935" },
  { name: "Azul", code: "#1976d2" },
  { name: "Verde", code: "#43a047" },
  { name: "Amarillo", code: "#fbc02d" },
  { name: "Gris", code: "#757575" },
  { name: "Beige", code: "#f5f5dc" },
  { name: "Rosa", code: "#e91e63" },
  { name: "Marrón", code: "#795548" },
];

export const CatalogFilters = () => {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [price, setPrice] = useState({ min: "", max: "" });
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedGender, setSelectedGender] = useState<string[]>([]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const toggleGender = (gender: string) => {
    setSelectedGender((prev) =>
      prev.includes(gender)
        ? prev.filter((g) => g !== gender)
        : [...prev, gender]
    );
  };

  return (
    <div>
      <h1>CLASSICS</h1>
      <Dropdown
        title="SHOES"
        options={[
          "Old skool",
          "Era",
          "Authentic",
          "Sk8-Hi",
          "Slip-on",
          "KNU skool",
        ]}
      />
      <Dropdown title="Talle Calzado">
        <div className={styles.sizesGrid}>
          {shoeSizes.map((size) => (
            <button
              key={size}
              className={`${styles.sizeBtn} ${
                selectedSizes.includes(size) ? styles.selected : ""
              }`}
              onClick={() => toggleSize(size)}
              type="button"
            >
              {size}
            </button>
          ))}
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
          {colors.map((color) => (
            <label key={color.name} className={styles.colorCheck}>
              <input
                type="checkbox"
                checked={selectedColors.includes(color.name)}
                onChange={() => toggleColor(color.name)}
                style={{ accentColor: color.code }}
              />
              <span
                className={styles.colorBox}
                style={{ background: color.code, borderColor: "#aaa" }}
              />
              {color.name}
            </label>
          ))}
        </div>
      </Dropdown>
      <Dropdown title="Género">
        <div className={styles.genderGrid}>
          {["Hombre", "Mujer", "Unisex"].map((gender) => (
            <label key={gender} className={styles.genderCheck}>
              <input
                type="checkbox"
                checked={selectedGender.includes(gender)}
                onChange={() => toggleGender(gender)}
              />
              {gender}
            </label>
          ))}
        </div>
      </Dropdown>
    </div>
  );
};
