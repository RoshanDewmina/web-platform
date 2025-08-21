import { test, expect } from '@playwright/test';

test.describe('Student Learning Experience', () => {
  test.beforeEach(async ({ page }) => {
    // Mock student authentication
    // await signInAsStudent(page);
  });

  test('should browse course catalog', async ({ page }) => {
    await page.goto('/learn');
    
    // Check for course cards
    await expect(page.locator('.course-card').first()).toBeVisible();
    
    // Filter by category
    await page.click('[id="course-category"]');
    await page.click('text=Web Development');
    
    // Courses should be filtered
    await expect(page.locator('.course-card')).toHaveCount(3); // Assuming 3 web dev courses
    
    // Search for course
    await page.fill('input[placeholder*="Search courses"]', 'React');
    
    // Results should update
    await expect(page.locator('text=Introduction to React')).toBeVisible();
  });

  test('should enroll in a course', async ({ page }) => {
    await page.goto('/learn');
    
    // Click on a course card
    await page.click('text=Introduction to React');
    
    // Click enroll button
    await page.click('button:has-text("Enroll Now")');
    
    // Should show enrollment confirmation
    await expect(page.locator('text=Successfully enrolled')).toBeVisible();
    
    // Button should change to "Continue Learning"
    await expect(page.locator('button:has-text("Continue Learning")')).toBeVisible();
  });

  test('should navigate through course content', async ({ page }) => {
    await page.goto('/learn/course/react-basics');
    
    // Check course structure
    await expect(page.locator('text=Module 1')).toBeVisible();
    
    // Click on first lesson
    await page.click('text=Lesson 1: Introduction');
    
    // Lesson content should load
    await expect(page.locator('.lesson-content')).toBeVisible();
    
    // Navigate to next slide
    await page.click('button:has-text("Next")');
    
    // Should show next slide
    await expect(page.locator('text=Slide 2')).toBeVisible();
    
    // Navigate back
    await page.click('button:has-text("Previous")');
    await expect(page.locator('text=Slide 1')).toBeVisible();
  });

  test('should track progress through lessons', async ({ page }) => {
    await page.goto('/learn/course/react-basics/lesson/1');
    
    // Complete all slides
    for (let i = 0; i < 5; i++) {
      await page.click('button:has-text("Next")');
      await page.waitForTimeout(500); // Simulate reading time
    }
    
    // Click complete lesson
    await page.click('button:has-text("Complete Lesson")');
    
    // Progress should update
    await expect(page.locator('text=Lesson completed')).toBeVisible();
    
    // XP should be awarded
    await expect(page.locator('text=+10 XP')).toBeVisible();
    
    // Next lesson should unlock
    await expect(page.locator('text=Lesson 2').locator('..').locator('svg.lock')).not.toBeVisible();
  });

  test('should handle locked content', async ({ page }) => {
    await page.goto('/learn/course/react-basics');
    
    // Try to access locked lesson
    await page.click('text=Lesson 5: Advanced Topics');
    
    // Should show lock message
    await expect(page.locator('text=Complete previous lessons to unlock')).toBeVisible();
    
    // Lesson should not load
    await expect(page.url()).not.toContain('lesson/5');
  });
});

test.describe('Assessment and Quizzes', () => {
  test('should take a quiz', async ({ page }) => {
    await page.goto('/learn/course/react-basics/quiz/1');
    
    // Start quiz
    await page.click('button:has-text("Start Quiz")');
    
    // Answer question 1
    await expect(page.locator('text=Question 1')).toBeVisible();
    await page.click('label:has-text("A JavaScript library")');
    await page.click('button:has-text("Next")');
    
    // Answer question 2
    await expect(page.locator('text=Question 2')).toBeVisible();
    await page.click('label:has-text("True")');
    await page.click('button:has-text("Next")');
    
    // Submit quiz
    await page.click('button:has-text("Submit Quiz")');
    
    // Show results
    await expect(page.locator('text=Quiz Results')).toBeVisible();
    await expect(page.locator('text=Score:')).toBeVisible();
  });

  test('should show immediate feedback', async ({ page }) => {
    await page.goto('/learn/course/react-basics/quiz/1');
    
    await page.click('button:has-text("Start Quiz")');
    
    // Select wrong answer
    await page.click('label:has-text("A database")');
    await page.click('button:has-text("Check Answer")');
    
    // Should show feedback
    await expect(page.locator('text=Incorrect')).toBeVisible();
    await expect(page.locator('text=React is a JavaScript library')).toBeVisible();
  });

  test('should enforce quiz time limits', async ({ page }) => {
    await page.goto('/learn/course/react-basics/quiz/timed');
    
    // Start timed quiz
    await page.click('button:has-text("Start Timed Quiz")');
    
    // Timer should be visible
    await expect(page.locator('text=Time remaining:')).toBeVisible();
    
    // Wait for timer to expire (in test, use shorter time)
    await page.waitForTimeout(5000);
    
    // Quiz should auto-submit
    await expect(page.locator('text=Time expired')).toBeVisible();
    await expect(page.locator('text=Quiz Results')).toBeVisible();
  });

  test('should limit quiz attempts', async ({ page }) => {
    await page.goto('/learn/course/react-basics/quiz/limited');
    
    // Assume 2 attempts already used
    await expect(page.locator('text=Attempts: 2/3')).toBeVisible();
    
    // Take quiz
    await page.click('button:has-text("Start Quiz")');
    // Complete quiz...
    await page.click('button:has-text("Submit Quiz")');
    
    // Should show final attempt used
    await expect(page.locator('text=Attempts: 3/3')).toBeVisible();
    
    // Retake button should be disabled
    await expect(page.locator('button:has-text("Retake Quiz")')).toBeDisabled();
  });
});

