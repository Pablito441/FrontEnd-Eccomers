import { brandService } from "../http/BrandService";
import type { IBrand } from "../types/IBrand";
import { createStore } from "./useStore";

export const useBrandStore = createStore<IBrand>(brandService);
