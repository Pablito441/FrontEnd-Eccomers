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

// Función para obtener el estado inicial desde localStorage
const getInitialState = () => {
  const storedUser = localStorage.getItem("user");
  const storedAuth = localStorage.getItem("isAuthenticated");

  return {
    currentUser: storedUser ? JSON.parse(storedUser) : null,
    isAuthenticated: storedAuth === "true",
  };
};

export const useUserStore = create<UserStore>((set, get) => ({
  items: [],
  item: null,
  currentUser: getInitialState().currentUser,
  loading: false,
  error: null,
  isAuthenticated: getInitialState().isAuthenticated,

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
          localStorage.setItem("user", JSON.stringify(updatedItem));
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
        // Guardar en localStorage
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isAuthenticated", "true");

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
        // Guardar en localStorage
        localStorage.setItem("user", JSON.stringify(newUser));
        localStorage.setItem("isAuthenticated", "true");

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
    // Limpiar localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");

    set({
      currentUser: null,
      isAuthenticated: false,
    });
  },
}));
