const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: 'e2e',
  use: {
    headless: true, // Default to headless
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
  },
  globalSetup: require.resolve('./e2e/helpers/test-setup'),
  webServer: {
    command: 'npm run dev',
    port: 3000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI,
  },
});
