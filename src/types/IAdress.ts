export type Adress = {
  id: number;
  street: string;
  town: string;
  state: string;
  cpi: string;
  country: string;
  createdAt: string;
  updatedAt?: string | null;
  deletedAt?: string | null;
  isActive: boolean;
};
