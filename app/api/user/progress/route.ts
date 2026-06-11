import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const userId = session.user.id;

    // 1. Fetch Streak Data
    const streak = await prisma.streakData.findUnique({
      where: { userId },
    });

    // 2. Fetch Aggregated Quiet Time Sessions (Total sessions & total minutes)
    const sessions = await prisma.quietTimeSession.findMany({
      where: { userId },
      select: { duration: true },
    });

    const totalSessions = sessions.length;
    const totalMinutes = sessions.reduce((acc, curr) => acc + curr.duration, 0);

    // 3. Fetch Completed Progress Milestones
    const completedNodes = await prisma.userPathProgress.findMany({
      where: { userId, isCompleted: true },
    });

    return NextResponse.json({
      streak: {
        current: streak?.currentStreak || 0,
        longest: streak?.longestStreak || 0,
        lastActive: streak?.lastActiveAt || null,
      },
      stats: {
        totalSessions,
        totalMinutes,
      },
      completedMilestones: completedNodes.map(n => n.nodeId),
    });
  } catch (error) {
    console.error('Progress fetch error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}