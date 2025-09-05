const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createCompleteCourse() {
  console.log("📚 Creating a Complete Course with All Content\n");

  try {
    // 1. Create the Course
    console.log("1️⃣ Creating Course...");
    const course = await prisma.course.create({
      data: {
        title: "Full Stack Web Development Masterclass",
        description:
          "Learn to build modern web applications from scratch using React, Node.js, and PostgreSQL",
        thumbnail: "https://example.com/course-thumbnail.jpg",
        difficulty: "INTERMEDIATE",
        estimatedHours: 40,
        category: "Web Development",
        tags: ["react", "nodejs", "postgresql", "fullstack", "javascript"],
        isPublished: false, // Start as draft
        visibility: "PUBLIC",
        price: 0, // Free course
      },
    });
    console.log("✅ Course created:", course.title);

    // 2. Create Modules
    console.log("\n2️⃣ Creating Modules...");

    // Module 1: Frontend Fundamentals
    const module1 = await prisma.module.create({
      data: {
        courseId: course.id,
        title: "Frontend Fundamentals",
        description: "Master HTML, CSS, and JavaScript basics",
        orderIndex: 0,
      },
    });

    // Module 2: React Development
    const module2 = await prisma.module.create({
      data: {
        courseId: course.id,
        title: "React Development",
        description: "Build interactive UIs with React",
        orderIndex: 1,
      },
    });

    // Module 3: Backend with Node.js
    const module3 = await prisma.module.create({
      data: {
        courseId: course.id,
        title: "Backend Development with Node.js",
        description: "Create RESTful APIs and server-side applications",
        orderIndex: 2,
      },
    });

    console.log("✅ Created", 3, "modules");

    // 3. Create Lessons for Module 1
    console.log("\n3️⃣ Creating Lessons...");

    // Module 1 Lessons
    const lesson1_1 = await prisma.lesson.create({
      data: {
        moduleId: module1.id,
        title: "Introduction to HTML",
        description: "Learn the structure of web pages",
        orderIndex: 0,
        xpReward: 10,
        content: {
          type: "structured",
          blocks: [
            {
              type: "text",
              content:
                "HTML (HyperText Markup Language) is the standard markup language for creating web pages.",
            },
            {
              type: "code",
              language: "html",
              content: `<!DOCTYPE html>
<html>
  <head>
    <title>My First Page</title>
  </head>
  <body>
    <h1>Hello World!</h1>
    <p>This is my first web page.</p>
  </body>
</html>`,
            },
          ],
        },
      },
    });

    const lesson1_2 = await prisma.lesson.create({
      data: {
        moduleId: module1.id,
        title: "CSS Styling Basics",
        description: "Style your web pages with CSS",
        orderIndex: 1,
        xpReward: 15,
        content: {
          type: "structured",
          blocks: [
            {
              type: "text",
              content:
                "CSS (Cascading Style Sheets) is used to style and layout web pages.",
            },
            {
              type: "code",
              language: "css",
              content: `/* Basic CSS Example */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  background-color: #f0f0f0;
}

h1 {
  color: #333;
  text-align: center;
}

.button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}`,
            },
          ],
        },
      },
    });

    // Module 2 Lessons
    const lesson2_1 = await prisma.lesson.create({
      data: {
        moduleId: module2.id,
        title: "React Components",
        description: "Understanding React component architecture",
        orderIndex: 0,
        xpReward: 20,
        content: {
          type: "structured",
          blocks: [
            {
              type: "text",
              content:
                "React components are the building blocks of any React application.",
            },
            {
              type: "code",
              language: "javascript",
              content: `import React from 'react';

// Functional Component
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}

// Class Component
class WelcomeClass extends React.Component {
  render() {
    return <h1>Hello, {this.props.name}!</h1>;
  }
}

export default Welcome;`,
            },
          ],
        },
      },
    });

    console.log("✅ Created lessons for modules");

    // 4. Create Slides for Lessons (Alternative to content blocks)
    console.log("\n4️⃣ Creating Slides...");

    const slide1 = await prisma.slide.create({
      data: {
        lessonId: lesson1_1.id,
        title: "What is HTML?",
        orderIndex: 0,
        template: "default",
        gridLayout: {
          elements: [
            {
              id: "title-1",
              type: "heading",
              content: "Introduction to HTML",
              position: { x: 0, y: 0, w: 12, h: 2 },
              props: { level: 1, align: "center" },
            },
            {
              id: "text-1",
              type: "text",
              content:
                "HTML stands for HyperText Markup Language. It's the standard markup language for creating web pages and web applications.",
              position: { x: 0, y: 2, w: 12, h: 3 },
              props: { fontSize: "medium" },
            },
            {
              id: "code-1",
              type: "code",
              content:
                "<h1>This is a heading</h1>\n<p>This is a paragraph.</p>",
              position: { x: 0, y: 5, w: 12, h: 4 },
              props: { language: "html", theme: "dark" },
            },
          ],
        },
        theme: { name: "default" },
      },
    });

    const slide2 = await prisma.slide.create({
      data: {
        lessonId: lesson1_1.id,
        title: "HTML Elements",
        orderIndex: 1,
        template: "default",
        gridLayout: {
          elements: [
            {
              id: "title-2",
              type: "heading",
              content: "Common HTML Elements",
              position: { x: 0, y: 0, w: 12, h: 2 },
              props: { level: 1, align: "center" },
            },
            {
              id: "list-1",
              type: "list",
              content: [
                "<h1> - <h6>: Headings",
                "<p>: Paragraph",
                "<div>: Division/Container",
                "<span>: Inline container",
                "<a>: Anchor/Link",
                "<img>: Image",
                "<ul>, <ol>, <li>: Lists",
              ],
              position: { x: 0, y: 2, w: 6, h: 6 },
              props: { ordered: false },
            },
            {
              id: "image-1",
              type: "image",
              content: "https://example.com/html-structure.png",
              position: { x: 6, y: 2, w: 6, h: 6 },
              props: { alt: "HTML Structure Diagram" },
            },
          ],
        },
        theme: { name: "default" },
      },
    });

    console.log("✅ Created slides with content");

    // 5. Create a Quiz for the lesson
    console.log("\n5️⃣ Creating Quiz...");

    const quiz = await prisma.quiz.create({
      data: {
        lessonId: lesson1_1.id,
        title: "HTML Basics Quiz",
        description: "Test your knowledge of HTML fundamentals",
        passingScore: 70,
        timeLimit: 600, // 10 minutes
      },
    });

    // Create quiz questions
    const question1 = await prisma.question.create({
      data: {
        quizId: quiz.id,
        text: "What does HTML stand for?",
        type: "MULTIPLE_CHOICE",
        points: 10,
        options: [
          "Hyper Text Markup Language",
          "High Tech Modern Language",
          "Home Tool Markup Language",
          "Hyperlink and Text Markup Language",
        ],
        correctAnswer: "Hyper Text Markup Language",
        orderIndex: 0,
      },
    });

    const question2 = await prisma.question.create({
      data: {
        quizId: quiz.id,
        text: "Which HTML element is used for the largest heading?",
        type: "MULTIPLE_CHOICE",
        points: 10,
        options: ["<h6>", "<heading>", "<h1>", "<head>"],
        correctAnswer: "<h1>",
        orderIndex: 1,
      },
    });

    console.log("✅ Created quiz with questions");

    // 6. Publish the course
    console.log("\n6️⃣ Publishing course...");
    await prisma.course.update({
      where: { id: course.id },
      data: {
        isPublished: true,
      },
    });

    console.log("✅ Course published!");

    // 7. Display summary
    console.log("\n📊 Course Creation Summary:");
    console.log("================================");
    console.log(`Course: ${course.title}`);
    console.log(`ID: ${course.id}`);
    console.log(`Modules: 3`);
    console.log(`Lessons: 3`);
    console.log(`Slides: 2`);
    console.log(`Quiz Questions: 2`);
    console.log("================================");

    // 8. Verify data in database
    console.log("\n🔍 Verifying data in database...");
    const savedCourse = await prisma.course.findUnique({
      where: { id: course.id },
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                slides: true,
                quizzes: {
                  include: {
                    questions: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    console.log("\n✅ Course structure saved in database:");
    console.log(JSON.stringify(savedCourse, null, 2));

    return savedCourse;
  } catch (error) {
    console.error("❌ Error creating course:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the course creation
createCompleteCourse();
