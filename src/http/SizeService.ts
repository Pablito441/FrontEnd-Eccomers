import type { ISize } from "../types/ISize";
import { ApiService } from "./ApiService";

export const sizeService = new ApiService<ISize>(
  "http://localhost:9000/api/v1/sizes"
);
