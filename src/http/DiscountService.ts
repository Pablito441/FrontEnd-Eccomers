import type { IDiscount } from "../types/IDiscount";
import { ApiService } from "./ApiService";

export const discountService = new ApiService<IDiscount>(
  "http://localhost:9000/api/v1/discounts"
);
