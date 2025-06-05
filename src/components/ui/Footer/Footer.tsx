import s from "./Footer.module.css";

export const Footer = () => {
  return (
    <div className={s.footerContainerMain}>
      <div className={s.footerContainerSocialMedia}>
        <div className={s.footerShop}>
          <h1>SHOP</h1>
          <h3>Classic</h3>
          <h3>Skaterboarding</h3>
          <h3>Surf</h3>
          <h3>UltraRange</h3>
        </div>
        <div className={s.footerSocialMedia}>
          <h1>SEGUINOS EN REDES</h1>
          <div className={s.footerLogos}>
            <img
              src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/2/28/9419951.svg"
              alt=""
            />
            <img
              src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/2/28/9419945.svg"
              alt=""
            />
          </div>
        </div>
        <div className={s.footerCompany}>
          <h1>COMPANY</h1>
          <h3>Terminos y condiciones</h3>
          <h3>Defensa al consumidor</h3>
          <h3>Politicas de privacidad</h3>
        </div>
      </div>
    </div>
  );
};
