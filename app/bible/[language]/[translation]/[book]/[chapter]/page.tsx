'use client';

import { useState, useEffect } from 'react';
import { ChapterList } from '@/components/bible/ChapterList';
import { TranslationSwitcher } from '@/components/bible/TranslationSwitcher';
import { useParams } from 'next/navigation';

export default function BibleChapterPage() {
  const params = useParams();
  const { book = 'Genesis', chapter = '1', language = 'en', translation = 'KJV' } = params as any;
  
  const [currentTranslation, setCurrentTranslation] = useState(translation as string);
  const [verses, setVerses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock fetch verses
    const mockVerses = Array.from({ length: 31 }, (_, i) => ({
      book: book as string,
      chapter: parseInt(chapter as string),
      verse: i + 1,
      text: `This is verse ${i + 1} from ${book} ${chapter}. In a real app, this would be fetched from the Bible API.`,
    }));
    setVerses(mockVerses);
    setLoading(false);
  }, [book, chapter, currentTranslation]);

  return (
    <main className="min-h-screen bg-light dark:bg-dark py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-dark dark:text-light">
            {book}
          </h1>
          <div className="w-48">
            <TranslationSwitcher
              currentTranslation={currentTranslation}
              onTranslationChange={setCurrentTranslation}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">Loading verses...</div>
        ) : (
          <ChapterList
            book={book as string}
            chapterCount={50}
            currentChapter={parseInt(chapter as string)}
            verses={verses}
            onChapterChange={ch => window.location.href = `/bible/${language}/${currentTranslation}/${book}/${ch}`}
          />
        )}
      </div>
    </main>
  );
}
