import type { ISize } from "../types/ISize";
import { sizeService } from "../http/SizeService";
import { createStore } from "./useStore";

export const useSizeStore = createStore<ISize>(sizeService);
