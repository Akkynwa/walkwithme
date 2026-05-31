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
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/50 mb-1 block">Currently Reading</span>
          <h2 className="text-4xl font-display font-black text-[#3C3830] tracking-tighter">{book}</h2>
        </div>

        {/* Custom Segmented Control */}
        <div className="flex bg-gray-100 p-1 rounded-2xl w-fit border border-gray-200/50">
          <button
            onClick={() => setDisplayMode('grid')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
              displayMode === 'grid' ? 'bg-white shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <span className="material-symbols-outlined text-sm">grid_view</span>
            Grid
          </button>
          <button
            onClick={() => setDisplayMode('list')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all ${
              displayMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <span className="material-symbols-outlined text-sm">list</span>
            Select
          </button>
        </div>
      </div>

      {/* Navigation Area */}
      <div className="mb-12">
        {displayMode === 'grid' ? (
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-3">
            {chapters.map(chapter => (
              <button
                key={chapter}
                onClick={() => onChapterChange(chapter)}
                className={`h-11 rounded-xl font-display font-bold text-sm transition-all active:scale-90 ${
                  currentChapter === chapter 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105' 
                  : 'bg-white border border-gray-100 text-secondary hover:border-primary/30 hover:bg-primary/5'
                }`}
              >
                {chapter}
              </button>
            ))}
          </div>
        ) : (
          <div className="relative group">
             <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary/40">menu_book</span>
             <select
              value={currentChapter}
              onChange={e => onChapterChange(parseInt(e.target.value))}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-gray-100 bg-white shadow-sm font-bold text-secondary appearance-none focus:ring-2 focus:ring-primary/20 outline-none cursor-pointer"
            >
              {chapters.map(chapter => (
                <option key={chapter} value={chapter}>
                  Chapter {chapter}
                </option>
              ))}
            </select>
            <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-gray-400 pointer-events-none">expand_more</span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="bg-white/40 backdrop-blur-sm rounded-[2.5rem] border border-white p-8 md:p-12 shadow-sm">
        <div className="max-w-prose mx-auto">
          <VerseRenderer verses={verses} translation="KJV" />
        </div>
      </div>
    </div>
  );
}