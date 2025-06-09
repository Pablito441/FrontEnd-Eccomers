import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ProductImageCarousel } from "../../ui/ProductImageCarousel/ProductImageCarousel";
import s from "./ProductDetails.module.css";
import type { IProduct } from "../../../types/IProduct";
import { useSizeStore } from "../../../hooks/useSizeStore";
import { useProductStore } from "../../../hooks/useProductStore";

export const ProductDetails = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { product } = location.state as { product: IProduct };

  // ESTADOS GLOBALES

  const { items: sizes, fetchAll: fetchAllSizes } = useSizeStore();
  const { items: allProducts, fetchAll: fetchAllProducts } = useProductStore();

  // Filtrar productos relacionados (excluyendo el producto actual)
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id)
    .sort(() => Math.random() - 0.5)
    .slice(0, 6);

  useEffect(() => {
    fetchAllSizes();
    fetchAllProducts();
  }, [fetchAllSizes, fetchAllProducts]);

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
              {sizes.map((size) => (
                <button className={s.sizeButtonn} key={size.id}>
                  {size.number}
                </button>
              ))}
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
            <span className="material-symbols-outlined">arrow_back_ios</span>
            <div className={s.otherProducts}>
              {relatedProducts.map((relatedProduct) => (
                <img
                  key={relatedProduct.id}
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                />
              ))}
            </div>
            <span className="material-symbols-outlined">arrow_forward_ios</span>
          </div>
        </div>
      </div>
    </div>
  );
};
