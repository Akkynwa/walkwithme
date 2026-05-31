import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  
  // The API expects a specific ID format like 'JHN.1' 
  // We'll construct it or accept a direct chapterId
  const book = searchParams.get('book'); // e.g., 'JHN'
  const chapter = searchParams.get('chapter'); // e.g., '1'
  const versionId = searchParams.get('versionId') || 'de4e12af7f895f10-01'; // Defaulting to KJV

  if (!book || !chapter) {
    return NextResponse.json({ error: 'Book and Chapter are required' }, { status: 400 });
  }

  const chapterId = `${book.toUpperCase()}.${chapter}`;
  const BIBLE_API_KEY = process.env.BIBLE_API_KEY;

  if (!BIBLE_API_KEY) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    // API.Bible provides audio as a resource link. 
    // Note: Not all Bible versions on API.Bible have audio enabled.
    const apiUrl = `https://api.scripture.api.bible/v1/bibles/${versionId}/chapters/${chapterId}/audio`;

    const response = await fetch(apiUrl, {
      headers: {
        'api-key': BIBLE_API_KEY,
      },
      next: { revalidate: 3600 } // Cache for 1 hour to optimize performance
    });

    if (!response.ok) {
      // Log the specific status for debugging
      console.error(`Bible API Error: ${response.status} for ${chapterId}`);
      return NextResponse.json({ error: 'Audio resource not available for this version/chapter' }, { status: 404 });
    }

    const data = await response.json();

    // The API returns a resourceUrl which is often a temporary signed link
    return NextResponse.json({ 
      success: true,
      url: data.data.resourceUrl,
      expiresAt: data.data.expiresAt || null
    });

  } catch (error) {
    console.error('Bible Audio Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}