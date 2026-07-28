import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Forces Next.js to render this route dynamically at runtime instead of static build time
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.max(1, parseInt(searchParams.get('limit') || '10', 10));
    const offset = Math.max(0, parseInt(searchParams.get('offset') || '0', 10));

    // Fetch real entries from PostgreSQL using Prisma
    const [entries, total] = await Promise.all([
      prisma.journalEntry.findMany({
        take: limit,
        skip: offset,
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          title: true,
          content: true,
          createdAt: true,
        },
      }),
      prisma.journalEntry.count(),
    ]);

    return NextResponse.json({
      success: true,
      entries: entries ?? [],
      total: total ?? 0,
      hasMore: offset + (entries?.length || 0) < (total ?? 0),
    });
  } catch (error) {
    console.error('Journal list API error:', error);
    return NextResponse.json(
      { error: 'An error occurred while retrieving your journey logs' },
      { status: 500 }
    );
  }
}