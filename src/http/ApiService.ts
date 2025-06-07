import axios from "axios";
import type { AxiosResponse } from "axios";

export class ApiService<T> {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
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
