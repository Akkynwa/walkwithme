import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// --- GET: Fetch a single prayer with ownership check ---
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const prayer = await prisma.prayer.findUnique({
      where: { id: params.id },
    });

    if (!prayer || prayer.userId !== user.id) {
      return NextResponse.json(
        { error: 'Prayer not found or unauthorized' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, prayer });
  } catch (error) {
    console.error('GET_PRAYER_ERROR:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// --- PATCH: Update a specific prayer entry ---
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Verify ownership
    const prayer = await prisma.prayer.findUnique({
      where: { id: params.id },
    });

    if (!prayer || prayer.userId !== user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const body = await request.json();
    const { title, description, request: oldKey, status } = body;

    const updatedPrayer = await prisma.prayer.update({
      where: { id: params.id },
      data: {
        title: title !== undefined ? title.trim() : prayer.title,
        status: status ?? prayer.status,
        
        // Use 'description' or fallback to the old 'request' key from frontend
        description: (description || oldKey || prayer.description).trim(),
        
        // If status is changed to 'answered', set the timestamp
        ...(status === 'answered' && !prayer.answeredAt && { answeredAt: new Date() }),
      },
    });

    return NextResponse.json({
      success: true,
      prayer: updatedPrayer,
    });
  } catch (error) {
    console.error('PATCH_PRAYER_ERROR:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// --- DELETE: Remove a single prayer record ---
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    const prayer = await prisma.prayer.findUnique({
      where: { id: params.id },
    });

    if (!prayer || prayer.userId !== user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    await prisma.prayer.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true, message: 'Deleted' });
  } catch (error) {
    console.error('DELETE_PRAYER_ERROR:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}