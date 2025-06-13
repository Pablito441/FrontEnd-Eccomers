import { ApiService } from "./ApiService";
import axios from "axios";

export interface ICarouselImage {
  id: number;
  imageUrl: string;
  productName: string;
  productId?: number;
  isCatalogLink: boolean;
  position: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  deletedAt: string | null;
}

export interface ICreateCarouselImage {
  imageUrl: string;
  productName: string;
  productId?: number;
  isCatalogLink: boolean;
  position: number;
}

class CarouselImageService extends ApiService<ICarouselImage> {
  private apiUrl = "http://localhost:9000/api/v1/carousel-images";

  constructor() {
    super("http://localhost:9000/api/v1/carousel-images");
  }

  // Obtener imágenes ordenadas por posición
  async getOrdered(): Promise<ICarouselImage[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/ordered`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener imágenes ordenadas:", error);
      return [];
    }
  }

  // Obtener imágenes por producto
  async getByProductId(productId: number): Promise<ICarouselImage[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/product/${productId}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener imágenes por producto:", error);
      return [];
    }
  }

  // Obtener solo enlaces al catálogo
  async getCatalogLinks(): Promise<ICarouselImage[]> {
    try {
      const response = await axios.get(`${this.apiUrl}/catalog-links`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener enlaces del catálogo:", error);
      return [];
    }
  }

  // Actualizar posición
  async updatePosition(id: number, position: number): Promise<ICarouselImage | null> {
    try {
      const response = await axios.put(`${this.apiUrl}/${id}/position?position=${position}`);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar posición:", error);
      return null;
    }
  }

  // Crear imagen del carrusel
  async createCarouselImage(data: ICreateCarouselImage): Promise<ICarouselImage | null> {
    try {
      const response = await axios.post(this.apiUrl, data);
      return response.data;
    } catch (error) {
      console.error("Error al crear imagen del carrusel:", error);
      return null;
    }
  }
}

export const carouselImageService = new CarouselImageService(); 