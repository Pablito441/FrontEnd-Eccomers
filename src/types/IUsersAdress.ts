import type { IAdress } from "./IAdress";
import type { IUser } from "./IUser";

export type IUsersAdress = {
  userId: number;
  addressId: number;
  user?: IUser;
  adress?: IAdress;
};
