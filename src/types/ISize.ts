export type Size = {
  id: number;
  number: string;
  systemType: "EU" | "US" | "UK" | "CM";
  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
  isActive: boolean;
};
