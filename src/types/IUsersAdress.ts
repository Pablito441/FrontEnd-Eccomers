import type { IAdress } from "./IAdress";
import type { IUser } from "./IUser";

export type IUsersAdressId = {
  userId: number;
  addressId: number;
};

export type IUsersAdress = IUsersAdressId & {
  user?: IUser;
  adress?: IAdress;
};