test.describe('Progress Tracking', () => {
  test('should display progress dashboard', async ({ page }) => {
    await page.goto('/progress');
    
    // Check for progress elements
    await expect(page.locator('text=Total XP')).toBeVisible();
    await expect(page.locator('text=Current Streak')).toBeVisible();
    await expect(page.locator('text=Lessons Completed')).toBeVisible();
    
    // Check for charts
    await expect(page.locator('.recharts-wrapper')).toBeVisible();
  });

  test('should show course-specific progress', async ({ page }) => {
    await page.goto('/learn/course/react-basics');
    
    // Progress bar should be visible
    await expect(page.locator('[role="progressbar"]')).toBeVisible();
    
    // Check progress percentage
    await expect(page.locator('text=75%')).toBeVisible();
    
    // Modules should show completion status
    await expect(page.locator('text=Module 1').locator('..').locator('svg.check')).toBeVisible();
  });

  test('should update streak counter', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Check current streak
    const streakElement = page.locator('text=Current Streak').locator('..');
    await expect(streakElement).toContainText('7 days');
    
    // Complete a lesson to maintain streak
    await page.goto('/learn/course/react-basics/lesson/new');
    await page.click('button:has-text("Complete Lesson")');
    
    // Streak should be maintained
    await page.goto('/dashboard');
    await expect(streakElement).toContainText('7 days');
  });
});

test.describe('Gamification Features', () => {
  test('should earn achievements', async ({ page }) => {
    await page.goto('/learn/course/react-basics/lesson/1');
    
    // Complete first lesson
    await page.click('button:has-text("Complete Lesson")');
    
    // Achievement notification should appear
    await expect(page.locator('text=Achievement Unlocked!')).toBeVisible();
    await expect(page.locator('text=First Steps')).toBeVisible();
    await expect(page.locator('text=+50 XP')).toBeVisible();
  });

  test('should display leaderboard', async ({ page }) => {
    await page.goto('/progress');
    
    // Navigate to leaderboard tab
    await page.click('tab:has-text("Leaderboard")');
    
    // Leaderboard should be visible
    await expect(page.locator('text=#1')).toBeVisible();
    
    // User's position should be highlighted
    await expect(page.locator('.bg-primary').locator('text=You')).toBeVisible();
    
    // Toggle to friends only
    await page.click('button:has-text("Friends Only")');
    
    // Should filter leaderboard
    await expect(page.locator('.leaderboard-entry')).toHaveCount(5); // Assuming 5 friends
  });

  test('should show XP animation on earn', async ({ page }) => {
    await page.goto('/learn/course/react-basics/lesson/2');
    
    // Complete action that awards XP
    await page.click('button:has-text("Complete Lesson")');
    
    // XP animation should play
    await expect(page.locator('.xp-animation')).toBeVisible();
    
    // XP counter should update
    const xpBefore = await page.locator('text=Total XP').locator('..').textContent();
    await page.waitForTimeout(1000); // Wait for animation
    const xpAfter = await page.locator('text=Total XP').locator('..').textContent();
    
    expect(xpAfter).not.toBe(xpBefore);
  });

  test('should trigger level up', async ({ page }) => {
    // Assume user is close to leveling up
    await page.goto('/learn/course/react-basics/lesson/10');
    
    // Complete lesson to gain XP
    await page.click('button:has-text("Complete Lesson")');
    
    // Level up animation should play
    await expect(page.locator('text=Level Up!')).toBeVisible();
    await expect(page.locator('text=You reached Level 13')).toBeVisible();
    
    // New level should be displayed
    await page.goto('/dashboard');
    await expect(page.locator('text=Level 13')).toBeVisible();
  });
});

test.describe('Mobile Learning Experience', () => {
  test.use({ viewport: { width: 375, height: 667 } });

  test('should be responsive on mobile', async ({ page }) => {
    await page.goto('/learn');
    
    // Mobile menu should be visible
    await expect(page.locator('button[aria-label="Menu"]')).toBeVisible();
    
    // Course cards should stack vertically
    const courseCards = page.locator('.course-card');
    const firstCard = await courseCards.first().boundingBox();
    const secondCard = await courseCards.nth(1).boundingBox();
    
    // Second card should be below first card
    expect(secondCard?.y).toBeGreaterThan(firstCard?.y || 0);
  });

  test('should handle touch interactions', async ({ page }) => {
    await page.goto('/learn/course/react-basics/lesson/1');
    
    // Swipe to next slide (simulate touch)
    await page.locator('.lesson-content').swipe({ direction: 'left' });
    
    // Should navigate to next slide
    await expect(page.locator('text=Slide 2')).toBeVisible();
    
    // Swipe back
    await page.locator('.lesson-content').swipe({ direction: 'right' });
    await expect(page.locator('text=Slide 1')).toBeVisible();
  });
});
