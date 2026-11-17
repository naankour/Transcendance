import { test, expect } from '@playwright/test';

test.describe('Home page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('renders the app with a page title', async ({ page }) => {
    await expect(page).toHaveTitle(/.+/);
    await expect(page.locator('#root')).not.toBeEmpty();
  });

  test('main navigation shows all expected entries', async ({ page }) => {
    for (const item of ['Movies', 'Reviews', 'Watchlist', 'Favorites', 'Profile']) {
      await expect(page.getByText(new RegExp(item, 'i')).first()).toBeVisible();
    }
  });

  test('log in button is visible', async ({ page }) => {
    await expect(page.getByText(/log in/i).first()).toBeVisible();
  });

  test('search bar accepts text input', async ({ page }) => {
    const search = page.getByPlaceholder(/search/i).first();
    await expect(search).toBeVisible();
    await search.fill('Inception');
    await expect(search).toHaveValue('Inception');
  });
});