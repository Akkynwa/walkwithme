import { NextResponse } from 'next/server';

const BIBLE_API_CDN = 'https://cdn.jsdelivr.net/gh/wldeh/bible-api';

/**
 * GET /api/bible/[version]/books/[book]/chapters/[chapter]
 * Retrieves an entire chapter from the Bible
 * 
 * Parameters:
 * - version: Bible version (e.g., en-asv, en-kjv)
 * - book: Book name (e.g., genesis, exodus)
 * - chapter: Chapter number
 */
export async function GET(
  request: Request,
  { params }: { params: { version: string; book: string; chapter: string } }
) {
  try {
    const { version, book, chapter } = params;

    // Validate parameters
    if (!version || !book || !chapter) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameters: version, book, chapter',
        },
        { status: 400 }
      );
    }

    const url = `${BIBLE_API_CDN}/bibles/${version}/books/${book}/chapters/${chapter}.json`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Failed to fetch chapter: ${response.statusText}`,
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
    console.error('Error fetching chapter:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
