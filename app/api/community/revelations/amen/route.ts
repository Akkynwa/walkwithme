import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth"

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized pulse context' }, { status: 401 });
    }

    const body = await request.json();
    const { postId } = body;

    if (!postId) {
      return NextResponse.json({ error: 'Post target identifier missing' }, { status: 400 });
    }

    const userId = session.user.id;

    // Check for existing state atomically
    const existingAmen = await prisma.amen.findUnique({
      where: {
        communityShareId_userId: {
          communityShareId: postId,
          userId,
        },
      },
    });

    if (existingAmen) {
      // Remove connection
      await prisma.amen.delete({
        where: { id: existingAmen.id },
      });
      return NextResponse.json({ status: 'REMOVED' });
    } else {
      // Create connection
      await prisma.amen.create({
        data: {
          communityShareId: postId,
          userId,
        },
      });
      return NextResponse.json({ status: 'ADDED' });
    }
  } catch (error) {
    console.error('AMEN_PULSE_ERR:', error);
    return NextResponse.json({ error: 'Failed to synchronize structural interaction' }, { status: 500 });
  }
}