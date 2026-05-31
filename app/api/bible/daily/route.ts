import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const BIBLE_API_KEY = process.env.NEXT_PUBLIC_BIBLE_API_KEY;
    // King James Version ID (Commonly available on the free tier)
    const BIBLE_ID = 'de4e12af7f895f10-01'; 

    if (!BIBLE_API_KEY) {
      return NextResponse.json({ error: 'API Key missing' }, { status: 500 });
    }

    /**
     * Logic: To get a "Daily" feel without a specific VOD endpoint, 
     * we fetch a specific chapter or use a predefined list of 
     * impactful verses indexed by the day of the year.
     */
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    
    // A sample list of verse IDs to rotate through
    const verseIds = ['JER.29.11', 'PSA.23.1', 'PHL.4.13', 'ROM.8.28', 'PRO.3.5', 'MAT.6.33', 'ISA.41.10'];
    const selectedId = verseIds[dayOfYear % verseIds.length];

    const response = await fetch(
      `https://api.scripture.api.bible/v1/bibles/${BIBLE_ID}/verses/${selectedId}?content-type=text&include-notes=false&include-titles=false`,
      {
        headers: {
          'api-key': BIBLE_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch from Scripture API');
    }

    const result = await response.json();
    const data = result.data;

    const verse = {
      reference: data.reference,
      text: data.content.trim(),
      translation: 'KJV',
      date: new Date().toISOString(),
      verseId: data.id
    };

    return NextResponse.json({
      success: true,
      verse,
    });
  } catch (error) {
    console.error('Bible API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch the living Word for today' },
      { status: 500 }
    );
  }
}