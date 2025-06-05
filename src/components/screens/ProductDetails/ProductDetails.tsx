import { ProductImageCarousel } from "../../ui/ProductImageCarousel/ProductImageCarousel";
import s from "./ProductDetails.module.css";

const images = [
  "https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/10/2/10042258_800.jpg",
  "https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/10/2/10042259_800.jpg",
  "https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/10/2/10042260_800.jpg",
  "https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/10/2/10042260_800.jpg",
];

export const ProductDetails = () => {
  return (
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
            la estética "Off The Wall", nuestro icónico Vans Sidestripe ™ se ha
            rediseñado como un molde 3D de diamante hinchado, que se suma a la
            apariencia y sensación general gruesa. La adición de tiradores en el
            talón ofrece un fácil acceso para entrar y salir. Contiene tiradores
            en el talón para facilitar la calzada y suela waffle de goma
            distintiva.
          </span>
        </div>
        <div className={s.contentBuy}>
          <h2>Vans</h2>
          <h1>Zapatillas U knu Skool</h1>
          <h5>Precio un pago</h5>
          <h3> $189.000</h3>
          <h4> Genero: Unisex</h4>
          <div className={s.containerProductColors}>
            {/* Ejemplo de colores */}
            <img src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/10/2/10042258_300.jpg" />
            <img src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/10/2/10042259_300.jpg" />
            <img src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/10/2/10042260_300.jpg" />
          </div>
          <h4>Talle:</h4>
          <div className={s.gridSize}>
            {/* Ejemplo de talles */}
            {[35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47].map(
              (size) => (
                <button key={size}>{size}</button>
              )
            )}
          </div>
          <div className={s.guideSize}>
            <img src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/12/6/10254138.jpg" />
          </div>
          <button>COMPRAR</button>
          <button>Agregar al Carrito</button>
        </div>
      </div>
      <div className={s.interesentContent}>
        <h1>TAMBIÉN TE PUEDE INTERESAR</h1>
        <div className={s.otherProducts}>
          <img src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/10/2/10042260_800.jpg" />
          <img src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/10/2/10042260_800.jpg" />
          <img src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/10/2/10042260_800.jpg" />
          <img src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/10/2/10042260_800.jpg" />
        </div>
      </div>
    </div>
  );
};
