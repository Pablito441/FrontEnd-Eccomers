import { useNavigate } from "react-router-dom";
import s from "./ShoppingCart.module.css";
import { useCartStore } from "../../../hooks/useCartStore";
import { ItemProductCart } from "../../ui/ItemProductCart/ItemProductCart";
import { useUserStore } from "../../../hooks/useUserStore";

export const ShoppingCart = () => {
  const navigate = useNavigate();
  const { items, removeItem, updateQuantity, clearCart } = useCartStore();
  const { isAuthenticated } = useUserStore();

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate("/purchaseOrder");
    } else {
      navigate("/continueShopping");
    }
  };

  return (
    <div className={s.container}>
      <div className={s.content}>
        <div className={s.title}>
          <h1>CARRITOS DE COMPRAS</h1>
        </div>
        {items.length === 0 ? (
          <div className={s.contentZero}>
            <div className={s.emptyCartIcon}>
              <span className="material-symbols-outlined">shopping_cart</span>
            </div>
            <h2>El carrito no tiene elementos</h2>
            {!isAuthenticated ? (
              <>
                <p>Inicia sesión para recuperar tu carrito</p>
                <div className={s.buttonGroup}>
                  <button 
                    className={s.primaryButton}
                    onClick={() => navigate("/login")}
                  >
                    INICIAR SESIÓN
                  </button>
                  <button 
                    className={s.secondaryButton}
                    onClick={() => navigate("/register")}
                  >
                    REGISTRARSE
                  </button>
                </div>
              </>
            ) : (
              <>
                <p>¡Comienza a agregar productos a tu carrito!</p>
                <div className={s.buttonGroup}>
                  <button 
                    className={s.primaryButton}
                    onClick={() => navigate("/catalog")}
                  >
                    VER PRODUCTOS
                  </button>
                </div>
              </>
            )}
            <button 
              className={s.backButton}
              onClick={() => navigate("/landing")}
            >
              VOLVER AL INICIO
            </button>
          </div>
        ) : (
          <>
            <div className={s.contentDetails}>
              <div className={s.containerListDetail}>
                <div className={s.headerList}>
                  <span>Producto</span>
                  <span>Nombre</span>
                  <span>Talle</span>
                  <span>Color </span>
                  <span>Precio</span>
                  <span>Cantidad</span>
                  <span>Marca</span>
                  <span>Subtotal</span>
                  <span>""</span>
                </div>
                {items.map((item) => (
                  <ItemProductCart
                    key={`${item.product.id}-${item.size}`}
                    item={item}
                    onRemove={() => removeItem(item.product.id, item.size)}
                    onUpdateQuantity={(quantity) =>
                      updateQuantity(item.product.id, item.size, quantity)
                    }
                  />
                ))}
              </div>
              <div className={s.containerArticle}>
                <div className={s.totalArticle}>
                  <span>Total de artículos:</span>
                  <span>{totalItems}</span>
                </div>
                <div className={s.total}>
                  <span>Total:</span>
                  <span>$ {totalPrice.toLocaleString()}</span>
                </div>
                <span className={s.freeShepping}>¡Envío gratis!</span>
                <button onClick={handleCheckout}>FINALIZAR COMPRA</button>
                <span
                  className={s.ultSpan}
                  onClick={() => navigate("/catalog")}
                >
                  Continuar Comprando
                </span>
                <span className={s.ultSpan} onClick={clearCart}>
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
