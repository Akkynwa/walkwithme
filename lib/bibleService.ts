// lib/bibleService.ts

export interface Verse {
  number: number;
  text: string;
  startSecond: number; // We calculate this for the karaoke effect
}

export async function getRealChapter(bookName: string, chapter: number) {
  try {
    // Fetching from a free, public open-source Bible API
    const response = await fetch(`https://bible-api.com/${bookName}+${chapter}?translation=kjv`);
    const data = await response.json();

    // Map the verses into a structure our player can read in real time
    const verses: Verse[] = data.verses.map((v: any, index: number) => ({
      number: v.verse,
      text: v.text.trim(),
      // Simple estimate: assume an average reading speed of 4 seconds per verse
      // For absolute precision, production apps use pre-mapped timestamp JSONs
      startSecond: index * 4 
    }));

    // A real public audio stream link for KJV (Placeholder standard audio structure)
    const audioUrl = `https://bibles.org/audio/eng-KJV/${bookName}/${chapter}.mp3`;

    return { verses, audioUrl };
  } catch (error) {
    console.error("Error fetching from public Bible API:", error);
    return null;
  }
}