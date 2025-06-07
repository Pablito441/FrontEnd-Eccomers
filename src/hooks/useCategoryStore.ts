import { create } from "zustand";
import { fetchCategories } from "../http/CategoryService";
import type { Category } from "../types/ICategory";

type CategoryStore = {
  categories: Category[];
  loading: boolean;
  error: string | null;
  fetchAllCategories: () => Promise<void>;
};

export const useCategoryStore = create<CategoryStore>((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchAllCategories: async () => {
    set({ loading: true, error: null });
    try {
      const data = await fetchCategories();
      set({ categories: data, loading: false });
    } catch {
      set({ error: "Error fetching categories", loading: false });
    }
  },
}));
