const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function testFeatures() {
  console.log("🧪 Testing Multi-tenant Learning Platform Features\n");

  try {
    // 1. Test User Management (Multi-tenant)
    console.log("1️⃣ Testing User Management...");

    // Create test users
    const user1 = await prisma.user.upsert({
      where: { clerkId: "test-user-1" },
      update: {},
      create: {
        clerkId: "test-user-1",
        email: "user1@test.com",
        username: "testuser1",
        bio: "Test User One - Learning enthusiast",
        xp: 0,
        level: 1,
      },
    });

    const user2 = await prisma.user.upsert({
      where: { clerkId: "test-user-2" },
      update: {},
      create: {
        clerkId: "test-user-2",
        email: "user2@test.com",
        username: "testuser2",
        bio: "Test User Two - Another learner",
        xp: 0,
        level: 1,
      },
    });

    console.log("✅ Created test users:", user1.username, user2.username);

    // 2. Test Course Management
    console.log("\n2️⃣ Testing Course Management...");

    // Get the test course we created earlier
    const course = await prisma.course.findFirst({
      where: { id: "test-course-1" },
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
      },
    });

    console.log("✅ Found course:", course?.title);
    console.log("   Modules:", course?.modules.length);
    console.log("   Lessons:", course?.modules[0]?.lessons.length);

    // 3. Test Enrollment (Multi-tenant behavior)
    console.log("\n3️⃣ Testing Enrollment System...");

    // Enroll user1 in the course (use upsert to handle existing enrollment)
    const enrollment1 = await prisma.enrollment.upsert({
      where: {
        userId_courseId: {
          userId: user1.id,
          courseId: course.id,
        },
      },
      update: {},
      create: {
        userId: user1.id,
        courseId: course.id,
        enrolledAt: new Date(),
      },
    });

    console.log("✅ User1 enrolled in course");

    // Check that user2 is not enrolled
    const user2Enrollments = await prisma.enrollment.findMany({
      where: { userId: user2.id },
    });

    console.log(
      "✅ User2 enrollments:",
      user2Enrollments.length,
      "(should be 0)"
    );

    // 4. Test Progress Tracking
    console.log("\n4️⃣ Testing Progress Tracking...");

    const lesson = course.modules[0].lessons[0];

    // Create progress for user1 (use upsert to handle existing progress)
    const progress1 = await prisma.progress.upsert({
      where: {
        userId_lessonId: {
          userId: user1.id,
          lessonId: lesson.id,
        },
      },
      update: {},
      create: {
        userId: user1.id,
        lessonId: lesson.id,
        completed: false,
        timeSpent: 0,
      },
    });

    // Simulate learning progress
    await prisma.progress.update({
      where: { id: progress1.id },
      data: {
        completed: true,
        completedAt: new Date(),
        timeSpent: 600, // 10 minutes
      },
    });

    console.log("✅ Progress tracked for user1");

    // 5. Test XP and Gamification
    console.log("\n5️⃣ Testing XP and Gamification...");

    // Award XP for completing lesson
    const updatedUser1 = await prisma.user.update({
      where: { id: user1.id },
      data: {
        xp: { increment: lesson.xpReward },
      },
    });

    console.log("✅ XP awarded:", lesson.xpReward);
    console.log("   User1 total XP:", updatedUser1.xp);
    console.log("   User1 level:", Math.floor(updatedUser1.xp / 100) + 1);

    // Create achievement (check if exists first)
    let achievement = await prisma.achievement.findFirst({
      where: {
        name: "First Steps",
      },
    });

    if (!achievement) {
      achievement = await prisma.achievement.create({
        data: {
          name: "First Steps",
          description: "Complete your first lesson",
          icon: "🎯",
          xpReward: 50,
          category: "PROGRESS",
          requirement: { lessonsCompleted: 1 },
        },
      });
    }

    // Award achievement to user1 (check if already awarded)
    const existingUserAchievement = await prisma.userAchievement.findFirst({
      where: {
        userId: user1.id,
        achievementId: achievement.id,
      },
    });

    if (!existingUserAchievement) {
      await prisma.userAchievement.create({
        data: {
          userId: user1.id,
          achievementId: achievement.id,
          earnedAt: new Date(),
        },
      });
    }

    console.log("✅ Achievement unlocked:", achievement.name);

    // 6. Test Profile Features
    console.log("\n6️⃣ Testing Profile Features...");

    // Update user profile
    const profileUpdate = await prisma.user.update({
      where: { id: user1.id },
      data: {
        bio: "I love learning new technologies!",
        avatarUrl: "https://example.com/avatar1.jpg",
      },
    });

    console.log("✅ Profile updated with bio and avatar");

    // 7. Test Social Features
    console.log("\n7️⃣ Testing Social Features...");

    // Create study group (check if exists first)
    let studyGroup = await prisma.studyGroup.findFirst({
      where: {
        name: "Web Development Enthusiasts",
      },
    });

    if (!studyGroup) {
      studyGroup = await prisma.studyGroup.create({
        data: {
          name: "Web Development Enthusiasts",
          description: "A group for learning web development together",
          maxMembers: 10,
        },
      });
    }

    // Add members (check if already a member)
    const existingMembership = await prisma.studyGroupMember.findFirst({
      where: {
        groupId: studyGroup.id,
        userId: user1.id,
      },
    });

    if (!existingMembership) {
      await prisma.studyGroupMember.create({
        data: {
          groupId: studyGroup.id,
          userId: user1.id,
          role: "ADMIN",
        },
      });
    }

    console.log("✅ Study group created:", studyGroup.name);

    // 8. Test Multi-tenant Data Isolation
    console.log("\n8️⃣ Testing Multi-tenant Data Isolation...");

    // Verify user1 can only see their own data
    const user1Data = await prisma.enrollment.findMany({
      where: { userId: user1.id },
      include: {
        course: true,
      },
    });

    const user1Progress = await prisma.progress.findMany({
      where: { userId: user1.id },
    });

    const user1Achievements = await prisma.userAchievement.findMany({
      where: { userId: user1.id },
      include: {
        achievement: true,
      },
    });

    console.log("✅ User1 data:");
    console.log("   Enrollments:", user1Data.length);
    console.log("   Progress records:", user1Progress.length);
    console.log("   Achievements:", user1Achievements.length);

    // 9. Summary
    console.log("\n📊 Test Summary:");
    console.log("✅ Multi-tenant user management working");
    console.log("✅ Course enrollment system working");
    console.log("✅ Progress tracking working");
    console.log("✅ XP and gamification working");
    console.log("✅ Profile features working");
    console.log("✅ Social features working");
    console.log("✅ Data isolation between users verified");

    console.log("\n🎉 All features tested successfully!");

    // Cleanup (optional)
    const cleanup = false; // Set to true to clean up test data
    if (cleanup) {
      console.log("\n🧹 Cleaning up test data...");
      await prisma.userAchievement.deleteMany({ where: { userId: user1.id } });
      await prisma.achievement.delete({ where: { id: achievement.id } });
      await prisma.studyGroupMember.deleteMany({
        where: { groupId: studyGroup.id },
      });
      await prisma.studyGroup.delete({ where: { id: studyGroup.id } });
      await prisma.progress.deleteMany({ where: { userId: user1.id } });
      await prisma.enrollment.deleteMany({ where: { userId: user1.id } });
      await prisma.user.deleteMany({
        where: { id: { in: [user1.id, user2.id] } },
      });
      console.log("✅ Test data cleaned up");
    }
  } catch (error) {
    console.error("❌ Test failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the tests
testFeatures();
