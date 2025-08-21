import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/analytics/quiz?quizId=... - basic analytics for a quiz
export async function GET(req: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const role = (sessionClaims as any)?.metadata?.role || (sessionClaims as any)?.publicMetadata?.role;
    if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const quizId = searchParams.get('quizId');
    if (!quizId) return NextResponse.json({ error: 'Missing quizId' }, { status: 400 });

    const attempts = await prisma.quizAttempt.findMany({ where: { quizId } });
    const totalAttempts = attempts.length;
    const avgScore = totalAttempts > 0 ? attempts.reduce((s, a) => s + a.score, 0) / totalAttempts : 0;
    const passRate = totalAttempts > 0 ? attempts.filter((a) => a.score >= 70).length / totalAttempts : 0;

    return NextResponse.json({ totalAttempts, avgScore, passRate });
  } catch (e) {
    console.error('quiz analytics error', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}


