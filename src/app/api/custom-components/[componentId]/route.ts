import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { CustomComponentSchema } from '@/types/custom-components';
import { ComponentValidator } from '@/lib/component-validator';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ componentId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { componentId } = await params;

    const component = await prisma.customComponent.findUnique({
      where: { id: componentId },
    });

    if (!component) {
      return NextResponse.json({ error: 'Component not found' }, { status: 404 });
    }

    // Check if user can access this component
    if (!component.isPublic && component.createdBy !== userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    return NextResponse.json(component);
  } catch (error) {
    console.error('Error fetching custom component:', error);
    return NextResponse.json(
      { error: 'Failed to fetch custom component' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ componentId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { componentId } = await params;
    const body = await req.json();

    // Check if component exists and user owns it
    const existingComponent = await prisma.customComponent.findUnique({
      where: { id: componentId },
    });

    if (!existingComponent) {
      return NextResponse.json({ error: 'Component not found' }, { status: 404 });
    }

    if (existingComponent.createdBy !== userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Validate the updated component data
    const validatedData = CustomComponentSchema.parse({
      ...existingComponent,
      ...body,
      id: componentId,
      updatedAt: new Date(),
    });

    // Validate the component code if it changed
    if (body.code && body.code !== existingComponent.code) {
      const validator = new ComponentValidator();
      const validation = await validator.validateComponent(validatedData);
      
      if (!validation.isValid) {
        return NextResponse.json(
          { 
            error: 'Component validation failed',
            details: validation.errors 
          },
          { status: 400 }
        );
      }
    }

    // Update the component
    const updatedComponent = await prisma.customComponent.update({
      where: { id: componentId },
      data: {
        name: validatedData.name,
        description: validatedData.description,
        code: validatedData.code,
        dependencies: validatedData.dependencies,
        propSchema: validatedData.propSchema,
        defaultProps: validatedData.defaultProps,
        defaultSize: validatedData.defaultSize,
        minSize: validatedData.minSize,
        maxSize: validatedData.maxSize,
        category: validatedData.category,
        isPublic: validatedData.isPublic,
        tags: validatedData.tags,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedComponent);
  } catch (error) {
    console.error('Error updating custom component:', error);
    
    if (error instanceof Error && error.message.includes('validation failed')) {
      return NextResponse.json(
        { error: 'Invalid component data', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update custom component' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ componentId: string }> }
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { componentId } = await params;

    // Check if component exists and user owns it
    const component = await prisma.customComponent.findUnique({
      where: { id: componentId },
    });

    if (!component) {
      return NextResponse.json({ error: 'Component not found' }, { status: 404 });
    }

    if (component.createdBy !== userId) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Delete the component
    await prisma.customComponent.delete({
      where: { id: componentId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting custom component:', error);
    return NextResponse.json(
      { error: 'Failed to delete custom component' },
      { status: 500 }
    );
  }
}





