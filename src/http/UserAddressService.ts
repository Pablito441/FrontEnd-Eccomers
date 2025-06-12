import axios from "axios";
import type { IUsersAdress, IUsersAdressId } from "../types/IUsersAdress";
import { authService } from "./AuthService";

const BASE_URL = "http://localhost:9000/api/v1/user-addresses";

// Interfaz corregida para coincidir con la estructura real del backend
interface IMyAddressResponse {
  id: number;
  userId: number;
  addressId: number;
  adress: {
    id: number;
    street: string;
    town: string;
    state: string;
    cpi: string;
    country: string;
    isActive: boolean;
  };
}

class UserAddressService {
  async getAll(): Promise<IUsersAdress[]> {
    try {
      const response = await axios.get<IUsersAdress[]>(BASE_URL);
      return response.data;
    } catch (error) {
      console.error("Get all failed:", error);
      return [];
    }
  }

  async getById(ids: IUsersAdressId): Promise<IUsersAdress | null> {
    try {
      const response = await axios.get<IUsersAdress>(
        `${BASE_URL}/${ids.userId}/${ids.addressId}`
      );
      return response.data;
    } catch (error) {
      console.error("Get by ID failed:", error);
      return null;
    }
  }

  async create(data: Partial<IUsersAdress>): Promise<IUsersAdress | null> {
    try {
      const response = await axios.post<IUsersAdress>(BASE_URL, data);
      return response.data;
    } catch (error) {
      console.error("Create failed:", error);
      return null;
    }
  }

  async update(
    ids: IUsersAdressId,
    data: Partial<IUsersAdress>
  ): Promise<IUsersAdress | null> {
    try {
      const response = await axios.put<IUsersAdress>(
        `${BASE_URL}/${ids.userId}/${ids.addressId}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Update failed:", error);
      return null;
    }
  }

  async delete(ids: IUsersAdressId): Promise<boolean> {
    try {
      await axios.delete(`${BASE_URL}/${ids.userId}/${ids.addressId}`);
      return true;
    } catch (error) {
      console.error("Delete failed:", error);
      return false;
    }
  }

  async getMyAddresses(): Promise<IMyAddressResponse[]> {
    try {
      const token = authService.getToken();
      if (!token || !authService.isTokenValid()) {
        throw new Error("No hay token válido");
      }

      const response = await axios.get(
        `${BASE_URL}/my-addresses`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      console.log("Respuesta del servidor:", response.data);
      return response.data;
    } catch (error) {
      console.error("Error al obtener mis direcciones:", error);
      return [];
    }
  }
}

export const userAddressService = new UserAddressService();
