'use client';

import React, { useState, useEffect } from 'react';
import { SacredRibbon } from './SacredRibbon';
import { ReadingToolbar } from './ReadingToolbar';

interface Verse {
  number: number;
  text: string;
}

interface Book {
  name: string;
  chapters: number;
}

interface ReadingCanvasProps {
  book: Book;
  chapter: number;
  onChapterChange: React.Dispatch<React.SetStateAction<number>>;
}

const BIBLE_BOOKS = [
  { name: 'Genesis', chapters: 50 },
  { name: 'Exodus', chapters: 40 },
  { name: 'John', chapters: 21 },
];

const VERSIONS = [
  { id: 'kjv', name: 'King James Version (KJV)' },
  { id: 'niv', name: 'New International Version (NIV)' }
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'es', name: 'Spanish' }
];

export function ReadingCanvas({ book, chapter, onChapterChange }: ReadingCanvasProps) {
  const [showSettings, setShowSettings] = useState(false);
  const [activeVerseMenu, setActiveVerseMenu] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const [fontSize, setFontSize] = useState(22);
  const [fontFamily, setFontFamily] = useState('font-serif');
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [highlights, setHighlights] = useState<Record<number, string>>({});

  const [currentLanguage, setLanguage] = useState('en');
  const [currentVersion, setVersion] = useState('kjv');

  const [verses, setVerses] = useState<Verse[]>([
    { number: 4, text: "Abide in me, and I in you. As the branch cannot bear fruit of itself, except it abide in the vine; no more can ye, except ye abide in me." },
    { number: 5, text: "I am the vine, ye are the branches: He that abideth in me, and I in him, the same bringeth forth much fruit: for without me ye can do nothing." }
  ]);

  useEffect(() => {
    const savedSize = localStorage.getItem('qt-font-size');
    const savedBookmarks = localStorage.getItem('qt-bookmarks');
    if (savedSize) setFontSize(Number(savedSize));
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
  }, []);

  useEffect(() => {
    localStorage.setItem('qt-font-size', fontSize.toString());
    localStorage.setItem('qt-bookmarks', JSON.stringify(bookmarks));
  }, [fontSize, bookmarks]);

  useEffect(() => {
    const fetchPassage = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/bible/passage?book=${book.name}&chapter=${chapter}&versionId=${currentVersion}&lang=${currentLanguage}`);
        if (res.ok) {
          const data = await res.json();
          if (data.verses) setVerses(data.verses);
        }
      } catch (err) {
        console.error("Sanctuary Text Engine Load Failure:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPassage();
  }, [book.name, chapter, currentVersion, currentLanguage]);

  const toggleBookmark = (num: number) => {
    setBookmarks(prev => prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num]);
  };

  const applyHighlight = (num: number, color: string) => {
    setHighlights(prev => ({ ...prev, [num]: color }));
  };

  const midIndex = Math.ceil(verses.length / 2);
  const leftPageVerses = verses.slice(0, midIndex);
  const rightPageVerses = verses.slice(midIndex);

  return (
    <div className={`w-full ${fontFamily} relative overflow-visible`}>
      
      <ReadingToolbar 
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        fontSize={fontSize}
        setFontSize={setFontSize}
        fontFamily={fontFamily}
        setFontFamily={setFontFamily}
        currentLanguage={currentLanguage}
        setLanguage={setLanguage}
        currentVersion={currentVersion}
        setVersion={setVersion}
        currentBook={book.name}
        setBook={(name) => {
          const found = BIBLE_BOOKS.find(b => b.name === name);
          if (found) {
            onChapterChange(1); 
          }
        }}
        currentChapter={chapter}
        setChapter={onChapterChange}
        books={BIBLE_BOOKS}
        versions={VERSIONS}
        languages={LANGUAGES}
      />

      <section className="relative w-full transition-all duration-1000 min-h-[650px] flex flex-col overflow-visible rounded-2xl bg-white/40 backdrop-blur-sm shadow-xl border border-white/60">
        
        <div className="flex-1 flex flex-col lg:flex-row relative">
          {/* Center Spine Line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-amber-300/30 to-transparent z-30 hidden lg:block" />
          
          {/* Center Spine Shadow */}
          <div className="hidden lg:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-12 z-20 bg-gradient-to-r from-transparent via-amber-400/5 to-transparent pointer-events-none" />

          {/* LEFT PAGE */}
          <div className="flex-1 px-6 md:px-10 py-8 relative">
            <div className="max-w-xl ml-auto">
              <header className="mb-6 flex justify-between items-end pb-3 border-b border-white/40">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="material-symbols-outlined text-amber-500 text-[12px]">menu_book</span>
                    <span className="text-[7px] font-sans font-black uppercase tracking-wider text-amber-600">Sacred Scriptures</span>
                  </div>
                  <h2 className="text-[9px] font-sans font-black uppercase tracking-wider text-gray-600">{book.name} — {chapter}</h2>
                </div>
                <span className="font-serif italic text-[10px] text-gray-400">p. 01</span>
              </header>
              <div className="space-y-1" style={{ fontSize: `${fontSize}px` }}>
                {leftPageVerses.map((v) => renderVerseRow(v))}
              </div>
            </div>
          </div>

          {/* RIGHT PAGE */}
          <div className="flex-1 px-6 md:px-10 py-8 relative">
            <div className="max-w-xl mr-auto">
              <header className="mb-6 flex justify-between items-end pb-3 border-b border-white/40">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="material-symbols-outlined text-amber-500 text-[12px]">auto_awesome</span>
                    <span className="text-[7px] font-sans font-black uppercase tracking-wider text-amber-600">Living Bread</span>
                  </div>
                  <h2 className="text-[9px] font-sans font-black uppercase tracking-wider text-gray-600">{book.name} — {chapter}</h2>
                </div>
                <span className="font-serif italic text-[10px] text-gray-400">p. 02</span>
              </header>
              <div className="space-y-1" style={{ fontSize: `${fontSize}px` }}>
                {rightPageVerses.map((v) => renderVerseRow(v))}
              </div>
            </div>
          </div>
        </div>

        {/* Integrated Action Footer */}
        <footer className="relative z-40 bg-white/40 backdrop-blur-xl border-t border-white/60 px-6 md:px-10 py-6 rounded-b-2xl">
          <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-50">
            <SacredRibbon color1="#D4AF37" color2="#AA8A2E" className="transform scale-110 drop-shadow-md" />
          </div>
          <div className="flex justify-between items-center max-w-4xl mx-auto relative">
            <button 
              onClick={() => onChapterChange(c => Math.max(1, c - 1))} 
              disabled={chapter === 1 || loading}
              className="group flex items-center gap-3 transition-all disabled:opacity-20"
            >
              <div className="w-10 h-10 rounded-full border border-white/60 bg-white/50 flex items-center justify-center hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all shadow-sm">
                <span className="material-symbols-outlined text-lg text-gray-600 group-hover:text-white">chevron_left</span>
              </div>
            </button>

            <div className="text-center flex flex-col items-center gap-1">
              <p className="text-lg md:text-xl font-serif italic text-gray-700">
                {book.name} <span className="text-amber-600 ml-1 font-sans not-italic font-black">{chapter}</span>
              </p>
            </div>

            <button 
              onClick={() => onChapterChange(c => Math.min(book.chapters, c + 1))} 
              disabled={chapter >= book.chapters || loading}
              className="group flex items-center gap-3 transition-all disabled:opacity-20"
            >
              <div className="w-10 h-10 rounded-full border border-white/60 bg-white/50 flex items-center justify-center hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all shadow-sm">
                <span className="material-symbols-outlined text-lg text-gray-600 group-hover:text-white">chevron_right</span>
              </div>
            </button>
          </div>
        </footer>
      </section>
    </div>
  );

  function renderVerseRow(v: Verse) {
    const isBookmarked = bookmarks.includes(v.number);
    return (
      <div 
        key={v.number} 
        onClick={() => setActiveVerseMenu(activeVerseMenu === v.number ? null : v.number)}
        className={`relative pl-8 pr-2 py-2 rounded-lg transition-all cursor-pointer hover:bg-amber-50/50 ${
          isBookmarked ? 'bg-amber-50/30 border-l-2 border-amber-500' : ''
        }`}
        style={{ backgroundColor: highlights[v.number] || undefined }}
      >
        <span className="absolute left-1 top-2 text-[8px] font-bold text-gray-400 font-sans">{v.number}</span>
        
        {activeVerseMenu === v.number && (
          <div className="absolute left-8 -top-10 flex gap-1 bg-white/90 backdrop-blur-md shadow-lg border border-amber-200 p-1 rounded-lg z-[100]">
            <button 
              onClick={(e) => { e.stopPropagation(); toggleBookmark(v.number); setActiveVerseMenu(null); }} 
              className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-amber-50 transition-colors"
            >
              <span className="material-symbols-outlined text-xs text-gray-600 hover:text-amber-600">bookmark_border</span>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); applyHighlight(v.number, 'rgba(245, 158, 11, 0.1)'); setActiveVerseMenu(null); }} 
              className="w-7 h-7 rounded-md flex items-center justify-center hover:bg-amber-50 transition-colors"
            >
              <span className="material-symbols-outlined text-xs text-amber-500">stylus</span>
            </button>
          </div>
        )}
        <p className="leading-relaxed text-gray-700 text-sm md:text-base">{v.text}</p>
      </div>
    );
  }
}