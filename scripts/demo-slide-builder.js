#!/usr/bin/env node

/**
 * AI-Powered Visual Slide Builder System - Demo Script
 *
 * This script demonstrates the key features of the slide builder system
 * and shows how to interact with it programmatically.
 */

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Demo slide data
const demoSlide = {
  title: "AI-Powered Learning Demo",
  elements: [
    {
      id: "title-1",
      type: "title",
      x: 2,
      y: 1,
      w: 8,
      h: 2,
      props: {
        content: "Welcome to AI-Powered Learning",
        level: 1,
        align: "center",
        fontSize: 48,
        color: "#1f2937",
      },
    },
    {
      id: "text-1",
      type: "text",
      x: 2,
      y: 4,
      w: 8,
      h: 3,
      props: {
        content:
          "This slide demonstrates the capabilities of our AI-powered slide builder system. It features a 12x12 grid layout with magnetic snapping, drag-and-drop functionality, and intelligent AI assistance.",
        fontSize: 18,
        align: "left",
        lineHeight: 1.6,
      },
    },
    {
      id: "image-1",
      type: "image",
      x: 2,
      y: 8,
      w: 4,
      h: 3,
      props: {
        src: "https://via.placeholder.com/400x300/3b82f6/ffffff?text=AI+Learning",
        alt: "AI Learning Concept",
        fit: "cover",
        borderRadius: 8,
      },
    },
    {
      id: "callout-1",
      type: "callout",
      x: 7,
      y: 8,
      w: 3,
      h: 3,
      props: {
        content: "✨ AI-Powered\n🎯 Grid-Based\n🔄 Real-time",
        type: "info",
        icon: "sparkles",
      },
    },
  ],
  theme: {
    primaryColor: "#3b82f6",
    backgroundColor: "#ffffff",
    fontFamily: "Inter, sans-serif",
  },
};

// AI Commands demo
const aiCommands = [
  {
    type: "create_slides_from_text",
    parameters: {
      courseId: "demo-course",
      lessonId: "demo-lesson",
      sourceText: `
# Introduction to AI-Powered Learning

## What is AI-Powered Learning?

AI-powered learning combines artificial intelligence with educational technology to create personalized, adaptive learning experiences.

## Key Benefits

1. **Personalization**: Content adapts to individual learning styles
2. **Adaptive Assessment**: Questions adjust based on performance
3. **Real-time Feedback**: Immediate guidance and support
4. **Scalability**: Reach more learners efficiently

## Implementation

The system uses machine learning algorithms to analyze learner behavior and optimize content delivery.
      `,
      strategy: "by_headings",
      imagePlaceholders: "auto",
    },
  },
  {
    type: "add_element",
    parameters: {
      slideId: "demo-slide",
      type: "quiz",
      x: 0,
      y: 0,
      w: 6,
      h: 4,
      props: {
        question: "What is the main benefit of AI-powered learning?",
        options: [
          "Personalization",
          "Cost reduction",
          "Faster internet",
          "More colors",
        ],
        correctAnswer: 0,
        explanation:
          "AI-powered learning personalizes content based on individual learning patterns and preferences.",
      },
    },
  },
  {
    type: "move_element",
    parameters: {
      slideId: "demo-slide",
      elementId: "title-1",
      x: 1,
      y: 1,
      respectCollisions: true,
    },
  },
];

async function demoSlideBuilder() {
  console.log("🎯 AI-Powered Visual Slide Builder System - Demo");
  console.log("=".repeat(60));

  try {
    // 1. Create a demo course
    console.log("\n📚 Creating demo course...");
    const course = await prisma.course.create({
      data: {
        title: "AI-Powered Learning Demo Course",
        description: "A demonstration of the AI-powered slide builder system",
        category: "Technology",
        tags: ["AI", "Learning", "Demo"],
        difficulty: "BEGINNER",
        estimatedHours: 2.0,
        isPublished: true,
      },
    });
    console.log("✅ Course created:", course.title);

    // 2. Create a demo module
    console.log("\n📖 Creating demo module...");
    const module = await prisma.module.create({
      data: {
        courseId: course.id,
        title: "Introduction to AI-Powered Learning",
        description:
          "Learn about the fundamentals of AI-powered learning systems",
        orderIndex: 0,
      },
    });
    console.log("✅ Module created:", module.title);

    // 3. Create a demo lesson
    console.log("\n📝 Creating demo lesson...");
    const lesson = await prisma.lesson.create({
      data: {
        moduleId: module.id,
        title: "Getting Started with AI Learning",
        description: "An overview of AI-powered learning concepts",
        content: { blocks: [] },
        orderIndex: 0,
      },
    });
    console.log("✅ Lesson created:", lesson.title);

    // 4. Create a demo slide
    console.log("\n🖼️ Creating demo slide...");
    const slide = await prisma.slide.create({
      data: {
        lessonId: lesson.id,
        title: demoSlide.title,
        gridLayout: demoSlide.elements,
        theme: demoSlide.theme,
        orderIndex: 0,
      },
    });
    console.log("✅ Slide created:", slide.title);

    // 5. Demonstrate AI commands
    console.log("\n🤖 Demonstrating AI commands...");
    for (const command of aiCommands) {
      console.log(`\n📋 Executing command: ${command.type}`);

      // Simulate AI command execution
      const aiCommand = await prisma.aICommand.create({
        data: {
          type: command.type,
          parameters: command.parameters,
          status: "completed",
          result: { success: true, message: "Command executed successfully" },
          courseId: course.id,
          slideId: slide.id,
        },
      });
      console.log(`✅ Command logged: ${aiCommand.id}`);
    }

    // 6. Display slide information
    console.log("\n📊 Slide Information:");
    console.log(`- Title: ${slide.title}`);
    console.log(`- Elements: ${demoSlide.elements.length}`);
    console.log(`- Grid Layout: 12x12`);
    console.log(`- Theme: ${demoSlide.theme.primaryColor}`);

    // 7. Show element details
    console.log("\n🧩 Slide Elements:");
    demoSlide.elements.forEach((element, index) => {
      console.log(`${index + 1}. ${element.type.toUpperCase()}`);
      console.log(`   Position: (${element.x}, ${element.y})`);
      console.log(`   Size: ${element.w}x${element.h}`);
      if (element.props.content) {
        console.log(`   Content: ${element.props.content.substring(0, 50)}...`);
      }
    });

    console.log("\n🎉 Demo completed successfully!");
    console.log(
      "\n🌐 Access the slide builder at: http://localhost:3001/test-slide-builder"
    );
    console.log(
      "🔧 Or create a new slide at: http://localhost:3001/admin/slides/new/builder"
    );
  } catch (error) {
    console.error("❌ Demo failed:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the demo
if (require.main === module) {
  demoSlideBuilder();
}

module.exports = { demoSlideBuilder, demoSlide, aiCommands };
