import type { IUsersAdress } from "../types/IUsersAdress";
import { ApiService } from "./ApiService";

export const userAddressService = new ApiService<IUsersAdress>(
  "http://localhost:9000/api/v1/user-addresses"
);
