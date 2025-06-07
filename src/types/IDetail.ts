import type { Product } from "./IProduct";
import type { PurchaseOrder } from "./IPurchaseOrder";

export type Detail = {
  id: number;
  quantity: number;
  productId: number;
  orderId: number;
  product?: Product;
  purchaseOrder?: PurchaseOrder;
  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
  isActive: boolean;
};
