import { categoryService } from "../http/CategoryService";
import { createStore } from "./useStore";
import type { ICategory } from "../types/ICategory";

export const useCategoryStore = createStore<ICategory>(categoryService);
