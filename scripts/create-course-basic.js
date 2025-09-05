const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createCompleteCourse() {
  console.log("📚 Creating a Complete Course with All Content\n");

  try {
    // 1. Create the Course
    console.log("1️⃣ Creating Course...");
    const course = await prisma.course.create({
      data: {
        title: "React & Next.js Full Course",
        description:
          "Build modern web applications with React and Next.js from scratch",
        thumbnail: "https://example.com/react-course.jpg",
        difficulty: "INTERMEDIATE",
        estimatedHours: 25,
        category: "Web Development",
        tags: ["react", "nextjs", "javascript", "web development"],
        isPublished: true, // Publish immediately
        visibility: "PUBLIC",
        price: 0, // Free course
      },
    });
    console.log("✅ Course created:", course.title);
    console.log("   Course ID:", course.id);

    // 2. Create Modules
    console.log("\n2️⃣ Creating Modules...");

    const module1 = await prisma.module.create({
      data: {
        courseId: course.id,
        title: "Getting Started with React",
        description: "Learn React fundamentals",
        orderIndex: 0,
      },
    });

    const module2 = await prisma.module.create({
      data: {
        courseId: course.id,
        title: "Building with Next.js",
        description: "Create full-stack applications",
        orderIndex: 1,
      },
    });

    console.log("✅ Created 2 modules");

    // 3. Create Lessons
    console.log("\n3️⃣ Creating Lessons...");

    const lesson1 = await prisma.lesson.create({
      data: {
        moduleId: module1.id,
        title: "React Components and Props",
        description: "Understanding React component architecture",
        orderIndex: 0,
        xpReward: 15,
        duration: 20,
        content: {
          type: "structured",
          sections: [
            {
              title: "What are Components?",
              content:
                "Components are the building blocks of React applications",
            },
            {
              title: "Props",
              content: "Props allow you to pass data to components",
            },
          ],
        },
      },
    });

    const lesson2 = await prisma.lesson.create({
      data: {
        moduleId: module1.id,
        title: "State and Lifecycle",
        description: "Managing component state and lifecycle methods",
        orderIndex: 1,
        xpReward: 20,
        duration: 25,
        content: {
          type: "structured",
          sections: [
            {
              title: "useState Hook",
              content:
                "The useState hook allows functional components to have state",
            },
            {
              title: "useEffect Hook",
              content: "Handle side effects in your components",
            },
          ],
        },
      },
    });

    console.log("✅ Created lessons");

    // 4. Create Slides (without new fields)
    console.log("\n4️⃣ Creating Slides...");

    const slide1 = await prisma.slide.create({
      data: {
        lessonId: lesson1.id,
        title: "Introduction to Components",
        orderIndex: 0,
        template: "standard",
        notes: "Start with a simple example of a React component",
      },
    });

    const slide2 = await prisma.slide.create({
      data: {
        lessonId: lesson1.id,
        title: "Component Props",
        orderIndex: 1,
        template: "code-example",
        notes: "Show how to pass and use props",
      },
    });

    console.log("✅ Created slides");

    // 5. Create Content Blocks for Slides
    console.log("\n5️⃣ Creating Content Blocks...");

    // Content for slide 1
    await prisma.contentBlock.createMany({
      data: [
        {
          slideId: slide1.id,
          type: "TEXT",
          content: {
            text: "Welcome to React Components!",
            style: "heading1",
            align: "center",
          },
          orderIndex: 0,
        },
        {
          slideId: slide1.id,
          type: "TEXT",
          content: {
            text: "Components let you split the UI into independent, reusable pieces, and think about each piece in isolation.",
            style: "paragraph",
          },
          orderIndex: 1,
        },
        {
          slideId: slide1.id,
          type: "CODE",
          content: {
            code: `// A simple React component
function Welcome() {
  return <h1>Hello, World!</h1>;
}

export default Welcome;`,
            language: "javascript",
          },
          orderIndex: 2,
        },
      ],
    });

    // Content for slide 2
    await prisma.contentBlock.createMany({
      data: [
        {
          slideId: slide2.id,
          type: "TEXT",
          content: {
            text: "Passing Data with Props",
            style: "heading1",
            align: "center",
          },
          orderIndex: 0,
        },
        {
          slideId: slide2.id,
          type: "CODE",
          content: {
            code: `// Parent component
function App() {
  return (
    <div>
      <Welcome name="Alice" />
      <Welcome name="Bob" />
    </div>
  );
}

// Child component receiving props
function Welcome({ name }) {
  return <h1>Hello, {name}!</h1>;
}`,
            language: "javascript",
          },
          orderIndex: 1,
        },
      ],
    });

    console.log("✅ Created content blocks");

    // 6. Create a Quiz
    console.log("\n6️⃣ Creating Quiz...");

    const quiz = await prisma.quiz.create({
      data: {
        lessonId: lesson1.id,
        title: "React Components Quiz",
        description: "Test your understanding of React components",
        passingScore: 70,
        timeLimit: 300,
      },
    });

    await prisma.question.createMany({
      data: [
        {
          quizId: quiz.id,
          question: "What is the correct way to pass a prop to a component?",
          type: "MULTIPLE_CHOICE",
          points: 10,
          options: [
            '<Component prop="value" />',
            '<Component {prop: "value"} />',
            "<Component prop:value />",
            '<Component (prop="value") />',
          ],
          correctAnswer: '<Component prop="value" />',
          orderIndex: 0,
        },
        {
          quizId: quiz.id,
          question: "Components must return a single element.",
          type: "TRUE_FALSE",
          points: 5,
          correctAnswer: "true",
          orderIndex: 1,
        },
      ],
    });

    console.log("✅ Created quiz with questions");

    // 7. Display summary
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
      },
    });

    console.log(`Course: ${fullCourse.title}`);
    console.log(`Course ID: ${fullCourse.id}`);
    console.log(`Status: ${fullCourse.isPublished ? "Published" : "Draft"}`);
    console.log(`Modules: ${fullCourse.modules.length}`);

    let totalLessons = 0;
    let totalSlides = 0;
    let totalContentBlocks = 0;
    let totalQuizzes = 0;

    fullCourse.modules.forEach((module) => {
      totalLessons += module.lessons.length;
      module.lessons.forEach((lesson) => {
        totalSlides += lesson.slides.length;
        lesson.slides.forEach((slide) => {
          totalContentBlocks += slide.blocks.length;
        });
        totalQuizzes += lesson.quizzes.length;
      });
    });

    console.log(`Total Lessons: ${totalLessons}`);
    console.log(`Total Slides: ${totalSlides}`);
    console.log(`Total Content Blocks: ${totalContentBlocks}`);
    console.log(`Total Quizzes: ${totalQuizzes}`);
    console.log("================================");

    // 8. Instructions for accessing the course
    console.log("\n🎯 How to Access Your Course:");
    console.log("================================");
    console.log("1. Admin Interface (Course Builder):");
    console.log(`   http://localhost:3000/admin/courses/${course.id}/builder`);
    console.log("\n2. Student View (Learn Page):");
    console.log(`   http://localhost:3000/learn/course/${course.id}`);
    console.log("\n3. Direct API Access:");
    console.log(`   GET http://localhost:3000/api/courses/${course.id}`);
    console.log("================================");

    // 9. Show sample database queries
    console.log("\n🔍 Verify Data in Database:");
    console.log("================================");
    console.log("To check courses in the database:");
    console.log(
      `docker exec -it web-platform-db-1 psql -U postgres -d web_platform -c "SELECT id, title, \\\"isPublished\\\" FROM \\\"Course\\\" WHERE id = '${course.id}';"`
    );
    console.log("\nTo check modules:");
    console.log(
      `docker exec -it web-platform-db-1 psql -U postgres -d web_platform -c "SELECT id, title FROM \\\"Module\\\" WHERE \\\"courseId\\\" = '${course.id}';"`
    );
    console.log("================================");

    return fullCourse;
  } catch (error) {
    console.error("❌ Error creating course:", error);
    console.error("Error details:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the course creation
createCompleteCourse();
