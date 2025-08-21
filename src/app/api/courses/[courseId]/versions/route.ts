import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST: create a new version snapshot
export async function POST(req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const role = (sessionClaims as any)?.metadata?.role || (sessionClaims as any)?.publicMetadata?.role;
    if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { courseId } = await params;
    const current = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: { include: { lessons: { include: { slides: { include: { blocks: true } } } } } },
      },
    });
    if (!current) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const last = await prisma.courseVersion.findFirst({ where: { courseId }, orderBy: { version: 'desc' } });
    const version = (last?.version || 0) + 1;
    const created = await prisma.courseVersion.create({
      data: {
        courseId,
        version,
        label: `v${version}`,
        data: current,
        createdBy: userId,
      },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error('version create error', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

// GET: list versions
export async function GET(req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const role = (sessionClaims as any)?.metadata?.role || (sessionClaims as any)?.publicMetadata?.role;
    if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { courseId } = await params;
    const versions = await prisma.courseVersion.findMany({ where: { courseId }, orderBy: { version: 'desc' } });
    return NextResponse.json(versions);
  } catch (e) {
    console.error('versions list error', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}


