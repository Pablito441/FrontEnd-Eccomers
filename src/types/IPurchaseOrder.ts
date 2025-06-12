import type { IUser } from "./IUser";
import type { IUsersAdress } from "./IUsersAdress";
import type { IProduct } from "./IProduct";
import type { ISize } from "./ISize";

export interface IOrderDetail {
  id: number;
  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
  isActive: boolean;
  quantity: number;
  productId: number;
  orderId: number;
  sizeId: number;
  product: IProduct;
  size: ISize;
}

export type IPurchaseOrder = {
  id: number;
  userId: number;
  userAddressId: number;
  total: number;
  paymentMethod: string;
  paymentId?: string | null;
  status: "PENDING" | "PAID" | "CANCELLED";
  usersAdress?: IUsersAdress;
  user?: IUser;
  details?: IOrderDetail[];
  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
  isActive: boolean;
};
