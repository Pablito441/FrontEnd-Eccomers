import type { IType } from "./IType";

export type ICategory = {
  id: number;
  name: string;
  typeId: number;
  type?: IType;
  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
  isActive: boolean;
};
