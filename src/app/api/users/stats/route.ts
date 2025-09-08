import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// GET /api/users/stats - Get user statistics
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user with related data
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        progress: {
          where: {
            completed: true
          }
        },
        quizAttempts: {
          where: {
            score: 100
          }
        },
        friendsInitiated: true,
        friendsReceived: true,
        studyGroups: true,
        achievements: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Calculate total time spent from progress records
    const totalMinutes = Math.round(
      user.progress.reduce((sum, p) => sum + (p.timeSpent || 0), 0) / 60
    );

    // Calculate level from XP (100 XP per level)
    const currentLevel = Math.floor(user.xp / 100) + 1;
    const nextLevelXP = currentLevel * 100;

    // Calculate friends count
    const friendsCount = user.friendsInitiated.length + user.friendsReceived.length;

    // Get recent activity to calculate average daily time
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const recentProgress = await prisma.progress.findMany({
      where: {
        userId: user.id,
        lastAccessedAt: {
          gte: thirtyDaysAgo
        }
      },
      select: {
        timeSpent: true,
        lastAccessedAt: true
      }
    });

    // Calculate average daily time
    let averageDaily = 0;
    if (recentProgress.length > 0) {
      const dailyTimes = new Map<string, number>();
      recentProgress.forEach(p => {
        const date = p.lastAccessedAt.toISOString().split('T')[0];
        dailyTimes.set(date, (dailyTimes.get(date) || 0) + (p.timeSpent || 0));
      });
      const totalDays = dailyTimes.size;
      const totalTime = Array.from(dailyTimes.values()).reduce((sum, time) => sum + time, 0);
      averageDaily = Math.round(totalTime / totalDays / 60); // Convert to minutes
    }

    // Get quiz stats
    const allQuizAttempts = await prisma.quizAttempt.count({
      where: { userId: user.id }
    });

    const stats = {
      totalXP: user.xp,
      currentLevel,
      nextLevelXP,
      currentStreak: user.currentStreak,
      longestStreak: user.longestStreak,
      totalLessons: user.progress.length,
      totalQuizzes: allQuizAttempts,
      perfectQuizzes: user.quizAttempts.length,
      totalMinutes,
      averageDaily,
      friendsCount,
      groupsJoined: user.studyGroups.length,
      achievementsEarned: user.achievements.length,
      lastActivityDate: user.lastActivityDate
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Get user stats error:", error);
    return NextResponse.json(
      { error: "Failed to fetch user statistics" },
      { status: 500 }
    );
  }
}

// PATCH /api/users/stats - Update user stats (streak, XP, etc.)
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
    const { action, data } = body;

    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    let updateData: any = {};

    switch (action) {
      case 'update_streak':
        // Check if user has activity today
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        
        const lastActivity = user.lastActivityDate ? new Date(user.lastActivityDate) : null;
        if (lastActivity) {
          lastActivity.setHours(0, 0, 0, 0);
        }

        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (!lastActivity || lastActivity < yesterday) {
          // Streak broken, reset to 1
          updateData.currentStreak = 1;
        } else if (lastActivity.getTime() === yesterday.getTime()) {
          // Continuing streak
          updateData.currentStreak = user.currentStreak + 1;
          updateData.longestStreak = Math.max(user.longestStreak, updateData.currentStreak);
        }
        // If activity is today, don't update streak

        updateData.lastActivityDate = new Date();
        break;

      case 'add_xp':
        if (typeof data.xp !== 'number' || data.xp < 0) {
          return NextResponse.json(
            { error: 'Invalid XP value' },
            { status: 400 }
          );
        }
        updateData.xp = { increment: data.xp };
        break;

      case 'update_learning_time':
        if (typeof data.minutes !== 'number' || data.minutes < 0) {
          return NextResponse.json(
            { error: 'Invalid minutes value' },
            { status: 400 }
          );
        }
        updateData.learningMinutes = { increment: data.minutes };
        break;

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData
    });

    return NextResponse.json({
      success: true,
      user: {
        xp: updatedUser.xp,
        currentStreak: updatedUser.currentStreak,
        longestStreak: updatedUser.longestStreak,
        learningMinutes: updatedUser.learningMinutes,
        lastActivityDate: updatedUser.lastActivityDate
      }
    });
  } catch (error) {
    console.error("Update user stats error:", error);
    return NextResponse.json(
      { error: "Failed to update user statistics" },
      { status: 500 }
    );
  }
}