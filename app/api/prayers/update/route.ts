import { NextRequest, NextResponse } from 'next/server';

export async function PUT(request: NextRequest) {
  try {
    const { id, status } = await request.json();

    if (!id || !status) {
      return NextResponse.json({ error: 'ID and status are required' }, { status: 400 });
    }

    // Update prayer status
    const prayer = {
      id,
      status,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      prayer,
    });
  } catch (error) {
    console.error('Prayer update error:', error);
    return NextResponse.json({ error: 'Failed to update prayer' }, { status: 500 });
  }
}
