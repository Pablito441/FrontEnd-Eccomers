import s from "./CardLandingProduct.module.css";
export const CardLandingProduct = () => {
  return (
    <div className={s.container}>
      <div className={s.imageContainer}>
        <img
          src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/5/22/9672536.jpg"
          className={s.image}
        />
      </div>
      <h2 className={s.nameProduct}>NAME OF PRODUCTO</h2>
      <button className={s.button}>COMPRAR</button>
    </div>
  );
};
