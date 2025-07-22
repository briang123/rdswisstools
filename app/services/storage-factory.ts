import { StorageGateway, StorageType } from './storage-gateway';
import { LocalSessionStorageService } from './local-session-storage.service';
import { IndexedDBStorageService } from './indexeddb-storage.service';
import { PostgresStorageService } from './postgresql-storage.service';

export function createStorageService<T = unknown>(
  type: StorageType,
  options?: { graphqlEndpoint?: string },
): StorageGateway<T> {
  switch (type) {
    case StorageType.Local:
      return new LocalSessionStorageService<T>(StorageType.Local);
    case StorageType.Session:
      return new LocalSessionStorageService<T>(StorageType.Session);
    case StorageType.IndexedDB:
      return new IndexedDBStorageService<T>();
    case StorageType.PostgreSQL:
      if (!options?.graphqlEndpoint)
        throw new Error('GraphQL endpoint required for PostgreSQL storage');
      return new PostgresStorageService<T>(options.graphqlEndpoint);
    default:
      throw new Error('Unknown storage type');
  }
}
