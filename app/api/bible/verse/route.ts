import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const BIBLE_API_KEY = process.env.NEXT_PUBLIC_BIBLE_API_KEY;
    const BIBLE_ID = 'de4e12af7f895f10-01'; // King James Version

    if (!BIBLE_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'API Key not configured' },
        { status: 500 }
      );
    }

    // 1. Fetch all books to select one at random
    const booksRes = await fetch(
      `https://api.scripture.api.bible/v1/bibles/${BIBLE_ID}/books`,
      { headers: { 'api-key': BIBLE_API_KEY } }
    );
    const booksData = await booksRes.json();
    const books = booksData.data;
    const randomBook = books[Math.floor(Math.random() * books.length)];

    // 2. Fetch chapters for the selected book
    const chaptersRes = await fetch(
      `https://api.scripture.api.bible/v1/bibles/${BIBLE_ID}/books/${randomBook.id}/chapters`,
      { headers: { 'api-key': BIBLE_API_KEY } }
    );
    const chaptersData = await chaptersRes.json();
    // Filter out "intro" sections if they exist
    const chapters = chaptersData.data.filter((ch: any) => ch.number !== 'intro');
    const randomChapter = chapters[Math.floor(Math.random() * chapters.length)];

    // 3. Fetch the full chapter and select a random verse from the content
    const contentRes = await fetch(
      `https://api.scripture.api.bible/v1/bibles/${BIBLE_ID}/chapters/${randomChapter.id}?content-type=json`,
      { headers: { 'api-key': BIBLE_API_KEY } }
    );
    const contentData = await contentRes.json();
    
    // Filter for actual verse tags in the JSON structure
    const verses = contentData.data.content.filter(
      (item: any) => item.type === 'tag' && item.name === 'v'
    );
    const randomVerse = verses[Math.floor(Math.random() * verses.length)];

    // Clean up the text by joining items and removing leading verse numbers
    const cleanText = randomVerse.items
      .map((i: any) => i.text)
      .join('')
      .replace(/^\d+\s*/, '');

    return NextResponse.json({
      success: true,
      verse: {
        book: randomBook.name,
        chapter: randomChapter.number,
        verse: randomVerse.attrs.number,
        text: cleanText.trim(),
        reference: `${randomBook.name} ${randomChapter.number}:${randomVerse.attrs.number}`,
      }
    });
  } catch (error) {
    console.error('Bible Production API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve scripture' },
      { status: 500 }
    );
  }
}