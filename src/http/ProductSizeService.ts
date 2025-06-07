import type { IProductSize } from "../types/IProductSize";
import { ApiService } from "./ApiService";

export const productSizeService = new ApiService<IProductSize>(
  "http://localhost:9000/api/v1/product-sizes"
);
