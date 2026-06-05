import { NextResponse } from 'next/server';

const BIBLE_API_CDN = 'https://cdn.jsdelivr.net/gh/wldeh/bible-api';

export async function GET(
  _request: Request,
  { params }: { params: { version: string; book: string; chapter: string } }
) {
  try {
    // Await params to comply with Next.js dynamic routing paradigms
    const { version, book, chapter } = await params;

    if (!version || !book || !chapter) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameters: version, book, chapter',
        },
        { status: 400 }
      );
    }

    // Sanitize parameters: Normalize version and book to lower-case for CDN match
    const cleanVersion = version.toLowerCase().trim();
    const cleanBook = book.toLowerCase().trim();
    const cleanChapter = chapter.trim();

    const url = `${BIBLE_API_CDN}/bibles/${cleanVersion}/books/${cleanBook}/chapters/${cleanChapter}.json`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 604800 } // Cache scripture data for 7 days (static asset optimization)
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Failed to fetch chapter: ${response.statusText}. Ensure version and book names are valid.`,
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