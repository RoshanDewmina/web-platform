import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { 
  AICommand, 
  GridElement, 
  SlideLayout,
  slotToGridPosition,
  checkCollision,
  findFreePosition 
} from '@/types/slide-builder';

// Command parameter schemas
const CreateSlidesFromTextSchema = z.object({
  courseId: z.string(),
  lessonId: z.string(),
  sourceText: z.string().optional(),
  strategy: z.enum(['by_headings', 'by_semantics', 'hybrid']).default('hybrid'),
  imagePlaceholders: z.enum(['auto', 'none']).default('auto'),
  maxSlidesPerHeading: z.number().optional(),
});

const AddElementSchema = z.object({
  slideId: z.string(),
  type: z.string(),
  x: z.number(),
  y: z.number(),
  w: z.number(),
  h: z.number(),
  props: z.record(z.any(), z.any()).optional(),
});

const MoveElementSchema = z.object({
  slideId: z.string(),
  elementId: z.string(),
  x: z.number(),
  y: z.number(),
  w: z.number().optional(),
  h: z.number().optional(),
  respectCollisions: z.boolean().default(true),
});

const UpdatePropsSchema = z.object({
  slideId: z.string(),
  elementId: z.string(),
  props: z.record(z.any(), z.any()),
  merge: z.boolean().default(true),
});

const DeleteElementSchema = z.object({
  slideId: z.string(),
  elementId: z.string(),
});

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { type, parameters } = body as AICommand;

    // Log the command for audit
    const command = await prisma.aICommand.create({
      data: {
        type,
        parameters,
        status: 'executing',
        userId,
      },
    });

    let result: any;

    switch (type) {
      case 'create_slides_from_text':
        result = await handleCreateSlidesFromText(parameters, userId);
        break;
      
      case 'add_element':
        result = await handleAddElement(parameters);
        break;
      
      case 'move_element':
        result = await handleMoveElement(parameters);
        break;
      
      case 'update_props':
        result = await handleUpdateProps(parameters);
        break;
      
      case 'delete_element':
        result = await handleDeleteElement(parameters);
        break;
      
      case 'new_slide':
        result = await handleNewSlide(parameters, userId);
        break;
      
      case 'duplicate_element':
        result = await handleDuplicateElement(parameters);
        break;
      
      case 'reorder_slides':
        result = await handleReorderSlides(parameters);
        break;
      
      case 'apply_layout_template':
        result = await handleApplyLayoutTemplate(parameters);
        break;
      
      default:
        throw new Error(`Unknown command type: ${type}`);
    }

    // Update command status
    await prisma.aICommand.update({
      where: { id: command.id },
      data: {
        status: 'completed',
        result,
        executedAt: new Date(),
      },
    });

    return NextResponse.json({ 
      success: true, 
      commandId: command.id,
      result 
    });

  } catch (error) {
    console.error('AI Command error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Command execution failed' },
      { status: 500 }
    );
  }
}

// Command Handlers

async function handleCreateSlidesFromText(params: any, userId: string) {
  const validated = CreateSlidesFromTextSchema.parse(params);
  
  // Parse the source text into slide content
  const slidePlan = parseTextToSlides(validated.sourceText || '', validated.strategy);
  
  // Create slides in the database
  const slides = [];
  for (let i = 0; i < slidePlan.length; i++) {
    const slideData = slidePlan[i];
    
    // Convert slide plan elements to grid elements
    const gridElements: GridElement[] = slideData.elements.map((el: any, idx: number) => ({
      id: `element-${Date.now()}-${idx}`,
      type: el.type,
      ...slotToGridPosition(el.slot),
      props: {
        content: el.content || el.placeholder,
        ...el.props,
      },
    }));

    const slide = await prisma.slide.create({
      data: {
        lessonId: validated.lessonId,
        title: slideData.title,
        notes: slideData.notes,
        orderIndex: i,
        gridLayout: gridElements as any,
      },
    });
    
    slides.push(slide);
  }
  
  return { slidesCreated: slides.length, slides };
}

