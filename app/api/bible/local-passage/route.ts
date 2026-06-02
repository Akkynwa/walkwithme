import { NextResponse } from 'next/server';
import { convertBookToCDNFormat } from '@/lib/bible-utils';

/**
 * Local/Custom Passage Endpoint
 * This endpoint handles custom Bible translations stored locally
 * Currently routes to CDN as fallback, but can be extended for database lookups
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const book = searchParams.get('book');
  const chapter = searchParams.get('chapter');
  const langCode = searchParams.get('lang') || 'en';
  const versionId = searchParams.get('versionId');

  if (!book || !chapter) {
    return NextResponse.json(
      { success: false, error: "Missing parameters: book and chapter are required" },
      { status: 400 }
    );
  }

  try {
    // For now, this routes to CDN as fallback
    // In the future, you can add logic to fetch from your database:
    // 1. Check if versionId exists in database
    // 2. Query local translation data
    // 3. Format and return response

    const cdnBookName = convertBookToCDNFormat(book);
    const BIBLE_API_CDN = 'https://cdn.jsdelivr.net/gh/wldeh/bible-api';
    
    // Try common local version formats
    const localVersions = [
      `${langCode}-${versionId}`,
      versionId,
      `${langCode}-custom`,
    ];

    let chapterUrl = '';
    let response = null;

    // Try each version format
    for (const version of localVersions) {
      chapterUrl = `${BIBLE_API_CDN}/bibles/${version}/books/${cdnBookName}/chapters/${chapter}.json`;
      response = await fetch(chapterUrl, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) break;
    }

    if (!response || !response.ok) {
      console.error(`Failed to fetch local translation: ${versionId} for ${book} ${chapter}`);
      
      // Fallback to English ASV if custom version not found
      chapterUrl = `${BIBLE_API_CDN}/bibles/en-asv/books/${cdnBookName}/chapters/${chapter}.json`;
      response = await fetch(chapterUrl, {
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch chapter: ${response.statusText}`);
      }
    }

    const textData = await response.json();

    // Parse verses
    const formattedVerses = textData.verses?.map((v: any) => ({
      number: v.number || v.verse,
      text: (v.text || v.content || '').trim()
    })) || [];

    // Audio URL
    const audioUrl = `https://cdn.global-scriptures.com/audio/${langCode}/${cdnBookName}/${chapter}.mp3`;

    return NextResponse.json({
      success: true,
      passage: textData.reference || `${book} ${chapter}`,
      verses: formattedVerses,
      audio: audioUrl,
      language: langCode,
      versionId: versionId || 'default',
      isLocal: true
    });

  } catch (e) {
    console.error("Local Passage API Error:", e);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve local passage",
        details: e instanceof Error ? e.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
