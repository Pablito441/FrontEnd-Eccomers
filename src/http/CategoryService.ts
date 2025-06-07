import type { ICategory } from "../types/ICategory";
import { ApiService } from "./ApiService";

export const categoryService = new ApiService<ICategory>(
  "http://localhost:9000/api/v1/categories"
);
