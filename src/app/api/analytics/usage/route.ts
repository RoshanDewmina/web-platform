import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    // Allow anonymous usage logs for public routes
    const body = await req.json();
    const { event, properties } = body || {};
    if (!event) return NextResponse.json({ error: "Missing event" }, { status: 400 });

    // For demo, store into Activity as a generic event if user present
    if (userId) {
      const me = await prisma.user.findUnique({ where: { clerkId: userId } });
      if (me) {
        await prisma.activity.create({
          data: {
            userId: me.id,
            type: "ACHIEVEMENT_EARNED",
            description: `usage:${event}`,
            metadata: properties || {},
          },
        });
      }
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("usage analytics error", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}


