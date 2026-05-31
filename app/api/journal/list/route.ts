import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Ensure your prisma client path is correct
// import { getServerSession } from 'next-auth'; // Recommended for user-specific data

export async function GET(request: NextRequest) {
  try {
    // 1. (Optional but Recommended) Get current user session
    // const session = await getServerSession(authOptions);
    // if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // 2. Fetch real entries from PostgreSQL using Prisma
    // We use findMany with take (limit) and skip (offset) for pagination
    const [entries, total] = await Promise.all([
      prisma.journalEntry.findMany({
        // where: { userId: session.user.id }, // Filter by the logged-in user
        take: limit,
        skip: offset,
        orderBy: {
          createdAt: 'desc', // Show newest reflections first
        },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
          // Exclude sensitive fields if necessary
        }
      }),
      prisma.journalEntry.count({
        // where: { userId: session.user.id } 
      })
    ]);

    return NextResponse.json({
      success: true,
      entries,
      total,
      hasMore: offset + entries.length < total
    });
  } catch (error) {
    console.error('Journal list error:', error);
    return NextResponse.json(
      { error: 'An error occurred while retrieving your journey logs' }, 
      { status: 500 }
    );
  }
}