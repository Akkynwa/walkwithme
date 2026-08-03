'use client';

import { useState } from 'react';
import { VerseRenderer } from './VerseRenderer';

interface ChapterListProps {
  book: string;
  chapterCount: number;
  currentChapter: number;
  verses: any[];
  onChapterChange: (chapter: number) => void;
  isDark?: boolean;
}

export function ChapterList({
  book,
  chapterCount,
  currentChapter,
  verses,
  onChapterChange,
  isDark = false,
}: ChapterListProps) {
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');

  const chapters = Array.from({ length: chapterCount }, (_, i) => i + 1);

  return (
    <div className={`max-w-4xl mx-auto px-4 py-6 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'}`}>
      {/* Header & View Toggle */}
      <div className="mb-8 flex flex-col items-center justify-center text-center gap-4">
        <div>
          <span className={`text-xs font-medium uppercase tracking-wider ${
            isDark ? 'text-zinc-400' : 'text-zinc-500'
          }`}>
            Currently Reading
          </span>
          <h2 className={`text-3xl md:text-4xl font-serif tracking-tight mt-1 ${
            isDark ? 'text-zinc-100' : 'text-zinc-900'
          }`}>
            {book}
          </h2>
        </div>

        {/* Custom Segmented Control */}
        <div className={`flex p-1 rounded-md border ${
          isDark 
            ? 'bg-zinc-900 border-zinc-800' 
            : 'bg-zinc-100 border-zinc-200'
        } w-fit mx-auto`}>
          <button
            onClick={() => setDisplayMode('grid')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
              displayMode === 'grid' 
                ? isDark
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'bg-white text-zinc-900 shadow-sm'
                : isDark
                  ? 'text-zinc-400 hover:text-zinc-200'
                  : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <span className="material-symbols-outlined text-sm">grid_view</span>
            Grid
          </button>
          <button
            onClick={() => setDisplayMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-colors ${
              displayMode === 'list' 
                ? isDark
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'bg-white text-zinc-900 shadow-sm'
                : isDark
                  ? 'text-zinc-400 hover:text-zinc-200'
                  : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <span className="material-symbols-outlined text-sm">list</span>
            Select
          </button>
        </div>
      </div>

      {/* Navigation Area */}
      <div className="mb-8 flex justify-center">
        {displayMode === 'grid' ? (
          <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 w-full justify-items-center">
            {chapters.map((chapter) => (
              <button
                key={chapter}
                onClick={() => onChapterChange(chapter)}
                className={`w-full h-9 rounded-md font-serif text-xs font-medium transition-colors ${
                  currentChapter === chapter 
                    ? isDark
                      ? 'bg-zinc-100 text-zinc-900'
                      : 'bg-zinc-900 text-zinc-100'
                    : isDark
                      ? 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 border border-zinc-800'
                      : 'bg-zinc-50 text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 border border-zinc-200'
                }`}
              >
                {chapter}
              </button>
            ))}
          </div>
        ) : (
          <div className="relative w-full max-w-xs mx-auto">
            <select
              value={currentChapter}
              onChange={(e) => onChapterChange(parseInt(e.target.value))}
              className={`w-full px-3 py-2 rounded-md border text-sm font-medium appearance-none outline-none cursor-pointer text-center ${
                isDark
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-100'
                  : 'bg-white border-zinc-300 text-zinc-900'
              }`}
            >
              {chapters.map((chapter) => (
                <option key={chapter} value={chapter}>
                  Chapter {chapter}
                </option>
              ))}
            </select>
            <span className={`absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-sm pointer-events-none ${
              isDark ? 'text-zinc-400' : 'text-zinc-500'
            }`}>
              unfold_more
            </span>
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className={`rounded-md border p-6 md:p-8 ${
        isDark 
          ? 'bg-zinc-900 border-zinc-800' 
          : 'bg-white border-zinc-200'
      }`}>
        <div className="max-w-prose mx-auto">
          <VerseRenderer 
            verses={verses} 
            translation="KJV" 
            isDark={isDark}
          />
        </div>
      </div>
    </div>
  );
}