import type { IAdress } from "../types/IAdress";
import { ApiService } from "./ApiService";

export const addressService = new ApiService<IAdress>(
  "http://localhost:9000/api/v1/addresses"
);
