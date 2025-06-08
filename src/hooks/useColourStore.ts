import { colourService } from "../http/ColourService";
import type { IColour } from "../types/IColour";
import { createStore } from "./useStore";

export const useColourStore = createStore<IColour>(colourService);
