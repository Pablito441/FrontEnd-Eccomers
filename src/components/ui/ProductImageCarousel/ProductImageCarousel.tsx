import { useState } from "react";
import s from "./ProductImageCarousel.module.css";

interface Props {
  images: string[];
}

export const ProductImageCarousel = ({ images }: Props) => {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? images.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === images.length - 1 ? 0 : c + 1));

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
          src={images[current]}
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
        {images.map((img, idx) => (
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
