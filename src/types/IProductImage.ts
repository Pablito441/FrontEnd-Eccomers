import type { IProduct } from "./IProduct";

export type IProductImage = {
  id: number;
  link: string;
  productId: number;
  isPrincipalProductImage: boolean;
  product?: IProduct;
  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
  isActive: boolean;
};
