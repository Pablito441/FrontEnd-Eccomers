import { useNavigate } from "react-router-dom";
import s from "./CardCatalogProduct.module.css";
import type { IProduct } from "../../../types/IProduct";
import type { FC } from "react";
type CardCatalogProductProps = {
  element: IProduct;
};
export const CardCatalogProduct: FC<CardCatalogProductProps> = ({
  element,
}) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/productDetail");
  };

  return (
    <div
      className={s.container}
      onClick={handleClick}
      style={{ cursor: "pointer" }}
    >
      <div className={s.containerImg}>
        <img src={element.image} />
      </div>
      <div className={s.containerContent}>
        <h1>{element.brand?.name}</h1>
        <h2>{element.name}</h2>
        <h2>{element.price}</h2>
      </div>
    </div>
  );
};
