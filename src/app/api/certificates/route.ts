import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ certificates: [] });
    const items = await prisma.certificate.findMany({ where: { userId: user.id }, include: { course: true } });
    return NextResponse.json({ certificates: items });
  } catch (e) {
    console.error('cert list error', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) return NextResponse.json({ error: 'User missing' }, { status: 404 });
    const { courseId } = await req.json();
    if (!courseId) return NextResponse.json({ error: 'Missing courseId' }, { status: 400 });

    // Check completion: all lessons completed
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: { modules: { include: { lessons: true } } },
    });
    if (!course) return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    const lessonIds = course.modules.flatMap(m => m.lessons.map(l => l.id));
    const progress = await prisma.progress.findMany({ where: { userId: user.id, lessonId: { in: lessonIds } } });
    const numCompleted = progress.filter(p => p.completed).length;
    const allDone = lessonIds.length === 0 || numCompleted === lessonIds.length;
    if (!allDone) return NextResponse.json({ error: 'Course not completed' }, { status: 400 });

    // Issue certificate: generate simple URL placeholder
    const url = `https://example.com/cert/${user.id}-${course.id}`;
    const cert = await prisma.certificate.upsert({
      where: { userId_courseId: { userId: user.id, courseId: course.id } },
      update: { certificateUrl: url },
      create: { userId: user.id, courseId: course.id, certificateUrl: url },
      include: { course: true },
    });
    return NextResponse.json({ certificate: cert }, { status: 201 });
  } catch (e) {
    console.error('cert issue error', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}


