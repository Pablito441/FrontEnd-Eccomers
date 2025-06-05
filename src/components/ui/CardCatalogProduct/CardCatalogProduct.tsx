import { useNavigate } from "react-router-dom";
import s from "./CardCatalogProduct.module.css";

export const CardCatalogProduct = () => {
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
        <img src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/10/2/10042260_800.jpg" />
      </div>
      <div className={s.containerContent}>
        <h1>Vans</h1>
        <h2>Zapatillas U Knu Skool</h2>
        <h2>$ 189.000</h2>
      </div>
    </div>
  );
};
