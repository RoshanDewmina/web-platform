import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/courses - Get all courses or filtered courses
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const isAdmin = searchParams.get('admin') === 'true';

    const where: any = {};
    
    if (status) {
      where.isPublished = status === 'published';
    }
    
    if (category) {
      where.category = category;
    }

    // If not admin, only show published courses
    if (!isAdmin) {
      where.isPublished = true;
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        modules: {
          include: {
            lessons: true,
          },
        },
        enrollments: {
          where: {
            userId: userId,
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create a new course (admin only)
export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // TODO: Check if user is admin
    // For now, we'll assume the user is admin if they can access this endpoint

    const body = await request.json();
    const { title, description, thumbnail, difficulty, estimatedHours, category, tags } = body;

    const course = await prisma.course.create({
      data: {
        title,
        description,
        thumbnail,
        difficulty,
        estimatedHours,
        category,
        tags,
        isPublished: false,
      },
    });

    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}
