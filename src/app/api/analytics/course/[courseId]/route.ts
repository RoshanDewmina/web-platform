import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// GET /api/analytics/course/[courseId] - Get detailed course analytics
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const { courseId } = await params;
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Get comprehensive analytics
    const [
      analytics,
      sessions,
      slideViews,
      interactions,
      enrollment,
    ] = await Promise.all([
      // Get aggregated analytics
      prisma.courseAnalytics.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: courseId,
          },
        },
      }),
      
      // Get all sessions
      prisma.courseSession.findMany({
        where: {
          userId: user.id,
          courseId: courseId,
        },
        orderBy: { startedAt: "desc" },
        take: 10, // Last 10 sessions
      }),
      
      // Get slide view statistics
      prisma.slideView.groupBy({
        by: ["slideId"],
        where: {
          userId: user.id,
          session: {
            courseId: courseId,
          },
        },
        _count: true,
        _avg: {
          timeSpent: true,
          scrollDepth: true,
        },
        _max: {
          completed: true,
        },
      }),
      
      // Get interaction types count
      prisma.interactionEvent.groupBy({
        by: ["eventType", "eventName"],
        where: {
          userId: user.id,
          session: {
            courseId: courseId,
          },
        },
        _count: true,
      }),
      
      // Get enrollment data
      prisma.enrollment.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: courseId,
          },
        },
      }),
    ]);

    // Calculate additional insights
    const insights = calculateInsights(sessions, slideViews, interactions);

    return NextResponse.json({
      analytics,
      recentSessions: sessions,
      slideStatistics: slideViews,
      interactionStats: interactions,
      enrollment,
      insights,
    });
  } catch (error) {
    console.error("Get analytics error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function calculateInsights(sessions: any[], slideViews: any[], interactions: any[]) {
  // Calculate average session insights
  const completedSessions = sessions.filter(s => s.endedAt);
  const avgSessionDuration = completedSessions.length > 0
    ? completedSessions.reduce((sum, s) => sum + s.totalDuration, 0) / completedSessions.length
    : 0;

  // Find most viewed slides
  const mostViewedSlides = slideViews
    .sort((a, b) => b._count - a._count)
    .slice(0, 5);

  // Find slides with lowest completion
  const strugglingSlides = slideViews
    .filter(sv => sv._max.completed === false)
    .sort((a, b) => (a._avg.scrollDepth || 0) - (b._avg.scrollDepth || 0))
    .slice(0, 5);

  // Calculate engagement patterns
  const sessionsByHour = sessions.reduce((acc, session) => {
    const hour = new Date(session.startedAt).getHours();
    acc[hour] = (acc[hour] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const sessionsByDay = sessions.reduce((acc, session) => {
    const day = new Date(session.startedAt).toLocaleDateString('en-US', { weekday: 'long' });
    acc[day] = (acc[day] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Find most common interactions
  const topInteractions = interactions
    .sort((a, b) => b._count - a._count)
    .slice(0, 10);

  return {
    avgSessionDuration: Math.round(avgSessionDuration / 60), // in minutes
    totalSessions: sessions.length,
    completedSessions: completedSessions.length,
    mostViewedSlides,
    strugglingSlides,
    engagementPatterns: {
      byHour: sessionsByHour,
      byDay: sessionsByDay,
    },
    topInteractions,
  };
}
