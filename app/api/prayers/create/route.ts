import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { title, description, category } = await request.json();

    if (!title || !description || !category) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create prayer request
    const prayer = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      description,
      category,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      prayer,
    });
  } catch (error) {
    console.error('Prayer create error:', error);
    return NextResponse.json({ error: 'Failed to create prayer request' }, { status: 500 });
  }
}
