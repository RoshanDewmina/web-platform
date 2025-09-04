import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// Returns a simple schedule of lessons to review today based on lastAccessedAt and completed flag
export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    if (!courseId) return NextResponse.json({ error: 'Missing courseId' }, { status: 400 });

    const progresses = await prisma.progress.findMany({ where: { userId }, include: { lesson: true } });
    const today = new Date();
    const due: any[] = [];
    for (const p of progresses) {
      const daysSince = p.lastAccessedAt ? Math.floor((today.getTime() - new Date(p.lastAccessedAt).getTime()) / (1000*60*60*24)) : 999;
      // Basic intervals: 1, 3, 7, 14 days
      const intervals = [1, 3, 7, 14, 30];
      const shouldReview = intervals.includes(daysSince);
      if (shouldReview && p.lesson?.moduleId) {
        due.push({ lessonId: p.lessonId, title: p.lesson.title, daysSince });
      }
    }
    due.sort((a,b)=> b.daysSince - a.daysSince);
    return NextResponse.json({ due });
  } catch (e) {
    console.error('spaced error', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}


