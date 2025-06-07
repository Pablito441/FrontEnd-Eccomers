import type { Product } from "./IProduct";

export type ProductImage = {
  id: number;
  link: string;
  productId: number;
  isPrincipalProductImage: boolean;
  product?: Product;
  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
  isActive: boolean;
};
