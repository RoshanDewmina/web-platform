import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

// GET /api/achievements - Get all achievements and user's earned achievements
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { clerkId: userId },
      include: {
        achievements: {
          include: {
            achievement: true
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get all achievements
    const allAchievements = await prisma.achievement.findMany({
      orderBy: {
        category: 'asc'
      }
    });

    // Map achievements with earned status
    const achievementsWithStatus = allAchievements.map(achievement => {
      const userAchievement = user.achievements.find(
        ua => ua.achievementId === achievement.id
      );
      
      return {
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        category: achievement.category,
        xpReward: achievement.xpReward,
        earned: !!userAchievement,
        earnedDate: userAchievement?.earnedAt?.toISOString(),
      };
    });

    return NextResponse.json(achievementsWithStatus);
  } catch (error) {
    console.error("Get achievements error:", error);
    return NextResponse.json(
      { error: "Failed to fetch achievements" },
      { status: 500 }
    );
  }
}

// POST /api/achievements - Award an achievement to a user
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
    const { achievementId } = body;

    if (!achievementId) {
      return NextResponse.json(
        { error: 'Achievement ID is required' },
        { status: 400 }
      );
    }

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

    // Check if achievement exists
    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId }
    });

    if (!achievement) {
      return NextResponse.json(
        { error: 'Achievement not found' },
        { status: 404 }
      );
    }

    // Check if already earned
    const existing = await prisma.userAchievement.findUnique({
      where: {
        userId_achievementId: {
          userId: user.id,
          achievementId
        }
      }
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Achievement already earned' },
        { status: 409 }
      );
    }

    // Create user achievement and update XP
    const [userAchievement, updatedUser] = await prisma.$transaction([
      prisma.userAchievement.create({
        data: {
          userId: user.id,
          achievementId
        },
        include: {
          achievement: true
        }
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          xp: {
            increment: achievement.xpReward
          }
        }
      })
    ]);

    return NextResponse.json({
      success: true,
      achievement: userAchievement.achievement,
      newXP: updatedUser.xp
    });
  } catch (error) {
    console.error("Award achievement error:", error);
    return NextResponse.json(
      { error: "Failed to award achievement" },
      { status: 500 }
    );
  }
}