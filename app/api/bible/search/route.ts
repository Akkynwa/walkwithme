export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

interface GoogleSearchItem {
  title: string;
  snippet: string;
  link: string;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Reading configuration from your frontend parameter structures
    const keyword = searchParams.get('q') || searchParams.get('keyword');
    const bibleId = searchParams.get('bibleId') || 'de4e12af7f895f10-01'; // Defaulting to KJV
    
    // Scope Switches (Fallback to true if parameters are completely omitted)
    const searchLocal = searchParams.has('local') ? searchParams.get('local') === 'true' : true;
    const searchWeb = searchParams.get('web') === 'true';

    if (!keyword || keyword.trim().length < 3) {
      return NextResponse.json({ success: true, results: [] });
    }

    const BIBLE_API_KEY = process.env.NEXT_PUBLIC_BIBLE_API_KEY;
    const GOOGLE_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
    const GOOGLE_CX = process.env.GOOGLE_SEARCH_CX;

    let combinedResults: any[] = [];

    // --- SCOPE A: LIVE API.BIBLE SEARCH ---
    if (searchLocal && BIBLE_API_KEY) {
      const bibleResponse = await fetch(
        `https://api.scripture.api.bible/v1/bibles/${bibleId}/search?query=${encodeURIComponent(
          keyword
        )}&limit=10&sort=relevance`,
        {
          headers: {
            'api-key': BIBLE_API_KEY,
          },
        }
      );

      if (bibleResponse.ok) {
        const bibleData = await bibleResponse.json();
        if (bibleData?.data?.verses) {
          const processedVerses = bibleData.data.verses.map((v: any) => ({
            // Splitting typical strings like "John 3:16" cleanly into presentation metrics
            book: v.reference.split(/\s(?=\d)/)[0] || v.reference,
            chapter: parseInt(v.reference.match(/:(\d+)/)?.[1] || '1', 10),
            verse: parseInt(v.reference.match(/(\d+):/)?.[1] || '1', 10),
            text: v.text.trim(),
            translation: bibleId === 'de4e12af7f895f10-01' ? 'KJV' : 'TRANS',
            isExternal: false,
          }));
          combinedResults = [...combinedResults, ...processedVerses];
        }
      } else {
        console.error('API.Bible network response failed:', bibleResponse.status);
      }
    }

    // --- SCOPE B: LIVE GOOGLE CUSTOM SEARCH ENGINE ---
    if (searchWeb && GOOGLE_API_KEY && GOOGLE_CX) {
      const googleTargetUrl = `https://www.googleapis.com/customsearch/v1?key=${GOOGLE_API_KEY}&cx=${GOOGLE_CX}&q=${encodeURIComponent(
        keyword
      )}&num=5`;

      const webResponse = await fetch(googleTargetUrl);

      if (webResponse.ok) {
        const webData = await webResponse.json();
        if (webData.items) {
          const processedWebItems = webData.items.map((item: GoogleSearchItem) => ({
            title: item.title,
            snippet: item.snippet.replace(/\r?\n|\r/g, ' '),
            link: item.link,
            isExternal: true,
          }));
          combinedResults = [...combinedResults, ...processedWebItems];
        }
      } else {
        console.error('Google custom search request failed:', webResponse.status);
      }
    }

    // Return combined dataset without stubbing or fallback arrays
    return NextResponse.json({
      success: true,
      results: combinedResults,
      count: combinedResults.length,
    });

  } catch (error) {
    console.error('Unified hybrid search route failed:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during the search operation' },
      { status: 500 }
    );
  }
}