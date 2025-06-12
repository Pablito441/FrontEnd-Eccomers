import { create } from "zustand";
import { userService } from "../http/UserService";
import { authService } from "../http/AuthService";
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
  checkAuthStatus: () => void;
}

// Función para obtener el estado inicial desde localStorage
const getInitialState = () => {
  const storedUser = localStorage.getItem("user");
  const token = authService.getToken();
  const isValidToken = Boolean(token && authService.isTokenValid());

  return {
    currentUser: storedUser && isValidToken ? JSON.parse(storedUser) : null,
    isAuthenticated: isValidToken,
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
    console.log("useUserStore.login iniciado con:", { email, password });
    set({ loading: true, error: null });
    try {
      console.log("Llamando a authService.login...");
      const response = await authService.login({ email, password });
      console.log("Respuesta de authService.login:", response);

      if (response) {
        console.log("Login exitoso, guardando datos...");
        // Guardar token y usuario en localStorage
        authService.setToken(response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("isAuthenticated", "true");

        console.log("Datos guardados, actualizando estado...");
        set({
          currentUser: response.user,
          isAuthenticated: true,
          loading: false,
        });
        console.log("Estado actualizado, login completado");
        return true;
      }
      
      console.log("Login falló - response es null/undefined");
      set({ loading: false });
      return false;
    } catch (error) {
      console.error("Error en useUserStore.login:", error);
      set({ error: `Error: ${error}`, loading: false });
      return false;
    }
  },

  register: async (userData: Partial<IUser>) => {
    set({ loading: true, error: null });
    try {
      const response = await authService.register({
        name: userData.name!,
        lastName: userData.lastName!,
        username: userData.username!,
        email: userData.email!,
        password: userData.password!,
        role: userData.role!,
        isActive: userData.isActive!,
      });

      if (response) {
        // Guardar token y usuario en localStorage
        authService.setToken(response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
        localStorage.setItem("isAuthenticated", "true");

        set({
          currentUser: response.user,
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
    // Usar el servicio de autenticación para limpiar todo
    authService.logout();

    set({
      currentUser: null,
      isAuthenticated: false,
    });
  },

  checkAuthStatus: () => {
    const token = authService.getToken();
    const storedUser = localStorage.getItem("user");
    
    if (token && authService.isTokenValid() && storedUser) {
      set({
        currentUser: JSON.parse(storedUser),
        isAuthenticated: true,
      });
    } else {
      // Token inválido o expirado, limpiar estado
      authService.logout();
      set({
        currentUser: null,
        isAuthenticated: false,
      });
    }
  },
}));
