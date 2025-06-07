import type { User } from "./IUser";
import type { UsersAdress } from "./IUsersAdress";

export type PurchaseOrder = {
  id: number;
  userId: number;
  userAddressId: number;
  total: number;
  paymentMethod: string;
  status: "PENDING" | "PAID" | "CANCELLED";
  usersAdress?: UsersAdress;
  user?: User;
  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
  isActive: boolean;
};
