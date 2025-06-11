import { useEffect, useState } from "react";
import { AdminCardProduct } from "../AdminCardProduct/AdminCardProduct";
import { useProductStore } from "../../../hooks/useProductStore";
import { useCategoryStore } from "../../../hooks/useCategoryStore";
import { useSizeStore } from "../../../hooks/useSizeStore";
import { useColourStore } from "../../../hooks/useColourStore";
import { useProductSizeStore } from "../../../hooks/useProductSizeStore";
import s from "./AdminCatalogProducts.module.css";

interface FilterDetail {
  id: string;
  name: string;
}

export const AdminCatalogProducts = () => {
  const [columns, setColumns] = useState(3);
  const [activeFilters, setActiveFilters] = useState<{
    category?: FilterDetail;
    colour?: FilterDetail;
    size?: FilterDetail;
    priceRange?: { min: number | null; max: number | null };
  }>({});

  const { items: products, fetchAll: fetchAllProducts } = useProductStore();
  const { items: categories } = useCategoryStore();
  const { items: sizes } = useSizeStore();
  const { items: colours } = useColourStore();
  const { items: productSizes, fetchAll: fetchAllProductSizes } =
    useProductSizeStore();

  useEffect(() => {
    fetchAllProducts();
    fetchAllProductSizes();
  }, [fetchAllProducts, fetchAllProductSizes]);

  useEffect(() => {
    const handleCategoryChange = (event: CustomEvent) => {
      const categoryName = event.detail;
      const category = categories.find((c) => c.name === categoryName);
      setActiveFilters((prev) => ({
        ...prev,
        category: category
          ? { id: category.id.toString(), name: category.name }
          : undefined,
      }));
    };

    const handleSizeChange = (event: CustomEvent) => {
      const sizeNumber = event.detail;
      const size = sizes.find((s) => s.number === sizeNumber);
      setActiveFilters((prev) => ({
        ...prev,
        size: size ? { id: size.id.toString(), name: size.number } : undefined,
      }));
    };

    const handleColorChange = (event: CustomEvent) => {
      const colorNames = event.detail;
      const color = colours.find((c) => colorNames.includes(c.name));
      setActiveFilters((prev) => ({
        ...prev,
        colour: color
          ? { id: color.id.toString(), name: color.name }
          : undefined,
      }));
    };

    const handlePriceChange = (event: CustomEvent) => {
      const { min, max } = event.detail;
      setActiveFilters((prev) => ({
        ...prev,
        priceRange: { min, max },
      }));
    };

    window.addEventListener(
      "adminCategoryChange",
      handleCategoryChange as EventListener
    );
    window.addEventListener(
      "adminSizeChange",
      handleSizeChange as EventListener
    );
    window.addEventListener(
      "adminColorChange",
      handleColorChange as EventListener
    );
    window.addEventListener(
      "adminPriceChange",
      handlePriceChange as EventListener
    );

    return () => {
      window.removeEventListener(
        "adminCategoryChange",
        handleCategoryChange as EventListener
      );
      window.removeEventListener(
        "adminSizeChange",
        handleSizeChange as EventListener
      );
      window.removeEventListener(
        "adminColorChange",
        handleColorChange as EventListener
      );
      window.removeEventListener(
        "adminPriceChange",
        handlePriceChange as EventListener
      );
    };
  }, [categories, sizes, colours]);

  const filteredProducts = products.filter((product) => {
    // Filtrar por categoría
    if (
      activeFilters.category &&
      product.category?.id.toString() !== activeFilters.category.id
    ) {
      return false;
    }

    // Filtrar por color
    if (
      activeFilters.colour &&
      product.colour?.id.toString() !== activeFilters.colour.id
    ) {
      return false;
    }

    // Filtrar por talle
    if (activeFilters.size) {
      const hasSize = productSizes.some(
        (ps) =>
          ps.idProduct === product.id &&
          ps.idSize.toString() === activeFilters.size?.id &&
          ps.stock > 0
      );
      if (!hasSize) return false;
    }

    // Filtrar por precio
    if (activeFilters.priceRange) {
      const { min, max } = activeFilters.priceRange;
      if (min !== null && product.price < min) return false;
      if (max !== null && product.price > max) return false;
    }

    return true;
  });

  return (
    <div className={s.container}>
      <div className={s.header}>
        <div className={s.titleContainer}>
          <h2>Productos</h2>
          <span className={s.productCount}>
            ({filteredProducts.length} productos)
          </span>
        </div>
        <div className={s.viewOptions}>
          <button
            className={`${s.viewButton} ${columns === 3 ? s.active : ""}`}
            onClick={() => setColumns(3)}
          >
            <span className="material-symbols-outlined">grid_view</span>
          </button>
          <button
            className={`${s.viewButton} ${columns === 4 ? s.active : ""}`}
            onClick={() => setColumns(4)}
          >
            <span className="material-symbols-outlined">view_agenda</span>
          </button>
        </div>
      </div>
      <div className={`${s.productsGrid} ${s[`columns${columns}`]}`}>
        {filteredProducts.map((product) => (
          <AdminCardProduct key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};
