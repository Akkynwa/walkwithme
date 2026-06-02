import { NextResponse } from 'next/server';

const BIBLE_API_CDN = 'https://cdn.jsdelivr.net/gh/wldeh/bible-api';

/**
 * GET /api/bible/[version]/books/[book]/chapters/[chapter]/verses/[verse]
 * Retrieves a specific verse from the Bible
 * 
 * Parameters:
 * - version: Bible version (e.g., en-asv, en-kjv)
 * - book: Book name (e.g., genesis, exodus)
 * - chapter: Chapter number
 * - verse: Verse number
 */
export async function GET(
  _request: Request,
  { params }: { params: { version: string; book: string; chapter: string; verse: string } }
) {
  try {
    const { version, book, chapter, verse } = params;

    // Validate parameters
    if (!version || !book || !chapter || !verse) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameters: version, book, chapter, verse',
        },
        { status: 400 }
      );
    }

    const url = `${BIBLE_API_CDN}/bibles/${version}/books/${book}/chapters/${chapter}/verses/${verse}.json`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Failed to fetch verse: ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching verse:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
