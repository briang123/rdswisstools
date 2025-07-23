import { LocalSessionStorageService } from './local-session-storage.service';
import { StorageType } from './storage-gateway';

describe('LocalSessionStorageService', () => {
  let service: LocalSessionStorageService<unknown>;
  const testKey = 'jest-test-key';
  const testValue = { foo: 'bar' };

  beforeEach(() => {
    service = new LocalSessionStorageService(StorageType.Local);
    window.localStorage.clear();
  });

  it('sets and gets an item', async () => {
    await service.setItem(testKey, testValue);
    const result = await service.getItem(testKey);
    expect(result).toEqual(testValue);
  });

  it('removes an item', async () => {
    await service.setItem(testKey, testValue);
    await service.removeItem(testKey);
    const result = await service.getItem(testKey);
    expect(result).toBeNull();
  });

  it('clears all items', async () => {
    await service.setItem(testKey, testValue);
    await service.clear();
    const result = await service.getItem(testKey);
    expect(result).toBeNull();
  });
});
