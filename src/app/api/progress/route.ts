import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// POST /api/progress - Create or update progress tracking
export async function POST(req: NextRequest) {
  try {
    // For development, bypass authentication
    let userId = 'dev-user';
    
    // Try to get real user ID if Clerk is configured
    try {
      const authResult = await auth();
      if (authResult?.userId) {
        userId = authResult.userId;
      }
    } catch (error) {
      console.log('Running in development mode without Clerk');
    }

    const body = await req.json();
    const { type, data } = body;

    // Get or create user in database
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      // Create dev user if not exists
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: `${userId}@dev.local`,
          username: userId,
          xp: 0,
          level: 1,
        },
      });
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// GET /api/progress?courseId=xxx - Get user progress for a course
export async function GET(req: NextRequest) {
  try {
    // For development, bypass authentication
    let userId = 'dev-user';
    
    // Try to get real user ID if Clerk is configured
    try {
      const authResult = await auth();
      if (authResult?.userId) {
        userId = authResult.userId;
      }
    } catch (error) {
      console.log('Running in development mode without Clerk');
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    // If no courseId, return all progress for user
    if (!courseId) {
      // Get all progress records for the user
      const progress = await prisma.progress.findMany({
        where: { userId },
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

    // Get or create user in database
    let user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      // Create dev user if not exists
      user = await prisma.user.create({
        data: {
          clerkId: userId,
          email: `${userId}@dev.local`,
          username: userId,
          xp: 0,
          level: 1,
        },
      });
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
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Helper functions
async function handleSessionStart(userId: string, data: any) {
  const { courseId, deviceInfo, totalSlides } = data;

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
