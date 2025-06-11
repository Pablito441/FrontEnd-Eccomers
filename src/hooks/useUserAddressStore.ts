import { create } from "zustand";
import { userAddressService } from "../http/UserAddressService";
import type { IUsersAdress, IUsersAdressId } from "../types/IUsersAdress";

interface UserAddressStore {
  items: IUsersAdress[];
  item: IUsersAdress | null;
  loading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  fetchById: (id: IUsersAdressId) => Promise<void>;
  create: (data: Partial<IUsersAdress>) => Promise<void>;
  update: (id: IUsersAdressId, data: Partial<IUsersAdress>) => Promise<void>;
  delete: (id: IUsersAdressId) => Promise<void>;
}

export const useUserAddressStore = create<UserAddressStore>((set, get) => ({
  items: [],
  item: null,
  loading: false,
  error: null,

  fetchAll: async () => {
    if (get().items.length > 0) return;
    set({ loading: true, error: null });
    try {
      const data = await userAddressService.getAll();
      set({ items: data, loading: false });
    } catch (error) {
      set({ error: `Error: ${error}`, loading: false });
    }
  },

  fetchById: async ({ userId, addressId }) => {
    const found = get().items.find(
      (item) => item.userId === userId && item.addressId === addressId
    );
    if (found) {
      set({ item: found });
      return;
    }
    set({ loading: true, error: null });
    try {
      const item = await userAddressService.getById({ userId, addressId });
      set({ item, loading: false });
    } catch (error) {
      set({ error: `Error: ${error}`, loading: false });
    }
  },

  create: async (data) => {
    set({ loading: true, error: null });
    try {
      const newItem = await userAddressService.create(data);
      if (newItem) {
        set((state) => ({ items: [...state.items, newItem], loading: false }));
      }
    } catch (error) {
      set({ error: `Error: ${error}`, loading: false });
    }
  },

  update: async ({ userId, addressId }, data) => {
    set({ loading: true, error: null });
    try {
      const updatedItem = await userAddressService.update(
        { userId, addressId },
        data
      );
      if (updatedItem) {
        set((state) => ({
          items: state.items.map((item) =>
            item.userId === userId && item.addressId === addressId
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

  delete: async ({ userId, addressId }) => {
    set({ loading: true, error: null });
    try {
      const success = await userAddressService.delete({ userId, addressId });
      if (success) {
        set((state) => ({
          items: state.items.filter(
            (item) => item.userId !== userId || item.addressId !== addressId
          ),
          loading: false,
        }));
      }
    } catch (error) {
      set({ error: `Error: ${error}`, loading: false });
    }
  },
}));
