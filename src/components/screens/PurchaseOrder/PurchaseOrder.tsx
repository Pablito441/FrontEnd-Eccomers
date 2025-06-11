import { ItemPurchaseOrderProducts } from "../../ui/ListPurchaseOrderProducts/ItemPurchaseOrderProducts";
import { PurchaseOrderData } from "../../ui/PurchaseOrderData/PurchaseOrderData";
import { useCartStore } from "../../../hooks/useCartStore";
import s from "./PurchaseOrder.module.css";

export const PurchaseOrder = () => {
  const { items } = useCartStore();

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );
  const shippingCost = 0; // Envío gratis
  const total = subtotal + shippingCost;

  return (
    <div className={s.container}>
      <div className={s.deliveryData}>
        <PurchaseOrderData />
      </div>
      <div className={s.products}>
        <div className={s.headerProducts}>
          <span>TUS ITEMS ( {totalItems} )</span>
        </div>
        {/* Lista de productos */}
        <ItemPurchaseOrderProducts />
        <div className={s.resumePurchaseOrder}>
          <h1>RESUMEN DE SU COMPRA</h1>
          <div className={s.subtotal}>
            <span>Subtotal:</span>
            <span>${subtotal.toLocaleString()}</span>
          </div>
          <div className={s.shopingCost}>
            <span>Costo de envío:</span>
            <span>${shippingCost.toLocaleString()}</span>
          </div>
          <div className={s.total}>
            <span>TOTAL:</span>
            <span>${total.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
