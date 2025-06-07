import type { IType } from "../types/IType";
import { ApiService } from "./ApiService";

export const typeService = new ApiService<IType>(
  "http://localhost:9000/api/v1/types"
);
