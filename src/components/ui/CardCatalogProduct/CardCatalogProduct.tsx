import { useNavigate } from "react-router-dom";
import s from "./CardCatalogProduct.module.css";
import type { IProduct } from "../../../types/IProduct";
import type { FC } from "react";
type CardCatalogProductProps = {
  product: IProduct;
};
export const CardCatalogProduct: FC<CardCatalogProductProps> = ({
  product,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/productDetail", { state: { product } });
  };

  return (
    <div
      className={s.container}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className={s.containerImg}>
        <img src={product.image} />
      </div>
      <div className={s.containerContent}>
        <h1>{product.brand?.name}</h1>
        <h2>{product.name}</h2>
        <h2>{product.price}</h2>
      </div>
    </div>
  );
};
