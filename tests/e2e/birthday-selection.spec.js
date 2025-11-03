/**
 * End-to-end tests for Birthday chapter selection functionality
 */

import { test, expect } from '@playwright/test';

test.describe('Report Reading Page - Birthday Selection', () => {
  test('should display birthday checkbox for each chapter', async ({ page }) => {
    // Navigate to the report reading page
    await page.goto('http://localhost:3000/report-reading.html');
    
    // Click on first user
    const firstUser = page.locator('.user-item').first();
    await firstUser.click();
    
    // Select an author
    const authorDropdown = page.locator('#author-dropdown');
    await authorDropdown.selectOption('CemeteryFaerie');
    
    // Click on a book
    const firstBook = page.locator('.book-item').first();
    await firstBook.click();
    
    // Verify that each chapter item has a birthday checkbox
    const firstChapter = page.locator('.chapter-item').first();
    const birthdayCheckbox = firstChapter.locator('input[type="checkbox"].birthday-checkbox');
    await expect(birthdayCheckbox).toBeVisible();
  });

  test('should add chapter with birthday points when checkbox is checked', async ({ page }) => {
    // Navigate to the report reading page
    await page.goto('http://localhost:3000/report-reading.html');
    
    // Click on first user (BookLover42 with 85 points)
    const firstUser = page.locator('.user-item').first();
    await firstUser.click();
    
    // Select an author
    const authorDropdown = page.locator('#author-dropdown');
    await authorDropdown.selectOption('CemeteryFaerie');
    
    // Click on a book
    const firstBook = page.locator('.book-item').first();
    await firstBook.click();
    
    // Check the birthday checkbox on the first chapter
    const firstChapter = page.locator('.chapter-item').first();
    const birthdayCheckbox = firstChapter.locator('input[type="checkbox"].birthday-checkbox');
    await birthdayCheckbox.check();
    
    // Click the chapter to select it
    await firstChapter.click();
    
    // Verify the report comment shows birthday points (6 instead of rainbow 3)
    const reportComment = page.locator('.report-comment');
    await expect(reportComment).toContainText('birthday 6 points');
    await expect(reportComment).toContainText('Total: 85 + 1x6 = 91');
  });
});
