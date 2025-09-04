import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

function formatDate(d: Date) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const me = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!me) return NextResponse.json({ daily: [], byDow: [] });

    const { searchParams } = new URL(req.url);
    const rangeDays = Math.min(parseInt(searchParams.get("rangeDays") || "35", 10), 365);
    const since = new Date(Date.now() - rangeDays * 24 * 60 * 60 * 1000);

    const progresses = await prisma.progress.findMany({
      where: { userId: me.id, lastAccessedAt: { gte: since } },
      select: { timeSpent: true, completed: true, lastAccessedAt: true },
      orderBy: { lastAccessedAt: "asc" },
    });

    const dailyMap = new Map<string, { minutes: number; sessions: number; completed: number }>();
    for (const p of progresses) {
      const key = formatDate(p.lastAccessedAt);
      const current = dailyMap.get(key) || { minutes: 0, sessions: 0, completed: 0 };
      current.minutes += Math.round((p.timeSpent || 0) / 60);
      current.sessions += 1;
      if (p.completed) current.completed += 1;
      dailyMap.set(key, current);
    }

    // Fill missing days
    for (let i = 0; i <= rangeDays; i++) {
      const day = new Date(since.getTime() + i * 24 * 60 * 60 * 1000);
      const key = formatDate(day);
      if (!dailyMap.has(key)) dailyMap.set(key, { minutes: 0, sessions: 0, completed: 0 });
    }

    const daily = Array.from(dailyMap.entries())
      .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      .map(([date, v]) => ({ date, ...v }));

    const byDow = [0, 1, 2, 3, 4, 5, 6].map((dow) => ({ dow, minutes: 0, sessions: 0 }));
    for (const d of daily) {
      const dt = new Date(d.date + "T00:00:00");
      const idx = dt.getDay();
      byDow[idx].minutes += d.minutes;
      byDow[idx].sessions += d.sessions;
    }

    return NextResponse.json({ daily, byDow });
  } catch (e) {
    console.error("progress analytics error", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}


