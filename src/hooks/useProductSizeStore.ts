import { create } from "zustand";
import { productSizeService } from "../http/ProductSizeService";
import type { IProductSize, IProductSizeId } from "../types/IProductSize";

interface ProductSizeStore {
  items: IProductSize[];
  item: IProductSize | null;
  loading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  fetchById: (id: IProductSizeId) => Promise<void>;
  create: (data: Partial<IProductSize>) => Promise<void>;
  update: (id: IProductSizeId, data: Partial<IProductSize>) => Promise<void>;
  delete: (id: IProductSizeId) => Promise<void>;
}

export const useProductSizeStore = create<ProductSizeStore>((set, get) => ({
  items: [],
  item: null,
  loading: false,
  error: null,

  fetchAll: async () => {
    if (get().items.length > 0) return;
    set({ loading: true, error: null });
    try {
      const data = await productSizeService.getAll();
      set({ items: data, loading: false });
    } catch (error) {
      set({ error: `Error: ${error}`, loading: false });
    }
  },

  fetchById: async ({ idSize, idProduct }) => {
    const found = get().items.find(
      (item) => item.idSize === idSize && item.idProduct === idProduct
    );
    if (found) {
      set({ item: found });
      return;
    }
    set({ loading: true, error: null });
    try {
      const item = await productSizeService.getById({ idSize, idProduct });
      set({ item, loading: false });
    } catch (error) {
      set({ error: `Error: ${error}`, loading: false });
    }
  },

  create: async (data) => {
    set({ loading: true, error: null });
    try {
      const newItem = await productSizeService.create(data);
      if (newItem) {
        set((state) => ({ items: [...state.items, newItem], loading: false }));
      }
    } catch (error) {
      set({ error: `Error: ${error}`, loading: false });
    }
  },

  update: async ({ idSize, idProduct }, data) => {
    set({ loading: true, error: null });
    try {
      const updatedItem = await productSizeService.update(
        { idSize, idProduct },
        data
      );
      if (updatedItem) {
        set((state) => ({
          items: state.items.map((item) =>
            item.idSize === idSize && item.idProduct === idProduct
              ? updatedItem
              : item
          ),
          loading: false,
        }));
      }
    } catch (error) {
      set({ error: `Error: ${error}`, loading: false });
    }
  },

  delete: async ({ idSize, idProduct }) => {
    set({ loading: true, error: null });
    try {
      const success = await productSizeService.delete({ idSize, idProduct });
      if (success) {
        set((state) => ({
          items: state.items.filter(
            (item) => item.idSize !== idSize || item.idProduct !== idProduct
          ),
          loading: false,
        }));
      }
    } catch (error) {
      set({ error: `Error: ${error}`, loading: false });
    }
  },
}));
