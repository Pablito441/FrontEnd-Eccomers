import axios from "axios";
import type { IUser } from "../types/IUser";

const BASE_URL = "http://localhost:9000/auth";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  userId: number;
  username: string;
  name: string;
  lastName: string;
  email: string;
  role: "ADMIN" | "CLIENT";
}

export interface RegisterRequest {
  name: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: "ADMIN" | "CLIENT";
  isActive: boolean;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface ILoginResponse {
  token: string;
  user: {
    id: number;
    email: string;
    role: string;
  };
}

class AuthService {
  private apiUrl = "http://localhost:9000/api/v1/auth";

  async login(credentials: LoginRequest): Promise<{ token: string; user: IUser } | null> {
    try {
      console.log("Intentando login con:", credentials);
      const response = await axios.post<LoginResponse>(
        `${BASE_URL}/login`, 
        credentials,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      console.log("Respuesta del backend:", response.data);
      
      const data = response.data;
      
      // Verificar que tenemos todos los datos necesarios
      if (!data.token || !data.userId) {
        console.error("Respuesta del backend incompleta:", data);
        return null;
      }
      
      // Transformar la respuesta del backend al formato esperado por el frontend
      const result = {
        token: data.token,
        user: {
          id: data.userId,
          name: data.name,
          lastName: data.lastName,
          username: data.username,
          email: data.email,
          password: "", // No necesitamos la contraseña en el frontend
          role: data.role,
          createdAt: new Date().toISOString(),
          updatedAt: null,
          deletedAt: null,
          isActive: true,
        }
      };
      
      console.log("Datos transformados:", result);
      return result;
    } catch (error) {
      console.error("Login failed:", error);
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
        console.error("Error config:", error.config);
      }
      return null;
    }
  }

  async register(userData: RegisterRequest): Promise<{ token: string; user: IUser } | null> {
    try {
      console.log("Intentando registro con:", userData);
      const response = await axios.post<LoginResponse>(
        `${BASE_URL}/register`,
        userData,
        {
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      console.log("Respuesta del backend:", response.data);

      const data = response.data;

      // Verificar que tenemos todos los datos necesarios
      if (!data.token || !data.userId) {
        console.error("Respuesta del backend incompleta:", data);
        return null;
      }

      // Transformar la respuesta del backend al formato esperado por el frontend
      const result = {
        token: data.token,
        user: {
          id: data.userId,
          name: data.name,
          lastName: data.lastName,
          username: data.username,
          email: data.email,
          password: "", // No necesitamos la contraseña en el frontend
          role: data.role,
          createdAt: new Date().toISOString(),
          updatedAt: null,
          deletedAt: null,
          isActive: true,
        }
      };

      console.log("Datos transformados:", result);
      return result;
    } catch (error) {
      console.error("Register failed:", error);
      if (axios.isAxiosError(error)) {
        console.error("Error response:", error.response?.data);
        console.error("Error status:", error.response?.status);
        console.error("Error config:", error.config);
      }
      return null;
    }
  }

  async logout(): Promise<void> {
    // Limpiar token del localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
  }

  getToken(): string | null {
    return localStorage.getItem("token");
  }

  setToken(token: string): void {
    localStorage.setItem("token", token);
  }

  isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // Decodificar el JWT para verificar si ha expirado
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      return payload.exp > currentTime;
    } catch {
      return false;
    }
  }

  // Login de administrador
  async loginAdmin(email: string, password: string): Promise<string | null> {
    try {
      const response = await axios.post(`${this.apiUrl}/login`, {
        email,
        password
      });

      const data: ILoginResponse = response.data;
      
      // Guardar token en localStorage
      localStorage.setItem('adminToken', data.token);
      
      return data.token;
    } catch (error) {
      console.error('Error en login de admin:', error);
      return null;
    }
  }

  // Obtener token actual
  getAdminToken(): string | null {
    return localStorage.getItem('adminToken');
  }

  // Verificar si hay token válido
  isAdminAuthenticated(): boolean {
    const token = this.getAdminToken();
    return token !== null && token !== '';
  }

  // Logout
  logoutAdmin(): void {
    localStorage.removeItem('adminToken');
  }

  // Verificar si el token es válido (opcional)
  async verifyToken(): Promise<boolean> {
    try {
      const token = this.getAdminToken();
      if (!token) return false;

      const response = await axios.get(`${this.apiUrl}/verify`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      return response.status === 200;
    } catch (error) {
      console.error('Error al verificar token:', error);
      this.logoutAdmin(); // Limpiar token inválido
      return false;
    }
  }
}

export const authService = new AuthService(); 