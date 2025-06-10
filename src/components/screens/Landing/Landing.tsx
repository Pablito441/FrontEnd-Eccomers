import { useNavigate } from "react-router-dom";
import { CardLandingProduct } from "../../ui/CardLandingProduct/CardLandingProduct";
import s from "./Lading.module.css";
import { useState, useEffect, useCallback } from "react";
import { useProductStore } from "../../../hooks/useProductStore";

export const Landing = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [currentProduct, setCurrentProduct] = useState(0);
  const { items: products, fetchAll: fetchAllProducts } = useProductStore();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const images = [
    "https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2025/5/20/10859330.png",
    "https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2025/6/2/10895911.png",
    "https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2025/6/9/10920110.png",
    "https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2025/5/28/10880983.png",
  ];

  const prev = () => {
    setCurrent((current) => (current === 0 ? images.length - 1 : current - 1));
  };

  const next = useCallback(() => {
    setCurrent((current) => (current === images.length - 1 ? 0 : current + 1));
  }, [images.length]);

  const prevProduct = () => {
    setCurrentProduct((current) =>
      current === 0 ? products.length - 3 : current - 1
    );
  };

  const nextProduct = () => {
    setCurrentProduct((current) =>
      current + 3 >= products.length ? 0 : current + 1
    );
  };

  // Auto-play del carrusel
  useEffect(() => {
    const timer = setInterval(next, 5000); // Cambia cada 5 segundos
    return () => clearInterval(timer);
  }, [next]);

  const visibleProducts = products.slice(currentProduct, currentProduct + 3);

  return (
    <div className={s.landingContainerMain}>
      <div className={s.landingImgMain}>
        <span
          className={`material-symbols-outlined ${s.arrow} ${s.left}`}
          onClick={prev}
          aria-label="Anterior"
          role="button"
        >
          arrow_back_ios
        </span>
        <div className={s.carouselContainer}>
          {images.map((src, index) => (
            <img
              key={src}
              src={src}
              alt={`Slide ${index + 1}`}
              className={`${s.carouselImage} ${
                index === current ? s.active : ""
              }`}
            />
          ))}
        </div>
        <span
          className={`material-symbols-outlined ${s.arrow} ${s.right}`}
          onClick={next}
          aria-label="Siguiente"
          role="button"
        >
          arrow_forward_ios
        </span>
      </div>
      <div className={s.landingContainerBody}>
        <div className={s.landingListShoes}>
          <span
            className={`material-symbols-outlined ${s.arrow} ${s.left}`}
            onClick={prevProduct}
            aria-label="Anterior"
            role="button"
          >
            arrow_back_ios
          </span>
          <div className={s.productsCarousel}>
            {visibleProducts.map((product) => (
              <CardLandingProduct key={product.id} product={product} />
            ))}
          </div>
          <span
            className={`material-symbols-outlined ${s.arrow} ${s.right}`}
            onClick={nextProduct}
            aria-label="Siguiente"
            role="button"
          >
            arrow_forward_ios
          </span>
        </div>
        <div className={s.landingContainerImgStyle}>
          <img
            src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2023/3/8/8157787.jpg"
            className={s.landingImgStyle}
          />
          <div className={s.landingContainerButton}>
            <button
              className={s.ladingButton}
              onClick={() => navigate("/catalog")}
            >
              VER TODOS
            </button>
          </div>
        </div>

        <div className={s.landingBuyByCategories}>
          <div className={s.landingCateogiries}>
            <img src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2025/5/7/10764449.png" />
            <img src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2025/5/7/10764448.png" />
            <img src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2025/5/7/10764450.png" />
          </div>
        </div>
      </div>
    </div>
  );
};
