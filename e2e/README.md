# E2E Tests

This directory contains end-to-end (E2E) tests for the application, powered by Playwright.

## Structure

- `*.spec.ts` — E2E test files (e.g., login, file upload, results cleaner)
- `helpers/` — Shared Playwright test utilities, constants, selectors, and setup

## Running Tests

- **Default (headless):**
  ```sh
  npx playwright test
  ```
- **Headed mode:**
  ```sh
  npx playwright test --headed
  ```
- **UI mode (interactive):**
  ```sh
  npx playwright test --ui
  ```

## Helpers

- `helpers/test-utils-core.ts` — Core Playwright helpers
- `helpers/test-utils.ts` — App-specific helpers
- `helpers/test-constants.ts` — Constants for tests
- `helpers/test-selectors.ts` — Selectors for tests
- `helpers/test-setup.ts` — Global setup/teardown
- `helpers/index.ts` — Exports all helpers for easy import

## Environment Checks

- `env-check.spec.ts` — Verifies required environment variables and settings
