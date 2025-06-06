import { useState } from "react";
import { ProductImageCarousel } from "../../ui/ProductImageCarousel/ProductImageCarousel";
import s from "./ProductDetails.module.css";

const images = [
  "https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/10/2/10042258_800.jpg",
  "https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/10/2/10042259_800.jpg",
  "https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/10/2/10042260_800.jpg",
  "https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/10/2/10042260_800.jpg",
];
const shoeSizes = [
  "35.0",
  "36.0",
  "36.5",
  "37.0",
  "38.0",
  "38.5",
  "39.0",
  "40.0",
  "40.5",
  "41.0",
  "42.0",
  "42.5",
  "43.0",
  "44.0",
  "44.5",
  "46.0",
  "47.0",
];
export const ProductDetails = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className={s.containerMain}>
      <div className={s.container}>
        <div className={s.mainContent}>
          <div className={s.contentDescription}>
            <ProductImageCarousel images={images} />
            <h2>Description</h2>
            <span>
              La Knu Skool es un modelo reeditado de los años 90, cuando las
              zapatillas de skate eran extra hinchadas. Confeccionadas con parte
              superior de ante y lienzo, este modelo de perfil bajo presenta una
              gran lengüeta hinchada y un cuello en el tobillo, lo que le da un
              aspecto exagerado que juega con la Old Skool original. Manteniendo
              la estética "Off The Wall", nuestro icónico Vans Sidestripe ™ se
              ha rediseñado como un molde 3D de diamante hinchado, que se suma a
              la apariencia y sensación general gruesa. La adición de tiradores
              en el talón ofrece un fácil acceso para entrar y salir. Contiene
              tiradores en el talón para facilitar la calzada y suela waffle de
              goma distintiva.
            </span>
          </div>
          <div className={s.contentBuy}>
            <h1>Vans</h1>
            <h1>Zapatillas U knu Skool</h1>
            <h5>Precio un pago</h5>
            <h2> $189.000</h2>
            <h4 className={s.gender}> Genero: Unisex</h4>
            <div className={s.containerProductColors}>
              <img
                className={s.imgColorProuct}
                src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/10/2/10042258_300.jpg"
              />
              <img
                className={s.imgColorProuct}
                src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/10/2/10042259_300.jpg"
              />
              <img
                className={s.imgColorProuct}
                src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/10/2/10042260_300.jpg"
              />
            </div>
            <h4 className={s.size}>Talle:</h4>
            <div className={s.gridSizee}>
              {shoeSizes.map((size) => (
                <button className={s.sizeButtonn} key={size}>
                  {size}
                </button>
              ))}
            </div>
            <div className={s.dropdown}>
              <div
                className={s.dropdownHeader}
                onClick={() => setOpen((prev) => !prev)}
              >
                <span className={s.dropdowntitle}>Guía de talles</span>
                <span
                  className={`material-symbols-outlined ${s.iconDropdown} ${
                    open ? s.open : ""
                  }`}
                >
                  {open ? "arrow_drop_up" : "arrow_drop_down"}
                </span>
              </div>
              {open && (
                <img
                  className={s.imgGuideSize}
                  src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/12/6/10254138.jpg"
                />
              )}
            </div>
            <button className={s.buttonBuy}>COMPRAR</button>
            <button className={s.buttonCarShop}>Agregar al Carrito</button>
          </div>
        </div>
        <div className={s.interesentContent}>
          <h1>TAMBIÉN TE PUEDE INTERESAR</h1>
          <div className={s.imgCarrousel}>
            <span className="material-symbols-outlined">arrow_back_ios</span>
            <div className={s.otherProducts}>
              <img src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/10/2/10042260_800.jpg" />
              <img src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/10/2/10042260_800.jpg" />
              <img src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/10/2/10042260_800.jpg" />
              <img src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/10/2/10042260_800.jpg" />
              <img src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/10/2/10042260_800.jpg" />
              <img src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/10/2/10042260_800.jpg" />
            </div>
            <span className="material-symbols-outlined">arrow_forward_ios</span>
          </div>
        </div>
      </div>
    </div>
  );
};
