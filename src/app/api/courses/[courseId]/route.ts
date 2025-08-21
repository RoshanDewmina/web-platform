import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/courses/[courseId] - Get a specific course
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

    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                slides: {
                  include: { blocks: true },
                  orderBy: { orderIndex: 'asc' },
                },
                quizzes: true,
                activities: true,
              },
              orderBy: { orderIndex: 'asc' },
            },
          },
          orderBy: {
            orderIndex: 'asc',
          },
        },
        enrollments: {
          where: {
            userId: userId,
          },
        },
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found' }, { status: 404 });
    }

    // Check access for unpublished or scheduled courses or restricted visibility
    if (!course.isPublished || (course.scheduledPublishAt && course.scheduledPublishAt > new Date()) || course.visibility !== 'PUBLIC') {
      const { sessionClaims } = await auth();
      const role = (sessionClaims as any)?.metadata?.role || (sessionClaims as any)?.publicMetadata?.role;
      const isAdmin = role === 'admin';
      if (!isAdmin) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

// PUT /api/courses/[courseId] - Update a course (admin only)
export async function PUT(
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

    const updateData: any = { ...body };
    if (Object.prototype.hasOwnProperty.call(body, 'scheduledPublishAt')) {
      updateData.scheduledPublishAt = body.scheduledPublishAt ? new Date(body.scheduledPublishAt) : null;
    }
    if (Object.prototype.hasOwnProperty.call(body, 'visibility')) {
      updateData.visibility = body.visibility;
    }
    if (Object.prototype.hasOwnProperty.call(body, 'accessControl')) {
      updateData.accessControl = body.accessControl ?? null;
    }
    if (Object.prototype.hasOwnProperty.call(body, 'enrollmentLimit')) {
      updateData.enrollmentLimit = body.enrollmentLimit ?? null;
    }

    const course = await prisma.course.update({
      where: { id: courseId },
      data: updateData,
    });

    return NextResponse.json(course);
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[courseId] - Delete a course (admin only)
export async function DELETE(
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

    await prisma.course.delete({
      where: { id: courseId },
    });

    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}
