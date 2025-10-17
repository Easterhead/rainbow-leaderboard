/**
 * End-to-end tests for Report Reading page functionality using Playwright
 */

import { test, expect } from '@playwright/test';

test.describe('Report Reading Page - User Selection', () => {
  test('should display "Who are you?" header on report reading page', async ({ page }) => {
    // Navigate to the report reading page
    await page.goto('http://localhost:3000/report-reading.html');
    
    // Check if the "Who are you?" header exists
    const header = page.locator('h2').filter({ hasText: 'Who are you?' });
    await expect(header).toBeVisible();
  });

  test('should display a list of users with avatars and names', async ({ page }) => {
    // Navigate to the report reading page
    await page.goto('http://localhost:3000/report-reading.html');
    
    // Check if user list container exists
    const userList = page.locator('.user-list');
    await expect(userList).toBeVisible();
    
    // Check if at least one user item exists
    const userItems = page.locator('.user-item');
    await expect(userItems.first()).toBeVisible();
    
    // Check the first user item has avatar and name
    const firstUser = userItems.first();
    await expect(firstUser.locator('.user-avatar')).toBeVisible();
    await expect(firstUser.locator('.user-name')).toBeVisible();
  });

});