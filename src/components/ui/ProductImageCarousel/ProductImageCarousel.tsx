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
        <button
          className={`${s.arrow} ${s.left}`}
          onClick={prev}
          aria-label="Anterior"
        >
          &#8592;
        </button>
        <img src={images[current]} alt={`Producto ${current + 1}`} />
        <button
          className={`${s.arrow} ${s.right}`}
          onClick={next}
          aria-label="Siguiente"
        >
          &#8594;
        </button>
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
