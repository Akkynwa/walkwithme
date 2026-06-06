import { NextResponse } from 'next/server';
import { convertBookToCDNFormat } from '@/lib/bible-utils';

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
    // Build API.Bible endpoint
    const apiKey = process.env.NEXT_PUBLIC_BIBLE_API_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_BIBLE_API_URL || 'https://api.scripture.api.bible/v1';
    
    // API.Bible Bible IDs mapping
    const bibleIds: Record<string, Record<string, string>> = {
      en: {
        'de4e12af7f29f59f-01': 'de4e12af7f29f59f-01', // KJV
        '06125ad3d5662098-01': '06125ad3d5662098-01', // NIV
      },
      fr: {
        '01b17f8a70e2842c-01': '01b17f8a70e2842c-01', // French
      },
      es: {
        '592420522e16040d-01': '592420522e16040d-01', // Spanish
      },
      de: {
        'b17e01658803510c-01': 'b17e01658803510c-01', // German
      },
    };

    const bibleId = versionId
      ? bibleIds[langCode]?.[versionId] || versionId
      : 'de4e12af7f29f59f-01';
    const passage = `${book} ${chapter}`;
    
    const chapterUrl = `${baseUrl}/bibles/${bibleId}/passages/${encodeURIComponent(passage)}?content-type=text`;

    const textRes = await fetch(chapterUrl, {
      headers: {
        'api-key': apiKey || '',
        'Content-Type': 'application/json',
      },
    });

    if (!textRes.ok) {
      console.error(`Failed to fetch from API.Bible: ${chapterUrl}`, textRes.status);
      throw new Error(`Failed to fetch chapter: ${textRes.statusText}`);
    }

    const textData = await textRes.json();

    // Parse verses from API.Bible response
    let formattedVerses: any[] = [];
    
    if (textData.data && textData.data.content) {
      // Extract verses from the content
      const content = textData.data.content;
      const verseRegex = /\{(\d+)\}/g;
      let match;
      
      while ((match = verseRegex.exec(content)) !== null) {
        const verseNum = parseInt(match[1]);
        const verseStart = match.index + match[0].length;
        const nextMatch = verseRegex.exec(content);
        const verseEnd = nextMatch ? nextMatch.index : content.length;
        verseRegex.lastIndex = nextMatch ? nextMatch.index : content.length;
        
        const verseText = content.substring(verseStart, verseEnd).trim();
        if (verseText) {
          formattedVerses.push({
            number: verseNum,
            text: verseText
          });
        }
      }

      // If no verses found with regex, return the whole content as verse 1
      if (formattedVerses.length === 0) {
        formattedVerses = [{
          number: 1,
          text: content.trim()
        }];
      }
    }

    // 5. Generate audio URL
    const audioUrl = `https://cdn.global-scriptures.com/audio/${langCode}/${convertBookToCDNFormat(book)}/${chapter}.mp3`;

    return NextResponse.json({
      success: true,
      passage: textData.data?.reference || `${book} ${chapter}`,
      verses: formattedVerses,
      audio: audioUrl,
      language: langCode,
      version: versionId
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { book, chapter, lang = 'en', versionId } = body;

    if (!book || !chapter) {
      return NextResponse.json(
        { error: "Missing parameters: book and chapter are required" },
        { status: 400 }
      );
    }

    // Build API.Bible endpoint
    const apiKey = process.env.NEXT_PUBLIC_BIBLE_API_KEY;
    const baseUrl = process.env.NEXT_PUBLIC_BIBLE_API_URL || 'https://api.scripture.api.bible/v1';
    
    // API.Bible Bible IDs mapping
    const bibleIds: Record<string, Record<string, string>> = {
      en: {
        'de4e12af7f29f59f-01': 'de4e12af7f29f59f-01', // KJV
        '06125ad3d5662098-01': '06125ad3d5662098-01', // NIV
      },
      fr: {
        '01b17f8a70e2842c-01': '01b17f8a70e2842c-01', // French
      },
      es: {
        '592420522e16040d-01': '592420522e16040d-01', // Spanish
      },
      de: {
        'b17e01658803510c-01': 'b17e01658803510c-01', // German
      },
    };

    const bibleId = bibleIds[lang]?.[versionId] || versionId || 'de4e12af7f29f59f-01';
    const passage = `${book} ${chapter}`;
    
    const chapterUrl = `${baseUrl}/bibles/${bibleId}/passages/${encodeURIComponent(passage)}?content-type=text`;

    const textRes = await fetch(chapterUrl, {
      headers: {
        'api-key': apiKey || '',
        'Content-Type': 'application/json',
      },
    });

    if (!textRes.ok) {
      console.error(`Failed to fetch from API.Bible: ${chapterUrl}`, textRes.status);
      throw new Error(`Failed to fetch chapter: ${textRes.statusText}`);
    }

    const textData = await textRes.json();

    // Parse verses from API.Bible response
    let formattedVerses: any[] = [];
    
    if (textData.data && textData.data.content) {
      // Extract verses from the content
      const content = textData.data.content;
      const verseRegex = /\{(\d+)\}/g;
      let match;
      
      while ((match = verseRegex.exec(content)) !== null) {
        const verseNum = parseInt(match[1]);
        const verseStart = match.index + match[0].length;
        const nextMatch = verseRegex.exec(content);
        const verseEnd = nextMatch ? nextMatch.index : content.length;
        verseRegex.lastIndex = nextMatch ? nextMatch.index : content.length;
        
        const verseText = content.substring(verseStart, verseEnd).trim();
        if (verseText) {
          formattedVerses.push({
            number: verseNum,
            text: verseText
          });
        }
      }

      // If no verses found with regex, return the whole content as verse 1
      if (formattedVerses.length === 0) {
        formattedVerses = [{
          number: 1,
          text: content.trim()
        }];
      }
    }

    // Generate audio URL
    const audioUrl = `https://cdn.global-scriptures.com/audio/${lang}/${convertBookToCDNFormat(book)}/${chapter}.mp3`;

    return NextResponse.json({
      success: true,
      passage: textData.data?.reference || `${book} ${chapter}`,
      verses: formattedVerses,
      audio: audioUrl,
      language: lang,
      version: versionId
    });

  } catch (e) {
    console.error("POST API Route Error:", e);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve passage",
        details: e instanceof Error ? e.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}