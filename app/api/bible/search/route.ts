export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
// ... rest of your imports and GET function

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    // Defaulting to KJV (de4e12af7f895f10-01) if no translation is specified
    const bibleId = searchParams.get('bibleId') || 'de4e12af7f895f10-01';

    if (!keyword) {
      return NextResponse.json({ error: 'Keyword is required' }, { status: 400 });
    }

    const BIBLE_API_KEY = process.env.NEXT_PUBLIC_BIBLE_API_KEY;

    if (!BIBLE_API_KEY) {
      return NextResponse.json({ error: 'API Configuration missing' }, { status: 500 });
    }

    // API.Bible Search Endpoint: filters by keyword query
    const response = await fetch(
      `https://api.scripture.api.bible/v1/bibles/${bibleId}/search?query=${encodeURIComponent(
        keyword
      )}&limit=20&sort=relevance`,
      {
        headers: {
          'api-key': BIBLE_API_KEY,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.message || 'Scripture search failed' },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Map the API results to your existing frontend structure
    const results = data.data.verses.map((v: any) => ({
      reference: v.reference,
      text: v.text.trim(),
      verseId: v.id,
      translationId: bibleId,
    }));

    return NextResponse.json({
      success: true,
      results,
      count: results.length,
      total: data.data.total,
    });
  } catch (error) {
    console.error('Bible search error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during the search' },
      { status: 500 }
    );
  }
}