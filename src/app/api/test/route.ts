import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Test database connection
    const courseCount = await prisma.course.count();
    
    return NextResponse.json({
      message: 'API is working',
      courseCount,
      environment: process.env.NODE_ENV,
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { error: 'Database connection failed', details: error },
      { status: 500 }
    );
  }
}
