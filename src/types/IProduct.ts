import type { Brand } from "./IBrand";
import type { Category } from "./ICategory";
import type { Colour } from "./IColour";

export type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
  categoryId: number;
  colourId: number;
  brandId: number;
  status: boolean;
  category?: Category;
  colour?: Colour;
  brand?: Brand;
  createdAt: string; // LocalDateTime suele venir como string ISO
  updatedAt?: string | null;
  deletedAt?: string | null;
  isActive: boolean;
};
