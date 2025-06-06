import { useState } from "react";
import { CardCatalogProduct } from "../CardCatalogProduct/CardCatalogProduct";
import s from "./CatalogProducts.module.css";

export const CatalogProducts = () => {
  const [columns, setColumns] = useState(4);

  // Simula varios productos
  const products = Array.from({ length: 12 });

  return (
    <div className={s.container}>
      <div className={s.header}>
        <div className={s.icons}>
          <span
            className={`material-symbols-outlined ${
              columns === 4 ? s.active : ""
            } ${s.iconButton}`}
            onClick={() => setColumns(4)}
            title="Vista de 4 columnas"
            tabIndex={0}
            role="button"
            aria-pressed={columns === 4}
          >
            background_grid_small
          </span>
          <span
            className={`material-symbols-outlined ${
              columns === 3 ? s.active : ""
            } ${s.iconButton}`}
            onClick={() => setColumns(3)}
            title="Vista de 3 columnas"
            tabIndex={0}
            role="button"
            aria-pressed={columns === 3}
          >
            grid_on
          </span>
        </div>
      </div>
      <div
        className={s.grid}
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
      >
        {products.map((_, i) => (
          <CardCatalogProduct key={i} />
        ))}
      </div>
      <div className={s.description}>
        <span className={s.titlte}>Classics Vans</span>
        <span>
          Compra Zapatillas Classics Vans. Variedad de colores y talles.
          Recibílo en tu casa o retirá gratis en el local más cercano. Descubrí
          todo lo que tenemos para vos en la única tienda oficial de Vans en
          Argentina.
        </span>
      </div>
    </div>
  );
};
