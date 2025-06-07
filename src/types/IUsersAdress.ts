import type { User } from "./IUser";
import type { Adress } from "./IAdress";

export type UsersAdress = {
  userId: number;
  addressId: number;
  user?: User;
  adress?: Adress;
};
