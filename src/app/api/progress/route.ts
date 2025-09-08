import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// POST /api/progress - Create or update progress tracking
export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { type, data } = body;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    switch (type) {
      case "session_start":
        return handleSessionStart(user.id, data);
      case "session_end":
        return handleSessionEnd(user.id, data);
      case "slide_view":
        return handleSlideView(user.id, data);
      case "interaction":
        return handleInteraction(user.id, data);
      default:
        return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }
  } catch (error) {
    console.error("Progress tracking error:", error);
    
    // Better error handling with specific error messages
    if (error instanceof Error) {
      if (error.message.includes('P2002')) {
        return NextResponse.json(
          { error: "Progress record already exists" },
          { status: 409 }
        );
      }
      if (error.message.includes('P2025')) {
        return NextResponse.json(
          { error: "Record not found" },
          { status: 404 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Failed to track progress. Please try again later." },
      { status: 500 }
    );
  }
}

// GET /api/progress?courseId=xxx - Get user progress for a course
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }

    // If no courseId, return all progress for user
    if (!courseId) {
      // Get all progress records for the user
      const progress = await prisma.progress.findMany({
        where: { userId: user.id },
        include: {
          lesson: {
            include: {
              module: {
                include: {
                  course: true,
                },
              },
            },
          },
        },
      });
      return NextResponse.json(progress);
    }

    // Get analytics and latest session
    const [analytics, latestSession, enrollment] = await Promise.all([
      prisma.courseAnalytics.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId,
          },
        },
      }),
      prisma.courseSession.findFirst({
        where: {
          userId: user.id,
          courseId,
          endedAt: null,
        },
        orderBy: { startedAt: "desc" },
      }),
      prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId,
          },
        },
      }),
    ]);

    return NextResponse.json({
      analytics,
      currentSession: latestSession,
      enrollment,
    });
  } catch (error) {
    console.error("Get progress error:", error);
    
    // Better error handling
    if (error instanceof Error) {
      if (error.message.includes('Invalid')) {
        return NextResponse.json(
          { error: "Invalid course ID" },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: "Failed to fetch progress data. Please try again later." },
      { status: 500 }
    );
  }
}

// Helper functions
async function handleSessionStart(userId: string, data: any) {
  const { courseId, deviceInfo, totalSlides } = data;

  // Validate required fields
  if (!courseId) {
    throw new Error("Course ID is required");
  }

  // Create new session
  const session = await prisma.courseSession.create({
    data: {
      userId,
      courseId,
      deviceInfo,
      totalSlides,
    },
  });

  // Update or create analytics
  await prisma.courseAnalytics.upsert({
    where: {
      userId_courseId: {
        userId,
        courseId,
      },
    },
    update: {
      totalSessions: { increment: 1 },
      lastAccessedAt: new Date(),
    },
    create: {
      userId,
      courseId,
      totalSessions: 1,
      firstAccessedAt: new Date(),
      lastAccessedAt: new Date(),
    },
  });

  return NextResponse.json({ sessionId: session.id });
}

async function handleSessionEnd(userId: string, data: any) {
  const { sessionId, completedSlides } = data;

  // Validate required fields
  if (!sessionId) {
    throw new Error("Session ID is required");
  }

  const session = await prisma.courseSession.findFirst({
    where: {
      id: sessionId,
      userId,
    },
  });

  if (!session) {
    return NextResponse.json({ error: "Session not found" }, { status: 404 });
  }

  const duration = Math.floor(
    (new Date().getTime() - session.startedAt.getTime()) / 1000
  );

  // Update session
  await prisma.courseSession.update({
    where: { id: sessionId },
    data: {
      endedAt: new Date(),
      totalDuration: duration,
      completedSlides,
      progressSnapshot: data.progressSnapshot,
    },
  });

  // Update analytics
  await prisma.courseAnalytics.update({
    where: {
      userId_courseId: {
        userId,
        courseId: session.courseId,
      },
    },
    data: {
      totalTimeSpent: { increment: duration },
      averageSessionLength: {
        set: await calculateAverageSessionLength(userId, session.courseId),
      },
      completionRate: data.completionRate || 0,
    },
  });

  return NextResponse.json({ success: true });
}

