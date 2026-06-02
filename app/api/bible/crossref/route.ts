import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Required for dynamic request handling

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const verseId = url.searchParams.get('verseId'); // Expecting format like 'JHN.3.16'

    if (!verseId) {
      return NextResponse.json({ error: 'Verse ID is required' }, { status: 400 });
    }

    const BIBLE_API_KEY = process.env.NEXT_PUBLIC_BIBLE_API_KEY;
    // Note: You should ideally use a specific Bible ID (e.g., KJV or NIV)
    const BIBLE_ID = 'de4e12af7f895f10-01'; // Default King James Version ID

    if (!BIBLE_API_KEY) {
      throw new Error('BIBLE_API_KEY is not defined');
    }

    // Fetching the verse and its related content (cross-references are often handled via 'sections' or 'related')
    // Note: Most Bible APIs provide "Related" verses or you can fetch by chapter
    const response = await fetch(
      `https://api.scripture.api.bible/v1/bibles/${BIBLE_ID}/verses/${verseId}?include-chapter-numbers=false&include-verse-numbers=true`,
      {
        headers: {
          'api-key': BIBLE_API_KEY,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json({ error: errorData.message || 'API fetch failed' }, { status: response.status });
    }

    const data = await response.json();

    // To get actual cross-references from API.Bible, we typically look at the 'next'/'previous' 
    // or specific metadata fields depending on the Bible version used.
    return NextResponse.json({
      success: true,
      data: data.data,
    });

  } catch (error) {
    console.error('Cross-reference error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}