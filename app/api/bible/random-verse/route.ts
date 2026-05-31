import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const BIBLE_API_KEY = process.env.NEXT_PUBLIC_BIBLE_API_KEY;
    const BIBLE_ID = 'de4e12af7f895f10-01'; // Default King James Version

    if (!BIBLE_API_KEY) {
      return NextResponse.json(
        { success: false, error: 'API configuration missing' },
        { status: 500 }
      );
    }

    // 1. Fetch the list of books to pick a random one
    const booksResponse = await fetch(
      `https://api.scripture.api.bible/v1/bibles/${BIBLE_ID}/books`,
      { headers: { 'api-key': BIBLE_API_KEY } }
    );
    const booksData = await booksResponse.json();
    const books = booksData.data;
    const randomBook = books[Math.floor(Math.random() * books.length)];

    // 2. Fetch chapters for that random book
    const chaptersResponse = await fetch(
      `https://api.scripture.api.bible/v1/bibles/${BIBLE_ID}/books/${randomBook.id}/chapters`,
      { headers: { 'api-key': BIBLE_API_KEY } }
    );
    const chaptersData = await chaptersResponse.json();
    const chapters = chaptersData.data.filter((ch: any) => ch.number !== 'intro');
    const randomChapter = chapters[Math.floor(Math.random() * chapters.length)];

    // 3. Fetch the full chapter content and pick a random verse
    const chapterContentResponse = await fetch(
      `https://api.scripture.api.bible/v1/bibles/${BIBLE_ID}/chapters/${randomChapter.id}?content-type=json`,
      { headers: { 'api-key': BIBLE_API_KEY } }
    );
    const chapterResult = await chapterContentResponse.json();
    
    // API.Bible returns chapter content as an array of objects (verses/paras)
    const verses = chapterResult.data.content.filter((item: any) => item.type === 'tag' && item.name === 'v');
    const randomVerse = verses[Math.floor(Math.random() * verses.length)];

    // Clean up text: remove verse numbers/markers
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
      },
    });
  } catch (error) {
    console.error('Bible API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch the Word' },
      { status: 500 }
    );
  }
}