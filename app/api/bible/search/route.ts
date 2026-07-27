export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';

interface GoogleSearchItem {
  title: string;
  snippet: string;
  link: string;
}

// Simple in-memory cache to prevent burning API quota on duplicate queries
const searchCache = new Map<string, { timestamp: number; data: any[] }>();
const CACHE_TTL = 1000 * 60 * 60; // Cache results for 1 hour

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('q') || searchParams.get('keyword');
    const bibleId = searchParams.get('bibleId') || 'de4e12af7f895f10-01';
    
    const searchLocal = searchParams.has('local') ? searchParams.get('local') === 'true' : true;
    const searchWeb = searchParams.get('web') === 'true';

    if (!keyword || keyword.trim().length < 3) {
      return NextResponse.json({ success: true, results: [], count: 0 });
    }

    const cleanKeyword = keyword.trim().toLowerCase();
    const cacheKey = `${cleanKeyword}_local:${searchLocal}_web:${searchWeb}`;

    // Return cached response if available
    const cached = searchCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return NextResponse.json({
        success: true,
        results: cached.data,
        count: cached.data.length,
        fromCache: true,
      });
    }

    const BIBLE_API_KEY = process.env.NEXT_PUBLIC_BIBLE_API_KEY;
    const GOOGLE_API_KEY = process.env.GOOGLE_SEARCH_API_KEY;
    const GOOGLE_CX = process.env.GOOGLE_SEARCH_CX;

    let combinedResults: any[] = [];

    // --- SCOPE A: LIVE API.BIBLE SEARCH ---
    if (searchLocal && BIBLE_API_KEY) {
      const bibleUrl = new URL(`https://api.scripture.api.bible/v1/bibles/${bibleId}/search`);
      bibleUrl.searchParams.set('query', cleanKeyword);
      bibleUrl.searchParams.set('limit', '10');
      bibleUrl.searchParams.set('sort', 'relevance');

      const bibleResponse = await fetch(bibleUrl.toString(), {
        headers: { 'api-key': BIBLE_API_KEY },
      });

      if (bibleResponse.ok) {
        const bibleData = await bibleResponse.json();
        if (bibleData?.data?.verses) {
          const processedVerses = bibleData.data.verses.map((v: any) => ({
            book: v.reference.split(/\s(?=\d)/)[0] || v.reference,
            chapter: parseInt(v.reference.match(/(\d+):/)?.[1] || '1', 10),
            verse: parseInt(v.reference.match(/:(\d+)/)?.[1] || '1', 10),
            text: v.text.trim(),
            translation: bibleId === 'de4e12af7f895f10-01' ? 'KJV' : 'TRANS',
            isExternal: false,
          }));
          combinedResults = [...combinedResults, ...processedVerses];
        }
      }
    }

    // --- SCOPE B: LIVE GOOGLE CUSTOM SEARCH ENGINE ---
    if (searchWeb && GOOGLE_API_KEY && GOOGLE_CX) {
      const googleUrl = new URL('https://www.googleapis.com/customsearch/v1');
      googleUrl.searchParams.set('key', GOOGLE_API_KEY.trim());
      googleUrl.searchParams.set('cx', GOOGLE_CX.trim());
      googleUrl.searchParams.set('q', cleanKeyword);
      googleUrl.searchParams.set('num', '5');

      const webResponse = await fetch(googleUrl.toString());

      if (webResponse.ok) {
        const webData = await webResponse.json();
        if (webData.items) {
          const processedWebItems = webData.items.map((item: GoogleSearchItem) => ({
            title: item.title,
            snippet: item.snippet ? item.snippet.replace(/\r?\n|\r/g, ' ') : '',
            link: item.link,
            isExternal: true,
          }));
          combinedResults = [...combinedResults, ...processedWebItems];
        }
      } else if (webResponse.status === 429) {
        console.warn('Google Custom Search daily quota reached (429). Falling back to Bible API results.');
      }
    }

    // Cache the merged results
    searchCache.set(cacheKey, { timestamp: Date.now(), data: combinedResults });

    return NextResponse.json({
      success: true,
      results: combinedResults,
      count: combinedResults.length,
    });

  } catch (error) {
    console.error('Unified search route failed:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during search' },
      { status: 500 }
    );
  }
}