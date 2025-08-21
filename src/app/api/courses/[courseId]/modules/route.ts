import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/courses/[courseId]/modules - Get all modules for a course
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { courseId } = await params;

    const modules = await prisma.module.findMany({
      where: { courseId },
      include: {
        lessons: {
          include: {
            slides: { include: { blocks: true }, orderBy: { orderIndex: 'asc' } },
          },
          orderBy: {
            orderIndex: 'asc',
          },
        },
      },
      orderBy: {
        orderIndex: 'asc',
      },
    });

    return NextResponse.json(modules);
  } catch (error) {
    console.error('Error fetching modules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch modules' },
      { status: 500 }
    );
  }
}

// POST /api/courses/[courseId]/modules - Create a new module (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const role = (sessionClaims as any)?.metadata?.role || (sessionClaims as any)?.publicMetadata?.role;
    if (role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const { courseId } = await params;
    const body = await request.json();
    const { title, description, orderIndex } = body;

    const module = await prisma.module.create({
      data: {
        courseId,
        title,
        description,
        orderIndex: orderIndex ?? 0,
      },
    });

    return NextResponse.json(module, { status: 201 });
  } catch (error) {
    console.error('Error creating module:', error);
    return NextResponse.json(
      { error: 'Failed to create module' },
      { status: 500 }
    );
  }
}
