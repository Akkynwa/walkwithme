'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useTheme } from '../../context/ThemeContext';
import { ParallelBible } from '@/components/bible/ParallelBible';
import Sidebar from '@/app/layout-components/Sidebar';

interface VerseComparison {
  translation: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export default function ComparePage() {
  const { isDark } = useTheme();

  const [selectedTranslations, setSelectedTranslations] = useState(['KJV', 'NIV']);
  const [book, setBook] = useState('John');
  const [chapter, setChapter] = useState('3');
  const [verse, setVerse] = useState('16');
  const [versesData, setVersesData] = useState<VerseComparison[]>([]);
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
        setVersesData(data.results || []); 
      }
    } catch (error) {
      console.error('Failed to fetch translations:', error);
    } finally {
      setLoading(false);
    }
  }, [book, chapter, verse, selectedTranslations]);

  useEffect(() => {
    fetchComparison();
  }, [fetchComparison]);

  const toggleTranslation = (translation: string) => {
    setSelectedTranslations(prev =>
      prev.includes(translation) 
        ? prev.filter(t => t !== translation) 
        : [...prev, translation]
    );
  };

  return (
    <div className={`flex min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-stone-50 text-stone-900'
    }`}>
      
      <Sidebar />

      <main className="flex-1 lg:ml-56 pt-24 pb-16 px-6 md:px-10 max-w-4xl mx-auto w-full space-y-4">
        
        {/* Compact Back Button */}
        <div className="flex justify-start">
          <Link 
            href="/bible" 
            className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border transition-colors ${
              isDark 
                ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700' 
                : 'bg-white border-stone-200 text-stone-500 hover:text-stone-800 hover:border-stone-300 shadow-sm'
            }`}
          >
            <span className="material-symbols-outlined text-[12px]">arrow_back</span>
            Back
          </Link>
        </div>
        
        {/* Header Section */}
        <header className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-8 h-px ${isDark ? 'bg-amber-500/40' : 'bg-amber-400/40'}`} />
            <span className={`text-[8px] font-black uppercase tracking-wider ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>Study Mode</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-amber-500' : 'bg-amber-600'}`}></div>
            <h1 className={`text-3xl md:text-4xl font-serif tracking-tight ${isDark ? 'text-zinc-100' : 'text-gray-800'}`}>
              Compare <span className="italic text-amber-600">Translations</span>
            </h1>
          </div>
          <p className={`text-sm italic border-l-2 border-amber-400 pl-4 mt-2 ${isDark ? 'text-zinc-400' : 'text-gray-600'}`}>
            Study scripture across multiple translations side by side.
          </p>
        </header>

        {/* Controls Container - Plain/Solid Theme */}
        <div className={`border rounded-xl p-6 mb-8 shadow-sm transition-colors ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-stone-200'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
            <div className="space-y-1.5">
              <div className="flex items-center gap-1 ml-1">
                <span className="material-symbols-outlined text-amber-500 text-[10px]">menu_book</span>
                <label className="text-[6px] font-black text-amber-600 uppercase tracking-wider">Book</label>
              </div>
              <input
                value={book}
                onChange={e => setBook(e.target.value)}
                className={`w-full border rounded-lg px-4 py-2 text-sm font-medium outline-none transition-all ${
                  isDark 
                    ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-amber-500' 
                    : 'bg-stone-50 border-gray-250 text-gray-700 focus:border-amber-500'
                }`}
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
                className={`w-full border rounded-lg px-4 py-2 text-sm font-medium outline-none transition-all ${
                  isDark 
                    ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-amber-500' 
                    : 'bg-stone-50 border-gray-250 text-gray-700 focus:border-amber-500'
                }`}
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
                className={`w-full border rounded-lg px-4 py-2 text-sm font-medium outline-none transition-all ${
                  isDark 
                    ? 'bg-zinc-800 border-zinc-700 text-zinc-100 focus:border-amber-500' 
                    : 'bg-stone-50 border-gray-250 text-gray-700 focus:border-amber-500'
                }`}
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
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 border-amber-600 text-white shadow-sm' 
                      : isDark
                        ? 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-amber-500 hover:text-amber-500'
                        : 'bg-stone-50 border-gray-200 text-gray-500 hover:border-amber-300 hover:text-amber-600'
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
          <div className={`py-20 text-center rounded-xl border border-dashed ${
            isDark ? 'bg-zinc-900/30 border-zinc-800 text-zinc-400' : 'bg-stone-50 border-amber-200 text-gray-500'
          }`}>
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 ${isDark ? 'bg-zinc-800' : 'bg-amber-100'}`}>
              <span className="material-symbols-outlined text-amber-500 text-2xl">menu_book</span>
            </div>
            <p className="text-[10px] font-serif italic">Select translations and click Compare to begin your study.</p>
          </div>
        )}

        {/* Decorative Footer */}
        <div className="mt-10 flex justify-center items-center gap-4 opacity-30">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400" />
          <span className="material-symbols-outlined text-amber-500 text-sm">compare_arrows</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400" />
        </div>
      </main>
    </div>
  );
}