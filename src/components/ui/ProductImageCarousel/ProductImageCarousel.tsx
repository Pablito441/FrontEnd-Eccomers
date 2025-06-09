import { useEffect, useState } from "react";
import s from "./ProductImageCarousel.module.css";
import type { IProduct } from "../../../types/IProduct";
import { useProductImageStore } from "../../../hooks/useProductImage";

interface Props {
  product: IProduct;
}

export const ProductImageCarousel = ({ product }: Props) => {
  const [current, setCurrent] = useState(0);

  const { items: productImages, fetchAll: fetchAllProductImage } =
    useProductImageStore();

  // Filtrar las imágenes que corresponden al producto actual
  const productImagesFiltered = productImages
    .filter((img) => img.productId === product.id)
    .map((img) => img.link);

  useEffect(() => {
    fetchAllProductImage();
  }, [fetchAllProductImage]);

  const prev = () =>
    setCurrent((c) => (c === 0 ? productImagesFiltered.length - 1 : c - 1));
  const next = () =>
    setCurrent((c) => (c === productImagesFiltered.length - 1 ? 0 : c + 1));

  return (
    <div className={s.carouselWrapper}>
      <div className={s.carouselMain}>
        <span
          className={`material-symbols-outlined ${s.arrow} ${s.left}`}
          onClick={prev}
          aria-label="Anterior"
          tabIndex={0}
          role="button"
        >
          arrow_back_ios
        </span>
        <img
          className={s.image}
          src={productImagesFiltered[current]}
          alt={`Producto ${current + 1}`}
        />
        <span
          className={`material-symbols-outlined ${s.arrow} ${s.right}`}
          onClick={next}
          aria-label="Siguiente"
          tabIndex={0}
          role="button"
        >
          arrow_forward_ios
        </span>
      </div>
      <div className={s.carouselThumbs}>
        {productImagesFiltered.map((img, idx) => (
          <img
            key={img}
            src={img}
            alt={`Miniatura ${idx + 1}`}
            className={current === idx ? s.selected : ""}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>
    </div>
  );
};
