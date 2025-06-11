import { typeService } from "../http/TypeService";
import type { IType } from "../types/IType";
import { createStore } from "./useStore";

export const useTypeStore = createStore<IType>(typeService);
