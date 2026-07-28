import { NextResponse } from 'next/server';

// Forces Next.js to render this route dynamically at runtime
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Check for both server-side and client-exposed environment variables
    const BIBLE_API_KEY = process.env.BIBLE_API_KEY || process.env.NEXT_PUBLIC_BIBLE_API_KEY;
    const BIBLE_ID = 'de4e12af7f895f10-01'; // King James Version

    if (!BIBLE_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'API Key not configured' },
        { status: 500 }
      );
    }

    const headers = { 'api-key': BIBLE_API_KEY };

    // 1. Fetch all books to select one at random
    const booksRes = await fetch(
      `https://api.scripture.api.bible/v1/bibles/${BIBLE_ID}/books`,
      { headers }
    );
    if (!booksRes.ok) throw new Error(`Books API returned status ${booksRes.status}`);
    
    const booksData = await booksRes.json();
    const books = booksData?.data ?? [];
    if (!books.length) throw new Error('No books found');

    const randomBook = books[Math.floor(Math.random() * books.length)];

    // 2. Fetch chapters for the selected book
    const chaptersRes = await fetch(
      `https://api.scripture.api.bible/v1/bibles/${BIBLE_ID}/books/${randomBook.id}/chapters`,
      { headers }
    );
    if (!chaptersRes.ok) throw new Error(`Chapters API returned status ${chaptersRes.status}`);

    const chaptersData = await chaptersRes.json();
    const chaptersList = chaptersData?.data ?? [];
    
    // Filter out "intro" sections if they exist
    const chapters = chaptersList.filter((ch: any) => ch?.number !== 'intro');
    if (!chapters.length) throw new Error('No chapters found');

    const randomChapter = chapters[Math.floor(Math.random() * chapters.length)];

    // 3. Fetch the full chapter and select a random verse from the content
    const contentRes = await fetch(
      `https://api.scripture.api.bible/v1/bibles/${BIBLE_ID}/chapters/${randomChapter.id}?content-type=json`,
      { headers }
    );
    if (!contentRes.ok) throw new Error(`Content API returned status ${contentRes.status}`);

    const contentData = await contentRes.json();
    const rawContent = contentData?.data?.content ?? [];
    
    // Filter for actual verse tags in the JSON structure
    const verses = rawContent.filter(
      (item: any) => item?.type === 'tag' && item?.name === 'v'
    );
    if (!verses.length) throw new Error('No valid verses found in chapter content');

    const randomVerse = verses[Math.floor(Math.random() * verses.length)];

    // Clean up the text safely
    const rawItems = randomVerse?.items ?? [];
    const cleanText = rawItems
      .map((i: any) => i?.text || '')
      .join('')
      .replace(/^\d+\s*/, '');

    return NextResponse.json({
      success: true,
      verse: {
        book: randomBook.name,
        chapter: randomChapter.number,
        verse: randomVerse?.attrs?.number || '1',
        text: cleanText.trim(),
        reference: `${randomBook.name} ${randomChapter.number}:${randomVerse?.attrs?.number || '1'}`,
      }
    });
  } catch (error: any) {
    console.error('Bible Production API Error:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to retrieve scripture' },
      { status: 500 }
    );
  }
}