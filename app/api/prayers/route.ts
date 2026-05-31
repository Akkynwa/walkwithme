import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

// --- GET: Fetch all prayers for the logged-in user ---
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const searchParams = request.nextUrl.searchParams;
    const statusFilter = searchParams.get('status');

    const prayers = await prisma.prayer.findMany({
      where: {
        userId: user.id,
        ...(statusFilter && { status: statusFilter }),
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({
      success: true,
      prayers,
      total: prayers.length,
    });
  } catch (error) {
    console.error('API_PRAYERS_GET_ERROR:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// --- POST: Create a new prayer ---
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { title, request: prayerRequest, category } = body;

    if (!title?.trim() || !prayerRequest?.trim()) {
      return NextResponse.json(
        { error: 'Title and prayer request content are required' },
        { status: 400 }
      );
    }

    const prayer = await prisma.prayer.create({
      data: {
        userId: user.id,
        title: title.trim(),
        status: 'pending',
        category: category?.toLowerCase() || 'general',
        description: prayerRequest.trim(), 
      },
    });

    return NextResponse.json(
      { success: true, prayer },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('API_PRAYERS_POST_ERROR:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}