import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST: submit approval request for a version
export async function POST(req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const role = (sessionClaims as any)?.metadata?.role || (sessionClaims as any)?.publicMetadata?.role;
    if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { courseId } = await params;
    const { versionId, notes } = await req.json();
    if (!versionId) return NextResponse.json({ error: 'Missing versionId' }, { status: 400 });

    const created = await prisma.approvalRequest.create({
      data: { courseId, versionId, submittedBy: userId, notes: notes ?? null },
    });
    return NextResponse.json(created, { status: 201 });
  } catch (e) {
    console.error('approval submit error', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

// PUT: approve/reject
export async function PUT(req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const role = (sessionClaims as any)?.metadata?.role || (sessionClaims as any)?.publicMetadata?.role;
    if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { courseId } = await params;
    const { requestId, action, notes } = await req.json();
    if (!requestId || !['APPROVED', 'REJECTED'].includes(action)) return NextResponse.json({ error: 'Invalid' }, { status: 400 });

    const updated = await prisma.approvalRequest.update({
      where: { id: requestId },
      data: { status: action as any, reviewedBy: userId, reviewedAt: new Date(), notes: notes ?? null },
    });
    return NextResponse.json(updated);
  } catch (e) {
    console.error('approval update error', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}


