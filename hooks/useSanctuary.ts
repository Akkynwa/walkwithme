import { useState, useCallback } from 'react';

export const useSanctuary = () => {
  const [loading] = useState(false);

  const saveReflection = useCallback(async (book: string, chapter: number, content: string) => {
    try {
      const res = await fetch('/api/journal/reflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ book, chapter, content, timestamp: new Date() }),
      });
      return await res.json();
    } catch (err) {
      console.error("Failed to archive reflection:", err);
    }
  }, []);

  return { saveReflection, loading };
};