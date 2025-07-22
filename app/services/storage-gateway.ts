// StorageGateway interface abstracts storage operations for multiple backends
export interface StorageGateway<T = unknown> {
  getItem(key: string): Promise<T | null>;
  setItem(key: string, value: T): Promise<void>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
}

// StorageType enum for selecting backend
export enum StorageType {
  Local,
  Session,
  IndexedDB,
  PostgreSQL,
}
