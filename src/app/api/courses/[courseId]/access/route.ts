import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { courseId } = await params;
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ unlocked: [] });

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: { lessons: true },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });
    if (!course) return NextResponse.json({ unlocked: [] });

    const progress = await prisma.progress.findMany({ where: { userId: user.id } });
    const completed = new Set(progress.filter(p => p.completed).map(p => p.lessonId));

    const unlocked: string[] = [];
    for (const m of course.modules) {
      const lessonsSorted = [...m.lessons].sort((a,b)=> a.orderIndex - b.orderIndex);
      let prevCompleted = true;
      for (const l of lessonsSorted) {
        const isCompleted = completed.has(l.id);
        const canAccess = prevCompleted || isCompleted;
        if (canAccess) unlocked.push(l.id);
        prevCompleted = prevCompleted && isCompleted;
      }
    }
    return NextResponse.json({ unlocked });
  } catch (e) {
    console.error('access compute error', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}


