import s from "./ItemProductCart.module.css";

interface ItemProductCartProps {
  item: {
    product: {
      id: number;
      name: string;
      price: number;
      image: string;
      brand?: {
        name: string;
      };
      colour?: {
        name: string;
      };
    };
    quantity: number;
    size: string;
  };
  onRemove: () => void;
  onUpdateQuantity: (quantity: number) => void;
}

export const ItemProductCart = ({
  item,
  onRemove,
  onUpdateQuantity,
}: ItemProductCartProps) => {
  const handleQuantityChange = (delta: number) => {
    const newQuantity = item.quantity + delta;
    if (newQuantity > 0) {
      onUpdateQuantity(newQuantity);
    }
  };

  return (
    <div className={s.contentListDetail}>
      <div className={s.imageContent}>
        <img src={item.product.image} alt={item.product.name} />
      </div>
      <span>{item.product.name}</span>
      <span>{item.size}</span>
      <span>{item.product.colour?.name}</span>
      <span>${item.product.price.toLocaleString()}</span>
      <div className={s.cantArt}>
        <div className={s.cantArtContent}>
          <div className={s.iconContent}>
            <span
              className="material-symbols-outlined"
              onClick={() => handleQuantityChange(1)}
              style={{ cursor: "pointer" }}
            >
              arrow_drop_up
            </span>
            <span
              className="material-symbols-outlined"
              onClick={() => handleQuantityChange(-1)}
              style={{ cursor: "pointer" }}
            >
              arrow_drop_down
            </span>
          </div>
          <span>{item.quantity}</span>
        </div>
      </div>
      <span>{item.product.brand?.name}</span>
      <span>${(item.product.price * item.quantity).toLocaleString()}</span>
      <span
        className={`material-symbols-outlined ${s.trash}`}
        onClick={onRemove}
        style={{ cursor: "pointer" }}
      >
        delete
      </span>
    </div>
  );
};
