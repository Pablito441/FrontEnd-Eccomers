import type { Product } from "./IProduct";
import type { Size } from "./ISize";

export type ProductSize = {
  idSize: number;
  idProduct: number;
  size?: Size;
  product?: Product;
};
