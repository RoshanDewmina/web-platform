import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { CustomComponentSchema } from '@/types/custom-components';
import { ComponentValidator } from '@/lib/component-validator';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');
    const isPublic = searchParams.get('isPublic');
    const createdBy = searchParams.get('createdBy');

    const where: any = {};

    // Filter by category
    if (category) {
      where.category = category;
    }

    // Filter by public/private
    if (isPublic !== null) {
      where.isPublic = isPublic === 'true';
    }

    // Filter by creator
    if (createdBy) {
      where.createdBy = createdBy;
    }

    // Get user's own components and public components
    where.OR = [
      { createdBy: userId },
      { isPublic: true }
    ];

    const components = await prisma.customComponent.findMany({
      where,
      orderBy: [
        { updatedAt: 'desc' },
        { usageCount: 'desc' }
      ],
      take: 100,
    });

    return NextResponse.json(components);
  } catch (error) {
    console.error('Error fetching custom components:', error);
    return NextResponse.json(
      { error: 'Failed to fetch custom components' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    // Validate the component data
    const validatedData = CustomComponentSchema.parse({
      ...body,
      id: undefined, // Remove id for creation
      createdBy: userId,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Validate the component code
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

    // Create the component
    const component = await prisma.customComponent.create({
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
        createdBy: userId,
        tags: validatedData.tags,
      },
    });

    return NextResponse.json(component, { status: 201 });
  } catch (error) {
    console.error('Error creating custom component:', error);
    
    if (error instanceof Error && error.message.includes('validation failed')) {
      return NextResponse.json(
        { error: 'Invalid component data', details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create custom component' },
      { status: 500 }
    );
  }
}





