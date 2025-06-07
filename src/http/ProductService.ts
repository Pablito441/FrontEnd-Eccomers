import type { IProduct } from "../types/IProduct";
import { ApiService } from "./ApiService";

export const productService = new ApiService<IProduct>(
  "http://localhost:9000/api/v1/products"
);
