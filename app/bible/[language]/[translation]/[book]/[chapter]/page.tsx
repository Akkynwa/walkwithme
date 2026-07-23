'use client';

import { useState, useEffect } from 'react';
import { ChapterList } from '@/components/bible/ChapterList';
import { TranslationSwitcher } from '@/components/bible/TranslationSwitcher';
import { useParams, useRouter } from 'next/navigation';
import { useTheme } from '@/app/context/ThemeContext';
import Sidebar from '@/app/layout-components/Sidebar';

export default function BibleChapterPage() {
  const params = useParams();
  const router = useRouter();
  const { isDark } = useTheme();

  const { book = 'Genesis', chapter = '1', language = 'en', translation = 'KJV' } = params as any;
  
  const [currentTranslation, setCurrentTranslation] = useState(translation as string);
  const [verses, setVerses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock fetch verses - replace with actual API call
    const mockVerses = Array.from({ length: 31 }, (_, i) => ({
      book: book as string,
      chapter: parseInt(chapter as string),
      verse: i + 1,
      text: `This is verse ${i + 1} from ${book} ${chapter}. In a real app, this would be fetched from the Bible API.`,
    }));
    setVerses(mockVerses);
    setLoading(false);
  }, [book, chapter, currentTranslation]);

  const handleChapterChange = (ch: number) => {
    router.push(`/bible/${language}/${currentTranslation}/${book}/${ch}`);
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-stone-50 text-stone-900'
    }`}>
      
      <Sidebar />

      <main className="flex-1 lg:ml-56 pt-24 pb-16 px-6 md:px-10 max-w-5xl mx-auto w-full">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-8 h-px ${isDark ? 'bg-amber-500/40' : 'bg-amber-400/40'}`} />
              <span className={`text-[8px] font-black uppercase tracking-wider ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                Scripture Reading
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-amber-500' : 'bg-amber-600'}`}></div>
              <h1 className={`text-3xl md:text-4xl font-serif tracking-tight ${isDark ? 'text-zinc-100' : 'text-gray-800'}`}>
                {book}
              </h1>
            </div>
          </div>
          <div className="w-56">
            <TranslationSwitcher
              currentTranslation={currentTranslation}
              onTranslationChange={setCurrentTranslation}
            />
          </div>
        </div>

        {/* Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            <p className={`text-[8px] font-black uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
              Loading verses...
            </p>
          </div>
        ) : (
          <div className={`border rounded-xl p-6 shadow-sm transition-colors ${
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-stone-200'
          }`}>
            <ChapterList
              book={book as string}
              chapterCount={50}
              currentChapter={parseInt(chapter as string)}
              verses={verses}
              onChapterChange={handleChapterChange}
            />
          </div>
        )}

        {/* Decorative Footer */}
        <div className="mt-10 flex justify-center items-center gap-4 opacity-30">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400" />
          <span className="material-symbols-outlined text-amber-500 text-sm">menu_book</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400" />
        </div>
      </main>
    </div>
  );
}