import axios from "axios";
import type { IProductSize, IProductSizeId } from "../types/IProductSize";

const BASE_URL = "http://localhost:9000/api/v1/product-sizes";

export const productSizeService = {
  async getAll(): Promise<IProductSize[]> {
    try {
      const response = await axios.get<IProductSize[]>(BASE_URL);
      return response.data;
    } catch (error) {
      console.error("Get all failed:", error);
      return [];
    }
  },

  async getById(ids: IProductSizeId): Promise<IProductSize | null> {
    try {
      const response = await axios.get<IProductSize>(
        `${BASE_URL}/${ids.idSize}/${ids.idProduct}`
      );
      return response.data;
    } catch (error) {
      console.error("Get by ID failed:", error);
      return null;
    }
  },

  async create(data: Partial<IProductSize>): Promise<IProductSize | null> {
    try {
      const response = await axios.post<IProductSize>(BASE_URL, data);
      return response.data;
    } catch (error) {
      console.error("Create failed:", error);
      return null;
    }
  },

  async update(
    ids: IProductSizeId,
    data: Partial<IProductSize>
  ): Promise<IProductSize | null> {
    try {
      const response = await axios.put<IProductSize>(
        `${BASE_URL}/${ids.idSize}/${ids.idProduct}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Update failed:", error);
      return null;
    }
  },

  async delete(ids: IProductSizeId): Promise<boolean> {
    try {
      await axios.delete(`${BASE_URL}/${ids.idSize}/${ids.idProduct}`);
      return true;
    } catch (error) {
      console.error("Delete failed:", error);
      return false;
    }
  },
};
