import type { IDiscount } from "./IDiscount";
import type { IProduct } from "./IProduct";

export type IProductDiscount = {
  idDiscount: number;
  idProduct: number;
  discount?: IDiscount;
  product?: IProduct;
};
