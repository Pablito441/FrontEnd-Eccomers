import { create } from "zustand";
import { categoryService } from "../http/CategoryService";
import type { ICategory } from "../types/ICategory";

type CategoryStore = {
  categories: ICategory[];
  loading: boolean;
  error: string | null;
  fetchAllCategories: () => Promise<void>;
};

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  loading: false,
  error: null,

  fetchAllCategories: async () => {
    // Solo hace fetch si no hay categorías cargadas
    if (get().categories.length > 0) return;
    set({ loading: true, error: null });
    try {
      const data = await categoryService.getAll();
      set({ categories: data, loading: false });
    } catch {
      set({ error: "Error fetching categories", loading: false });
    }
  },
}));
