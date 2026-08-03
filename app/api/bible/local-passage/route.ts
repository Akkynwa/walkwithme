import { NextResponse } from 'next/server';
import { convertBookToCDNFormat } from '@/lib/bible-utils';

/**
 * Local/Custom Passage Endpoint
 * This endpoint handles custom Bible translations stored locally or fetched via CDN.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const book = searchParams.get('book');
  const chapter = searchParams.get('chapter');
  const langCode = searchParams.get('lang')?.toLowerCase() || 'en';
  const rawVersionId = searchParams.get('versionId');

  // Sanitize versionId - fallback to 'kjv' if null or undefined
  const versionId = rawVersionId && rawVersionId !== 'null' && rawVersionId !== 'undefined'
    ? rawVersionId.toLowerCase()
    : 'kjv';

  if (!book || !chapter) {
    return NextResponse.json(
      { success: false, error: 'Missing parameters: book and chapter are required' },
      { status: 400 }
    );
  }

  try {
    const cdnBookName = convertBookToCDNFormat(book);
    const BIBLE_API_CDN = 'https://cdn.jsdelivr.net/gh/wldeh/bible-api';

    // Unique local/CDN target formats to attempt
    const localVersions = Array.from(
      new Set([
        `${langCode}-${versionId}`,
        versionId,
        `${langCode}-asv`,
        'en-asv',
      ])
    );

    let response: Response | null = null;
    let resolvedVersion = versionId;

    // Iterate through version attempts
    for (const version of localVersions) {
      const chapterUrl = `${BIBLE_API_CDN}/bibles/${version}/books/${cdnBookName}/chapters/${chapter}.json`;
      
      try {
        const fetchRes = await fetch(chapterUrl, {
          headers: { 'Content-Type': 'application/json' },
          // Cache CDN responses on Next.js server for 24 hours
          next: { revalidate: 86400 },
        });

        if (fetchRes.ok) {
          response = fetchRes;
          resolvedVersion = version;
          break;
        }
      } catch (err) {
        // Continue to next fallback version if fetch throws network error
        continue;
      }
    }

    if (!response || !response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: `Unable to locate scripture passage for ${book} ${chapter}`,
        },
        { status: 404 }
      );
    }

    const textData = await response.json();

    // Normalizing different CDN verse response structures
    let formattedVerses: Array<{ number: number; text: string }> = [];

    if (Array.isArray(textData.verses)) {
      formattedVerses = textData.verses.map((v: any, idx: number) => ({
        number: Number(v.verse || v.number || idx + 1),
        text: (v.text || v.content || '').trim(),
      }));
    } else if (textData.book && Array.isArray(textData.chapters)) {
      const targetChapter = textData.chapters[0];
      if (targetChapter && Array.isArray(targetChapter.verses)) {
        formattedVerses = targetChapter.verses.map((v: any, idx: number) => ({
          number: Number(v.verse || v.number || idx + 1),
          text: (v.text || v.content || '').trim(),
        }));
      }
    } else if (Array.isArray(textData)) {
      formattedVerses = textData.map((v: any, idx: number) => ({
        number: Number(v.verse || v.number || idx + 1),
        text: (v.text || v.content || '').trim(),
      }));
    } else if (textData.text) {
      formattedVerses = [{ number: 1, text: (textData.text || '').trim() }];
    }

    // Audio CDN URL
    const audioUrl = `https://cdn.global-scriptures.com/audio/${langCode}/${cdnBookName}/${chapter}.mp3`;

    return NextResponse.json(
      {
        success: true,
        passage: textData.reference || `${book} ${chapter}`,
        verses: formattedVerses,
        audio: audioUrl,
        language: langCode,
        versionId: resolvedVersion,
        isLocal: true,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200',
        },
      }
    );
  } catch (e) {
    console.error('Local Passage API Error:', e);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to retrieve local passage',
        details: e instanceof Error ? e.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}