import type { IProduct } from "./IProduct";
import type { IPurchaseOrder } from "./IPurchaseOrder";
import type { ISize } from "./ISize";

export type IDetail = {
  id: number;
  quantity: number;
  productId: number;
  orderId: number;
  sizeId: number;
  size?: ISize;
  product?: IProduct;
  purchaseOrder?: IPurchaseOrder;
  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
  isActive: boolean;
};
