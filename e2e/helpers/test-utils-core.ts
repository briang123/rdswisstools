import { expect, Page } from '@playwright/test';

export async function expectUrlContains(page: Page, substring: string) {
  await expect(page).toHaveURL(new RegExp(substring));
}
