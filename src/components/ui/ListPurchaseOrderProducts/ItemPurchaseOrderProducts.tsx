import { useCartStore } from "../../../hooks/useCartStore";
import s from "./ItemPurchaseOrderProducts.module.css";

export const ItemPurchaseOrderProducts = () => {
  const { items, removeItem } = useCartStore();

  const getImageUrl = (imagePath: string) => {
    // Si la imagen ya es una URL completa, la devolvemos tal cual
    if (imagePath.startsWith("http")) {
      return imagePath;
    }
    // Si es una ruta relativa, la convertimos a URL completa
    return `${import.meta.env.VITE_API_URL}${imagePath}`;
  };

  return (
    <div className={s.container}>
      {items.map((item) => {
        const imageUrl = getImageUrl(item.product.image);
        return (
          <div key={`${item.product.id}-${item.size}`} className={s.item}>
            <div className={s.imageContainer}>
              <img src={imageUrl} alt={item.product.name} className={s.image} />
            </div>
            <div className={s.details}>
              <div className={s.productInfo}>
                <h3 className={s.brand}>{item.product.brand?.name}</h3>
                <h4 className={s.name}>{item.product.name}</h4>
                <div className={s.specs}>
                  <span className={s.spec}>Talle: {item.size}</span>
                  <span className={s.spec}>
                    Color: {item.product.colour?.name}
                  </span>
                </div>
              </div>
              <div className={s.priceInfo}>
                <span className={s.price}>${item.product.price}</span>
                <div className={s.quantity}>
                  <span>Cantidad: {item.quantity}</span>
                </div>
              </div>
              <button
                className={s.deleteButton}
                onClick={() => removeItem(item.product.id, item.size)}
                title="Eliminar producto"
              >
                <span className="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};
