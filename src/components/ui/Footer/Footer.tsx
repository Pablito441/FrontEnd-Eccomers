import { useNavigate } from "react-router-dom";
import s from "./Footer.module.css";

export const Footer = () => {
  const navigate = useNavigate();
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
            <a
              href="https://www.linkedin.com/in/pablo-c%C3%A1ceres-06638a32a/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Pablo Cáceres"
            >
              <img
                src="https://cdn3.iconfinder.com/data/icons/2018-social-media-black-and-white-logos/1000/2018_social_media_popular_app_logo_linkedin-512.png"
                alt="LinkedIn"
              />
            </a>
            <a
              href="https://www.linkedin.com/in/pablo-c%C3%A1ceres-06638a32a/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Pablo Cáceres"
            >
              <img
                src="https://cdn3.iconfinder.com/data/icons/2018-social-media-black-and-white-logos/1000/2018_social_media_popular_app_logo_linkedin-512.png"
                alt="LinkedIn"
              />
            </a>
          </div>
        </div>
        <div className={s.footerCompany}>
          <h1>COMPANY</h1>
          <h3
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/termsandconditions")}
          >
            Terminos y condiciones
          </h3>
          <h3
            style={{ cursor: "pointer" }}
            onClick={() =>
              window.open(
                "https://buenosaires.gob.ar/gobierno/atencion-ciudadana/defensa-al-consumidor",
                "_blank",
                "noopener,noreferrer"
              )
            }
          >
            Defensa al consumidor
          </h3>
          <h3
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/privacypolicies")}
          >
            Politicas de privacidad
          </h3>
        </div>
      </div>
    </div>
  );
};
