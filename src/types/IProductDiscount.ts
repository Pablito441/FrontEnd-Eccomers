import type { IDiscount } from "./IDiscount";
import type { IProduct } from "./IProduct";

export type IProductDiscountId = {
  idDiscount: number;
  idProduct: number;
};

export type IProductDiscount = IProductDiscountId & {
  discount?: IDiscount;
  product?: IProduct;
};
