export type IStore<T> = {
  items: T[];
  item: T | null;
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  fetchById: (id: number) => Promise<void>;
  create: (data: Partial<T>) => Promise<void>;
  update: (id: number, data: Partial<T>) => Promise<void>;
  delete: (id: number) => Promise<void>;
};
