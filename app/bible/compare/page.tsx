'use client';

import { useState, useEffect, useCallback } from 'react';
import { ParallelBible } from '@/components/bible/ParallelBible';
import Sidebar from '@/app/layout-components/Sidebar';
import Header from '@/app/layout-components/Header';
import Image from 'next/image';

export default function ComparePage() {
  const [selectedTranslations, setSelectedTranslations] = useState(['KJV', 'NIV']);
  const [book, setBook] = useState('John');
  const [chapter, setChapter] = useState('3');
  const [verse, setVerse] = useState('16');
  const [versesData, setVersesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchComparison = useCallback(async () => {
    if (!book || !chapter || !verse) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/bible/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book,
          chapter,
          verse,
          translations: selectedTranslations
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setVersesData(data.results); 
      }
    } catch (error) {
      console.error('Failed to fetch translations:', error);
    } finally {
      setLoading(false);
    }
  }, [book, chapter, verse, selectedTranslations]);

  useEffect(() => {
    fetchComparison();
  }, [book, chapter, verse, selectedTranslations, fetchComparison]);

  const toggleTranslation = (translation: string) => {
    setSelectedTranslations(prev =>
      prev.includes(translation) 
        ? prev.filter(t => t !== translation) 
        : [...prev, translation]
    );
  };

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

      <main className="relative z-10 flex-1 lg:ml-56 pt-20 pb-16 px-6 md:px-10 max-w-6xl mx-auto w-full">
        
        {/* Header Section */}
        <header className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-px bg-amber-400/40" />
            <span className="text-[8px] font-black uppercase tracking-wider text-amber-600">Study Mode</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-600"></div>
            <h1 className="text-3xl md:text-4xl font-serif text-gray-800 tracking-tight">
              Compare <span className="italic text-amber-600">Translations</span>
            </h1>
          </div>
          <p className="text-sm text-gray-600 italic border-l-2 border-amber-400 pl-4 mt-2">
            Study scripture across multiple translations side by side.
          </p>
        </header>

        {/* Controls Container */}
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-xl p-6 mb-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1 ml-1">
                <span className="material-symbols-outlined text-amber-500 text-[10px]">menu_book</span>
                <label className="text-[6px] font-black text-amber-600 uppercase tracking-wider">Book</label>
              </div>
              <input
                value={book}
                onChange={e => setBook(e.target.value)}
                className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                placeholder="John"
              />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center gap-1 ml-1">
                <span className="material-symbols-outlined text-amber-500 text-[10px]">numbers</span>
                <label className="text-[6px] font-black text-amber-600 uppercase tracking-wider">Chapter</label>
              </div>
              <input 
                type="number" 
                value={chapter} 
                onChange={e => setChapter(e.target.value)} 
                className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
              />
            </div>
            
            <div className="space-y-1.5">
              <div className="flex items-center gap-1 ml-1">
                <span className="material-symbols-outlined text-amber-500 text-[10px]">format_quote</span>
                <label className="text-[6px] font-black text-amber-600 uppercase tracking-wider">Verse</label>
              </div>
              <input 
                type="number" 
                value={verse} 
                onChange={e => setVerse(e.target.value)} 
                className="w-full bg-white/50 border border-gray-200 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
            <div className="flex flex-wrap gap-2">
              {['KJV', 'ESV', 'NIV', 'NASB', 'MSG', 'NLT'].map(t => (
                <button
                  key={t}
                  onClick={() => toggleTranslation(t)}
                  className={`px-3 py-1.5 rounded-full text-[7px] font-black uppercase tracking-wider transition-all border ${
                    selectedTranslations.includes(t) 
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 border-amber-600 text-white shadow-md' 
                      : 'bg-white/50 border-gray-200 text-gray-500 hover:border-amber-300 hover:text-amber-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button 
              onClick={fetchComparison}
              disabled={loading}
              className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg text-[8px] font-black uppercase tracking-wider hover:shadow-md hover:scale-[1.02] transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[12px]">sync</span>
                  COMPARING...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[12px]">compare_arrows</span>
                  COMPARE NOW
                </>
              )}
            </button>
          </div>
        </div>

        {/* Parallel Bible Component */}
        {versesData.length > 0 ? (
          <ParallelBible 
            verses={versesData} 
            translations={selectedTranslations} 
          />
        ) : !loading && (
          <div className="py-20 text-center bg-white/30 backdrop-blur-sm rounded-xl border border-dashed border-amber-200">
            <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-amber-400 text-2xl">menu_book</span>
            </div>
            <p className="text-[10px] font-serif italic text-gray-500">Select translations and click Compare to begin your study.</p>
          </div>
        )}

        {/* Decorative Footer */}
        <div className="mt-10 flex justify-center items-center gap-4 opacity-30">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400" />
          <span className="material-symbols-outlined text-amber-400 text-sm">compare_arrows</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400" />
        </div>
      </main>
    </div>
  );
}