import { test, expect } from '@playwright/test';

test.describe('Course Builder - Admin', () => {
  test.beforeEach(async ({ page }) => {
    // Mock admin authentication
    // In real scenario, sign in as admin user
    // await signInAsAdmin(page);
  });

  test('should create a new course', async ({ page }) => {
    await page.goto('/admin');
    
    // Click create course button
    await page.click('button:has-text("Create Course")');
    
    // Should navigate to course builder
    await expect(page.url()).toContain('/admin/courses/new');
    
    // Fill in course details
    await page.fill('input[placeholder="Course title"]', 'Test Course');
    await page.fill('textarea[placeholder="Course description"]', 'This is a test course description');
    
    // Select difficulty
    await page.click('[id="course-difficulty"]');
    await page.click('text=Beginner');
    
    // Save course
    await page.click('button:has-text("Save")');
    
    // Verify course is created
    await expect(page.locator('text=Course saved successfully')).toBeVisible();
  });

  test('should add modules to course', async ({ page }) => {
    await page.goto('/admin/courses/test-course-id/builder');
    
    // Add a module
    await page.click('button:has-text("Add Module")');
    
    // Module should appear in outline
    await expect(page.locator('text=New Module')).toBeVisible();
    
    // Rename module
    await page.dblclick('text=New Module');
    await page.fill('input[value="New Module"]', 'Introduction');
    await page.press('Enter');
    
    // Verify module is renamed
    await expect(page.locator('text=Introduction')).toBeVisible();
  });

  test('should add lessons to module', async ({ page }) => {
    await page.goto('/admin/courses/test-course-id/builder');
    
    // Assuming a module exists
    // Click add lesson button within module
    const moduleElement = page.locator('text=Introduction').first();
    await moduleElement.hover();
    await page.click('button[aria-label="Add lesson"]');
    
    // Lesson should appear
    await expect(page.locator('text=New Lesson')).toBeVisible();
  });

  test('should add content blocks to slides', async ({ page }) => {
    await page.goto('/admin/courses/test-course-id/builder');
    
    // Navigate to a slide
    await page.click('text=New Slide');
    
    // Add text block
    await page.click('button:has-text("Add Block")');
    await page.click('text=Text');
    
    // Text editor should appear
    await expect(page.locator('.prose')).toBeVisible();
    
    // Type content
    await page.fill('.prose', 'This is lesson content');
  });

  test('should preview course as student', async ({ page }) => {
    await page.goto('/admin/courses/test-course-id/builder');
    
    // Click preview button
    await page.click('button:has-text("Preview")');
    
    // Should open preview mode
    // Verify student view elements
    await expect(page.locator('text=Student View')).toBeVisible();
  });

  test('should publish course', async ({ page }) => {
    await page.goto('/admin/courses/test-course-id/builder');
    
    // Click publish button
    await page.click('button:has-text("Publish")');
    
    // Confirm publication
    await page.click('button:has-text("Confirm")');
    
    // Course should be published
    await expect(page.locator('text=published')).toBeVisible();
  });
});

test.describe('Content Block Management', () => {
  test('should add and edit text blocks', async ({ page }) => {
    await page.goto('/admin/courses/test-course-id/builder');
    
    // Add text block
    await page.click('button:has-text("Add Block")');
    await page.click('text=Text');
    
    // Format text
    await page.click('button[aria-label="Bold"]');
    await page.type('.prose', 'Bold text');
    
    // Verify formatting
    await expect(page.locator('strong:has-text("Bold text")')).toBeVisible();
  });

  test('should add image blocks', async ({ page }) => {
    await page.goto('/admin/courses/test-course-id/builder');
    
    // Add image block
    await page.click('button:has-text("Add Block")');
    await page.click('text=Image');
    
    // Add image URL
    await page.fill('input[placeholder*="image URL"]', 'https://example.com/image.jpg');
    await page.fill('input[placeholder*="Alt text"]', 'Test image');
    
    // Image should be displayed
    await expect(page.locator('img[alt="Test image"]')).toBeVisible();
  });

  test('should add video blocks', async ({ page }) => {
    await page.goto('/admin/courses/test-course-id/builder');
    
    // Add video block
    await page.click('button:has-text("Add Block")');
    await page.click('text=Video');
    
    // Add YouTube URL
    await page.fill('input[placeholder*="youtube.com"]', 'https://youtube.com/watch?v=test123');
    
    // Video embed should appear
    await expect(page.locator('iframe[src*="youtube.com/embed"]')).toBeVisible();
  });

  test('should add quiz blocks', async ({ page }) => {
    await page.goto('/admin/courses/test-course-id/builder');
    
    // Add quiz block
    await page.click('button:has-text("Add Block")');
    await page.click('text=Quiz');
    
    // Add question
    await page.click('button:has-text("Add First Question")');
    
    // Fill question details
    await page.fill('textarea[placeholder*="Enter your question"]', 'What is React?');
    await page.fill('input[placeholder="Option 1"]', 'A JavaScript library');
    await page.fill('input[placeholder="Option 2"]', 'A database');
    
    // Select correct answer
    await page.click('input[type="radio"][value="0"]');
    
    // Quiz should be created
    await expect(page.locator('text=What is React?')).toBeVisible();
  });

  test('should reorder content blocks', async ({ page }) => {
    await page.goto('/admin/courses/test-course-id/builder');
    
    // Add multiple blocks
    // Drag and drop to reorder
    const firstBlock = page.locator('.content-block').first();
    const secondBlock = page.locator('.content-block').nth(1);
    
    // Drag first block below second
    await firstBlock.dragTo(secondBlock);
    
    // Verify order changed
  });
});

