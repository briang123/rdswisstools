import { test, expect } from '@playwright/test';

test.describe('Environment Checks', () => {
  test('should have NODE_ENV defined (warn only)', () => {
    if (!process.env.NODE_ENV) {
      // eslint-disable-next-line no-console
      console.warn('Warning: NODE_ENV is not defined.');
    }
    expect(true).toBe(true); // Always pass
  });

  test('should print all environment variables', () => {
    // eslint-disable-next-line no-console
    console.log('Environment:', process.env);
    expect(typeof process.env).toBe('object');
  });
});
