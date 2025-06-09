import { productImageService } from "../http/ProductImageService";
import type { IProductImage } from "../types/IProductImage";
import { createStore } from "./useStore";

export const useProductImageStore =
  createStore<IProductImage>(productImageService);
