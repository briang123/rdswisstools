import { FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  // Example: Seed database, set up environment, etc.
  // console.log('Global setup for Playwright E2E tests');
}

export default globalSetup;
