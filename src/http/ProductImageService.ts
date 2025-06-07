import type { IProductImage } from "../types/IProductImage";
import { ApiService } from "./ApiService";

export const productImageService = new ApiService<IProductImage>(
  "http://localhost:9000/api/v1/product-images"
);
