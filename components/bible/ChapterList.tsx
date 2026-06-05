'use client';

import { useState } from 'react';
import { VerseRenderer } from './VerseRenderer';

interface ChapterListProps {
  book: string;
  chapterCount: number;
  currentChapter: number;
  verses: any[];
  onChapterChange: (chapter: number) => void;
}

export function ChapterList({
  book,
  chapterCount,
  currentChapter,
  verses,
  onChapterChange,
}: ChapterListProps) {
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');

  const chapters = Array.from({ length: chapterCount }, (_, i) => i + 1);

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header & View Toggle */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-5">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="material-symbols-outlined text-amber-500 text-[12px]">menu_book</span>
            <span className="text-[7px] font-black uppercase tracking-wider text-amber-600">Currently Reading</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif font-black text-gray-800 tracking-tight">{book}</h2>
        </div>

        {/* Custom Segmented Control */}
        <div className="flex bg-white/50 backdrop-blur-sm p-0.5 rounded-lg border border-white/60 w-fit">
          <button
            onClick={() => setDisplayMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[8px] font-black uppercase tracking-wider transition-all ${
              displayMode === 'grid' 
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-sm' 
                : 'text-gray-500 hover:text-amber-600'
            }`}
          >
            <span className="material-symbols-outlined text-[12px]">grid_view</span>
            Grid
          </button>
          <button
            onClick={() => setDisplayMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[8px] font-black uppercase tracking-wider transition-all ${
              displayMode === 'list' 
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-sm' 
                : 'text-gray-500 hover:text-amber-600'
            }`}
          >
            <span className="material-symbols-outlined text-[12px]">list</span>
            Select
          </button>
        </div>
      </div>

      {/* Navigation Area */}
      <div className="mb-10">
        {displayMode === 'grid' ? (
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2">
            {chapters.map(chapter => (
              <button
                key={chapter}
                onClick={() => onChapterChange(chapter)}
                className={`h-9 rounded-lg font-serif font-bold text-xs transition-all active:scale-95 ${
                  currentChapter === chapter 
                    ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-500/20 scale-105' 
                    : 'bg-white/50 backdrop-blur-sm border border-white/60 text-gray-600 hover:border-amber-300 hover:bg-amber-50 hover:text-amber-700'
                }`}
              >
                {chapter}
              </button>
            ))}
          </div>
        ) : (
          <div className="relative group">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-amber-500 text-[16px]">menu_book</span>
            <select
              value={currentChapter}
              onChange={e => onChapterChange(parseInt(e.target.value))}
              className="w-full pl-9 pr-8 py-2.5 rounded-lg border border-white/60 bg-white/50 backdrop-blur-sm font-serif font-semibold text-gray-700 appearance-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none cursor-pointer text-sm"
            >
              {chapters.map(chapter => (
                <option key={chapter} value={chapter}>
                  Chapter {chapter}
                </option>
              ))}
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 text-[16px] pointer-events-none">expand_more</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="bg-white/40 backdrop-blur-sm rounded-xl border border-white/60 p-6 md:p-8 shadow-lg">
        <div className="max-w-prose mx-auto">
          <VerseRenderer verses={verses} translation="KJV" />
        </div>
      </div>
    </div>
  );
}