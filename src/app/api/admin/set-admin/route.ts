import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Use Clerk's REST API to update user metadata
    const response = await fetch(`https://api.clerk.com/v1/users/${userId}/metadata`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        publicMetadata: {
          role: 'admin'
        }
      })
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Clerk API error:', error);
      return NextResponse.json({ 
        error: 'Failed to update user metadata',
        details: error
      }, { status: response.status });
    }

    const updatedUser = await response.json();

    return NextResponse.json({ 
      success: true, 
      user: updatedUser,
      message: 'Admin role set successfully'
    });

  } catch (error) {
    console.error('Error setting admin role:', error);
    return NextResponse.json({ 
      error: 'Failed to set admin role',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
