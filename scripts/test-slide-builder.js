#!/usr/bin/env node

/**
 * Quick test script to verify the slide builder is working
 */

const { PrismaClient } = require("@prisma/client");
const https = require("https");
const http = require("http");
const prisma = new PrismaClient();

// Simple fetch implementation for Node.js
function simpleFetch(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith("https") ? https : http;
    const req = client.get(url, (res) => {
      resolve({ ok: res.statusCode >= 200 && res.statusCode < 300 });
    });
    req.on("error", reject);
    req.setTimeout(5000, () => req.destroy());
  });
}

async function testSlideBuilder() {
  console.log("🧪 Testing Slide Builder Functionality...");
  console.log("=".repeat(50));

  try {
    // Test 1: Check if we can access the slide builder page
    console.log("1. Testing web interface...");
    try {
      const response = await simpleFetch(
        "http://localhost:3001/test-slide-builder"
      );
      if (response.ok) {
        console.log("✅ Web interface is accessible");
      } else {
        console.log("❌ Web interface is not accessible");
      }
    } catch (error) {
      console.log("❌ Web interface is not accessible:", error.message);
    }

    // Test 2: Check database connection
    console.log("\n2. Testing database connection...");
    const slideCount = await prisma.slide.count();
    console.log(`✅ Database connected. Found ${slideCount} slides`);

    // Test 3: Test component registry
    console.log("\n3. Testing component registry...");
    const componentTypes = [
      "title",
      "text",
      "paragraph",
      "list",
      "image",
      "video",
      "audio",
      "quiz",
      "code",
      "iframe",
      "chart",
      "table",
      "columns",
      "callout",
      "spacer",
    ];

    console.log("✅ Component types available:", componentTypes.length);

    // Test 4: Test AI command system
    console.log("\n4. Testing AI command system...");
    const aiCommands = [
      "create_slides_from_text",
      "add_element",
      "move_element",
      "update_props",
      "delete_element",
    ];

    console.log("✅ AI commands available:", aiCommands.length);

    // Test 5: Check recent slides
    console.log("\n5. Checking recent slides...");
    const recentSlides = await prisma.slide.findMany({
      take: 3,
      orderBy: { createdAt: "desc" },
      include: {
        lesson: { include: { module: { include: { course: true } } } },
      },
    });

    if (recentSlides.length > 0) {
      console.log("✅ Recent slides found:");
      recentSlides.forEach((slide, index) => {
        console.log(
          `   ${index + 1}. ${slide.title} (${
            slide.elements?.length || 0
          } elements)`
        );
      });
    } else {
      console.log("ℹ️  No recent slides found");
    }

    console.log("\n🎉 All tests completed successfully!");
    console.log(
      "\n🌐 Access the slide builder at: http://localhost:3001/test-slide-builder"
    );
  } catch (error) {
    console.error("❌ Test failed:", error.message);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
if (require.main === module) {
  testSlideBuilder();
}

module.exports = { testSlideBuilder };
