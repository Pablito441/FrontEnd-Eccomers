import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ProductImageCarousel } from "../../ui/ProductImageCarousel/ProductImageCarousel";
import s from "./ProductDetails.module.css";
import type { IProduct } from "../../../types/IProduct";
import { useSizeStore } from "../../../hooks/useSizeStore";
import { useProductStore } from "../../../hooks/useProductStore";
import { useProductSizeStore } from "../../../hooks/useProductSizeStore";

export const ProductDetails = () => {
  const [open, setOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { product } = location.state as { product: IProduct };

  // ESTADOS GLOBALES
  const { items: sizes, fetchAll: fetchAllSizes } = useSizeStore();
  const { items: allProducts, fetchAll: fetchAllProducts } = useProductStore();
  const { items: productSizes, fetchAll: fetchAllProductSizes } =
    useProductSizeStore();

  useEffect(() => {
    fetchAllSizes();
    fetchAllProducts();
    fetchAllProductSizes();
  }, [fetchAllSizes, fetchAllProducts, fetchAllProductSizes]);

  // Filtro para poder organizar los talles disponibles en este producto
  const availableSizeIds = productSizes
    .filter((ps) => ps.idProduct === product.id)
    .map((ps) => ps.idSize);

  // Ordenar productos relacionados solo una vez cuando se cargan los productos
  useEffect(() => {
    if (allProducts.length > 0) {
      const filteredProducts = allProducts
        .filter((p) => p.id !== product.id)
        .sort(() => Math.random() - 0.5);
      setRelatedProducts(filteredProducts);
    }
  }, [allProducts, product.id]);

  // función para manejar el scroll del carrusel mediante las flechas
  const handleScroll = (direction: "left" | "right") => {
    const container = document.querySelector(`.${s.otherProducts}`);
    if (container) {
      const scrollAmount = 216;
      const newPosition =
        direction === "left"
          ? scrollPosition - scrollAmount
          : scrollPosition + scrollAmount;

      container.scrollTo({
        left: newPosition,
        behavior: "smooth",
      });
      setScrollPosition(newPosition);
    }
  };

  const handleProductClick = (relatedProduct: IProduct) => {
    navigate("/productDetail", { state: { product: relatedProduct } });
  };

  return (
    <div className={s.containerMain}>
      <div className={s.container}>
        <div className={s.mainContent}>
          <div className={s.contentDescription}>
            <ProductImageCarousel product={product} />
            <h2>Description</h2>
            <span>{product.description}</span>
          </div>
          <div className={s.contentBuy}>
            <h1>{product.brand?.name}</h1>
            <h1>Zapatillas {product.name}</h1>
            <h5>Precio un pago</h5>
            <h2>$ {product.price}</h2>
            <h4 className={s.gender}> Genero: Unisex</h4>
            <h4 className={s.gender}> Colour: {product.colour?.name}</h4>
            <h4 className={s.size}>Talle:</h4>
            <div className={s.gridSizee}>
              {sizes.map((size) => {
                const isAvailable = availableSizeIds.includes(size.id);
                return (
                  <button
                    className={`${s.sizeButtonn} ${
                      !isAvailable ? s.sizeUnavailable : ""
                    }`}
                    key={size.id}
                    disabled={!isAvailable}
                    style={{
                      background: !isAvailable ? "#eee" : undefined,
                      color: !isAvailable ? "#aaa" : undefined,
                      textDecoration: !isAvailable ? "line-through" : undefined,
                      cursor: !isAvailable ? "not-allowed" : "pointer",
                    }}
                  >
                    {size.number}
                  </button>
                );
              })}
            </div>
            <div className={s.dropdown}>
              <div
                className={s.dropdownHeader}
                onClick={() => setOpen((prev) => !prev)}
              >
                <span className={s.dropdowntitle}>Guía de talles</span>
                <span
                  className={`material-symbols-outlined ${s.iconDropdown} ${
                    open ? s.open : ""
                  }`}
                >
                  {open ? "arrow_drop_up" : "arrow_drop_down"}
                </span>
              </div>
              {open && (
                <img
                  className={s.imgGuideSize}
                  src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/12/6/10254138.jpg"
                />
              )}
            </div>
            <button className={s.buttonBuy}>COMPRAR</button>
            <button className={s.buttonCarShop}>Agregar al Carrito</button>
          </div>
        </div>
        <div className={s.interesentContent}>
          <h1>TAMBIÉN TE PUEDE INTERESAR</h1>
          <div className={s.imgCarrousel}>
            <span
              className="material-symbols-outlined"
              onClick={() => handleScroll("left")}
              style={{ cursor: "pointer" }}
            >
              arrow_back_ios
            </span>
            <div className={s.otherProducts}>
              {relatedProducts.map((relatedProduct) => (
                <img
                  key={relatedProduct.id}
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                  onClick={() => handleProductClick(relatedProduct)}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </div>
            <span
              className="material-symbols-outlined"
              onClick={() => handleScroll("right")}
              style={{ cursor: "pointer" }}
            >
              arrow_forward_ios
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
