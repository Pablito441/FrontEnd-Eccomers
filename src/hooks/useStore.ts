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
    pagination: {
      currentPage: 1,
      totalPages: 1,
      total: 0,
      limit: 20,
    },

    fetchAll: async () => {
      set({ loading: true, error: null });
      try {
        const data = await service.getAll();
        set({ items: data, loading: false });
      } catch (error) {
        set({ error: `Error al cargar los datos: ${error}`, loading: false });
      }
    },

    // Obtener solo elementos activos
    fetchActive: async () => {
      set({ loading: true, error: null });
      try {
        const data = await service.getActive();
        set({ items: data, loading: false });
      } catch (error) {
        set({ error: `Error al cargar elementos activos: ${error}`, loading: false });
      }
    },

    // Obtener solo elementos inactivos
    fetchInactive: async () => {
      set({ loading: true, error: null });
      try {
        const data = await service.getInactive();
        set({ items: data, loading: false });
      } catch (error) {
        set({ error: `Error al cargar elementos inactivos: ${error}`, loading: false });
      }
    },

    // Obtener elementos soft deleted
    fetchSoftDeleted: async () => {
      set({ loading: true, error: null });
      try {
        const data = await service.getSoftDeleted();
        set({ items: data, loading: false });
      } catch (error) {
        set({ error: `Error al cargar elementos eliminados: ${error}`, loading: false });
      }
    },

    // Métodos con paginación
    fetchAllPaginated: async (page = 1, limit = 20) => {
      set({ loading: true, error: null });
      try {
        const response = await service.getAllPaginated(page, limit);
        // Si la respuesta no tiene la estructura de paginación, usar método normal
        if (!response.data || response.data.length === 0 && response.total === 0) {
          const fallbackData = await service.getAll();
          set({ 
            items: fallbackData, 
            loading: false,
            pagination: {
              currentPage: 1,
              totalPages: 1,
              total: fallbackData.length,
              limit: fallbackData.length,
            }
          });
        } else {
          set({ 
            items: response.data, 
            loading: false,
            pagination: {
              currentPage: response.currentPage,
              totalPages: response.totalPages,
              total: response.total,
              limit: limit,
            }
          });
        }
      } catch {
        // Si falla la paginación, intentar con método normal
        try {
          const fallbackData = await service.getAll();
          set({ 
            items: fallbackData, 
            loading: false,
            pagination: {
              currentPage: 1,
              totalPages: 1,
              total: fallbackData.length,
              limit: fallbackData.length,
            }
          });
        } catch (fallbackError) {
          set({ error: `Error al cargar los datos: ${fallbackError}`, loading: false });
        }
      }
    },

    fetchActivePaginated: async (page = 1, limit = 20) => {
      set({ loading: true, error: null });
      try {
        const response = await service.getActivePaginated(page, limit);
        // Si la respuesta no tiene la estructura de paginación, usar método normal
        if (!response.data || response.data.length === 0 && response.total === 0) {
          const fallbackData = await service.getActive();
          set({ 
            items: fallbackData, 
            loading: false,
            pagination: {
              currentPage: 1,
              totalPages: 1,
              total: fallbackData.length,
              limit: fallbackData.length,
            }
          });
        } else {
          set({ 
            items: response.data, 
            loading: false,
            pagination: {
              currentPage: response.currentPage,
              totalPages: response.totalPages,
              total: response.total,
              limit: limit,
            }
          });
        }
      } catch {
        // Si falla la paginación, intentar con método normal
        try {
          const fallbackData = await service.getActive();
          set({ 
            items: fallbackData, 
            loading: false,
            pagination: {
              currentPage: 1,
              totalPages: 1,
              total: fallbackData.length,
              limit: fallbackData.length,
            }
          });
        } catch (fallbackError) {
          set({ error: `Error al cargar elementos activos: ${fallbackError}`, loading: false });
        }
      }
    },

    fetchInactivePaginated: async (page = 1, limit = 20) => {
      set({ loading: true, error: null });
      try {
        const response = await service.getInactivePaginated(page, limit);
        // Si la respuesta no tiene la estructura de paginación, usar método normal
        if (!response.data || response.data.length === 0 && response.total === 0) {
          const fallbackData = await service.getInactive();
          set({ 
            items: fallbackData, 
            loading: false,
            pagination: {
              currentPage: 1,
              totalPages: 1,
              total: fallbackData.length,
              limit: fallbackData.length,
            }
          });
        } else {
          set({ 
            items: response.data, 
            loading: false,
            pagination: {
              currentPage: response.currentPage,
              totalPages: response.totalPages,
              total: response.total,
              limit: limit,
            }
          });
        }
      } catch {
        // Si falla la paginación, intentar con método normal
        try {
          const fallbackData = await service.getInactive();
          set({ 
            items: fallbackData, 
            loading: false,
            pagination: {
              currentPage: 1,
              totalPages: 1,
              total: fallbackData.length,
              limit: fallbackData.length,
            }
          });
        } catch (fallbackError) {
          set({ error: `Error al cargar elementos inactivos: ${fallbackError}`, loading: false });
        }
      }
    },

    fetchSoftDeletedPaginated: async (page = 1, limit = 20) => {
      set({ loading: true, error: null });
      try {
        const response = await service.getSoftDeletedPaginated(page, limit);
        // Si la respuesta no tiene la estructura de paginación, usar método normal
        if (!response.data || response.data.length === 0 && response.total === 0) {
          const fallbackData = await service.getSoftDeleted();
          set({ 
            items: fallbackData, 
            loading: false,
            pagination: {
              currentPage: 1,
              totalPages: 1,
              total: fallbackData.length,
              limit: fallbackData.length,
            }
          });
        } else {
          set({ 
            items: response.data, 
            loading: false,
            pagination: {
              currentPage: response.currentPage,
              totalPages: response.totalPages,
              total: response.total,
              limit: limit,
            }
          });
        }
      } catch {
        // Si falla la paginación, intentar con método normal
        try {
          const fallbackData = await service.getSoftDeleted();
          set({ 
            items: fallbackData, 
            loading: false,
            pagination: {
              currentPage: 1,
              totalPages: 1,
              total: fallbackData.length,
              limit: fallbackData.length,
            }
          });
        } catch (fallbackError) {
          set({ error: `Error al cargar elementos eliminados: ${fallbackError}`, loading: false });
        }
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

    // Activar elemento
    activate: async (id: number) => {
      set({ loading: true, error: null });
      try {
        const activatedItem = await service.activate(id);
        if (activatedItem) {
          set((state) => ({
            items: state.items.map((item) =>
              item.id === id ? activatedItem : item
            ),
            loading: false,
          }));
          return activatedItem;
        }
        return null;
      } catch (error) {
        set({
          error: `Error al activar el elemento: ${error}`,
          loading: false,
        });
        return null;
      }
    },

    // Desactivar elemento
    deactivate: async (id: number) => {
      set({ loading: true, error: null });
      try {
        const deactivatedItem = await service.deactivate(id);
        if (deactivatedItem) {
          set((state) => ({
            items: state.items.map((item) =>
              item.id === id ? deactivatedItem : item
            ),
            loading: false,
          }));
          return deactivatedItem;
        }
        return null;
      } catch (error) {
        set({
          error: `Error al desactivar el elemento: ${error}`,
          loading: false,
        });
        return null;
      }
    },

    // Soft delete
    softDelete: async (id: number) => {
      set({ loading: true, error: null });
      try {
        const softDeletedItem = await service.softDelete(id);
        if (softDeletedItem) {
          set((state) => ({
            items: state.items.filter((item) => item.id !== id),
            loading: false,
          }));
          return softDeletedItem;
        }
        return null;
      } catch (error) {
        set({
          error: `Error al eliminar el elemento: ${error}`,
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
