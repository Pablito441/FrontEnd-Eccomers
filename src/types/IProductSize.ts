import type { IProduct } from "./IProduct";
import type { ISize } from "./ISize";

export type IProductSize = {
  idSize: number;
  idProduct: number;
  size?: ISize;
  product?: IProduct;
};
