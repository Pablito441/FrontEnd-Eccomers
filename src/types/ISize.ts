export type ISize = {
  id: number;
  number: string;
  system: "ARG" | "US" | "UK" | "CM";
  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
  isActive: boolean;
};
