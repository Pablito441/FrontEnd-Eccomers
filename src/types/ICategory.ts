import type { Type } from "./IType";

export type Category = {
  id: number;
  name: string;
  typeId: number;
  type?: Type;
  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
  isActive: boolean;
};
