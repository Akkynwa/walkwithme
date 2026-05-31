import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

type RouteContext = {
  params: Promise<{ id: string }>;
};

// 1. GET - Retrieve a single entry for the Detail Page
export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    const entry = await prisma.journalEntry.findUnique({
      where: { id },
      include: { user: true }
    });

    // Check if entry exists and belongs to the logged-in user
    if (!entry || entry.user.email !== session.user.email) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, entry });
  } catch (error) {
    console.error('Error fetching journal entry:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// 2. PUT - Used for full updates (Matches your frontend handleSave)
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { title, content, mood, tags } = body;

    // Verify ownership and update in one query for better performance
    const updatedEntry = await prisma.journalEntry.update({
      where: { 
        id,
        user: { email: session.user.email } 
      },
      data: {
        title,
        content,
        mood,
        tags,
      },
    });

    return NextResponse.json({ success: true, entry: updatedEntry });
  } catch (error) {
    console.error('Error updating journal entry:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}

// 3. DELETE - Remove the entry
export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await context.params;

    await prisma.journalEntry.delete({
      where: { 
        id,
        user: { email: session.user.email }
      },
    });

    return NextResponse.json({ success: true, message: 'Deleted successfully' });
  } catch (error) {
    console.error('Error deleting journal entry:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}