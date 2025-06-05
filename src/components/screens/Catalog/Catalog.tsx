import { CatalogProducts } from "../../ui/CatalogProducts/CatalogProducts";
import { CatalogFilters } from "../../ui/CatalogFilters/CatalogFilters";
import s from "./Catalog.module.css";

export const Catalog = () => {
  return (
    <div className={s.container}>
      <div className={s.sidebar}>
        <CatalogFilters />
      </div>
      <div className={s.catalog}>
        <CatalogProducts />
      </div>
    </div>
  );
};