async function handleAddElement(params: any) {
  const validated = AddElementSchema.parse(params);
  
  // Get the current slide
  const slide = await prisma.slide.findUnique({
    where: { id: validated.slideId },
  });
  
  if (!slide) {
    throw new Error('Slide not found');
  }
  
  const currentElements = (slide.gridLayout as any as GridElement[]) || [];
  
  // Check for collisions
  const newElement: GridElement = {
    id: `element-${Date.now()}`,
    type: validated.type,
    x: validated.x,
    y: validated.y,
    w: validated.w,
    h: validated.h,
    props: validated.props || {},
  };
  
  const collision = checkCollision(newElement, currentElements);
  if (collision.hasCollision && collision.suggestedPosition) {
    newElement.x = collision.suggestedPosition.x;
    newElement.y = collision.suggestedPosition.y;
  }
  
  // Update the slide
  await prisma.slide.update({
    where: { id: validated.slideId },
    data: {
      gridLayout: [...currentElements, newElement] as any,
    },
  });
  
  return { elementId: newElement.id, position: { x: newElement.x, y: newElement.y } };
}

async function handleMoveElement(params: any) {
  const validated = MoveElementSchema.parse(params);
  
  const slide = await prisma.slide.findUnique({
    where: { id: validated.slideId },
  });
  
  if (!slide) {
    throw new Error('Slide not found');
  }
  
  const elements = (slide.gridLayout as any as GridElement[]) || [];
  const elementIndex = elements.findIndex(el => el.id === validated.elementId);
  
  if (elementIndex === -1) {
    throw new Error('Element not found');
  }
  
  const element = elements[elementIndex];
  element.x = validated.x;
  element.y = validated.y;
  
  if (validated.w !== undefined) element.w = validated.w;
  if (validated.h !== undefined) element.h = validated.h;
  
  // Check for collisions if requested
  if (validated.respectCollisions) {
    const collision = checkCollision(element, elements, element.id);
    if (collision.hasCollision && collision.suggestedPosition) {
      element.x = collision.suggestedPosition.x;
      element.y = collision.suggestedPosition.y;
    }
  }
  
  elements[elementIndex] = element;
  
  await prisma.slide.update({
    where: { id: validated.slideId },
    data: { gridLayout: elements as any },
  });
  
  return { success: true, newPosition: { x: element.x, y: element.y } };
}

async function handleUpdateProps(params: any) {
  const validated = UpdatePropsSchema.parse(params);
  
  const slide = await prisma.slide.findUnique({
    where: { id: validated.slideId },
  });
  
  if (!slide) {
    throw new Error('Slide not found');
  }
  
  const elements = (slide.gridLayout as any as GridElement[]) || [];
  const elementIndex = elements.findIndex(el => el.id === validated.elementId);
  
  if (elementIndex === -1) {
    throw new Error('Element not found');
  }
  
  if (validated.merge) {
    elements[elementIndex].props = {
      ...elements[elementIndex].props,
      ...validated.props,
    };
  } else {
    elements[elementIndex].props = validated.props;
  }
  
  await prisma.slide.update({
    where: { id: validated.slideId },
    data: { gridLayout: elements as any },
  });
  
  return { success: true };
}

async function handleDeleteElement(params: any) {
  const validated = DeleteElementSchema.parse(params);
  
  const slide = await prisma.slide.findUnique({
    where: { id: validated.slideId },
  });
  
  if (!slide) {
    throw new Error('Slide not found');
  }
  
  const elements = (slide.gridLayout as any as GridElement[]) || [];
  const filtered = elements.filter(el => el.id !== validated.elementId);
  
  await prisma.slide.update({
    where: { id: validated.slideId },
    data: { gridLayout: filtered as any },
  });
  
  return { success: true, elementsRemaining: filtered.length };
}

async function handleNewSlide(params: any, userId: string) {
  const { lessonId, title = 'New Slide', layoutTemplate } = params;
  
  // Get the lesson to find the next order index
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { slides: { orderBy: { orderIndex: 'desc' }, take: 1 } },
  });
  
  if (!lesson) {
    throw new Error('Lesson not found');
  }
  
  const nextOrder = lesson.slides.length > 0 ? lesson.slides[0].orderIndex + 1 : 0;
  
  // Create initial grid layout based on template if provided
  let gridLayout: GridElement[] = [];
  if (layoutTemplate) {
    gridLayout = await getTemplateElements(layoutTemplate);
  }
  
  const slide = await prisma.slide.create({
    data: {
      lessonId,
      title,
      orderIndex: nextOrder,
      gridLayout: gridLayout as any,
    },
  });
  
  return { slideId: slide.id, title: slide.title };
}

