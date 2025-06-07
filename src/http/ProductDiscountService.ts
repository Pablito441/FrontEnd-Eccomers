import type { IProductDiscount } from "../types/IProductDiscount";
import { ApiService } from "./ApiService";

export const productDiscountService = new ApiService<IProductDiscount>(
  "http://localhost:9000/api/v1/product-discounts"
);
