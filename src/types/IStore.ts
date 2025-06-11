export interface IStore<T> {
  items: T[];
  item: T | null;
  loading: boolean;
  error: string | null;

  fetchAll: () => Promise<void>;
  fetchById: (id: number) => Promise<void>;
  create: (data: Partial<T>) => Promise<T | null>;
  update: (id: number, data: Partial<T>) => Promise<T | null>;
  delete: (id: number) => Promise<void>;
}
