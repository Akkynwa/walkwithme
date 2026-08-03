import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Adjust path to your NextAuth config
import { prisma } from '@/lib/prisma';     // Adjust path to your Prisma client

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    // 1. Verify User Session & Admin Role
    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403 });
    }

    const { postId, postType } = await req.json();

    if (!postId || !postType) {
      return NextResponse.json({ error: 'Missing postId or postType' }, { status: 400 });
    }

    // 2. Delete target item based on section type
    if (postType === 'revelations') {
      await prisma.communityShare.delete({ where: { id: postId } });
    } else if (postType === 'intercession') {
      await prisma.prayerRequest.delete({ where: { id: postId } });
    } else {
      return NextResponse.json({ error: 'Invalid post type' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Post removed by admin' }, { status: 200 });
  } catch (error) {
    console.error('Admin deletion error:', error);
    return NextResponse.json({ error: 'Failed to delete post' }, { status: 500 });
  }
}