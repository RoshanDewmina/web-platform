import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET /api/courses - Get all courses or filtered courses
export async function GET(request: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      // For development, return empty array instead of error
      return NextResponse.json([]);
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

    // If not admin, only show published and visible courses, and not before schedule
    if (!isAdmin) {
      where.AND = [
        { isPublished: true },
        {
          OR: [
            { scheduledPublishAt: null },
            { scheduledPublishAt: { lte: new Date() } },
          ],
        },
        { visibility: 'PUBLIC' },
      ];
    }

    const courses = await prisma.course.findMany({
      where,
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                slides: {
                  include: {
                    blocks: true,
                  },
                  orderBy: { orderIndex: 'asc' },
                },
              },
              orderBy: { orderIndex: 'asc' },
            },
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
    const { userId, sessionClaims } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const role = (sessionClaims as any)?.metadata?.role || (sessionClaims as any)?.publicMetadata?.role;
    
    // Temporarily allow all authenticated users to create courses for development
    console.log('Course creation attempt:', { userId, role, sessionClaims });
    
    // TODO: Re-enable admin check once metadata is working properly
    // if (role !== 'admin') {
    //   return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    // }

    const body = await request.json();
    const { title, description, thumbnail, difficulty, estimatedHours, category, tags, visibility, scheduledPublishAt, accessControl, enrollmentLimit, price } = body;

    const course = await prisma.course.create({
      data: {
        title,
        description,
        thumbnail: thumbnail ?? null,
        difficulty,
        estimatedHours,
        category,
        tags,
        isPublished: false,
        visibility: (visibility || 'PUBLIC'),
        scheduledPublishAt: scheduledPublishAt ? new Date(scheduledPublishAt) : null,
        accessControl: accessControl ?? null,
        enrollmentLimit: enrollmentLimit ?? null,
        price: price ?? 0,
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

// POST /api/courses:bulk - Bulk operations (publish/unpublish, duplicate, archive)
export async function PUT(request: NextRequest) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const role = (sessionClaims as any)?.metadata?.role || (sessionClaims as any)?.publicMetadata?.role;
    
    // Temporarily allow all authenticated users for development
    console.log('Bulk operation attempt:', { userId, role, sessionClaims });
    
    // TODO: Re-enable admin check once metadata is working properly
    // if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const body = await request.json();
    const { action, courseIds } = body as { action: 'publish' | 'unpublish' | 'archive' | 'duplicate'; courseIds: string[] };
    if (!action || !Array.isArray(courseIds) || courseIds.length === 0) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    if (action === 'publish' || action === 'unpublish' || action === 'archive') {
      const isPublished = action === 'publish' ? true : action === 'unpublish' ? false : undefined;
      if (isPublished !== undefined) {
        await prisma.course.updateMany({ where: { id: { in: courseIds } }, data: { isPublished } });
      } else {
        // Archive flag can be modeled via category or add a new field; for now, set category suffix
        await Promise.all(
          courseIds.map((id) =>
            prisma.course.update({ where: { id }, data: { category: 'archived' } })
          )
        );
      }
      return NextResponse.json({ ok: true });
    }

    if (action === 'duplicate') {
      const duplicated: string[] = [];
      for (const id of courseIds) {
        const base = await prisma.course.findUnique({
          where: { id },
          include: {
            modules: {
              include: {
                lessons: {
                  include: {
                    slides: { include: { blocks: true } },
                  },
                },
              },
            },
          },
        });
        if (!base) continue;

        const newCourse = await prisma.course.create({
          data: {
            title: `${base.title} (Copy)`,
            description: base.description,
            thumbnail: base.thumbnail ?? undefined,
            difficulty: base.difficulty,
            estimatedHours: base.estimatedHours,
            category: base.category,
            tags: base.tags,
            isPublished: false,
          },
        });

        for (const m of base.modules) {
          const newModule = await prisma.module.create({
            data: {
              courseId: newCourse.id,
              title: m.title,
              description: m.description ?? undefined,
              orderIndex: m.orderIndex,
            },
          });
          for (const l of m.lessons) {
            const newLesson = await prisma.lesson.create({
              data: {
                moduleId: newModule.id,
                title: l.title,
                description: l.description ?? undefined,
                content: l.content ?? Prisma.JsonNull,
                videoUrl: l.videoUrl ?? undefined,
                duration: l.duration ?? undefined,
                orderIndex: l.orderIndex,
                xpReward: l.xpReward,
              },
            });
            for (const s of l.slides) {
              const newSlide = await prisma.slide.create({
                data: {
                  lessonId: newLesson.id,
                  title: s.title,
                  notes: s.notes ?? undefined,
                  template: s.template ?? undefined,
                  orderIndex: s.orderIndex,
                },
              });
              for (const b of s.blocks) {
                await prisma.contentBlock.create({
                  data: {
                    slideId: newSlide.id,
                    type: b.type,
                                      content: b.content ?? Prisma.JsonNull,
                  settings: b.settings ?? Prisma.JsonNull,
                    orderIndex: b.orderIndex,
                  },
                });
              }
            }
          }
        }
        duplicated.push(newCourse.id);
      }
      return NextResponse.json({ duplicated });
    }

    return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  } catch (error) {
    console.error('Error in bulk operation:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}
