import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const { id, title, content, mood, tags } = await request.json();

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    // Update journal entry
    const entry = {
      id,
      title,
      content,
      mood,
      tags,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      entry,
    });
  } catch (error) {
    console.error('Journal update error:', error);
    return NextResponse.json({ error: 'Failed to update journal entry' }, { status: 500 });
  }
}
