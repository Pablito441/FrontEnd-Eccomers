import { create } from "zustand";
import { userService } from "../http/UserService";
import type { IUser } from "../types/IUser";

interface UserStore {
  items: IUser[];
  item: IUser | null;
  currentUser: IUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;

  fetchAll: () => Promise<void>;
  fetchById: (id: number) => Promise<void>;
  create: (data: Partial<IUser>) => Promise<void>;
  update: (id: number, data: Partial<IUser>) => Promise<void>;
  delete: (id: number) => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: Partial<IUser>) => Promise<boolean>;
  logout: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  items: [],
  item: null,
  currentUser: null,
  loading: false,
  error: null,
  isAuthenticated: false,

  fetchAll: async () => {
    if (get().items.length > 0) return;
    set({ loading: true, error: null });
    try {
      const data = await userService.getAll();
      set({ items: data, loading: false });
    } catch (error) {
      set({ error: `Error: ${error}`, loading: false });
    }
  },

  fetchById: async (id) => {
    const found = get().items.find((item) => item.id === id);
    if (found) {
      set({ item: found });
      return;
    }
    set({ loading: true, error: null });
    try {
      const item = await userService.getById(id);
      set({ item, loading: false });
    } catch (error) {
      set({ error: `Error: ${error}`, loading: false });
    }
  },

  create: async (data) => {
    set({ loading: true, error: null });
    try {
      const newItem = await userService.create(data);
      if (newItem) {
        set((state) => ({ items: [...state.items, newItem], loading: false }));
      }
    } catch (error) {
      set({ error: `Error: ${error}`, loading: false });
    }
  },

  update: async (id, data) => {
    set({ loading: true, error: null });
    try {
      const updatedItem = await userService.update(id, data);
      if (updatedItem) {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? updatedItem : item
          ),
          loading: false,
        }));
        // Si el usuario actualizado es el usuario actual, actualizar también currentUser
        if (get().currentUser?.id === id) {
          set({ currentUser: updatedItem });
        }
      }
    } catch (error) {
      set({ error: `Error: ${error}`, loading: false });
    }
  },

  delete: async (id) => {
    set({ loading: true, error: null });
    try {
      const success = await userService.delete(id);
      if (success) {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
          loading: false,
        }));
      }
    } catch (error) {
      set({ error: `Error: ${error}`, loading: false });
    }
  },

  login: async (email: string, password: string) => {
    set({ loading: true, error: null });
    try {
      const users = await userService.getAll();
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        set({
          currentUser: user,
          isAuthenticated: true,
          loading: false,
        });
        return true;
      }
      return false;
    } catch (error) {
      set({ error: `Error: ${error}`, loading: false });
      return false;
    }
  },

  register: async (userData: Partial<IUser>) => {
    set({ loading: true, error: null });
    try {
      const newUser = await userService.create(userData);
      if (newUser) {
        set({
          currentUser: newUser,
          isAuthenticated: true,
          loading: false,
        });
        return true;
      }
      return false;
    } catch (error) {
      set({ error: `Error: ${error}`, loading: false });
      return false;
    }
  },

  logout: () => {
    set({
      currentUser: null,
      isAuthenticated: false,
    });
  },
}));
