/**
 * End-to-end tests for navigation functionality using Playwright
 */

import { test, expect } from '@playwright/test';

test.describe('Report Reading Navigation', () => {
  test('should have a Report Reading button on the leaderboard page', async ({ page }) => {
    // Navigate to the leaderboard page
    await page.goto('http://localhost:3000');
    
    // Check if the Report Reading button exists
    const reportButton = page.locator('.report-reading-button');
    await expect(reportButton).toBeVisible();
    await expect(reportButton).toContainText('Report Reading');
  });

  test('should navigate to report-reading.html when Report Reading button is clicked', async ({ page }) => {
    // Navigate to the leaderboard page
    await page.goto('http://localhost:3000');
    
    // Click the Report Reading button
    const reportButton = page.locator('.report-reading-button');
    await reportButton.click();
    
    // Check if we navigated to the correct page
    await expect(page).toHaveURL('http://localhost:3000/report-reading.html');
  });
});