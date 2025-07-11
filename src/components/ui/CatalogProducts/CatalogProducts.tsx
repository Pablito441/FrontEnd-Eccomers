import { useEffect, useState } from "react";
import { CardCatalogProduct } from "../CardCatalogProduct/CardCatalogProduct";
import s from "./CatalogProducts.module.css";
import { useProductStore } from "../../../hooks/useProductStore";
import { useProductSizeStore } from "../../../hooks/useProductSizeStore";
import { useSizeStore } from "../../../hooks/useSizeStore";
import { useSearchParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

interface SizeChangeEvent extends CustomEvent {
  detail: string | null;
}

interface PriceChangeEvent extends CustomEvent {
  detail: {
    min: number | null;
    max: number | null;
  };
}

interface ColorChangeEvent extends CustomEvent {
  detail: string[];
}

export const CatalogProducts = () => {
  const [searchParams] = useSearchParams();
  const [columns, setColumns] = useState(4);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<{
    min: number | null;
    max: number | null;
  }>({
    min: null,
    max: null,
  });
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string | null>(null);

  const { items: products, fetchAll: fetchAllProducts } = useProductStore();
  const { items: productSizes, fetchAll: fetchAllProductSizes } =
    useProductSizeStore();
  const { items: sizes, fetchAll: fetchAllSizes } = useSizeStore();

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllProducts();
    fetchAllProductSizes();
    fetchAllSizes();
  }, [fetchAllProducts, fetchAllProductSizes, fetchAllSizes]);

  // Leer la categoría y el término de búsqueda de la URL cuando se carga el componente
  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    const searchFromUrl = searchParams.get("search");

    if (categoryFromUrl) {
      setSelectedCategory(categoryFromUrl);
    }
    if (searchFromUrl) {
      setSearchTerm(searchFromUrl);
    }
    // Hacer scroll al inicio cuando cambian los parámetros de búsqueda
    window.scrollTo(0, 0);

    // Limpiar el término de búsqueda cuando se desmonte el componente
    return () => {
      setSearchTerm(null);
      setSelectedCategory(null);
    };
  }, [searchParams]);

  // Escuchar cambios en el talle seleccionado
  useEffect(() => {
    const handleSizeChange = (event: SizeChangeEvent) => {
      setSelectedSize(event.detail);
      window.scrollTo(0, 0);
    };

    window.addEventListener("sizeChange", handleSizeChange as EventListener);
    return () =>
      window.removeEventListener(
        "sizeChange",
        handleSizeChange as EventListener
      );
  }, []);

  // Escuchar cambios en el rango de precios
  useEffect(() => {
    const handlePriceChange = (event: PriceChangeEvent) => {
      setPriceRange(event.detail);
      window.scrollTo(0, 0);
    };

    window.addEventListener("priceChange", handlePriceChange as EventListener);
    return () =>
      window.removeEventListener(
        "priceChange",
        handlePriceChange as EventListener
      );
  }, []);

  // Escuchar cambios en los colores seleccionados
  useEffect(() => {
    const handleColorChange = (event: ColorChangeEvent) => {
      setSelectedColors(event.detail);
      window.scrollTo(0, 0);
    };

    window.addEventListener("colorChange", handleColorChange as EventListener);
    return () =>
      window.removeEventListener(
        "colorChange",
        handleColorChange as EventListener
      );
  }, []);

  // Escuchar cambios en la categoría seleccionada
  useEffect(() => {
    const handleCategoryChange = (event: CustomEvent) => {
      setSelectedCategory(event.detail);
      window.scrollTo(0, 0);
    };

    window.addEventListener(
      "categoryChange",
      handleCategoryChange as EventListener
    );
    return () =>
      window.removeEventListener(
        "categoryChange",
        handleCategoryChange as EventListener
      );
  }, []);

  const filteredProducts = products.filter((product) => {
    // Filtrar por término de búsqueda
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const productNameLower = product.name.toLowerCase();
      const brandNameLower = product.brand?.name.toLowerCase() || "";
      const categoryNameLower = product.category?.name.toLowerCase() || "";

      if (
        !productNameLower.includes(searchLower) &&
        !brandNameLower.includes(searchLower) &&
        !categoryNameLower.includes(searchLower)
      ) {
        return false;
      }
    }

    // Filtrar por categoría
    if (selectedCategory && product.category?.name !== selectedCategory)
      return false;

    // Filtrar por talle
    if (selectedSize) {
      const sizeId = sizes.find((s) => s.number === selectedSize)?.id;
      if (!sizeId) return false;

      const hasSize = productSizes.some(
        (ps) =>
          ps.idProduct === product.id && ps.idSize === sizeId && ps.stock > 0
      );
      if (!hasSize) return false;
    }

    // Filtrar por precio
    if (priceRange.min !== null && product.price < priceRange.min) return false;
    if (priceRange.max !== null && product.price > priceRange.max) return false;

    // Filtrar por color
    if (
      selectedColors.length > 0 &&
      !selectedColors.includes(product.colour?.name || "")
    )
      return false;

    return true;
  });

  const getActiveFilters = () => {
    const filters = [];
    if (selectedCategory) filters.push(`categoría: ${selectedCategory}`);
    if (selectedSize) filters.push(`talle: ${selectedSize}`);
    if (selectedColors.length > 0)
      filters.push(`colores: ${selectedColors.join(", ")}`);
    if (priceRange.min !== null || priceRange.max !== null) {
      const min = priceRange.min !== null ? `$${priceRange.min}` : "mínimo";
      const max = priceRange.max !== null ? `$${priceRange.max}` : "máximo";
      filters.push(`precio: ${min} - ${max}`);
    }
    if (searchTerm) filters.push(`búsqueda: "${searchTerm}"`);
    return filters;
  };

  const clearAllFilters = () => {
    // Limpiar estados locales
    setSearchTerm(null);
    setSelectedCategory(null);
    setSelectedSize(null);
    setSelectedColors([]);
    setPriceRange({ min: null, max: null });

    // Emitir evento para limpiar filtros en otros componentes
    window.dispatchEvent(new CustomEvent("clearFilters"));

    // Navegar al catálogo sin parámetros
    navigate("/catalog", { replace: true });
  };

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
      {filteredProducts.length > 0 ? (
        <>
          <div
            className={s.grid}
            style={{
              gridTemplateColumns: `repeat(${columns}, 1fr)`,
            }}
          >
            {filteredProducts.map((product) => (
              <CardCatalogProduct key={product.id} product={product} />
            ))}
          </div>

          <div className={s.description}>
            <span className={s.titlte}>Classics Vans</span>
            <span>
              Compra Zapatillas Classics Vans. Variedad de colores y talles.
              Recibílo en tu casa o retirá gratis en el local más cercano.
              Descubrí todo lo que tenemos para vos en la única tienda oficial
              de Vans en Argentina.
            </span>
          </div>
        </>
      ) : (
        <div className={s.noProducts}>
          <span className="material-symbols-outlined">search_off</span>
          <h3>No se encontraron productos</h3>
          {getActiveFilters().length > 0 && (
            <>
              <p>con las siguientes características:</p>
              <ul>
                {getActiveFilters().map((filter, index) => (
                  <li key={index}>{filter}</li>
                ))}
              </ul>
            </>
          )}
          <button className={s.clearFiltersButton} onClick={clearAllFilters}>
            <span className="material-symbols-outlined">refresh</span>
            Ver todos los productos
          </button>
        </div>
      )}
    </div>
  );
};
