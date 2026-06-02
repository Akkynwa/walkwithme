import { NextResponse } from 'next/server';
import { convertBookToCDNFormat, getCDNVersion } from '@/lib/bible-utils';

const BIBLE_API_CDN = 'https://cdn.jsdelivr.net/gh/wldeh/bible-api';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const book = searchParams.get('book');
  const chapter = searchParams.get('chapter');
  const langCode = searchParams.get('lang') || 'en';
  const versionId = searchParams.get('versionId');

  if (!book || !chapter) {
    return NextResponse.json({ error: "Missing parameters: book and chapter are required" }, { status: 400 });
  }

  try {
    // 1. Convert book abbreviation to CDN format (GEN -> genesis)
    const cdnBookName = convertBookToCDNFormat(book);
    
    // 2. Get CDN version code (maps version ID to CDN format)
    const cdnVersion = versionId ? getCDNVersion(langCode, versionId) : `${langCode}-asv`;

    // 3. Fetch the chapter from CDN API
    const chapterUrl = `${BIBLE_API_CDN}/bibles/${cdnVersion}/books/${cdnBookName}/chapters/${chapter}.json`;
    
    const textRes = await fetch(chapterUrl, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!textRes.ok) {
      console.error(`Failed to fetch from CDN: ${chapterUrl}`, textRes.status);
      throw new Error(`Failed to fetch chapter: ${textRes.statusText}`);
    }

    const textData = await textRes.json();

    // 4. Parse verses from the CDN response
    // The CDN API returns an object with verses array
    const formattedVerses = textData.verses?.map((v: any) => ({
      number: v.number || v.verse,
      text: (v.text || v.content || '').trim()
    })) || [];

    // 5. Generate audio URL (using a reliable audio Bible CDN)
    const audioUrl = `https://cdn.global-scriptures.com/audio/${langCode}/${cdnBookName}/${chapter}.mp3`;

    return NextResponse.json({
      success: true,
      passage: textData.reference || `${book} ${chapter}`,
      verses: formattedVerses,
      audio: audioUrl,
      language: langCode,
      version: cdnVersion
    });

  } catch (e) {
    console.error("API Route Error:", e);
    return NextResponse.json({ 
      success: false,
      error: "Failed to retrieve passage",
      details: e instanceof Error ? e.message : "Unknown error"
    }, { status: 500 });
  }
}