'use client';

import React from 'react';

interface ReadingToolbarProps {
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  fontFamily: string;
  setFontFamily: (font: string) => void;
  
  currentLanguage: string;
  setLanguage: (lang: string) => void;
  currentVersion: string;
  setVersion: (version: string) => void;
  currentBook: string;
  setBook: (book: string) => void;
  currentChapter: number;
  setChapter: (chapter: number) => void;
  
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

  const activeBookData = books.find(b => b.name === currentBook);
  const totalChapters = activeBookData ? activeBookData.chapters : 0;

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-4 bg-white/40 backdrop-blur-xl border border-white/60 p-3 rounded-xl shadow-lg relative z-[60]">
      <div className="flex flex-wrap items-center gap-4 ml-1">
        
        {/* Navigation Engine: Book & Chapter */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1 mb-1">
            <span className="material-symbols-outlined text-amber-500 text-[10px]">menu_book</span>
            <span className="text-[6px] font-black text-amber-600 uppercase tracking-wider">Passage</span>
          </div>
          <div className="flex items-center gap-2">
            <select 
              value={currentBook}
              onChange={(e) => setBook(e.target.value)}
              className="text-[10px] font-bold text-gray-700 bg-white/50 backdrop-blur-sm px-2 py-1.5 rounded-lg border border-white/60 outline-none appearance-none cursor-pointer hover:bg-white/80 hover:border-amber-300 transition-colors"
            >
              {books.map(b => <option key={b.name} value={b.name}>{b.name}</option>)}
            </select>
            
            <select 
              value={currentChapter}
              onChange={(e) => setChapter(Number(e.target.value))}
              className="text-[10px] font-bold text-gray-700 bg-white/50 backdrop-blur-sm px-2 py-1.5 rounded-lg border border-white/60 outline-none appearance-none cursor-pointer hover:bg-white/80 hover:border-amber-300 transition-colors"
            >
              {Array.from({ length: totalChapters }, (_, i) => (
                <option key={i + 1} value={i + 1}>{i + 1}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Translation Matrix */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1 mb-1">
            <span className="material-symbols-outlined text-amber-500 text-[10px]">translate</span>
            <span className="text-[6px] font-black text-amber-600 uppercase tracking-wider">Translation</span>
          </div>
          <select 
            value={currentVersion}
            onChange={(e) => setVersion(e.target.value)}
            className="text-[10px] font-bold text-gray-700 bg-white/50 backdrop-blur-sm px-2 py-1.5 rounded-lg border border-white/60 outline-none appearance-none cursor-pointer hover:bg-white/80 hover:border-amber-300 transition-colors"
          >
            {versions.map(v => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
        </div>

        {/* Language Engine */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1 mb-1">
            <span className="material-symbols-outlined text-amber-500 text-[10px]">language</span>
            <span className="text-[6px] font-black text-amber-600 uppercase tracking-wider">Language</span>
          </div>
          <select 
            value={currentLanguage}
            onChange={(e) => setLanguage(e.target.value)}
            className="text-[10px] font-bold text-gray-700 bg-white/50 backdrop-blur-sm px-2 py-1.5 rounded-lg border border-white/60 outline-none appearance-none cursor-pointer hover:bg-white/80 hover:border-amber-300 transition-colors"
          >
            {languages.map(l => (
              <option key={l.code} value={l.code}>{l.name}</option>
            ))}
          </select>
        </div>

        {/* Canvas Settings Trigger */}
        <div className="flex flex-col">
          <div className="flex items-center gap-1 mb-1">
            <span className="material-symbols-outlined text-amber-500 text-[10px]">palette</span>
            <span className="text-[6px] font-black text-amber-600 uppercase tracking-wider">Canvas</span>
          </div>
          <button 
            onClick={() => setShowSettings(!showSettings)} 
            className={`flex items-center gap-1 text-[8px] font-black px-3 py-1.5 rounded-lg border transition-all ${
              showSettings 
                ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white border-transparent shadow-md' 
                : 'bg-white/50 backdrop-blur-sm text-gray-600 border-white/60 hover:bg-white/80 hover:border-amber-300'
            }`}
          >
            <span className="material-symbols-outlined text-[12px]">tune</span>
            Format
          </button>
        </div>
      </div>

      {/* Floating Controls Overlay dropdown */}
      {showSettings && (
        <div className="absolute top-[calc(100%+0.5rem)] right-4 w-72 bg-white/90 backdrop-blur-xl border border-white/60 shadow-2xl rounded-xl p-5 animate-in slide-in-from-top-2 duration-200 z-[90]">
          <div className="space-y-5">
            {/* Font Size Slider */}
            <div>
              <div className="flex justify-between mb-2">
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-amber-500 text-[12px]">text_fields</span>
                  <label className="text-[7px] font-black text-amber-600 uppercase tracking-wider">Reading Text Size</label>
                </div>
                <span className="text-[9px] font-black text-gray-600">{fontSize}px</span>
              </div>
              <input 
                type="range" 
                min="18" 
                max="36" 
                value={fontSize} 
                onChange={(e) => setFontSize(Number(e.target.value))} 
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-amber-600" 
              />
            </div>

            {/* Typeface Style */}
            <div>
              <div className="flex items-center gap-1 mb-2">
                <span className="material-symbols-outlined text-amber-500 text-[12px]">font_download</span>
                <label className="text-[7px] font-black text-amber-600 uppercase tracking-wider">Typeface Style</label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => setFontFamily('font-serif')} 
                  className={`py-1.5 rounded-lg text-[8px] font-bold border transition-all ${
                    fontFamily === 'font-serif' 
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm' 
                      : 'bg-white/50 text-gray-500 border-white/60 hover:bg-amber-50 hover:border-amber-300'
                  }`}
                >
                  Elegant Serif
                </button>
                <button 
                  onClick={() => setFontFamily('font-sans')} 
                  className={`py-1.5 rounded-lg text-[8px] font-bold border transition-all ${
                    fontFamily === 'font-sans' 
                      ? 'bg-amber-600 text-white border-amber-600 shadow-sm' 
                      : 'bg-white/50 text-gray-500 border-white/60 hover:bg-amber-50 hover:border-amber-300'
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