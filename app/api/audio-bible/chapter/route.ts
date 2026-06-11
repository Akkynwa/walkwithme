import { NextResponse } from 'next/server';
import { getRealChapter } from '@/lib/bibleService';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const book = searchParams.get('book') || 'John'; // Expects full names like 'John' or 'Genesis'
  const chapter = parseInt(searchParams.get('chapter') || '1', 10);

  try {
    const data = await getRealChapter(book, chapter);
    
    if (!data) {
      return NextResponse.json({ error: "Bible content not found" }, { status: 404 });
    }

    return NextResponse.json({
      book,
      chapter,
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Temporary steady stream for testing audio player
      verses: data.verses
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}