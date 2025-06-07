import type { IUser } from "../types/IUser";
import { ApiService } from "./ApiService";

export const userService = new ApiService<IUser>(
  "http://localhost:9000/api/v1/users"
);
