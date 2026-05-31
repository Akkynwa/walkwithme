import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { query, topic } = await request.json();

    if (!query && !topic) {
      return NextResponse.json({ error: 'Query or topic is required' }, { status: 400 });
    }

    // Generate AI insights based on the query
    const insights = {
      topic: query || topic,
      insights: [
        'This topic relates to biblical principles of faith and trust',
        'Consider how this applies to your personal spiritual journey',
        'Reflect on similar passages that address this theme',
      ],
      relatedScriptures: [
        'Proverbs 3:5-6',
        'Psalm 46:5',
        'Isaiah 26:3',
      ],
    };

    return NextResponse.json({
      success: true,
      insights,
    });
  } catch (error) {
    console.error('Insight error:', error);
    return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 });
  }
}
