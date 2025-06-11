import { createStore } from "./useStore";
import { detailService } from "../http/DetailService";
import type { IDetail } from "../types/IDetail";

export const useDetailStore = createStore<IDetail>(detailService);
