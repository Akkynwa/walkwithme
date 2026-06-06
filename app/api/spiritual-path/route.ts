import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// 🌟 FORCE DYNAMIC: Prevents build-time static caching of user-specific pathways
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PathNode {
  id: string;
  title: string;
  desc: string;
  icon: string;
  position: 'center' | 'left' | 'right';
}

const MASTER_NODES: PathNode[] = [
  { id: 'path_1', title: 'Read Psalm 23', desc: 'A reflection on divine protection and guidance.', icon: 'check_circle', position: 'center' },
  { id: 'path_2', title: '10-Minute Morning Meditation', desc: '10 minutes of silent presence and breathing.', icon: 'air', position: 'right' },
  { id: 'path_3', title: '7-Day Gratitude Challenge', desc: 'Begin an intentional journey of identifying daily blessings.', icon: 'self_improvement', position: 'left' },
  { id: 'path_4', title: 'Set Monthly Spiritual Goal', desc: 'Setting intentions for the coming month of growth.', icon: 'lock', position: 'right' },
  { id: 'path_5', title: 'Service Reflection', desc: 'Exploring ways to serve others through light.', icon: 'diversity_3', position: 'center' },
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized credentials payload' }, { status: 401 });
    }

    const userId = session.user.id;

    // 1. Parallel Execution: Pull progress maps and user profile records simultaneously
    const [userProgress, userProfile] = await Promise.all([
      prisma.userPathProgress.findMany({
        where: { userId, isCompleted: true },
        select: { nodeId: true, createdAt: true } // Pruned fields to reduce DB engine I/O overhead
      }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { currentStreak: true, longestStreak: true }
      })
    ]);

    // 2. Generate lookup set for active progress matching
    const completedSet = new Set(userProgress.map(p => p.nodeId));

    // 3. Sequentially process state transitions & lock mechanisms
    const processedNodes = MASTER_NODES.map((node, index) => {
      const isCompleted = completedSet.has(node.id);
      
      let status: 'completed' | 'active' | 'locked' = 'locked';

      if (isCompleted) {
        status = 'completed';
      } else if (index === 0 || completedSet.has(MASTER_NODES[index - 1].id)) {
        status = 'active';
      }

      return {
        ...node,
        status,
        icon: status === 'completed' ? 'check_circle' : status === 'locked' ? 'lock' : node.icon
      };
    });

    // 4. Calculate unique milestone days safely (Grouping matching date configurations)
    const uniqueDaysCount = new Set(
      userProgress.map(p => new Date(p.createdAt).toDateString())
    ).size;

    const overallStats = {
      currentStreak: userProfile?.currentStreak ?? 0,
      longestStreak: userProfile?.longestStreak ?? 0,
      totalDays: uniqueDaysCount // Represents actual calendar dates engaged, rather than raw node length
    };

    return NextResponse.json({ success: true, nodes: processedNodes, stats: overallStats });
  } catch (error) {
    console.error('CRITICAL: Failed to parse path progress map:', error);
    return NextResponse.json({ error: 'Internal runtime exception' }, { status: 500 });
  }
}