import axios from "axios";
import type { AxiosResponse } from "axios";
import { authService } from "./AuthService";

// Variable para controlar si los interceptores ya fueron configurados
let interceptorsConfigured = false;

export class ApiService<T> {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
    // Configurar interceptor para incluir token en todas las peticiones (solo una vez)
    if (!interceptorsConfigured) {
      this.setupInterceptors();
      interceptorsConfigured = true;
    }
  }

  private setupInterceptors() {
    // Interceptor para requests - agregar token
    axios.interceptors.request.use(
      (config) => {
        const token = authService.getToken();
        if (token && authService.isTokenValid()) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para responses - manejar errores 401
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expirado o inválido, limpiar autenticación
          authService.logout();
          // Solo redirigir si no estamos ya en la página de login
          if (window.location.pathname !== '/loginRegister') {
            window.location.href = '/loginRegister';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async getAll(): Promise<T[]> {
    try {
      const response: AxiosResponse<T[]> = await axios.get(this.baseUrl);
      return response.data;
    } catch (error) {
      console.error("Get all failed:", error);
      return [];
    }
  }

  // Obtener con paginación
  async getAllPaginated(page: number = 1, limit: number = 20): Promise<{ data: T[], total: number, totalPages: number, currentPage: number }> {
    try {
      const response: AxiosResponse<{ data: T[], total: number, totalPages: number, currentPage: number }> = 
        await axios.get(`${this.baseUrl}?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Get paginated failed:", error);
      return { data: [], total: 0, totalPages: 0, currentPage: 1 };
    }
  }

  // Obtener solo elementos activos
  async getActive(): Promise<T[]> {
    try {
      const response: AxiosResponse<T[]> = await axios.get(`${this.baseUrl}/active`);
      return response.data;
    } catch (error) {
      console.error("Get active failed:", error);
      return [];
    }
  }

  // Obtener elementos activos con paginación
  async getActivePaginated(page: number = 1, limit: number = 20): Promise<{ data: T[], total: number, totalPages: number, currentPage: number }> {
    try {
      const response: AxiosResponse<{ data: T[], total: number, totalPages: number, currentPage: number }> = 
        await axios.get(`${this.baseUrl}/active?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Get active paginated failed:", error);
      return { data: [], total: 0, totalPages: 0, currentPage: 1 };
    }
  }

  // Obtener solo elementos inactivos
  async getInactive(): Promise<T[]> {
    try {
      const response: AxiosResponse<T[]> = await axios.get(`${this.baseUrl}/inactive`);
      return response.data;
    } catch (error) {
      console.error("Get inactive failed:", error);
      return [];
    }
  }

  // Obtener elementos inactivos con paginación
  async getInactivePaginated(page: number = 1, limit: number = 20): Promise<{ data: T[], total: number, totalPages: number, currentPage: number }> {
    try {
      const response: AxiosResponse<{ data: T[], total: number, totalPages: number, currentPage: number }> = 
        await axios.get(`${this.baseUrl}/inactive?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Get inactive paginated failed:", error);
      return { data: [], total: 0, totalPages: 0, currentPage: 1 };
    }
  }

  // Obtener elementos soft deleted (solo para admin)
  async getSoftDeleted(): Promise<T[]> {
    try {
      const response: AxiosResponse<T[]> = await axios.get(`${this.baseUrl}/soft-deleted`);
      return response.data;
    } catch (error) {
      console.error("Get soft deleted failed:", error);
      return [];
    }
  }

  // Obtener elementos soft deleted con paginación
  async getSoftDeletedPaginated(page: number = 1, limit: number = 20): Promise<{ data: T[], total: number, totalPages: number, currentPage: number }> {
    try {
      const response: AxiosResponse<{ data: T[], total: number, totalPages: number, currentPage: number }> = 
        await axios.get(`${this.baseUrl}/soft-deleted?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Get soft deleted paginated failed:", error);
      return { data: [], total: 0, totalPages: 0, currentPage: 1 };
    }
  }

  async getById(id: number): Promise<T | null> {
    try {
      const response: AxiosResponse<T> = await axios.get(
        `${this.baseUrl}/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("Get by id failed:", error);
      return null;
    }
  }

  async create(data: Partial<T>): Promise<T | null> {
    try {
      const response: AxiosResponse<T> = await axios.post(this.baseUrl, data);
      return response.data;
    } catch (error) {
      console.error("Create failed:", error);
      return null;
    }
  }

  async update(id: number, data: Partial<T>): Promise<T | null> {
    try {
      const response: AxiosResponse<T> = await axios.put(
        `${this.baseUrl}/${id}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Update failed:", error);
      return null;
    }
  }

  // Activar elemento
  async activate(id: number): Promise<T | null> {
    try {
      const response: AxiosResponse<T> = await axios.put(
        `${this.baseUrl}/${id}/activate`
      );
      return response.data;
    } catch (error) {
      console.error("Activate failed:", error);
      return null;
    }
  }

  // Desactivar elemento
  async deactivate(id: number): Promise<T | null> {
    try {
      const response: AxiosResponse<T> = await axios.put(
        `${this.baseUrl}/${id}/deactivate`
      );
      return response.data;
    } catch (error) {
      console.error("Deactivate failed:", error);
      return null;
    }
  }

  // Soft delete
  async softDelete(id: number): Promise<T | null> {
    try {
      const response: AxiosResponse<T> = await axios.put(
        `${this.baseUrl}/${id}/soft-delete`
      );
      return response.data;
    } catch (error) {
      console.error("Soft delete failed:", error);
      return null;
    }
  }

  async delete(id: number): Promise<boolean> {
    try {
      await axios.delete(`${this.baseUrl}/${id}`);
      return true;
    } catch (error) {
      console.error("Delete failed:", error);
      return false;
    }
  }
}
