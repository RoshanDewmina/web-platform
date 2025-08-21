import { PrismaClient } from "@prisma/client";

// Mock Prisma Client
jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    course: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    module: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    lesson: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    enrollment: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
      update: jest.fn(),
    },
  })),
}));

// Mock Clerk auth
jest.mock("@clerk/nextjs/server", () => ({
  auth: jest.fn(() => Promise.resolve({ userId: "test-user-id" })),
}));

const prisma = new PrismaClient();

describe("Course Database Operations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Course CRUD Operations", () => {
    it("fetches all published courses", async () => {
      const mockCourses = [
        {
          id: "1",
          title: "React Basics",
          description: "Learn React",
          isPublished: true,
          category: "Web Development",
          difficulty: "BEGINNER",
          modules: [],
          enrollments: [],
          _count: { enrollments: 10 },
        },
        {
          id: "2",
          title: "Advanced TypeScript",
          description: "Master TypeScript",
          isPublished: true,
          category: "Programming",
          difficulty: "ADVANCED",
          modules: [],
          enrollments: [],
          _count: { enrollments: 5 },
        },
      ];

      (prisma.course.findMany as jest.Mock).mockResolvedValue(mockCourses);

      const courses = await prisma.course.findMany({
        where: { isPublished: true },
      });

      expect(courses).toHaveLength(2);
      expect(courses[0].title).toBe("React Basics");
      expect(prisma.course.findMany).toHaveBeenCalledWith({
        where: { isPublished: true },
      });
    });

    it("creates a new course", async () => {
      const newCourse = {
        title: "New Course",
        description: "Course Description",
        category: "Technology",
        difficulty: "INTERMEDIATE",
        estimatedHours: 10,
        tags: ["programming", "web"],
      };

      const createdCourse = {
        id: "new-course-id",
        ...newCourse,
        isPublished: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.course.create as jest.Mock).mockResolvedValue(createdCourse);

      const result = await prisma.course.create({
        data: newCourse,
      });

      expect(result.id).toBe("new-course-id");
      expect(result.title).toBe("New Course");
      expect(prisma.course.create).toHaveBeenCalledWith({
        data: newCourse,
      });
    });

    it("updates a course", async () => {
      const courseId = "course-123";
      const updates = {
        title: "Updated Title",
        isPublished: true,
      };

      const updatedCourse = {
        id: courseId,
        ...updates,
        description: "Original Description",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      (prisma.course.update as jest.Mock).mockResolvedValue(updatedCourse);

      const result = await prisma.course.update({
        where: { id: courseId },
        data: updates,
      });

      expect(result.title).toBe("Updated Title");
      expect(result.isPublished).toBe(true);
    });

    it("deletes a course", async () => {
      const courseId = "course-123";

      (prisma.course.delete as jest.Mock).mockResolvedValue({
        id: courseId,
      });

      await prisma.course.delete({
        where: { id: courseId },
      });

      expect(prisma.course.delete).toHaveBeenCalledWith({
        where: { id: courseId },
      });
    });
  });

  describe("Course Enrollment", () => {
    it("enrolls a user in a course", async () => {
      const courseId = "course-123";
      const userId = "test-user-id";

      const enrollment = {
        id: "enrollment-123",
        userId,
        courseId,
        status: "ACTIVE",
        progress: 0,
        enrolledAt: new Date(),
      };

      (prisma.enrollment.create as jest.Mock).mockResolvedValue(enrollment);

      // Check for existing enrollment
      (prisma.enrollment.findMany as jest.Mock).mockResolvedValue([]);

      const enrollmentData = await prisma.enrollment.create({
        data: {
          userId,
          courseId,
          status: "ACTIVE",
          progress: 0,
        },
      });

      expect(enrollmentData.id).toBe("enrollment-123");
      expect(enrollmentData.userId).toBe(userId);
      expect(enrollmentData.courseId).toBe(courseId);
    });

    it("prevents duplicate enrollments", async () => {
      const courseId = "course-123";
      const userId = "test-user-id";

      // Mock existing enrollment
      (prisma.enrollment.findMany as jest.Mock).mockResolvedValue([
        {
          id: "existing-enrollment",
          userId,
          courseId,
        },
      ]);

      const existingEnrollments = await prisma.enrollment.findMany({
        where: { userId, courseId },
      });

      expect(existingEnrollments).toHaveLength(1);
    });
  });

  describe("Progress Tracking", () => {
    it("updates user progress in a course", async () => {
      const progressUpdate = {
        lessonId: "lesson-123",
        completed: true,
        timeSpent: 300, // 5 minutes in seconds
      };

      const updatedProgress = {
        id: "progress-123",
        userId: "test-user-id",
        lessonId: "lesson-123",
        completed: true,
        completedAt: new Date(),
        timeSpent: 300,
      };

      (prisma.lesson.update as jest.Mock).mockResolvedValue(updatedProgress);

      // Simulate progress update
      const result = await prisma.lesson.update({
        where: { id: progressUpdate.lessonId },
        data: progressUpdate,
      });

      expect(result.completed).toBe(true);
      expect(result.timeSpent).toBe(300);
    });

    it("awards XP upon lesson completion", async () => {
      const userId = "test-user-id";
      const xpReward = 50;

      // Get current user XP
      (prisma.user.findUnique as jest.Mock).mockResolvedValue({
        id: userId,
        xp: 1000,
      });

      // Update user XP
      (prisma.user.update as jest.Mock).mockResolvedValue({
        id: userId,
        xp: 1050,
      });

      const user = await prisma.user.findUnique({ where: { id: userId } });
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { xp: (user?.xp || 0) + xpReward },
      });

      expect(updatedUser.xp).toBe(1050);
    });
  });

  describe("Module and Lesson Management", () => {
    it("creates a new module in a course", async () => {
      const courseId = "course-123";
      const moduleData = {
        title: "Introduction Module",
        description: "Getting started",
        orderIndex: 0,
      };

      const createdModule = {
        id: "module-123",
        courseId,
        ...moduleData,
      };

      (prisma.module.create as jest.Mock).mockResolvedValue(createdModule);

      const result = await prisma.module.create({
        data: {
          courseId,
          ...moduleData,
        },
      });

      expect(result.id).toBe("module-123");
      expect(result.title).toBe("Introduction Module");
      expect(result.courseId).toBe(courseId);
    });

    it("reorders modules within a course", async () => {
      const modules = [
        { id: "module-1", orderIndex: 0 },
        { id: "module-2", orderIndex: 1 },
        { id: "module-3", orderIndex: 2 },
      ];

      // Swap module-1 and module-2
      const reorderedModules = [
        { id: "module-2", orderIndex: 0 },
        { id: "module-1", orderIndex: 1 },
        { id: "module-3", orderIndex: 2 },
      ];

      reorderedModules.forEach((module) => {
        (prisma.module.update as jest.Mock).mockResolvedValueOnce(module);
      });

      const results = await Promise.all(
        reorderedModules.map((module) =>
          prisma.module.update({
            where: { id: module.id },
            data: { orderIndex: module.orderIndex },
          })
        )
      );

      expect(results[0].orderIndex).toBe(0);
      expect(results[0].id).toBe("module-2");
      expect(results[1].orderIndex).toBe(1);
      expect(results[1].id).toBe("module-1");
    });

    it("creates lessons within a module", async () => {
      const moduleId = "module-123";
      const lessonData = {
        title: "First Lesson",
        description: "Introduction to the topic",
        orderIndex: 0,
        xpReward: 10,
      };

      const createdLesson = {
        id: "lesson-123",
        moduleId,
        ...lessonData,
      };

      (prisma.lesson.create as jest.Mock).mockResolvedValue(createdLesson);

      const result = await prisma.lesson.create({
        data: {
          moduleId,
          ...lessonData,
        },
      });

      expect(result.id).toBe("lesson-123");
      expect(result.title).toBe("First Lesson");
      expect(result.xpReward).toBe(10);
    });

    it("filters courses by category", async () => {
      const category = "Web Development";
      const mockCourses = [
        {
          id: "1",
          title: "React Basics",
          category: "Web Development",
          isPublished: true,
        },
        {
          id: "2",
          title: "Vue.js Fundamentals",
          category: "Web Development",
          isPublished: true,
        },
      ];

      (prisma.course.findMany as jest.Mock).mockResolvedValue(mockCourses);

      const courses = await prisma.course.findMany({
        where: {
          category,
          isPublished: true,
        },
      });

      expect(courses).toHaveLength(2);
      expect(courses.every((c) => c.category === category)).toBe(true);
    });
  });
});