import type { IBrand } from "../types/IBrand";
import { ApiService } from "./ApiService";

export const brandService = new ApiService<IBrand>(
  "http://localhost:9000/api/v1/brands"
);
