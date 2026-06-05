import { NextResponse } from 'next/server';

const BIBLE_API_CDN = 'https://cdn.jsdelivr.net/gh/wldeh/bible-api';

export async function GET(
  _request: Request,
  { params }: { params: { version: string; book: string; chapter: string; verse: string } }
) {
  try {
    const { version, book, chapter, verse } = await params;

    if (!version || !book || !chapter || !verse) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required parameters: version, book, chapter, verse',
        },
        { status: 400 }
      );
    }

    // Sanitize parameters for seamless static asset resolution
    const cleanVersion = version.toLowerCase().trim();
    const cleanBook = book.toLowerCase().trim();
    const cleanChapter = chapter.trim();
    const cleanVerse = verse.trim();

    const url = `${BIBLE_API_CDN}/bibles/${cleanVersion}/books/${cleanBook}/chapters/${cleanChapter}/verses/${cleanVerse}.json`;

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 604800 } // Cache individual verses long-term
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Failed to fetch verse: ${response.statusText}. Check reference indexes.`,
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