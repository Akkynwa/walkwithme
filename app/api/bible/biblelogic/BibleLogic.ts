'use client';

import { useState } from 'react';

// This is where you'd put your actual API key
const BIBLE_API_KEY = process.env.NEXT_PUBLIC_BIBLE_API_KEY;

export default function BibleLogic() {
  const [audioUrl, setAudioUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);

  // 1. The Logic to fetch the Audio Link
  const fetchBibleAudio = async (book: string, chapter: number, versionId: string) => {
    setLoading(true);
    try {
      // Example using API.Bible's structure
      // First, we find the chapter ID, then we get the audio link
      const response = await fetch(
        `https://api.scripture.api.bible/v1/bibles/${versionId}/chapters/${book}.${chapter}/audio`,
        {
          headers: { 'api-key': BIBLE_API_KEY || '' }
        }
      );
      
      const data = await response.json();
      // Most APIs return a streaming URL or an MP3 link
      setAudioUrl(data.data.resourceUrl); 
    } catch (error) {
      console.error("Error fetching audio:", error);
    } finally {
      setLoading(false);
    }
  };

  // 2. The "Pre-template-literaled" link for a simple local setup
  // If you are hosting the files yourself in the /public folder:
  const getLocalAudioPath = (book: string, chapter: number, lang: string) => {
    return `/audio/${lang}/${book.toLowerCase()}-${chapter}.mp3`;
  };

  return { audioUrl, fetchBibleAudio, getLocalAudioPath, loading };
}