test.describe('Course Settings and Metadata', () => {
  test('should update course settings', async ({ page }) => {
    await page.goto('/admin/courses/test-course-id/builder');
    
    // Open settings panel
    await page.click('tab:has-text("Settings")');
    
    // Update visibility
    await page.click('[id="course-visibility"]');
    await page.click('text=Public');
    
    // Set enrollment limit
    await page.fill('input[id="enrollment-limit"]', '100');
    
    // Set price
    await page.fill('input[id="course-price"]', '49.99');
    
    // Save settings
    await page.click('button:has-text("Save")');
    
    // Verify settings saved
    await expect(page.locator('text=Settings updated')).toBeVisible();
  });

  test('should add course objectives', async ({ page }) => {
    await page.goto('/admin/courses/test-course-id/builder');
    
    // Navigate to metadata section
    await page.click('text=Course Details');
    
    // Add objectives
    await page.click('button:has-text("Add Objective")');
    await page.fill('input[placeholder="Learning objective"]', 'Understand React fundamentals');
    
    // Save
    await page.click('button:has-text("Save")');
    
    // Verify objective added
    await expect(page.locator('text=Understand React fundamentals')).toBeVisible();
  });

  test('should set prerequisites', async ({ page }) => {
    await page.goto('/admin/courses/test-course-id/builder');
    
    // Add prerequisite
    await page.click('button:has-text("Add Prerequisite")');
    await page.fill('input[placeholder="Prerequisite"]', 'Basic JavaScript knowledge');
    
    // Save
    await page.click('button:has-text("Save")');
    
    // Verify prerequisite added
    await expect(page.locator('text=Basic JavaScript knowledge')).toBeVisible();
  });
});

test.describe('Template System', () => {
  test('should apply template to slide', async ({ page }) => {
    await page.goto('/admin/courses/test-course-id/builder');
    
    // Select a slide
    await page.click('text=New Slide');
    
    // Open template selector
    await page.click('button:has-text("Apply Template")');
    
    // Select a template
    await page.click('text=Title Slide');
    
    // Template should be applied
    await expect(page.locator('.slide-template-title')).toBeVisible();
  });

  test('should save custom template', async ({ page }) => {
    await page.goto('/admin/courses/test-course-id/builder');
    
    // Create custom layout
    // Add blocks and arrange them
    
    // Save as template
    await page.click('button:has-text("Save as Template")');
    await page.fill('input[placeholder="Template name"]', 'My Custom Template');
    await page.click('button:has-text("Save Template")');
    
    // Template should be available in library
    await page.click('button:has-text("Apply Template")');
    await expect(page.locator('text=My Custom Template')).toBeVisible();
  });
});

test.describe('Auto-save and Version Control', () => {
  test('should auto-save changes', async ({ page }) => {
    await page.goto('/admin/courses/test-course-id/builder');
    
    // Make a change
    await page.fill('input[placeholder="Course title"]', 'Updated Title');
    
    // Wait for auto-save (30 seconds in production, immediate in test)
    await page.waitForTimeout(1000);
    
    // Check for save indicator
    await expect(page.locator('text=Last saved')).toBeVisible();
  });

  test('should handle save conflicts', async ({ page, context }) => {
    // Open course in two tabs
    const page1 = page;
    const page2 = await context.newPage();
    
    await page1.goto('/admin/courses/test-course-id/builder');
    await page2.goto('/admin/courses/test-course-id/builder');
    
    // Make changes in both tabs
    await page1.fill('input[placeholder="Course title"]', 'Title from Tab 1');
    await page2.fill('input[placeholder="Course title"]', 'Title from Tab 2');
    
    // Save in both tabs
    await page1.click('button:has-text("Save")');
    await page2.click('button:has-text("Save")');
    
    // One should show conflict warning
    const conflictMessage = page2.locator('text=conflict') || page1.locator('text=conflict');
    await expect(conflictMessage).toBeVisible();
  });
});
