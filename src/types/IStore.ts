export interface IStore<T> {
  items: T[];
  item: T | null;
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    totalPages: number;
    total: number;
    limit: number;
  };

  fetchAll: () => Promise<void>;
  fetchActive: () => Promise<void>;
  fetchInactive: () => Promise<void>;
  fetchSoftDeleted: () => Promise<void>;
  fetchAllPaginated: (page?: number, limit?: number) => Promise<void>;
  fetchActivePaginated: (page?: number, limit?: number) => Promise<void>;
  fetchInactivePaginated: (page?: number, limit?: number) => Promise<void>;
  fetchSoftDeletedPaginated: (page?: number, limit?: number) => Promise<void>;
  fetchById: (id: number) => Promise<void>;
  create: (data: Partial<T>) => Promise<T | null>;
  update: (id: number, data: Partial<T>) => Promise<T | null>;
  activate: (id: number) => Promise<T | null>;
  deactivate: (id: number) => Promise<T | null>;
  softDelete: (id: number) => Promise<T | null>;
  restore: (id: number) => Promise<T | null>;
  delete: (id: number) => Promise<void>;
}
