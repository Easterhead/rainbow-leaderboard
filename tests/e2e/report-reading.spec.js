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

  test('should hide user list and show selected user when clicking on a user', async ({ page }) => {
    // Navigate to the report reading page
    await page.goto('http://localhost:3000/report-reading.html');
    
    // Click on the first user
    const firstUser = page.locator('.user-item').first();
    await firstUser.click();
    
    // Check that user list is hidden
    const userList = page.locator('.user-list');
    await expect(userList).toBeHidden();
    
    // Check that selected user container is visible
    const selectedUserContainer = page.locator('.selected-user-container');
    await expect(selectedUserContainer).toBeVisible();
    
    // Check that back button is visible
    const backButton = page.locator('.back-button');
    await expect(backButton).toBeVisible();
    await expect(backButton).toContainText('Back');
  });

  test('should show user list again when clicking back button', async ({ page }) => {
    // Navigate to the report reading page
    await page.goto('http://localhost:3000/report-reading.html');
    
    // Click on a user to select them
    const firstUser = page.locator('.user-item').first();
    await firstUser.click();
    
    // Click the back button
    const backButton = page.locator('.back-button');
    await backButton.click();
    
    // Check that user list is visible again
    const userList = page.locator('.user-list');
    await expect(userList).toBeVisible();
    
    // Check that selected user container is hidden
    const selectedUserContainer = page.locator('.selected-user-container');
    await expect(selectedUserContainer).toBeHidden();
  });

  test('should display report comment with user points when selecting a user', async ({ page }) => {
    // Navigate to the report reading page
    await page.goto('http://localhost:3000/report-reading.html');
    
    // Click on the first user (BookLover42 with 85 points)
    const firstUser = page.locator('.user-item').first();
    await firstUser.click();
    
    // Check that report comment header is visible
    const reportHeader = page.locator('h3').filter({ hasText: 'Report Comment' });
    await expect(reportHeader).toBeVisible();
    
    // Check that report comment shows correct format
    const reportComment = page.locator('.report-comment');
    await expect(reportComment).toBeVisible();
    await expect(reportComment).toContainText('Total: 85 = 85 points');
  });

  test('should display author selection dropdown when user is selected', async ({ page }) => {
    // Navigate to the report reading page
    await page.goto('http://localhost:3000/report-reading.html');
    
    // Click on the first user
    const firstUser = page.locator('.user-item').first();
    await firstUser.click();
    
    // Check that chapter selection section is visible
    const chapterSection = page.locator('.chapter-selection-section');
    await expect(chapterSection).toBeVisible();
    
    // Check that author dropdown exists and has options
    const authorDropdown = page.locator('#author-dropdown');
    await expect(authorDropdown).toBeVisible();
    
    // Check that dropdown has multiple author options
    const authorOptions = page.locator('#author-dropdown option');
    const optionCount = await authorOptions.count();
    expect(optionCount).toBeGreaterThan(1); // Should have at least the placeholder + authors
  });

  test('should display book list when an author is selected', async ({ page }) => {
    // Navigate to the report reading page
    await page.goto('http://localhost:3000/report-reading.html');
    
    // Click on the first user
    const firstUser = page.locator('.user-item').first();
    await firstUser.click();
    
    // Select an author from the dropdown
    const authorDropdown = page.locator('#author-dropdown');
    await authorDropdown.selectOption({ index: 1 }); // Select first non-placeholder option
    
    // Check that book list container is visible
    const bookList = page.locator('.book-list');
    await expect(bookList).toBeVisible();
    
    // Check that books are displayed
    const bookItems = page.locator('.book-item');
    await expect(bookItems.first()).toBeVisible();
    
    // Check that book items have title
    const firstBook = bookItems.first();
    await expect(firstBook.locator('.book-title')).toBeVisible();
  });

  test('should display chapter list when a book is selected', async ({ page }) => {
    // Navigate to the report reading page
    await page.goto('http://localhost:3000/report-reading.html');
    
    // Click on the first user
    const firstUser = page.locator('.user-item').first();
    await firstUser.click();
    
    // Select an author from the dropdown
    const authorDropdown = page.locator('#author-dropdown');
    await authorDropdown.selectOption({ index: 1 }); // Select first non-placeholder option
    
    // Click on the first book
    const firstBook = page.locator('.book-item').first();
    await firstBook.click();
    
    // Check that chapter list container is visible
    const chapterList = page.locator('.chapter-list');
    await expect(chapterList).toBeVisible();
    
    // Check that chapters are displayed
    const chapterItems = page.locator('.chapter-item');
    await expect(chapterItems.first()).toBeVisible();
  });

  test('should update report comment when chapter is selected', async ({ page }) => {
    // Navigate to the report reading page
    await page.goto('http://localhost:3000/report-reading.html');
    
    // Click on the first user (BookLover42 with 85 points)
    const firstUser = page.locator('.user-item').first();
    await firstUser.click();
    
    // Select CemeteryFaerie (rainbow group, 3 points)
    const authorDropdown = page.locator('#author-dropdown');
    await authorDropdown.selectOption('CemeteryFaerie');
    
    // Click on "Mirror, Mirror" book
    const mirrorBook = page.locator('.book-item:has-text("Mirror, Mirror")');
    await mirrorBook.click();
    
    // Click on first chapter
    const firstChapter = page.locator('.chapter-item').first();
    await firstChapter.click();
    
    // Verify the report comment is updated
    const reportComment = page.locator('.report-comment');
    await expect(reportComment).toContainText('Total: 85 + 1x3 = 88');
    await expect(reportComment).toContainText('Mirror, Mirror by @CemeteryFaerie');
    await expect(reportComment).toContainText('rainbow 3 points');
    await expect(reportComment).toContainText('1 (Chapter 1: The Reflection)');
  });

  test('should show Selected Chapters list and add chapters when selected', async ({ page }) => {
    // Navigate to the report reading page
    await page.goto('http://localhost:3000/report-reading.html');
    
    // Click on the first user to show the selected user container
    const firstUser = page.locator('.user-item').first();
    await firstUser.click();
    
    // Verify Selected Chapters section exists
    const selectedChaptersSection = page.locator('.selected-chapters');
    await expect(selectedChaptersSection).toBeVisible();
    
    const selectedChaptersTitle = page.locator('.selected-chapters h3');
    await expect(selectedChaptersTitle).toContainText('Selected Chapters');
    
    // Select CemeteryFaerie (rainbow group, 3 points)
    const authorDropdown = page.locator('#author-dropdown');
    await authorDropdown.selectOption('CemeteryFaerie');
    
    // Click on "Mirror, Mirror" book
    const mirrorBook = page.locator('.book-item:has-text("Mirror, Mirror")');
    await mirrorBook.click();
    
    // Click on first chapter
    const firstChapter = page.locator('.chapter-item').first();
    await firstChapter.click();
    
    // Now verify the selected chapters list is visible and has content
    const selectedChaptersList = page.locator('.selected-chapters-list');
    await expect(selectedChaptersList).toBeVisible();
    await expect(selectedChaptersList.locator('.selected-chapter-item')).toHaveCount(1);
    
    // Verify the chapter appears in the selected list
    const selectedChapterItem = selectedChaptersList.locator('.selected-chapter-item').first();
    await expect(selectedChapterItem).toContainText('CemeteryFaerie - Mirror, Mirror - Chapter 1: The Reflection');
  });

  test('should prevent duplicate chapter selection', async ({ page }) => {
    // Navigate to the report reading page
    await page.goto('http://localhost:3000/report-reading.html');
    
    // Click on the first user
    const firstUser = page.locator('.user-item').first();
    await firstUser.click();
    
    // Select CemeteryFaerie (rainbow group, 3 points)
    const authorDropdown = page.locator('#author-dropdown');
    await authorDropdown.selectOption('CemeteryFaerie');
    
    // Click on "Mirror, Mirror" book
    const mirrorBook = page.locator('.book-item:has-text("Mirror, Mirror")');
    await mirrorBook.click();
    
    // Click on first chapter
    const firstChapter = page.locator('.chapter-item').first();
    await firstChapter.click();
    
    // Verify one chapter is selected
    const selectedChaptersList = page.locator('.selected-chapters-list');
    await expect(selectedChaptersList.locator('.selected-chapter-item')).toHaveCount(1);
    
    // Click the same chapter again
    await firstChapter.click();
    
    // Verify still only one chapter is selected (no duplicate)
    await expect(selectedChaptersList.locator('.selected-chapter-item')).toHaveCount(1);
    
    // Verify the chapter content is still correct
    const selectedChapterItem = selectedChaptersList.locator('.selected-chapter-item').first();
    await expect(selectedChapterItem).toContainText('CemeteryFaerie - Mirror, Mirror - Chapter 1: The Reflection');
  });

  test('should remove chapters when remove button is clicked', async ({ page }) => {
    // Navigate to the report reading page
    await page.goto('http://localhost:3000/report-reading.html');
    
    // Click on the first user
    const firstUser = page.locator('.user-item').first();
    await firstUser.click();
    
    // Select CemeteryFaerie (rainbow group, 3 points)
    const authorDropdown = page.locator('#author-dropdown');
    await authorDropdown.selectOption('CemeteryFaerie');
    
    // Click on "Mirror, Mirror" book
    const mirrorBook = page.locator('.book-item:has-text("Mirror, Mirror")');
    await mirrorBook.click();
    
    // Add first chapter
    const firstChapter = page.locator('.chapter-item').first();
    await firstChapter.click();
    
    // Add second chapter
    const secondChapter = page.locator('.chapter-item').nth(1);
    await secondChapter.click();
    
    // Verify two chapters are selected
    const selectedChaptersList = page.locator('.selected-chapters-list');
    await expect(selectedChaptersList.locator('.selected-chapter-item')).toHaveCount(2);
    
    // Click the remove button on the first chapter
    const firstRemoveButton = selectedChaptersList.locator('.remove-chapter').first();
    await firstRemoveButton.click();
    
    // Verify only one chapter remains
    await expect(selectedChaptersList.locator('.selected-chapter-item')).toHaveCount(1);
    
    // Verify the remaining chapter is the second one
    const remainingChapter = selectedChaptersList.locator('.selected-chapter-item').first();
    await expect(remainingChapter).toContainText('Chapter 2: Shattered Glass');
  });

});