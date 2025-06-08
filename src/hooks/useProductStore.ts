import { productService } from "../http/ProductService";
import { createStore } from "./useStore";
import type { IProduct } from "../types/IProduct";

export const useProductStore = createStore<IProduct>(productService);
