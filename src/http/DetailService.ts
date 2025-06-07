import type { IDetail } from "../types/IDetail";
import { ApiService } from "./ApiService";

export const detailService = new ApiService<IDetail>(
  "http://localhost:9000/api/v1/details"
);
