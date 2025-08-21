# Comprehensive Testing Guide for EduLearn Platform

## 📋 Table of Contents
- [Testing Overview](#testing-overview)
- [Test Setup](#test-setup)
- [Running Tests](#running-tests)
- [Unit Testing](#unit-testing)
- [Integration Testing](#integration-testing)
- [End-to-End Testing](#end-to-end-testing)
- [Performance Testing](#performance-testing)
- [Security Testing](#security-testing)
- [Manual Testing Checklist](#manual-testing-checklist)

## 🎯 Testing Overview

The EduLearn platform implements a comprehensive testing strategy covering:
- **Unit Tests**: Individual component and function testing
- **Integration Tests**: API and database interaction testing
- **E2E Tests**: Complete user journey testing
- **Performance Tests**: Load and scalability testing
- **Security Tests**: Authentication and authorization testing
- **Accessibility Tests**: WCAG compliance testing

### Test Coverage Goals
- Unit Tests: 80%+ coverage
- Integration Tests: All API endpoints
- E2E Tests: Critical user journeys
- Performance: < 3s page load time
- Accessibility: WCAG 2.1 AA compliance

## 🛠️ Test Setup

### Prerequisites
```bash
# Install testing dependencies (already included in package.json)
npm install

# Install Playwright browsers
npx playwright install

# Set up test database (optional)
DATABASE_URL="postgresql://test:test@localhost:5432/edulearn_test" npx prisma migrate dev
```

### Environment Variables
Create a `.env.test` file:
```env
# Test environment variables
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=test_pk_test
CLERK_SECRET_KEY=test_sk_test
DATABASE_URL=postgresql://test:test@localhost:5432/edulearn_test
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🚀 Running Tests

### Quick Commands
```bash
# Run all unit tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui

# Debug E2E tests
npm run test:e2e:debug

# Run all tests
npm run test:all
```

### Specific Test Suites
```bash
# Run specific test file
npm test -- course-builder.test.tsx

# Run tests matching pattern
npm test -- --testNamePattern="Authentication"

# Run E2E tests for specific browser
npx playwright test --project=chromium

# Run E2E tests for specific file
npx playwright test e2e/auth.spec.ts
```

## 🧪 Unit Testing

### Component Testing Examples

#### Testing Course Builder Components
```typescript
// Test: Course outline renders correctly
test('renders course modules', () => {
  render(<CourseOutline course={mockCourse} />);
  expect(screen.getByText('Module 1')).toBeInTheDocument();
});

// Test: Adding content blocks
test('adds text block to slide', () => {
  const { getByText } = render(<ContentCanvas slide={mockSlide} />);
  fireEvent.click(getByText('Add Block'));
  fireEvent.click(getByText('Text'));
  expect(screen.getByRole('textbox')).toBeInTheDocument();
});
```

#### Testing Authentication
```typescript
// Test: User role verification
test('identifies admin users', () => {
  const user = { role: 'admin' };
  expect(isAdmin(user)).toBe(true);
});

// Test: Protected route access
test('redirects unauthenticated users', () => {
  const result = checkAuth(null);
  expect(result.redirect).toBe('/sign-in');
});
```

#### Testing Gamification Logic
```typescript
// Test: XP calculation
test('calculates level from XP', () => {
  expect(calculateLevel(2450)).toBe(12);
});

// Test: Achievement conditions
test('awards streak achievement', () => {
  const user = { currentStreak: 7 };
  expect(checkAchievement('week-warrior', user)).toBe(true);
});
```

### Utility Function Testing
```typescript
// Test: Date formatting
test('formats date correctly', () => {
  const date = new Date('2024-01-15');
  expect(formatDate(date)).toBe('January 15, 2024');
});

// Test: Progress calculation
test('calculates course progress', () => {
  const progress = calculateProgress(24, 32);
  expect(progress).toBe(75);
});
```

## 🔄 Integration Testing

### API Route Testing
```typescript
// Test: Course creation
test('POST /api/courses creates course', async () => {
  const response = await request(app)
    .post('/api/courses')
    .send({ title: 'New Course' })
    .expect(201);
  
  expect(response.body.title).toBe('New Course');
});

// Test: Enrollment
test('POST /api/courses/:id/enroll', async () => {
  const response = await request(app)
    .post('/api/courses/123/enroll')
    .set('Authorization', 'Bearer token')
    .expect(200);
  
  expect(response.body.enrolled).toBe(true);
});
```

### Database Testing
```typescript
// Test: User creation
test('creates user with metadata', async () => {
  const user = await prisma.user.create({
    data: {
      clerkId: 'clerk_123',
      email: 'test@example.com',
      xp: 0,
      level: 1,
    },
  });
  
  expect(user.id).toBeDefined();
  expect(user.level).toBe(1);
});

// Test: Progress tracking
test('updates lesson progress', async () => {
  const progress = await prisma.progress.create({
    data: {
      userId: 'user_123',
      lessonId: 'lesson_123',
      completed: true,
      timeSpent: 300,
    },
  });
  
  expect(progress.completed).toBe(true);
});
```

## 🎭 End-to-End Testing

### Critical User Journeys

#### 1. New Student Onboarding
```typescript
test('complete student onboarding', async ({ page }) => {
  // Sign up
  await page.goto('/sign-up');
  await page.fill('[name="email"]', 'student@test.com');
  await page.fill('[name="password"]', 'Test123!');
  await page.click('button[type="submit"]');
  
  // Complete profile
  await page.fill('[name="bio"]', 'Eager to learn!');
  await page.click('button:has-text("Continue")');
  
  // Browse courses
  await page.goto('/learn');
  await page.click('.course-card:first-child');
  
  // Enroll
  await page.click('button:has-text("Enroll")');
  
  // Start learning
  await page.click('button:has-text("Start Learning")');
  
  // Verify lesson loads
  await expect(page.locator('.lesson-content')).toBeVisible();
});
```

#### 2. Admin Course Creation
```typescript
test('create and publish course', async ({ page }) => {
  // Sign in as admin
  await signInAsAdmin(page);
  
  // Navigate to course builder
  await page.goto('/admin/courses/new');
  
  // Add course details
  await page.fill('[name="title"]', 'E2E Test Course');
  await page.fill('[name="description"]', 'Test description');
  
  // Add module
  await page.click('button:has-text("Add Module")');
  await page.fill('.module-title', 'Module 1');
  
  // Add lesson
  await page.click('button:has-text("Add Lesson")');
  await page.fill('.lesson-title', 'Lesson 1');
  
  // Add content
  await page.click('button:has-text("Add Block")');
  await page.click('text=Text');
  await page.fill('.content-editor', 'Lesson content');
  
  // Save and publish
  await page.click('button:has-text("Save")');
  await page.click('button:has-text("Publish")');
  
  // Verify publication
  await expect(page.locator('text=published')).toBeVisible();
});
```

#### 3. Social Interaction Flow
```typescript
test('add friend and interact', async ({ page }) => {
  // Search for friend
  await page.goto('/social');
  await page.fill('[placeholder*="Search"]', 'John');
  
  // Send friend request
  await page.click('button:has-text("Add Friend")');
  
  // View friend activity
  await page.click('tab:has-text("Friends")');
  await expect(page.locator('text=John Doe')).toBeVisible();
  
  // Check leaderboard
  await page.goto('/progress');
  await page.click('tab:has-text("Leaderboard")');
  await expect(page.locator('text=John Doe')).toBeVisible();
});
```

## ⚡ Performance Testing

### Load Testing Script
```javascript
// k6 load test script
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // Ramp up
    { duration: '5m', target: 100 }, // Stay at 100 users
    { duration: '2m', target: 0 },   // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<3000'], // 95% of requests under 3s
    http_req_failed: ['rate<0.1'],     // Error rate under 10%
  },
};

export default function () {
  // Test course listing
  let response = http.get('https://app.edulearn.com/api/courses');
  check(response, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });
  
  sleep(1);
  
  // Test lesson content
  response = http.get('https://app.edulearn.com/api/lessons/123');
  check(response, {
    'content loads': (r) => r.status === 200,
  });
  
  sleep(1);
}
```

### Performance Metrics to Monitor
- **Page Load Time**: < 3 seconds (95th percentile)
- **Time to Interactive**: < 5 seconds
- **API Response Time**: < 500ms average
- **Database Query Time**: < 100ms average
- **CDN Response Time**: < 200ms
- **WebSocket Latency**: < 100ms

## 🔒 Security Testing

### Authentication Tests
```typescript
// Test: SQL injection prevention
test('prevents SQL injection', async () => {
  const maliciousInput = "'; DROP TABLE users; --";
  const response = await request(app)
    .post('/api/login')
    .send({ email: maliciousInput })
    .expect(400);
  
  // Verify database is intact
  const users = await prisma.user.count();
  expect(users).toBeGreaterThan(0);
});

// Test: XSS prevention
test('sanitizes user input', async () => {
  const xssPayload = '<script>alert("XSS")</script>';
  const response = await request(app)
    .post('/api/courses')
    .send({ title: xssPayload })
    .expect(201);
  
  expect(response.body.title).not.toContain('<script>');
});

// Test: Rate limiting
test('enforces rate limits', async () => {
  // Make 100 rapid requests
  const requests = Array(100).fill(null).map(() =>
    request(app).get('/api/courses')
  );
  
  const responses = await Promise.all(requests);
  const rateLimited = responses.filter(r => r.status === 429);
  
  expect(rateLimited.length).toBeGreaterThan(0);
});
```

## ♿ Accessibility Testing

### Automated Accessibility Tests
```typescript
// Using jest-axe
import { axe, toHaveNoViolations } from 'jest-axe';

test('dashboard is accessible', async () => {
  const { container } = render(<Dashboard />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

// Playwright accessibility
test('course page meets WCAG standards', async ({ page }) => {
  await page.goto('/learn/course/123');
  
  // Check color contrast
  const violations = await page.evaluate(() => {
    // Run axe-core
    return window.axe.run();
  });
  
  expect(violations.violations).toHaveLength(0);
});
```

### Manual Accessibility Checklist
- [ ] Keyboard navigation works for all interactive elements
- [ ] Screen reader announces all content correctly
- [ ] Color contrast ratio ≥ 4.5:1 for normal text
- [ ] Color contrast ratio ≥ 3:1 for large text
- [ ] Focus indicators are visible
- [ ] Images have alt text
- [ ] Videos have captions
- [ ] Forms have proper labels
- [ ] Error messages are announced
- [ ] Page has proper heading hierarchy

## 📝 Manual Testing Checklist

### Critical Flows to Test Manually

#### Authentication
- [ ] Sign up with email
- [ ] Sign up with social providers
- [ ] Sign in with correct credentials
- [ ] Sign in with incorrect credentials
- [ ] Password reset flow
- [ ] Email verification
- [ ] Session persistence
- [ ] Sign out

#### Course Management (Admin)
- [ ] Create new course
- [ ] Add modules and lessons
- [ ] Upload media files
- [ ] Create quizzes
- [ ] Preview as student
- [ ] Publish course
- [ ] Edit published course
- [ ] Archive course

#### Learning Experience
- [ ] Browse course catalog
- [ ] Search and filter courses
- [ ] Enroll in course
- [ ] Navigate lessons
- [ ] Watch videos
- [ ] Complete quizzes
- [ ] Track progress
- [ ] Earn achievements

#### Social Features
- [ ] Send friend requests
- [ ] Accept/reject requests
- [ ] View friend activity
- [ ] Join study groups
- [ ] Post in forums
- [ ] View leaderboards

#### Mobile Experience
- [ ] Responsive layout
- [ ] Touch interactions
- [ ] Offline mode
- [ ] Performance on 3G
- [ ] Cross-browser compatibility

## 📊 Test Reporting

### Coverage Reports
```bash
# Generate coverage report
npm run test:coverage

# View HTML report
open coverage/lcov-report/index.html
```

### E2E Test Reports
```bash
# Run tests with HTML report
npx playwright test --reporter=html

# View report
npx playwright show-report
```

### Continuous Integration
```yaml
# GitHub Actions example
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm ci
      - run: npm test
      - run: npx playwright install
      - run: npm run test:e2e
```

## 🎯 Success Criteria

### Test Pass Rates
- Unit Tests: 100% pass rate
- Integration Tests: 100% pass rate
- E2E Tests: 95%+ pass rate (flaky tests investigated)

### Performance Benchmarks
- Page Load: < 3s (95th percentile)
- API Response: < 500ms (average)
- Database Queries: < 100ms (average)

### Quality Metrics
- Code Coverage: 80%+
- Zero critical bugs in production
- Zero security vulnerabilities
- WCAG 2.1 AA compliance

## 🚨 Troubleshooting

### Common Issues and Solutions

#### Tests Failing Locally
```bash
# Clear test cache
npm test -- --clearCache

# Update snapshots
npm test -- -u

# Run with verbose output
npm test -- --verbose
```

#### E2E Tests Timing Out
```javascript
// Increase timeout in test
test.setTimeout(60000);

// Or in config
use: {
  timeout: 60000,
}
```

#### Database Connection Issues
```bash
# Reset test database
DATABASE_URL="..." npx prisma migrate reset --force

# Seed test data
npx prisma db seed
```

## 📚 Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Testing Library Docs](https://testing-library.com/docs/)
- [Playwright Documentation](https://playwright.dev/docs/intro)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Performance Testing with k6](https://k6.io/docs/)

---

For questions or issues with testing, please contact the development team or create an issue in the repository.
