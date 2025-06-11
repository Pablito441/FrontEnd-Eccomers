import axios from "axios";
import type {
  IProductDiscount,
  IProductDiscountId,
} from "../types/IProductDiscount";

const BASE_URL = "http://localhost:9000/api/v1/product-discounts";

export const productDiscountService = {
  async getAll(): Promise<IProductDiscount[]> {
    try {
      const response = await axios.get<IProductDiscount[]>(BASE_URL);
      return response.data;
    } catch (error) {
      console.error("Get all failed:", error);
      return [];
    }
  },

  async getById(ids: IProductDiscountId): Promise<IProductDiscount | null> {
    try {
      const response = await axios.get<IProductDiscount>(
        `${BASE_URL}/${ids.idDiscount}/${ids.idProduct}`
      );
      return response.data;
    } catch (error) {
      console.error("Get by ID failed:", error);
      return null;
    }
  },

  async create(
    data: Partial<IProductDiscount>
  ): Promise<IProductDiscount | null> {
    try {
      const response = await axios.post<IProductDiscount>(BASE_URL, data);
      return response.data;
    } catch (error) {
      console.error("Create failed:", error);
      return null;
    }
  },

  async update(
    ids: IProductDiscountId,
    data: Partial<IProductDiscount>
  ): Promise<IProductDiscount | null> {
    try {
      const response = await axios.put<IProductDiscount>(
        `${BASE_URL}/${ids.idDiscount}/${ids.idProduct}`,
        data
      );
      return response.data;
    } catch (error) {
      console.error("Update failed:", error);
      return null;
    }
  },

  async delete(ids: IProductDiscountId): Promise<boolean> {
    try {
      await axios.delete(`${BASE_URL}/${ids.idDiscount}/${ids.idProduct}`);
      return true;
    } catch (error) {
      console.error("Delete failed:", error);
      return false;
    }
  },
};
