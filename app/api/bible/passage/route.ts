import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const book = searchParams.get('book');
  const chapter = searchParams.get('chapter');
  const langCode = searchParams.get('lang') || 'en';

  if (!book || !chapter) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    // 1. Map translation slugs for bible-api.com 
    // Note: bible-api.com is best for English. 
    // For FR/ES/DE, you might eventually want to point to the API.Bible (Digital Bible Library)
    let translationSlug = 'kjv'; 
    if (langCode === 'es') translationSlug = 'rvr09';
    if (langCode === 'fr') translationSlug = 'lsg'; // Louis Segond

    const textRes = await fetch(
      `https://bible-api.com/${book}+${chapter}?translation=${translationSlug}`
    );

    if (!textRes.ok) throw new Error("External API unreachable");

    const textData = await textRes.json();

    // 2. CRITICAL: Transform the flat text into a Verse Array for your Frontend
    // Your frontend expects: { verses: [{ number: 1, text: "..." }] }
    const formattedVerses = textData.verses?.map((v: any) => ({
      number: v.verse,
      text: v.text.trim()
    })) || [];

    // 3. Audio Logic (Ensure URL is encoded for spaces/special chars)
    const audioUrl = `https://cdn.global-scriptures.com/audio/${langCode}/${book}/${chapter}.mp3`;

    return NextResponse.json({
      passage: textData.reference || `${book} ${chapter}`,
      verses: formattedVerses, // This fixed the "clustered text" issue
      audio: audioUrl,
      language: langCode
    });

  } catch (e) {
    console.error("API Route Error:", e);
    return NextResponse.json({ 
      error: "Global Sync Failed",
      details: e instanceof Error ? e.message : "Unknown error"
    }, { status: 500 });
  }
}