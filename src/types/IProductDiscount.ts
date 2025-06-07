import type { Discount } from "./IDiscount";
import type { Product } from "./IProduct";

export type ProductDiscount = {
  idDiscount: number;
  idProduct: number;
  discount?: Discount;
  product?: Product;
};
