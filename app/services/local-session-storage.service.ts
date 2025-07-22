import { StorageGateway, StorageType } from './storage-gateway';

export class LocalSessionStorageService<T = unknown> implements StorageGateway<T> {
  private storage: Storage;

  constructor(type: StorageType.Local | StorageType.Session = StorageType.Local) {
    this.storage = type === StorageType.Local ? window.localStorage : window.sessionStorage;
  }

  async getItem(key: string): Promise<T | null> {
    const item = this.storage.getItem(key);
    return item ? (JSON.parse(item) as T) : null;
  }

  async setItem(key: string, value: T): Promise<void> {
    this.storage.setItem(key, JSON.stringify(value));
  }

  async removeItem(key: string): Promise<void> {
    this.storage.removeItem(key);
  }

  async clear(): Promise<void> {
    this.storage.clear();
  }
}
