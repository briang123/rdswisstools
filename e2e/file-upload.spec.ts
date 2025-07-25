import { test, expect } from '@playwright/test';
import path from 'path';
import fs from 'fs';

const FILE_UPLOAD_URL = '/tools/results-cleaner';
const FILE_INPUT_SELECTOR = '[data-testid="file-input"]';
const DROP_AREA_SELECTOR = '[data-testid="file-drop-area"]';
const IMPORT_BUTTON_SELECTOR = '[data-testid="import-file-button"]';
const DATA_TABLE_SELECTOR = '[data-testid="data-table-root"]';
const PASTE_DATA_BTN_SELECTOR = '[data-testid="paste-data-open-btn"]';
const PASTE_DATA_TEXTAREA_SELECTOR = '[data-testid="paste-data-textarea"]';

const fixtures = [
  {
    name: 'simple CSV',
    file: 'sample-simple.csv',
    checks: ['Alice', '30', 'Bob', '25'],
  },
  {
    name: 'complex CSV',
    file: 'sample-complex.csv',
    checks: ['Alice', 'NY', '100', 'Charlie', 'LA', ''],
  },
  {
    name: 'simple JSON',
    file: 'sample-simple.json',
    checks: ['Alice', '30', 'Bob', '25'],
  },
  {
    name: 'complex JSON',
    file: 'sample-complex.json',
    checks: ['Alice', 'NY', '10001', '[100,98]', 'Bob', 'LA', '[95,90]'],
  },
  {
    name: 'simple Markdown',
    file: 'sample-simple.md',
    checks: ['Alice', '30', 'Bob', '25'],
  },
  {
    name: 'complex Markdown',
    file: 'sample-complex.md',
    checks: ['Alice', 'NY', '100', 'Charlie', 'LA', ''],
  },
  {
    name: 'simple HTML',
    file: 'sample-simple.html',
    checks: ['Alice', '30', 'Bob', '25'],
  },
  {
    name: 'complex HTML',
    file: 'sample-complex.html',
    checks: ['Alice', 'NY', '100', 'Charlie', 'LA', ''],
  },
];

test.describe('File Upload', () => {
  for (const { name, file, checks } of fixtures) {
    test(`should upload and parse ${name} fixture`, async ({ page }) => {
      await page.goto(FILE_UPLOAD_URL);
      const filePath = path.resolve(__dirname, 'fixtures', file);

      await page.click(DROP_AREA_SELECTOR);
      await page.setInputFiles(FILE_INPUT_SELECTOR, filePath);
      await expect(page.locator(`text=Selected file: ${file}`)).toBeVisible();
      const importButton = page.locator(IMPORT_BUTTON_SELECTOR);
      await expect(importButton).toBeVisible();
      await expect(importButton).toBeEnabled();
      await importButton.click();
      const table = page.locator(DATA_TABLE_SELECTOR);
      for (const value of checks) {
        await expect(table).toContainText(value);
      }
    });
  }
});

test.describe('Paste Data', () => {
  for (const { name, file, checks } of fixtures) {
    test(`should paste and parse ${name} fixture`, async ({ page }) => {
      await page.goto(FILE_UPLOAD_URL);
      await page.click(PASTE_DATA_BTN_SELECTOR);
      const filePath = path.resolve(__dirname, 'fixtures', file);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      await page.fill(PASTE_DATA_TEXTAREA_SELECTOR, fileContent);
      const table = page.locator(DATA_TABLE_SELECTOR);
      for (const value of checks) {
        await expect(table).toContainText(value);
      }
    });
  }
});
