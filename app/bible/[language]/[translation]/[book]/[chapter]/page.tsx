'use client';

import { useState, useEffect } from 'react';
import { ChapterList } from '@/components/bible/ChapterList';
import { TranslationSwitcher } from '@/components/bible/TranslationSwitcher';
import { useParams } from 'next/navigation';
import Sidebar from '@/app/layout-components/Sidebar';
import Header from '@/app/layout-components/Header';
import Image from 'next/image';

export default function BibleChapterPage() {
  const params = useParams();
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

  return (
    <div className="relative flex min-h-screen">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=2070"
          alt="Peaceful sanctuary background"
          fill
          className="object-cover scale-110 blur-xl opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/30"></div>
      </div>

      {/* Subtle Animated Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-amber-200/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-amber-300/8 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '-3s' }} />
      </div>

      <Sidebar />
      <Header />

      <main className="relative z-10 flex-1 lg:ml-56 pt-20 pb-16 px-6 md:px-10 max-w-5xl mx-auto w-full">
        
        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-px bg-amber-400/40" />
              <span className="text-[8px] font-black uppercase tracking-wider text-amber-600">Scripture Reading</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-600"></div>
              <h1 className="text-3xl md:text-4xl font-serif text-gray-800 tracking-tight">
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
            <p className="text-[8px] font-black uppercase tracking-wider text-gray-500">Loading verses...</p>
          </div>
        ) : (
          <ChapterList
            book={book as string}
            chapterCount={50}
            currentChapter={parseInt(chapter as string)}
            verses={verses}
            onChapterChange={ch => window.location.href = `/bible/${language}/${currentTranslation}/${book}/${ch}`}
          />
        )}

        {/* Decorative Footer */}
        <div className="mt-10 flex justify-center items-center gap-4 opacity-30">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400" />
          <span className="material-symbols-outlined text-amber-400 text-sm">menu_book</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400" />
        </div>
      </main>
    </div>
  );
}