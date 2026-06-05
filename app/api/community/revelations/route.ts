import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route'; // Adjust path to your auth configuration

// GET: Stream all public community revelations
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id;

    const posts = await prisma.communityShare.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: { name: true },
        },
        amens: true,
      },
    });

    const formattedPosts = posts.map((post) => ({
      id: post.id,
      book: post.book,
      chapter: post.chapter,
      content: post.content,
      user: {
        name: post.user.name || 'A Devoted Reader',
        isAnonymous: post.isAnonymous,
      },
      createdAt: post.createdAt.toISOString(),
      amenCount: post.amens.length,
      hasAmened: currentUserId ? post.amens.some((a) => a.userId === currentUserId) : false,
    }));

    return NextResponse.json(formattedPosts);
  } catch (error) {
    console.error('COMMUNITY_REVELATIONS_GET_ERR:', error);
    return NextResponse.json({ error: 'Failed to stream fellowship timeline' }, { status: 500 });
  }
}

// POST: Share an insight directly to the public feed
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized profile context' }, { status: 401 });
    }

    const body = await request.json();
    const { book, chapter, content, isAnonymous } = body;

    if (!book || !chapter || !content?.trim()) {
      return NextResponse.json({ error: 'Incomplete content configurations' }, { status: 400 });
    }

    const share = await prisma.communityShare.create({
      data: {
        userId: session.user.id,
        book,
        chapter: Number(chapter),
        content: content.trim(),
        isAnonymous: Boolean(isAnonymous),
      },
    });

    return NextResponse.json({ success: true, id: share.id });
  } catch (error) {
    console.error('COMMUNITY_REVELATIONS_POST_ERR:', error);
    return NextResponse.json({ error: 'Failed to publish revelation globally' }, { status: 500 });
  }
}