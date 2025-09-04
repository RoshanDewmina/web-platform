import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET /api/courses/[courseId]/builder - Return nested structure tailored for the builder
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { courseId } = await params;
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      include: {
        modules: {
          include: {
            lessons: {
              include: {
                slides: { include: { blocks: true }, orderBy: { orderIndex: 'asc' } },
              },
              orderBy: { orderIndex: 'asc' },
            },
          },
          orderBy: { orderIndex: 'asc' },
        },
      },
    });

    if (!course) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const builderCourse = {
      id: course.id,
      title: course.title,
      description: course.description,
      thumbnail: course.thumbnail ?? undefined,
      banner: undefined,
      modules: course.modules.map((m) => ({
        id: m.id,
        courseId: course.id,
        title: m.title,
        description: m.description ?? undefined,
        order: m.orderIndex,
        lessons: m.lessons.map((l) => ({
          id: l.id,
          moduleId: m.id,
          title: l.title,
          description: l.description ?? undefined,
          order: l.orderIndex,
          duration: l.duration ?? undefined,
          xpReward: l.xpReward,
          settings: { locked: false, prerequisites: [] },
          slides: l.slides
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((s) => ({
              id: s.id,
              title: s.title,
              notes: s.notes ?? undefined,
              template: s.template ?? undefined,
              order: s.orderIndex,
              blocks: s.blocks
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map((b) => ({
                  id: b.id,
                  type: b.type as any,
                  content: b.content as any,
                  settings: (b.settings as any) ?? {},
                  order: b.orderIndex,
                })),
            })),
        })),
      })),
      metadata: {
        difficulty: course.difficulty.toLowerCase(),
        duration: course.estimatedHours,
        objectives: [],
        prerequisites: [],
        tags: course.tags,
        category: course.category,
      },
      settings: {
        status: course.isPublished ? 'published' : 'draft',
        visibility: (course.visibility || 'PUBLIC').toLowerCase(),
        enrollmentLimit: course.enrollmentLimit ?? undefined,
        price: course.price,
        publishDate: course.scheduledPublishAt ?? undefined,
      },
      createdBy: '',
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    };

    return NextResponse.json(builderCourse);
  } catch (e) {
    console.error('builder GET error', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

// POST /api/courses/[courseId]/builder - Replace nested structure from builder
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    const role = (sessionClaims as any)?.metadata?.role || (sessionClaims as any)?.publicMetadata?.role;
    
    // Temporarily allow all authenticated users for development
    console.log('Course builder access:', { userId, role, sessionClaims });
    
    // TODO: Re-enable admin check once metadata is working properly
    // if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

    const { courseId } = await params;
    const body = await request.json();
    const { course } = body as { course: any };
    if (!course) return NextResponse.json({ error: 'Missing course' }, { status: 400 });

    // Update course basics
    await prisma.course.update({
      where: { id: courseId },
      data: {
        title: course.title,
        description: course.description,
        thumbnail: course.thumbnail ?? null,
        difficulty: (course.metadata?.difficulty || 'beginner').toUpperCase(),
        estimatedHours: course.metadata?.duration || 0,
        category: course.metadata?.category || '',
        tags: course.metadata?.tags || [],
        price: course.settings?.price || 0,
        isPublished: course.settings?.status === 'published',
        visibility: (course.settings?.visibility || 'public').toUpperCase(),
        scheduledPublishAt: course.settings?.publishDate ? new Date(course.settings.publishDate) : null,
        enrollmentLimit: course.settings?.enrollmentLimit ?? null,
        accessControl: Prisma.JsonNull,
      },
    });

    // Replace modules/lessons/slides/blocks atomically
    await prisma.$transaction(async (tx) => {
      // Delete existing modules to cascade delete all nested entities
      await tx.module.deleteMany({ where: { courseId } });

      // Recreate structure
      for (const [moduleIndex, m] of (course.modules || []).entries()) {
        const newModule = await tx.module.create({
          data: {
            courseId,
            title: m.title || 'Untitled Module',
            description: m.description || null,
            orderIndex: moduleIndex,
          },
        });
        for (const [lessonIndex, l] of (m.lessons || []).entries()) {
          const newLesson = await tx.lesson.create({
            data: {
              moduleId: newModule.id,
              title: l.title || 'Untitled Lesson',
              description: l.description || null,
              content: {},
              videoUrl: null,
              duration: l.duration || null,
              orderIndex: lessonIndex,
              xpReward: l.xpReward || 10,
            },
          });
          for (const [slideIndex, s] of (l.slides || []).entries()) {
            const newSlide = await tx.slide.create({
              data: {
                lessonId: newLesson.id,
                title: s.title || 'Slide',
                notes: s.notes || null,
                template: s.template || null,
                orderIndex: slideIndex,
              },
            });
            for (const [blockIndex, b] of (s.blocks || []).entries()) {
              await tx.contentBlock.create({
                data: {
                  slideId: newSlide.id,
                  type: b.type,
                  content: b.content || {},
                  settings: b.settings || {},
                  orderIndex: blockIndex,
                },
              });
            }
          }
        }
      }
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('builder POST error', e);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}


