import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slideId: string }> }
) {
  const { slideId } = await params;
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const slide = await prisma.slide.findUnique({
      where: { id: slideId },
      include: {
        lesson: {
          include: {
            module: {
              include: {
                course: true
              }
            }
          }
        }
      }
    });

    if (!slide) {
      return NextResponse.json({ error: 'Slide not found' }, { status: 404 });
    }

    return NextResponse.json(slide);
  } catch (error) {
    console.error('Error fetching slide:', error);
    return NextResponse.json(
      { error: 'Failed to fetch slide' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ slideId: string }> }
) {
  const { slideId } = await params;
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { title, gridLayout, notes, theme, transition, duration, background } = body;

    const slide = await prisma.slide.update({
      where: { id: slideId },
      data: {
        title,
        gridLayout,
        notes,
        theme,
        transition,
        duration,
        background,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(slide);
  } catch (error) {
    console.error('Error updating slide:', error);
    return NextResponse.json(
      { error: 'Failed to update slide' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ slideId: string }> }
) {
  const { slideId } = await params;
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await prisma.slide.delete({
      where: { id: slideId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting slide:', error);
    return NextResponse.json(
      { error: 'Failed to delete slide' },
      { status: 500 }
    );
  }
}
