'use client';

import React from 'react';

// Added props for navigation and localization
interface ReadingToolbarProps {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  
  // New Navigation & Localization Props
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  currentVersion: string;
  setVersion: (version: string) => void;
  currentBook: string;
  setBook: (book: string) => void;
  currentChapter: number;
  setChapter: (chapter: number) => void;
  
  // Data for the dropdowns
  books: { name: string; chapters: number }[];
  versions: { id: string; name: string }[];
  languages: { code: string; name: string }[];
}

export function ReadingToolbar({
  showSettings,
  setShowSettings,
  fontSize,
  setFontSize,
  fontFamily,
  setFontFamily,
  currentLanguage,
  setLanguage,
  currentVersion,
  setVersion,
  currentBook,
  setBook,
  currentChapter,
  setChapter,
  books,
  versions,
  languages
}: ReadingToolbarProps) {

  // Helper to get total chapters for the current selected book
  const activeBookData = books.find(b => b.name === currentBook);
  const totalChapters = activeBookData ? activeBookData.chapters : 0;

  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-6 bg-white border border-gray-100 p-4 rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.02)] relative z-[60]">
      <div className="flex flex-wrap items-center gap-6 ml-2">
        
        {/* --- NAVIGATION ENGINE: BOOK & CHAPTER --- */}
        <div className="flex gap-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Passage</span>
            <div className="flex items-center gap-1">
              <select 
                value={currentBook}
                onChange={(e) => setBook(e.target.value)}
                className="text-sm font-bold text-gray-800 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 outline-none appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
              >
                {books.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
              </select>
              
              <select 
                value={currentChapter}
                onChange={(e) => setChapter(Number(e.target.value))}
                className="text-sm font-bold text-gray-800 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 outline-none appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
              >
                {Array.from({ length: totalChapters }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* --- TRANSLATION MATRIX --- */}
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
            Translation Matrix
          </span>
          <select 
            value={currentVersion}
            onChange={(e) => setVersion(e.target.value)}
            className="text-sm font-bold text-gray-800 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 outline-none appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
          >
            {versions.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        {/* --- LANGUAGE ENGINE --- */}
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
            Language
          </span>
          <select 
            value={currentLanguage}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-sm font-bold text-gray-800 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 outline-none appearance-none cursor-pointer hover:bg-gray-100 transition-colors"
          >
            {languages.map(l => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>
        </div>

        {/* --- CANVAS SETTINGS TRIGGER --- */}
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-1">
            Canvas Engine
          </span>
          <button 
            onClick={() => setShowSettings(!showSettings)} 
            className={`flex items-center gap-2 text-xs font-bold px-4 py-1.5 rounded-lg border transition-all ${
              showSettings 
                ? 'bg-[#3C3830] text-white border-transparent' 
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <span className="material-symbols-outlined text-sm">tune</span>
            Format Layout
          </button>
        </div>
      </div>

      {/* Floating Controls Overlay dropdown */}
      {showSettings && (
        <div className="absolute top-[calc(100%+0.5rem)] right-4 w-72 bg-white border border-gray-100 shadow-[0_25px_60px_rgba(0,0,0,0.1)] rounded-2xl p-6 animate-in slide-in-from-top-2 duration-200 z-[90]">
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Reading Text Size
                </label>
                <span className="text-xs font-black text-gray-700">{fontSize}px</span>
              </div>
              <input 
                type="range" 
                min="18" 
                max="36" 
                value={fontSize} 
                onChange={(e) => setFontSize(Number(e.target.value))} 
                className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#3C3830]" 
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                Typeface Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setFontFamily('font-serif')} 
                  className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                    fontFamily === 'font-serif' 
                      ? 'border-black bg-gray-50 text-black' 
                      : 'border-gray-200 text-gray-400'
                  }`}
                >
                  Elegant Serif
                </button>
                <button 
                  onClick={() => setFontFamily('font-sans')} 
                  className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                    fontFamily === 'font-sans' 
                      ? 'border-black bg-gray-50 text-black' 
                      : 'border-gray-200 text-gray-400'
                  }`}
                >
                  Modern Sans
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}