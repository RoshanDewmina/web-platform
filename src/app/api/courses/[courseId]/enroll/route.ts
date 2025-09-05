import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

// POST /api/courses/[courseId]/enroll - Enroll in a course
export async function POST(
  request: NextRequest,
  props: { params: Promise<{ courseId: string }> }
) {
  try {
    // For development, bypass authentication
    let userId = 'dev-user';
    
    // Try to get real user ID if Clerk is configured
    try {
      const authResult = await auth();
      if (authResult?.userId) {
        userId = authResult.userId;
      }
    } catch (error) {
      console.log('Running in development mode without Clerk');
    }

    const { courseId } = await props.params;

    // Check if course exists and is published
    const course = await prisma.course.findFirst({
      where: {
        id: courseId,
        isPublished: true,
        visibility: 'PUBLIC',
      },
    });

    if (!course) {
      return NextResponse.json({ error: 'Course not found or not available' }, { status: 404 });
    }

    // Check if already enrolled
    const existingEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId,
        courseId,
      },
    });

    if (existingEnrollment) {
      return NextResponse.json({ error: 'Already enrolled in this course' }, { status: 400 });
    }

    // Check enrollment limit if applicable
    if (course.enrollmentLimit) {
      const enrollmentCount = await prisma.enrollment.count({
        where: { courseId },
      });

      if (enrollmentCount >= course.enrollmentLimit) {
        return NextResponse.json({ error: 'Course enrollment limit reached' }, { status: 400 });
      }
    }

    // Create enrollment
    const enrollment = await prisma.enrollment.create({
      data: {
        userId,
        courseId,
        enrolledAt: new Date(),
      },
    });

    // Create initial progress records for all lessons
    const modules = await prisma.module.findMany({
      where: { courseId },
      include: {
        lessons: true,
      },
    });

    const progressRecords = [];
    for (const module of modules) {
      for (const lesson of module.lessons) {
        progressRecords.push({
          userId,
          lessonId: lesson.id,
          isCompleted: false,
          completedAt: null,
          timeSpent: 0,
        });
      }
    }

    if (progressRecords.length > 0) {
      await prisma.progress.createMany({
        data: progressRecords,
        skipDuplicates: true,
      });
    }

    return NextResponse.json(enrollment, { status: 201 });
  } catch (error) {
    console.error('Error enrolling in course:', error);
    return NextResponse.json(
      { error: 'Failed to enroll in course' },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[courseId]/enroll - Unenroll from a course
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ courseId: string }> }
) {
  try {
    // For development, bypass authentication
    let userId = 'dev-user';
    
    // Try to get real user ID if Clerk is configured
    try {
      const authResult = await auth();
      if (authResult?.userId) {
        userId = authResult.userId;
      }
    } catch (error) {
      console.log('Running in development mode without Clerk');
    }

    const { courseId } = await props.params;

    // Delete enrollment
    const enrollment = await prisma.enrollment.deleteMany({
      where: {
        userId,
        courseId,
      },
    });

    if (enrollment.count === 0) {
      return NextResponse.json({ error: 'Not enrolled in this course' }, { status: 404 });
    }

    // Optionally delete progress records
    // await prisma.progress.deleteMany({
    //   where: {
    //     userId,
    //     lesson: {
    //       module: {
    //         courseId,
    //       },
    //     },
    //   },
    // });

    return NextResponse.json({ message: 'Successfully unenrolled' });
  } catch (error) {
    console.error('Error unenrolling from course:', error);
    return NextResponse.json(
      { error: 'Failed to unenroll from course' },
      { status: 500 }
    );
  }
}
