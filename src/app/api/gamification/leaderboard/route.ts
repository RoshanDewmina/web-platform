import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const limit = Number(req.nextUrl.searchParams.get("limit") || 20);

    const users = await prisma.user.findMany({
      orderBy: [{ xp: "desc" }, { createdAt: "asc" }],
      take: Math.min(limit, 100),
      select: { id: true, username: true, xp: true, level: true, avatarUrl: true, createdAt: true },
    });

    return NextResponse.json({ leaderboard: users });
  } catch (e) {
    console.error("leaderboard error", e);
    return NextResponse.json({ error: "Failed to load leaderboard" }, { status: 500 });
  }
}


