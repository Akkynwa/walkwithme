import { NextResponse } from 'next/server';

const BIBLE_API_CDN = 'https://cdn.jsdelivr.net/gh/wldeh/bible-api';

/**
 * GET /api/bible/versions
 * Retrieves a list of all available Bible versions
 */
export async function GET() {
  try {
    const response = await fetch(`${BIBLE_API_CDN}/bibles/bibles.json`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Failed to fetch Bible versions: ${response.statusText}` 
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
    console.error('Error fetching Bible versions:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 }
    );
  }
}
