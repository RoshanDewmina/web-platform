import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// GET /api/analytics/course?courseId=... - aggregated analytics for a course
export async function GET(req: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const role = (sessionClaims as any)?.metadata?.role || (sessionClaims as any)?.publicMetadata?.role;
    if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get('courseId');
    if (!courseId) return NextResponse.json({ error: 'Missing courseId' }, { status: 400 });

    const enrollments = await prisma.enrollment.findMany({ where: { courseId } });
    const totalStudents = enrollments.length;
    const avgProgress = totalStudents > 0 ? enrollments.reduce((s, e) => s + e.progress, 0) / totalStudents : 0;

    // Quiz pass rate across course quizzes
    const modules = await prisma.module.findMany({
      where: { courseId },
      include: { lessons: { include: { quizzes: true } } },
    });
    const quizIds = modules.flatMap((m) => m.lessons.flatMap((l) => l.quizzes.map((q) => q.id)));
    const attempts = await prisma.quizAttempt.findMany({ where: { quizId: { in: quizIds } } });
    const totalAttempts = attempts.length;
    const passRate = totalAttempts > 0 ? attempts.filter((a) => a.score >= 70).length / totalAttempts : 0;

    return NextResponse.json({ totalStudents, avgProgress, passRate });
  } catch (e) {
    console.error('course analytics error', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}


