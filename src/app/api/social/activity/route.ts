import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);
    const scope = searchParams.get("scope") || "friends"; // friends | me | global

    const me = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!me) return NextResponse.json({ items: [] });

    let userIds: string[] | undefined;
    if (scope === "me") {
      userIds = [me.id];
    } else if (scope === "friends") {
      const friendships = await prisma.friendship.findMany({
        where: { OR: [{ userId: me.id }, { friendId: me.id }] },
      });
      const friendIds = friendships.map((f) => (f.userId === me.id ? f.friendId : f.userId));
      userIds = [me.id, ...friendIds];
    } else {
      // global - no filter
      userIds = undefined;
    }

    const items = await prisma.activity.findMany({
      where: userIds ? { userId: { in: userIds } } : undefined,
      include: {
        user: { select: { id: true, username: true, avatarUrl: true, level: true } },
        lesson: { select: { id: true, title: true } },
      },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ items });
  } catch (e) {
    console.error("activity feed error", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}


