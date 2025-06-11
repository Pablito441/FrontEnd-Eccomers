import { create } from "zustand";
import type { IStore } from "../types/IStore";
import { ApiService } from "../http/ApiService";

export const createStore = <T extends { id: number }>(
  service: ApiService<T>
) => {
  return create<IStore<T>>((set) => ({
    items: [],
    item: null,
    loading: false,
    error: null,

    fetchAll: async () => {
      set({ loading: true, error: null });
      try {
        const data = await service.getAll();
        set({ items: data, loading: false });
      } catch (error) {
        set({ error: `Error al cargar los datos: ${error}`, loading: false });
      }
    },

    fetchById: async (id: number) => {
      set({ loading: true, error: null });
      try {
        const data = await service.getById(id);
        set({ item: data, loading: false });
      } catch (error) {
        set({ error: `Error al cargar el elemento: ${error}`, loading: false });
      }
    },

    create: async (data: Partial<T>) => {
      set({ loading: true, error: null });
      try {
        const newItem = await service.create(data);
        if (newItem) {
          set((state) => ({
            items: [...state.items, newItem],
            loading: false,
          }));
          return newItem;
        }
        return null;
      } catch (error) {
        set({ error: `Error al crear el elemento: ${error}`, loading: false });
        return null;
      }
    },

    update: async (id: number, data: Partial<T>) => {
      set({ loading: true, error: null });
      try {
        const updatedItem = await service.update(id, data);
        if (updatedItem) {
          set((state) => ({
            items: state.items.map((item) =>
              item.id === id ? updatedItem : item
            ),
            item: updatedItem,
            loading: false,
          }));
          return updatedItem;
        }
        return null;
      } catch (error) {
        set({
          error: `Error al actualizar el elemento: ${error}`,
          loading: false,
        });
        return null;
      }
    },

    delete: async (id: number) => {
      set({ loading: true, error: null });
      try {
        const success = await service.delete(id);
        if (success) {
          set((state) => ({
            items: state.items.filter((item) => item.id !== id),
            loading: false,
          }));
        }
      } catch (error) {
        set({
          error: `Error al eliminar el elemento: ${error}`,
          loading: false,
        });
      }
    },
  }));
};
