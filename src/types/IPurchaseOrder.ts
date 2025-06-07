import type { IUser } from "./IUser";
import type { IUsersAdress } from "./IUsersAdress";

export type IPurchaseOrder = {
  id: number;
  userId: number;
  userAddressId: number;
  total: number;
  paymentMethod: string;
  status: "PENDING" | "PAID" | "CANCELLED";
  usersAdress?: IUsersAdress;
  user?: IUser;
  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
  isActive: boolean;
};
