import { useNavigate } from "react-router-dom";
import { CardLandingProduct } from "../../ui/CardLandingProduct/CardLandingProduct";
import s from "./Lading.module.css";
import { useState, useEffect, useCallback } from "react";
import { useProductStore } from "../../../hooks/useProductStore";
import { useCarouselImageStore } from "../../../hooks/useCarouselImageStore";
import { useCategoryImageStoreBackend } from "../../../hooks/useCategoryImageStoreBackend";

export const Landing = () => {
  const navigate = useNavigate();
  const [current, setCurrent] = useState(0);
  const [currentProduct, setCurrentProduct] = useState(0);
  const { items: products, fetchAll: fetchAllProducts } = useProductStore();
  const { 
    images: carouselImages, 
    fetchOrderedImages,
    loading: carouselLoading,
    error: carouselError 
  } = useCarouselImageStore();
  const { 
    images: categoryImages, 
    fetchOrderedImages: fetchOrderedCategoryImages,
    loading: categoryLoading,
    error: categoryError 
  } = useCategoryImageStoreBackend();

  useEffect(() => {
    fetchAllProducts();
    fetchOrderedImages();
    fetchOrderedCategoryImages();
  }, [fetchAllProducts, fetchOrderedImages, fetchOrderedCategoryImages]);

  const handleCarouselClick = (image: (typeof carouselImages)[0]) => {
    if (image.isCatalogLink) {
      navigate("/catalog");
    } else if (image.productId) {
      navigate(`/catalog?search=${encodeURIComponent(image.productName)}`);
    }
    window.scrollTo(0, 0);
  };

  const prev = () => {
    setCurrent((current) =>
      current === 0 ? carouselImages.length - 1 : current - 1
    );
  };

  const next = useCallback(() => {
    setCurrent((current) =>
      current === carouselImages.length - 1 ? 0 : current + 1
    );
  }, [carouselImages.length]);

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
    if (carouselImages.length > 0) {
      const timer = setInterval(next, 5000); // Cambia cada 5 segundos
      return () => clearInterval(timer);
    }
  }, [next, carouselImages.length]);

  const visibleProducts = products.slice(currentProduct, currentProduct + 3);

  // Mostrar loading si está cargando
  if (carouselLoading || categoryLoading) {
    return (
      <div className={s.landingContainerMain}>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          Cargando...
        </div>
      </div>
    );
  }

  // Mostrar errores si los hay
  if (carouselError || categoryError) {
    return (
      <div className={s.landingContainerMain}>
        <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
          Error al cargar el contenido: {carouselError || categoryError}
        </div>
      </div>
    );
  }

  return (
    <div className={s.landingContainerMain}>
      <div className={s.landingImgMain}>
        {carouselImages.length > 1 && (
          <span
            className={`material-symbols-outlined ${s.arrow} ${s.left}`}
            onClick={prev}
            aria-label="Anterior"
            role="button"
          >
            arrow_back_ios
          </span>
        )}
        <div className={s.carouselContainer}>
          {carouselImages.map((item, index) => (
            <div
              key={item.id}
              className={`${s.carouselImage} ${
                index === current ? s.active : ""
              }`}
              onClick={() => {
                if (index === current) {
                  handleCarouselClick(item);
                }
              }}
            >
              <img src={item.imageUrl} alt={item.productName} />
            </div>
          ))}
        </div>
        {carouselImages.length > 1 && (
          <span
            className={`material-symbols-outlined ${s.arrow} ${s.right}`}
            onClick={next}
            aria-label="Siguiente"
            role="button"
          >
            arrow_forward_ios
          </span>
        )}
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
            onClick={() => navigate("/catalog")}
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
            {categoryImages.map((image) => (
              <img
                key={image.id}
                src={image.imageUrl}
                alt={image.productName}
                onClick={() => {
                  navigate(
                    `/catalog?search=${encodeURIComponent(image.productName)}`
                  );
                  window.scrollTo(0, 0);
                }}
                style={{ cursor: "pointer" }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
