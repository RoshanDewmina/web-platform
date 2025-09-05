const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createCompleteCourse() {
  console.log("📚 Creating a Complete Course with All Content\n");

  try {
    // 1. Create the Course
    console.log("1️⃣ Creating Course...");
    const course = await prisma.course.create({
      data: {
        title: "Complete JavaScript Programming",
        description:
          "Master JavaScript from basics to advanced concepts with hands-on projects",
        thumbnail: "https://example.com/js-course-thumbnail.jpg",
        difficulty: "BEGINNER",
        estimatedHours: 30,
        category: "Programming",
        tags: ["javascript", "web development", "programming", "es6"],
        isPublished: false, // Start as draft
        visibility: "PUBLIC",
        price: 0, // Free course
      },
    });
    console.log("✅ Course created:", course.title);
    console.log("   Course ID:", course.id);

    // 2. Create Modules
    console.log("\n2️⃣ Creating Modules...");

    // Module 1: JavaScript Basics
    const module1 = await prisma.module.create({
      data: {
        courseId: course.id,
        title: "JavaScript Fundamentals",
        description: "Learn the basics of JavaScript programming",
        orderIndex: 0,
      },
    });

    // Module 2: Advanced Concepts
    const module2 = await prisma.module.create({
      data: {
        courseId: course.id,
        title: "Advanced JavaScript",
        description: "Dive deep into advanced JavaScript concepts",
        orderIndex: 1,
      },
    });

    console.log("✅ Created", 2, "modules");

    // 3. Create Lessons for Module 1
    console.log("\n3️⃣ Creating Lessons...");

    const lesson1 = await prisma.lesson.create({
      data: {
        moduleId: module1.id,
        title: "Variables and Data Types",
        description: "Understanding JavaScript variables and data types",
        orderIndex: 0,
        xpReward: 10,
        duration: 15, // 15 minutes
        videoUrl: "https://example.com/lesson1-video.mp4",
        content: {
          introduction: "Welcome to JavaScript basics!",
          topics: [
            "let, const, and var",
            "Numbers and Strings",
            "Booleans and null/undefined",
            "Arrays and Objects",
          ],
          summary: "You've learned about JavaScript data types!",
        },
      },
    });

    const lesson2 = await prisma.lesson.create({
      data: {
        moduleId: module1.id,
        title: "Functions and Scope",
        description: "Master JavaScript functions and scope",
        orderIndex: 1,
        xpReward: 15,
        duration: 20,
        content: {
          introduction: "Functions are the building blocks of JavaScript",
          topics: [
            "Function declarations vs expressions",
            "Arrow functions",
            "Scope and closures",
            "Higher-order functions",
          ],
        },
      },
    });

    console.log("✅ Created lessons for modules");

    // 4. Create Slides for Lessons
    console.log("\n4️⃣ Creating Slides with Content Blocks...");

    // Slide 1 for Lesson 1
    const slide1 = await prisma.slide.create({
      data: {
        lessonId: lesson1.id,
        title: "Introduction to Variables",
        orderIndex: 0,
        template: "standard",
        notes: "Explain the importance of variables in programming",
      },
    });

    // Create content blocks for slide 1
    await prisma.contentBlock.createMany({
      data: [
        {
          slideId: slide1.id,
          type: "TEXT",
          content: {
            text: "Variables in JavaScript",
            style: "heading1",
            align: "center",
          },
          orderIndex: 0,
        },
        {
          slideId: slide1.id,
          type: "TEXT",
          content: {
            text: "Variables are containers for storing data values. In JavaScript, we have three ways to declare variables:",
            style: "paragraph",
          },
          orderIndex: 1,
        },
        {
          slideId: slide1.id,
          type: "CODE",
          content: {
            code: `// Using let (block-scoped, can be reassigned)
let age = 25;
age = 26; // OK

// Using const (block-scoped, cannot be reassigned)
const name = "John";
// name = "Jane"; // Error!

// Using var (function-scoped, avoid in modern JS)
var oldWay = true;`,
            language: "javascript",
          },
          orderIndex: 2,
        },
      ],
    });

    // Slide 2 for Lesson 1
    const slide2 = await prisma.slide.create({
      data: {
        lessonId: lesson1.id,
        title: "Data Types Overview",
        orderIndex: 1,
        template: "standard",
      },
    });

    // Create content blocks for slide 2
    await prisma.contentBlock.createMany({
      data: [
        {
          slideId: slide2.id,
          type: "TEXT",
          content: {
            text: "JavaScript Data Types",
            style: "heading1",
            align: "center",
          },
          orderIndex: 0,
        },
        {
          slideId: slide2.id,
          type: "TEXT",
          content: {
            text: "JavaScript has several built-in data types:",
            style: "paragraph",
          },
          orderIndex: 1,
        },
        {
          slideId: slide2.id,
          type: "CODE",
          content: {
            code: `// Primitive Types
const number = 42;              // Number
const text = "Hello World";     // String
const isTrue = true;            // Boolean
const nothing = null;           // Null
const notDefined = undefined;   // Undefined
const unique = Symbol('id');    // Symbol

// Object Types
const array = [1, 2, 3];        // Array
const object = { name: "John" }; // Object
const func = () => {};          // Function`,
            language: "javascript",
          },
          orderIndex: 2,
        },
      ],
    });

    console.log("✅ Created slides with content blocks");

    // 5. Create a Quiz for the lesson
    console.log("\n5️⃣ Creating Quiz...");

    const quiz = await prisma.quiz.create({
      data: {
        lessonId: lesson1.id,
        title: "Variables and Data Types Quiz",
        description: "Test your understanding of JavaScript basics",
        passingScore: 70,
        timeLimit: 300, // 5 minutes
      },
    });

    // Create quiz questions
    await prisma.question.createMany({
      data: [
        {
          quizId: quiz.id,
          text: "Which keyword should you use to declare a variable that won't be reassigned?",
          type: "MULTIPLE_CHOICE",
          points: 10,
          options: ["let", "const", "var", "function"],
          correctAnswer: "const",
          orderIndex: 0,
        },
        {
          quizId: quiz.id,
          text: "What is the result of: typeof []",
          type: "MULTIPLE_CHOICE",
          points: 10,
          options: ["array", "object", "undefined", "null"],
          correctAnswer: "object",
          orderIndex: 1,
        },
      ],
    });

    console.log("✅ Created quiz with questions");

    // 6. Verify and Display Course Structure
    console.log("\n📊 Course Creation Summary:");
    console.log("================================");

    const fullCourse = await prisma.course.findUnique({
      where: { id: course.id },
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                slides: {
                  include: {
                    blocks: true,
                  },
                },
                quizzes: {
                  include: {
                    questions: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
    });

    console.log(`Course: ${fullCourse.title}`);
    console.log(`Course ID: ${fullCourse.id}`);
    console.log(`Status: ${fullCourse.isPublished ? "Published" : "Draft"}`);
    console.log(`Modules: ${fullCourse.modules.length}`);

    let totalLessons = 0;
    let totalSlides = 0;
    let totalQuizzes = 0;

    fullCourse.modules.forEach((module) => {
      totalLessons += module.lessons.length;
      module.lessons.forEach((lesson) => {
        totalSlides += lesson.slides.length;
        totalQuizzes += lesson.quizzes.length;
      });
    });

    console.log(`Total Lessons: ${totalLessons}`);
    console.log(`Total Slides: ${totalSlides}`);
    console.log(`Total Quizzes: ${totalQuizzes}`);
    console.log(`Enrollments: ${fullCourse._count.enrollments}`);
    console.log("================================");

    // 7. Show how to access the course
    console.log("\n🎯 Next Steps:");
    console.log(
      `1. View course in admin: http://localhost:3000/admin/courses/${course.id}/builder`
    );
    console.log(`2. Edit course content using the Course Builder interface`);
    console.log(`3. Publish the course when ready`);
    console.log(
      `4. Students can enroll at: http://localhost:3000/learn/course/${course.id}`
    );

    return fullCourse;
  } catch (error) {
    console.error("❌ Error creating course:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the course creation
createCompleteCourse();
