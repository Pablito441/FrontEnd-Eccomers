import type { IBrand } from "./IBrand";
import type { ICategory } from "./ICategory";
import type { IColour } from "./IColour";

export type IProduct = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  categoryId: number;
  colourId: number;
  brandId: number;
  status: boolean;
  category?: ICategory;
  colour?: IColour;
  brand?: IBrand;
  createdAt: string; // LocalDateTime suele venir como string ISO
  updatedAt?: string | null;
  deletedAt?: string | null;
  isActive: boolean;
};
