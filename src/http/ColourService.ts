import type { IColour } from "../types/IColour";
import { ApiService } from "./ApiService";

export const colourService = new ApiService<IColour>(
  "http://localhost:9000/api/v1/colours"
);
