import { useNavigate } from "react-router-dom";
import { CardLandingProduct } from "../../ui/CardLandingProduct/CardLandingProduct";
import s from "./Lading.module.css";
export const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className={s.landingContainerMain}>
      <div className={s.landingImgMain}>
        <img
          src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2025/5/20/10859330.png"
          alt=""
        />
      </div>
      <div className={s.landingContainerBody}>
        <div className={s.landingListShoes}>
          <CardLandingProduct />
          <CardLandingProduct />
          <CardLandingProduct />
          <CardLandingProduct />
          <CardLandingProduct />
          <CardLandingProduct />
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
          <h1>COMPRAR POR CATEGORÍA</h1>
          <div className={s.landingCateogiries}>
            <img src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/9/19/10007887.jpg" />
            <img src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/9/19/10007886.jpg" />
            <img src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/9/19/10007885.jpg" />
          </div>
        </div>
      </div>
    </div>
  );
};
