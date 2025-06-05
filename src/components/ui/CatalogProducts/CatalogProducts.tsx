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
        <span>CATÁLOGO</span>
        <div className={s.icons}>
          <button
            className={columns === 4 ? s.active : ""}
            onClick={() => setColumns(4)}
            title="Vista de 4 columnas"
          >
            {/* Icono grid 4 columnas */}
            <span>🔳</span>
          </button>
          <button
            className={columns === 3 ? s.active : ""}
            onClick={() => setColumns(3)}
            title="Vista de 3 columnas"
          >
            {/* Icono grid 3 columnas */}
            <span>🔲</span>
          </button>
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
        <h1>Classics Vans</h1>
        <h2>
          Compra Zapatillas Classics Vans. Variedad de colores y talles.
          Recibílo en tu casa o retirá gratis en el local más cercano. Descubrí
          todo lo que tenemos para vos en la única tienda oficial de Vans en
          Argentina.
        </h2>
      </div>
    </div>
  );
};
