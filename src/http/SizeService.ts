import type { ISize } from "../types/ISize";
import { ApiService } from "./ApiService";

class SizeService extends ApiService<ISize> {
  constructor() {
    super("http://localhost:9000/api/v1/sizes");
  }

  async create(data: Partial<ISize>): Promise<ISize | null> {
    console.log("SizeService.create - Datos enviados:", data);
    const result = await super.create(data);
    console.log("SizeService.create - Respuesta:", result);
    return result;
  }

  async update(id: number, data: Partial<ISize>): Promise<ISize | null> {
    console.log("SizeService.update - Datos enviados:", { id, data });
    const result = await super.update(id, data);
    console.log("SizeService.update - Respuesta:", result);
    return result;
  }
}

export const sizeService = new SizeService();
