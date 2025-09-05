#!/usr/bin/env node

/**
 * Quick Course Creator
 * Usage: node scripts/quick-course.js "Course Title" "Course Description"
 *
 * Example: node scripts/quick-course.js "Python Basics" "Learn Python programming from scratch"
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Get command line arguments
const [, , title, description] = process.argv;

if (!title) {
  console.log(`
📚 Quick Course Creator

Usage: node scripts/quick-course.js "Course Title" "Course Description"

Example: 
  node scripts/quick-course.js "JavaScript Basics" "Learn JS from scratch"

Options:
  - Title: Required - The name of your course
  - Description: Optional - What students will learn
  `);
  process.exit(1);
}

async function quickCreateCourse() {
  console.log("\n🚀 Creating course...\n");

  try {
    // 1. Create the course
    const course = await prisma.course.create({
      data: {
        title: title,
        description: description || `A comprehensive course on ${title}`,
        category: "General",
        difficulty: "BEGINNER",
        estimatedHours: 5,
        tags: title.toLowerCase().split(" "),
        isPublished: true, // Publish immediately for quick testing
        visibility: "PUBLIC",
        price: 0,
      },
    });

    // 2. Create a starter module
    const module = await prisma.module.create({
      data: {
        courseId: course.id,
        title: "Getting Started",
        description: `Introduction to ${title}`,
        orderIndex: 0,
      },
    });

    // 3. Create a welcome lesson
    const lesson = await prisma.lesson.create({
      data: {
        moduleId: module.id,
        title: "Welcome to the Course",
        description: "Get started with your learning journey",
        orderIndex: 0,
        xpReward: 10,
        duration: 10,
        content: {
          introduction: `Welcome to ${title}!`,
          objectives: [
            "Understand the course structure",
            "Get familiar with the platform",
            "Start your learning journey",
          ],
        },
      },
    });

    // 4. Create an introductory slide
    const slide = await prisma.slide.create({
      data: {
        lessonId: lesson.id,
        title: "Welcome!",
        orderIndex: 0,
        template: "standard",
        notes: "Introduction slide for the course",
      },
    });

    // 5. Add welcome content
    await prisma.contentBlock.createMany({
      data: [
        {
          slideId: slide.id,
          type: "TEXT",
          content: {
            text: `Welcome to ${title}`,
            style: "heading1",
            align: "center",
          },
          orderIndex: 0,
        },
        {
          slideId: slide.id,
          type: "TEXT",
          content: {
            text:
              description ||
              `In this course, you'll master ${title} through hands-on learning and practical examples.`,
            style: "paragraph",
            align: "center",
          },
          orderIndex: 1,
        },
        {
          slideId: slide.id,
          type: "TEXT",
          content: {
            text: '🎯 Ready to begin? Click "Next" to start learning!',
            style: "paragraph",
            align: "center",
          },
          orderIndex: 2,
        },
      ],
    });

    // Success! Display the results
    console.log("✅ Course created successfully!\n");
    console.log("📋 Course Details:");
    console.log("══════════════════════════════════════════");
    console.log(`Title:       ${course.title}`);
    console.log(`ID:          ${course.id}`);
    console.log(
      `Status:      ${course.isPublished ? "🟢 Published" : "🟡 Draft"}`
    );
    console.log(`Category:    ${course.category}`);
    console.log(`Difficulty:  ${course.difficulty}`);
    console.log("══════════════════════════════════════════\n");

    console.log("🔗 Access your course:");
    console.log("══════════════════════════════════════════");
    console.log(`👨‍💼 Admin Builder:`);
    console.log(
      `   http://localhost:3000/admin/courses/${course.id}/builder\n`
    );
    console.log(`👨‍🎓 Student View:`);
    console.log(`   http://localhost:3000/learn/course/${course.id}\n`);
    console.log(`🔧 API Endpoint:`);
    console.log(`   GET http://localhost:3000/api/courses/${course.id}`);
    console.log("══════════════════════════════════════════\n");

    console.log("💡 Next Steps:");
    console.log("1. Use the Course Builder to add more content");
    console.log("2. Create additional modules and lessons");
    console.log("3. Add quizzes to test student knowledge");
    console.log("4. Upload images and videos for rich content\n");
  } catch (error) {
    console.error("❌ Error creating course:", error.message);
    console.error("\n💡 Troubleshooting tips:");
    console.error(
      "1. Make sure Docker services are running: docker-compose up -d"
    );
    console.error("2. Check database connection");
    console.error("3. Try running: npx prisma generate");
  } finally {
    await prisma.$disconnect();
  }
}

// Run the quick course creator
quickCreateCourse();
