import s from "./CardLandingProduct.module.css";
import { useNavigate } from "react-router-dom";
import type { IProduct } from "../../../types/IProduct";
import { useProductImageStore } from "../../../hooks/useProductImage";
import { useEffect, useMemo } from "react";

interface Props {
  product: IProduct;
}

export const CardLandingProduct = ({ product }: Props) => {
  const navigate = useNavigate();

  const { items: productImages, fetchAll: fetchAllProductImages } =
    useProductImageStore();

  useEffect(() => {
    fetchAllProductImages();
  }, [fetchAllProductImages]);

  const productImage = useMemo(() => {
    const images = productImages.filter((img) => img.productId === product.id);
    return images.length > 1 ? images[1].link : product.image;
  }, [productImages, product.id, product.image]);

  const handleClick = () => {
    navigate("/productDetail", { state: { product } });
  };

  return (
    <div className={s.container}>
      <div className={s.imageContainer}>
        <img src={productImage} className={s.image} alt={product.name} />
      </div>
      <h2 className={s.nameProduct}>{product.name}</h2>
      <button className={s.button} onClick={handleClick}>
        COMPRAR
      </button>
    </div>
  );
};
