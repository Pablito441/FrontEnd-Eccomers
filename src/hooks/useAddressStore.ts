import { createStore } from "./useStore";
import { addressService } from "../http/AddressService";
import type { IAdress } from "../types/IAdress";

export const useAddressStore = createStore<IAdress>(addressService);