async function handleSlideView(userId: string, data: any) {
  const { sessionId, slideId, moduleId, subModuleId, timeSpent, scrollDepth, completed } = data;

  // Validate required fields
  if (!sessionId || !slideId) {
    throw new Error("Session ID and Slide ID are required");
  }

  // Check if slide view already exists
  const existingView = await prisma.slideView.findFirst({
    where: {
      userId,
      sessionId,
      slideId,
    },
  });

  if (existingView) {
    // Update existing view
    await prisma.slideView.update({
      where: { id: existingView.id },
      data: {
        timeSpent: { increment: timeSpent },
        scrollDepth: Math.max(existingView.scrollDepth, scrollDepth),
        completed: completed || existingView.completed,
      },
    });
  } else {
    // Create new view
    await prisma.slideView.create({
      data: {
        userId,
        sessionId,
        slideId,
        moduleId,
        subModuleId,
        timeSpent,
        scrollDepth,
        completed,
      },
    });
  }

  return NextResponse.json({ success: true });
}

async function handleInteraction(userId: string, data: any) {
  const { sessionId, slideId, eventType, eventName, eventData } = data;

  // Validate required fields
  if (!sessionId || !eventType || !eventName) {
    throw new Error("Session ID, event type, and event name are required");
  }

  // Create interaction event
  await prisma.interactionEvent.create({
    data: {
      userId,
      sessionId,
      slideId,
      eventType,
      eventName,
      eventData,
    },
  });

  // Update interaction count in analytics
  const session = await prisma.courseSession.findUnique({
    where: { id: sessionId },
    select: { courseId: true },
  });

  if (session) {
    await prisma.courseAnalytics.update({
      where: {
        userId_courseId: {
          userId,
          courseId: session.courseId,
        },
      },
      data: {
        totalInteractions: { increment: 1 },
      },
    });
  }

  return NextResponse.json({ success: true });
}

async function calculateAverageSessionLength(userId: string, courseId: string) {
  const sessions = await prisma.courseSession.findMany({
    where: {
      userId,
      courseId,
      endedAt: { not: null },
    },
    select: { totalDuration: true },
  });

  if (sessions.length === 0) return 0;

  const totalDuration = sessions.reduce((sum, s) => sum + s.totalDuration, 0);
  return Math.floor(totalDuration / sessions.length);
}

// PATCH /api/progress - Update progress record
export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { progressId, lessonId, updates } = body;

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Update by progressId or by userId+lessonId
    let progress;
    if (progressId) {
      progress = await prisma.progress.update({
        where: { 
          id: progressId,
          userId: user.id // Ensure user owns this progress
        },
        data: {
          ...updates,
          lastAccessedAt: new Date()
        }
      });
    } else if (lessonId) {
      progress = await prisma.progress.update({
        where: { 
          userId_lessonId: {
            userId: user.id,
            lessonId
          }
        },
        data: {
          ...updates,
          lastAccessedAt: new Date()
        }
      });
    } else {
      return NextResponse.json(
        { error: 'Progress ID or Lesson ID is required' },
        { status: 400 }
      );
    }

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Update progress error:", error);
    
    if (error instanceof Error && error.message.includes('P2025')) {
      return NextResponse.json(
        { error: 'Progress record not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update progress" },
      { status: 500 }
    );
  }
}

// DELETE /api/progress - Delete progress record (reset progress)
export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const progressId = searchParams.get("progressId");
    const lessonId = searchParams.get("lessonId");
    const courseId = searchParams.get("courseId");

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Delete specific progress record
    if (progressId) {
      await prisma.progress.delete({
        where: { 
          id: progressId,
          userId: user.id // Ensure user owns this progress
        }
      });
      return NextResponse.json({ success: true, message: "Progress deleted" });
    }

    // Delete progress for a specific lesson
    if (lessonId) {
      await prisma.progress.delete({
        where: { 
          userId_lessonId: {
            userId: user.id,
            lessonId
          }
        }
      });
      return NextResponse.json({ success: true, message: "Lesson progress deleted" });
    }

    // Delete all progress for a course
    if (courseId) {
      const lessons = await prisma.lesson.findMany({
        where: {
          module: {
            courseId
          }
        },
        select: { id: true }
      });

      await prisma.progress.deleteMany({
        where: {
          userId: user.id,
          lessonId: {
            in: lessons.map(l => l.id)
          }
        }
      });
      
      // Also reset course analytics
      await prisma.courseAnalytics.deleteMany({
        where: {
          userId: user.id,
          courseId
        }
      });
      
      return NextResponse.json({ success: true, message: "Course progress reset" });
    }

    return NextResponse.json(
      { error: 'Progress ID, Lesson ID, or Course ID is required' },
      { status: 400 }
    );
  } catch (error) {
    console.error("Delete progress error:", error);
    
    if (error instanceof Error && error.message.includes('P2025')) {
      return NextResponse.json(
        { error: 'Progress record not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to delete progress" },
      { status: 500 }
    );
  }
}
