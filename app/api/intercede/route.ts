import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

// GET: Stream intercession prayer needs
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;

    const requests = await prisma.prayerRequest.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } },
        intercessors: true,
      },
    });

    const formattedRequests = requests.map((req) => ({
      id: req.id,
      content: req.content,
      user: {
        name: req.user.name || 'Believer',
        isAnonymous: req.isAnonymous,
      },
      createdAt: req.createdAt.toISOString(),
      intercessorCount: req.intercessors.length,
      hasInterceded: currentUserId ? req.intercessors.some((i) => i.userId === currentUserId) : false,
      status: req.status,
    }));

    return NextResponse.json(formattedRequests);
  } catch (error) {
    console.error('CRITICAL_INTERCESSION_GET_ERR:', error);
    return NextResponse.json({ error: 'Failed to retrieve prayer requests' }, { status: 500 });
  }
}

// POST: Drop a new prayer need into the room
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized action context' }, { status: 401 });
    }

    const body = await request.json();
    const { content, isAnonymous } = body;

    if (!content?.trim()) {
      return NextResponse.json({ error: 'Request content cannot be empty' }, { status: 400 });
    }

    const freshRequest = await prisma.prayerRequest.create({
      data: {
        userId: session.user.id,
        content: content.trim(),
        isAnonymous: Boolean(isAnonymous),
      },
      include: {
        user: { select: { name: true } },
      },
    });

    return NextResponse.json({
      id: freshRequest.id,
      content: freshRequest.content,
      user: {
        name: freshRequest.user.name || 'Believer',
        isAnonymous: freshRequest.isAnonymous,
      },
      createdAt: freshRequest.createdAt.toISOString(),
      intercessorCount: 0,
      hasInterceded: false,
      status: freshRequest.status,
    });
  } catch (error) {
    console.error('CRITICAL_INTERCESSION_POST_ERR:', error);
    return NextResponse.json({ error: 'Failed to anchor prayer node' }, { status: 500 });
  }
}