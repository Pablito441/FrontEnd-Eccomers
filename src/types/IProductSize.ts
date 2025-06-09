import type { IProduct } from "./IProduct";
import type { ISize } from "./ISize";

export type IProductSizeId = {
  idSize: number;
  idProduct: number;
};

export type IProductSize = IProductSizeId & {
  size?: ISize;
  product?: IProduct;
};
