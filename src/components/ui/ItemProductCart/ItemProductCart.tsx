import s from "./ItemProductCart.module.css";
import { useProductSizeStore } from "../../../hooks/useProductSizeStore";
import { useSizeStore } from "../../../hooks/useSizeStore";
import { useEffect, useState } from "react";
import { Alert } from "../Alert/Alert";

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
  const { items: productSizes, fetchAll: fetchAllProductSizes } =
    useProductSizeStore();
  const { items: sizes, fetchAll: fetchAllSizes } = useSizeStore();
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    fetchAllProductSizes();
    fetchAllSizes();
  }, [fetchAllProductSizes, fetchAllSizes]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = item.quantity + delta;

    // Si estamos intentando aumentar la cantidad, verificar el stock
    if (delta > 0) {
      const sizeId = sizes.find((s) => s.number === item.size)?.id;
      if (!sizeId) return;

      const productSize = productSizes.find(
        (ps) => ps.idProduct === item.product.id && ps.idSize === sizeId
      );

      if (!productSize || newQuantity > productSize.stock) {
        setShowAlert(true);
        return;
      }
    }

    // Solo actualizar si la nueva cantidad es mayor que 0
    if (newQuantity > 0) {
      onUpdateQuantity(newQuantity);
    }
  };

  return (
    <>
      <Alert
        message="No hay suficiente stock disponible para este talle"
        isVisible={showAlert}
        onClose={() => setShowAlert(false)}
        type="error"
      />
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
    </>
  );
};
