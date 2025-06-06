import { useNavigate } from "react-router-dom";
import s from "./ShoppingCart.module.css";
import { useState } from "react";
export const ShoppingCart = () => {
  const navigate = useNavigate();
  const [cantCart, setCantCart] = useState(1);
  return (
    <div className={s.container}>
      <div className={s.content}>
        <div className={s.title}>
          <h1>CARRITOS DE COMPRAS</h1>
        </div>
        {cantCart === 0 ? (
          <div className={s.contentZero}>
            <h3>El carrito no tiene elementos</h3>
            <h3>Inicia sesión para recuperar tu carrito</h3>
            <button onClick={() => navigate("/landing")}>
              VOLVER AL INICIO
            </button>
            <button onClick={() => navigate("/loginRegister")}>
              INICIAR SESIÓN
            </button>
          </div>
        ) : (
          <>
            <div className={s.contentDetails}>
              <div className={s.containerListDetail}>
                <div className={s.headerList}>
                  <span>Producto</span>
                  <span>Detalle</span>
                  <span>Tamaño</span>
                  <span>Color </span>
                  <span>Precio</span>
                  <span>Cantidad</span>
                  <span>Distribuidor</span>
                  <span>Precio subtotal </span>
                  <span>""</span>
                </div>
                <div className={s.contentListDetail}>
                  <div className={s.imageContent}>
                    <img src="https://mmgrim2.azureedge.net/MediaFiles/Grimoldi/2024/9/27/10026172_800.jpg" />
                  </div>
                  <span>U OLD SKOOL</span>
                  <span>35.0</span>
                  <span>Negro</span>
                  <span>$132.000</span>
                  <div className={s.cantArt}>
                    <div className={s.cantArtContent}>
                      <div className={s.iconContent}>
                        <span className="material-symbols-outlined">
                          arrow_drop_up
                        </span>
                        <span className="material-symbols-outlined">
                          arrow_drop_down
                        </span>
                      </div>
                      <span>{cantCart}</span>
                    </div>
                  </div>
                  <span>Grimoldi</span>
                  <span>$132.000</span>
                  <span className={`material-symbols-outlined ${s.trash}`}>
                    delete
                  </span>
                </div>
              </div>
              <div className={s.containerArticle}>
                <div className={s.totalArticle}>
                  <span>Total de artículos:</span>
                  <span>{cantCart}</span>
                </div>
                <div className={s.total}>
                  <span>Total:</span>
                  <span>$ 189.000</span>
                </div>
                <span className={s.freeShepping}>¡Envío gratis!</span>
                <button>FINALIZAR COMPRA</button>
                <span
                  className={s.ultSpan}
                  onClick={() => navigate("/catalog")}
                >
                  {" "}
                  Continuar Comprando
                </span>
                <span className={s.ultSpan} onClick={() => setCantCart(0)}>
                  Vaciar Carro
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
