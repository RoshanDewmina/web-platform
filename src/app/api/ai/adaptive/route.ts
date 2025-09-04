import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    if (!courseId) return NextResponse.json({ error: 'Missing courseId' }, { status: 400 });

    // Heuristic adaptive logic: prefer next incomplete lesson; if recent quiz score < 70, suggest review; else challenge
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: { 
          include: { lessons: { include: { quizzes: true } } },
          orderBy: { orderIndex: 'asc' }
        },
      },
    });
    if (!course) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const progresses = await prisma.progress.findMany({ where: { userId }, orderBy: { lastAccessedAt: 'desc' } });
    const completed = new Set(progresses.filter(p => p.completed).map(p => p.lessonId));
    let nextLesson: any = null;
    for (const m of course.modules.sort((a,b) => a.orderIndex - b.orderIndex)) {
      for (const l of m.lessons.sort((a,b)=> a.orderIndex - b.orderIndex)) {
        if (!completed.has(l.id)) { nextLesson = l; break; }
      }
      if (nextLesson) break;
    }
    if (!nextLesson) return NextResponse.json({ suggestion: null });

    const recentAttempts = await prisma.quizAttempt.findMany({ where: { userId }, orderBy: { completedAt: 'desc' }, take: 5 });
    const lowScore = recentAttempts.find(a => a.score < 70);
    const mode = lowScore ? 'review' : 'challenge';
    return NextResponse.json({ suggestion: { lessonId: nextLesson.id, title: nextLesson.title, mode } });
  } catch (e) {
    console.error('adaptive error', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}


