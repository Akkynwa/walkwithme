import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Master definitions array for your nodes
const MASTER_NODES = [
  { id: 'path_1', title: 'Read Psalm 23', desc: 'A reflection on divine protection and guidance.', icon: 'check_circle', position: 'center' },
  { id: 'path_2', title: '10-Minute Morning Meditation', desc: '10 minutes of silent presence and breathing.', icon: 'air', position: 'right' },
  { id: 'path_3', title: '7-Day Gratitude Challenge', desc: 'Begin an intentional journey of identifying daily blessings.', icon: 'auto_awesome', position: 'left' },
  { id: 'path_4', title: 'Set Monthly Spiritual Goal', desc: 'Setting intentions for the coming month of growth.', icon: 'lock', position: 'right' },
  { id: 'path_5', title: 'Service Reflection', desc: 'Exploring ways to serve others through light.', icon: 'diversity_3', position: 'center' },
];

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 1. Grab all completions for this specific user
    const userProgress = await prisma.userPathProgress.findMany({
      where: { userId: session.user.id }
    });

    const completedSet = new Set(
      userProgress.filter(p => p.isCompleted).map(p => p.nodeId)
    );

    // 2. Map structures sequentially enforcing lock dependencies
    const processedNodes = MASTER_NODES.map((node, index) => {
      const isCompleted = completedSet.has(node.id);
      
      let status: 'completed' | 'active' | 'locked' = 'locked';

      if (isCompleted) {
        status = 'completed';
      } else if (index === 0 || completedSet.has(MASTER_NODES[index - 1].id)) {
        // First node is automatically active, others require previous index validation completion
        status = 'active';
      }

      return {
        ...node,
        status,
        icon: status === 'completed' ? 'check_circle' : status === 'locked' ? 'lock' : node.icon
      };
    });

    // 3. Spool actual profile stats for the header metrics
    const overallStats = {
      currentStreak: session.user?.currentStreak || 0,
      longestStreak: session.user?.longestStreak || 0,
      totalDays: userProgress.filter(p => p.isCompleted).length
    };

    return NextResponse.json({ success: true, nodes: processedNodes, stats: overallStats });
  } catch (error) {
    console.error('Failed to parse path progress map:', error);
    return NextResponse.json({ error: 'Internal Server error' }, { status: 500 });
  }
}