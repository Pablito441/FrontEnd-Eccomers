export type IDiscount = {
  id: number;
  startDate: string; // Date suele venir como string ISO
  endDate: string;
  discountPercentage: number;
  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
  isActive: boolean;
};
