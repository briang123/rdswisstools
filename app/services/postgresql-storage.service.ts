import { StorageGateway } from './storage-gateway';

// This service is a stub for server-side use with a GraphQL API to PostgreSQL
export class PostgresStorageService<T = unknown> implements StorageGateway<T> {
  // Example: pass a GraphQL client instance in constructor
  constructor(private graphqlEndpoint: string) {}

  async getItem(key: string): Promise<T | null> {
    // TODO: Implement GraphQL query to fetch item by key
    throw new Error('Not implemented: getItem');
  }

  async setItem(key: string, value: T): Promise<void> {
    // TODO: Implement GraphQL mutation to upsert item
    throw new Error('Not implemented: setItem');
  }

  async removeItem(key: string): Promise<void> {
    // TODO: Implement GraphQL mutation to delete item
    throw new Error('Not implemented: removeItem');
  }

  async clear(): Promise<void> {
    // TODO: Implement GraphQL mutation to clear all items
    throw new Error('Not implemented: clear');
  }
}
