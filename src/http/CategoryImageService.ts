import { ApiService } from "./ApiService";
import axios from "axios";

export interface ICategoryImage {
  id: number;
  imageUrl: string;
  productName: string;
  productId?: number;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}

export interface ICreateCategoryImage {
  imageUrl: string;
  productName: string;
  productId?: number;
  position: number;
}

class CategoryImageService extends ApiService<ICategoryImage> {
  private apiUrl = "http://localhost:9000/api/v1/category-images";

  constructor() {
    super("http://localhost:9000/api/v1/category-images");
  }

  // Obtener imágenes ordenadas por posición
  async getOrdered(): Promise<ICategoryImage[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/ordered`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener imágenes de categorías ordenadas:", error);
      return [];
    }
  }

  // Obtener imágenes por producto
  async getByProductId(productId: number): Promise<ICategoryImage[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/product/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener imágenes de categorías por producto:", error);
      return [];
    }
  }

  // Actualizar posición
  async updatePosition(id: number, position: number): Promise<ICategoryImage | null> {
    try {
      const response = await axios.put(`${this.apiUrl}/${id}/position?position=${position}`);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar posición de imagen de categoría:", error);
      return null;
    }
  }

  // Crear imagen de categoría
  async createCategoryImage(data: ICreateCategoryImage): Promise<ICategoryImage | null> {
    try {
      const response = await axios.post(this.apiUrl, data);
      return response.data;
    } catch (error) {
      console.error("Error al crear imagen de categoría:", error);
      return null;
    }
  }
}

export const categoryImageService = new CategoryImageService(); 