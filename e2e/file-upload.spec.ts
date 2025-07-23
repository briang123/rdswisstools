import { test, expect } from '@playwright/test';
import path from 'path';

const FILE_UPLOAD_URL = '/tools/results-cleaner';
const FILE_INPUT_SELECTOR = '[data-testid="file-input"]';
const DROP_AREA_SELECTOR = '[data-testid="file-drop-area"]';
const IMPORT_BUTTON_SELECTOR = '[data-testid="import-file-button"]';
const SUCCESS_MESSAGE_TEXT = 'File uploaded successfully!';
const DEBUG_MSG_SELECTOR = '[data-testid="debug-msg"]';

test.describe('File Upload', () => {
  test('should upload a file and show success', async ({ page }) => {
    // Capture browser console logs
    page.on('console', (msg) => {
      // eslint-disable-next-line no-console
      console.log('BROWSER LOG:', msg.type(), msg.text());
    });

    await page.goto(FILE_UPLOAD_URL);
    const filePath = path.resolve(__dirname, 'fixtures', 'sample.csv');

    await page.click(DROP_AREA_SELECTOR);
    await page.setInputFiles(FILE_INPUT_SELECTOR, filePath);

    // Wait for the selected file name to appear (ensures React state is updated)
    await expect(page.locator('text=Selected file: sample.csv')).toBeVisible();

    // Now wait for the Import File button to appear and be enabled
    const importButton = page.locator(IMPORT_BUTTON_SELECTOR);
    await expect(importButton).toBeVisible();
    await expect(importButton).toBeEnabled();
    await importButton.click();

    // Wait for the upload complete message
    const debugMsg = page.locator(DEBUG_MSG_SELECTOR);
    await expect(debugMsg).toContainText('Upload complete');
    await expect(debugMsg).toContainText('sample.csv');
  });
});
