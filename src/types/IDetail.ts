import type { IProduct } from "./IProduct";
import type { IPurchaseOrder } from "./IPurchaseOrder";

export type IDetail = {
  id: number;
  quantity: number;
  productId: number;
  orderId: number;
  product?: IProduct;
  purchaseOrder?: IPurchaseOrder;
  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
  isActive: boolean;
};