async function handleDuplicateElement(params: any) {
  const { slideId, elementId } = params;
  
  const slide = await prisma.slide.findUnique({
    where: { id: slideId },
  });
  
  if (!slide) {
    throw new Error('Slide not found');
  }
  
  const elements = (slide.gridLayout as any as GridElement[]) || [];
  const elementToDuplicate = elements.find(el => el.id === elementId);
  
  if (!elementToDuplicate) {
    throw new Error('Element not found');
  }
  
  const newElement: GridElement = {
    ...elementToDuplicate,
    id: `element-${Date.now()}`,
    x: Math.min(elementToDuplicate.x + 1, 12 - elementToDuplicate.w),
    y: Math.min(elementToDuplicate.y + 1, 12 - elementToDuplicate.h),
  };
  
  // Find free position
  const freePos = findFreePosition(newElement, elements);
  if (freePos) {
    newElement.x = freePos.x;
    newElement.y = freePos.y;
  }
  
  await prisma.slide.update({
    where: { id: slideId },
    data: { gridLayout: [...elements, newElement] as any },
  });
  
  return { newElementId: newElement.id };
}

async function handleReorderSlides(params: any) {
  const { lessonId, newOrder } = params;
  
  // Update order indices for all slides
  const updates = newOrder.map((slideId: string, index: number) => 
    prisma.slide.update({
      where: { id: slideId },
      data: { orderIndex: index },
    })
  );
  
  await prisma.$transaction(updates);
  
  return { success: true };
}

async function handleApplyLayoutTemplate(params: any) {
  const { slideId, templateId, preserveContent = true } = params;
  
  const template = await getTemplateById(templateId);
  if (!template) {
    throw new Error('Template not found');
  }
  
  const slide = await prisma.slide.findUnique({
    where: { id: slideId },
  });
  
  if (!slide) {
    throw new Error('Slide not found');
  }
  
  let newElements = template.elements;
  
  if (preserveContent) {
    // Try to merge existing content into new template layout
    const existingElements = (slide.gridLayout as any as GridElement[]) || [];
    // Logic to intelligently merge content would go here
  }
  
  await prisma.slide.update({
    where: { id: slideId },
    data: { gridLayout: newElements as any },
  });
  
  return { success: true };
}

// Helper functions

function parseTextToSlides(text: string, strategy: string) {
  // Simple implementation - split by double newlines or headings
  const sections = text.split(/\n\n+/);
  const slides = [];
  
  for (const section of sections) {
    if (!section.trim()) continue;
    
    const lines = section.trim().split('\n');
    const title = lines[0];
    const content = lines.slice(1).join('\n');
    
    slides.push({
      title,
      elements: [
        {
          type: 'title',
          slot: 'top',
          content: title,
        },
        content && {
          type: 'text',
          slot: 'bottom',
          content,
        },
      ].filter(Boolean),
      notes: '',
    });
  }
  
  return slides;
}

async function getTemplateElements(templateId: string): Promise<GridElement[]> {
  // This would fetch from database or return predefined templates
  const templates: Record<string, GridElement[]> = {
    'title-content': [
      {
        id: `element-${Date.now()}-1`,
        type: 'title',
        x: 0,
        y: 0,
        w: 12,
        h: 3,
        props: { content: 'Title Here' },
      },
      {
        id: `element-${Date.now()}-2`,
        type: 'text',
        x: 0,
        y: 4,
        w: 12,
        h: 8,
        props: { content: 'Content here...' },
      },
    ],
    'two-column': [
      {
        id: `element-${Date.now()}-1`,
        type: 'title',
        x: 0,
        y: 0,
        w: 12,
        h: 2,
        props: { content: 'Title' },
      },
      {
        id: `element-${Date.now()}-2`,
        type: 'text',
        x: 0,
        y: 3,
        w: 6,
        h: 9,
        props: { content: 'Left column' },
      },
      {
        id: `element-${Date.now()}-3`,
        type: 'text',
        x: 6,
        y: 3,
        w: 6,
        h: 9,
        props: { content: 'Right column' },
      },
    ],
  };
  
  return templates[templateId] || [];
}

async function getTemplateById(templateId: string) {
  // Fetch template from database
  const template = await prisma.template.findUnique({
    where: { id: templateId },
  });
  
  if (template) {
    return {
      elements: template.blockStructure as any as GridElement[],
    };
  }
  
  // Return predefined template as fallback
  return {
    elements: await getTemplateElements(templateId),
  };
}
