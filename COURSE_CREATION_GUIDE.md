# Course Creation Guide for Web Learning Platform

This guide explains how to create and manage courses in the multi-tenant learning platform.

## Table of Contents
- [Overview](#overview)
- [Prerequisites](#prerequisites)
- [Course Structure](#course-structure)
- [Methods to Create Courses](#methods-to-create-courses)
  - [Method 1: Admin Interface (Recommended)](#method-1-admin-interface-recommended)
  - [Method 2: API Integration](#method-2-api-integration)
  - [Method 3: Database Scripts](#method-3-database-scripts)
- [Database Schema](#database-schema)
- [Verifying Course Data](#verifying-course-data)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

## Overview

The learning platform is a multi-tenant application that allows you to create comprehensive courses with:
- 📚 Structured modules and lessons
- 🎨 Interactive slides with various content types
- 📝 Quizzes and assessments
- 🏆 Progress tracking and achievements
- 👥 Multi-user support with isolated data

## Prerequisites

Before creating courses, ensure you have:

1. **Docker services running:**
   ```bash
   docker-compose up -d
   ```

2. **Database migrated and ready:**
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

3. **Application running:**
   ```bash
   npm run dev
   # or for production
   docker-compose up web
   ```

## Course Structure

Courses follow a hierarchical structure:

```
Course
├── Module 1
│   ├── Lesson 1
│   │   ├── Slide 1
│   │   │   ├── Content Block 1 (Heading)
│   │   │   ├── Content Block 2 (Text)
│   │   │   └── Content Block 3 (Code)
│   │   ├── Slide 2
│   │   └── Quiz
│   └── Lesson 2
└── Module 2
    └── Lesson 3
```

## Methods to Create Courses

### Method 1: Admin Interface (Recommended)

The easiest way to create courses is through the visual admin interface.

1. **Navigate to Course Creation:**
   ```
   http://localhost:3000/admin/courses/new
   ```

2. **Fill in Course Details:**
   - Title (required)
   - Description (required)
   - Category (required)
   - Difficulty level
   - Estimated hours
   - Tags (comma-separated)
   - Thumbnail URL

3. **Create and Continue to Course Builder:**
   - Click "Create Course & Continue"
   - You'll be redirected to the Course Builder

4. **In the Course Builder:**
   - Add modules using the "Add Module" button
   - Add lessons to each module
   - Create slides for each lesson
   - Add content blocks to slides (text, code, images, etc.)
   - Add quizzes to test knowledge

### Method 2: API Integration

Create courses programmatically using the REST API.

#### Create a Course
```javascript
const response = await fetch('http://localhost:3000/api/courses', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: 'JavaScript Mastery',
    description: 'Complete JavaScript course from basics to advanced',
    category: 'Programming',
    difficulty: 'INTERMEDIATE',
    estimatedHours: 30,
    tags: ['javascript', 'web development', 'programming'],
    visibility: 'PUBLIC',
    price: 0,
    isPublished: false // Start as draft
  })
});

const course = await response.json();
console.log('Course ID:', course.id);
```

#### Add Modules and Lessons
Use the course ID to add modules and lessons through their respective API endpoints.

### Method 3: Database Scripts

For bulk course creation or migration, use database scripts.

1. **Use the provided script templates:**
   ```bash
   # Basic course creation
   node scripts/create-course-basic.js
   
   # Advanced course with all features
   node scripts/create-course.js
   ```

2. **Create your own script:**
   ```javascript
   const { PrismaClient } = require('@prisma/client');
   const prisma = new PrismaClient();

   async function createCourse() {
     const course = await prisma.course.create({
       data: {
         title: 'Your Course Title',
         description: 'Course description',
         // ... other fields
       }
     });
     
     // Add modules, lessons, etc.
   }
   ```

## Database Schema

### Key Tables

1. **Course**
   - `id`: Unique identifier
   - `title`: Course name
   - `description`: Course details
   - `difficulty`: BEGINNER | INTERMEDIATE | ADVANCED
   - `isPublished`: Publication status
   - `visibility`: PUBLIC | PRIVATE | UNLISTED

2. **Module**
   - `courseId`: Links to Course
   - `title`: Module name
   - `orderIndex`: Display order

3. **Lesson**
   - `moduleId`: Links to Module
   - `title`: Lesson name
   - `xpReward`: Experience points
   - `content`: JSON content structure

4. **Slide**
   - `lessonId`: Links to Lesson
   - `title`: Slide title
   - `gridLayout`: JSON layout data
   - `theme`: Visual theme settings

5. **ContentBlock**
   - `slideId`: Links to Slide
   - `type`: TEXT | CODE | IMAGE | VIDEO | QUIZ
   - `content`: JSON content data

## Verifying Course Data

### Check Course in Database
```bash
# List all courses
docker exec -it web-platform-db-1 psql -U postgres -d postgres -c "SELECT id, title, \"isPublished\" FROM \"Course\";"

# Check specific course structure
docker exec -it web-platform-db-1 psql -U postgres -d postgres -c "
SELECT 
  c.title as course,
  m.title as module,
  l.title as lesson,
  COUNT(s.id) as slides
FROM \"Course\" c
LEFT JOIN \"Module\" m ON m.\"courseId\" = c.id
LEFT JOIN \"Lesson\" l ON l.\"moduleId\" = m.id
LEFT JOIN \"Slide\" s ON s.\"lessonId\" = l.id
WHERE c.id = 'YOUR_COURSE_ID'
GROUP BY c.id, m.id, l.id
ORDER BY m.\"orderIndex\", l.\"orderIndex\";"
```

### Test Course Access
1. **Admin View:**
   ```
   http://localhost:3000/admin/courses/[courseId]/builder
   ```

2. **Student View:**
   ```
   http://localhost:3000/learn/course/[courseId]
   ```

3. **API Access:**
   ```bash
   curl http://localhost:3000/api/courses/[courseId]
   ```

## Best Practices

### Content Organization
- **Modules**: Group related topics (5-10 lessons per module)
- **Lessons**: Focus on single concepts (15-30 minutes each)
- **Slides**: Keep concise (5-10 slides per lesson)
- **Quizzes**: Add after each module for retention

### Content Types
- **Text Blocks**: Headers, paragraphs, lists
- **Code Blocks**: Include syntax highlighting
- **Media**: Use images and videos to enhance learning
- **Interactive Elements**: Quizzes, exercises

### Course Publishing
1. Start courses as drafts (`isPublished: false`)
2. Test thoroughly in preview mode
3. Publish when content is complete
4. Monitor student progress and feedback

## Troubleshooting

### Common Issues

1. **Database Connection Errors**
   ```bash
   # Check if PostgreSQL is running
   docker-compose ps
   
   # Restart database
   docker-compose restart db
   ```

2. **Schema Out of Sync**
   ```bash
   # Reset and sync database
   npx prisma db push --force-reset
   npx prisma generate
   ```

3. **Missing Environment Variables**
   Create a `.env` file with:
   ```
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"
   ```

4. **Port Conflicts**
   ```bash
   # Find process using port 3000
   lsof -i :3000
   
   # Kill process if needed
   kill -9 [PID]
   ```

### Debug Commands

```bash
# View Docker logs
docker-compose logs -f web

# Access PostgreSQL directly
docker exec -it web-platform-db-1 psql -U postgres

# Check Prisma schema status
npx prisma migrate status
```

## Example: Complete Course Creation

Here's a complete example of creating a course with all components:

```javascript
// scripts/example-course.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createCompleteCourse() {
  try {
    // 1. Create Course
    const course = await prisma.course.create({
      data: {
        title: "Full Stack Development",
        description: "Learn to build modern web applications",
        category: "Web Development",
        difficulty: "INTERMEDIATE",
        estimatedHours: 40,
        tags: ["fullstack", "react", "nodejs"],
        isPublished: false,
        visibility: "PUBLIC",
        price: 0
      }
    });

    // 2. Create Module
    const module = await prisma.module.create({
      data: {
        courseId: course.id,
        title: "Frontend Basics",
        description: "HTML, CSS, and JavaScript fundamentals",
        orderIndex: 0
      }
    });

    // 3. Create Lesson
    const lesson = await prisma.lesson.create({
      data: {
        moduleId: module.id,
        title: "Introduction to HTML",
        description: "Learn HTML basics",
        orderIndex: 0,
        xpReward: 10,
        duration: 15
      }
    });

    // 4. Create Slides
    const slide = await prisma.slide.create({
      data: {
        lessonId: lesson.id,
        title: "What is HTML?",
        orderIndex: 0,
        template: "standard"
      }
    });

    // 5. Add Content
    await prisma.contentBlock.create({
      data: {
        slideId: slide.id,
        type: "TEXT",
        content: {
          text: "HTML is the standard markup language for web pages",
          style: "paragraph"
        },
        orderIndex: 0
      }
    });

    // 6. Create Quiz
    const quiz = await prisma.quiz.create({
      data: {
        lessonId: lesson.id,
        title: "HTML Basics Quiz",
        passingScore: 70,
        timeLimit: 300
      }
    });

    console.log(`✅ Course created: ${course.id}`);
    console.log(`View at: http://localhost:3000/learn/course/${course.id}`);
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createCompleteCourse();
```

## Next Steps

1. **Explore the Course Builder** for visual course creation
2. **Review existing courses** for best practices
3. **Test student experience** by enrolling in courses
4. **Monitor analytics** to improve content
5. **Gather feedback** from learners

For more help, check the `/scripts` directory for additional examples and utilities.
