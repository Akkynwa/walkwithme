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
  // UI & Layout States
  const [showSettings, setShowSettings] = useState(false);
  const [activeVerseMenu, setActiveVerseMenu] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  // Typography & Personalization
  const [fontSize, setFontSize] = useState(22);
  const [fontFamily, setFontFamily] = useState('font-serif');
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [highlights, setHighlights] = useState<Record<number, string>>({});

  // Localization & Translation Matrix States
  const [currentLanguage, setLanguage] = useState('en');
  const [currentVersion, setVersion] = useState('kjv');

  // Scripture Data
  const [verses, setVerses] = useState<Verse[]>([
    { number: 4, text: "Abide in me, and I in you. As the branch cannot bear fruit of itself, except it abide in the vine; no more can ye, except ye abide in me." },
    { number: 5, text: "I am the vine, ye are the branches: He that abideth in me, and I in him, the same bringeth forth much fruit: for without me ye can do nothing." }
  ]);

  // Persistent Typography Preferences
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

  // Main Scripture Fetching Engine
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

      <section 
        className="relative w-full transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] min-h-[650px] flex flex-col overflow-visible rounded-[2.5rem] bg-[#FAFAFA] shadow-[0_40px_90px_-20px_rgba(60,56,48,0.06)] border border-[#D4CDBA]/40"
        style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` }}
      >
        <div className="flex-1 flex flex-col lg:flex-row relative">
          <div className="absolute top-0 right-[-6px] bottom-0 w-[6px] bg-[#EAE5D8] border-r border-gray-300 rounded-r-xs hidden lg:block opacity-60"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-full bg-black/[0.06] z-30 hidden lg:block"></div>
          <div className="hidden lg:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-16 z-20 bg-gradient-to-r from-black/[0.01] via-black/[0.04] to-black/[0.01] pointer-events-none"></div>

          {/* LEFT PAGE */}
          <div className="flex-1 px-6 md:px-16 py-12 relative lg:border-r border-[#D4CDBA]/30">
            <div className="max-w-xl ml-auto">
              <header className="mb-8 flex justify-between items-end pb-3 border-b border-[#D4CDBA]/30">
                <div className="flex flex-col">
                  <span className="text-[9px] font-sans font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-0.5">Sacred Scriptures</span>
                  <h2 className="text-xs font-sans font-black uppercase tracking-widest text-[#3C3830]">{book.name} — {chapter}</h2>
                </div>
                <span className="font-serif italic text-sm text-[#7C7565]/40">p. 01</span>
              </header>
              <div className="space-y-2" style={{ fontSize: `${fontSize}px` }}>
                {leftPageVerses.map((v) => renderVerseRow(v))}
              </div>
            </div>
          </div>

          {/* RIGHT PAGE */}
          <div className="flex-1 px-6 md:px-16 py-12 relative">
            <div className="max-w-xl mr-auto">
              <header className="mb-8 flex justify-between items-end pb-3 border-b border-[#D4CDBA]/30">
                <div className="flex flex-col">
                  <span className="text-[9px] font-sans font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-0.5">Living Bread</span>
                  <h2 className="text-xs font-sans font-black uppercase tracking-widest text-[#3C3830]">{book.name} — {chapter}</h2>
                </div>
                <span className="font-serif italic text-sm text-[#7C7565]/40">p. 02</span>
              </header>
              <div className="space-y-2" style={{ fontSize: `${fontSize}px` }}>
                {rightPageVerses.map((v) => renderVerseRow(v))}
              </div>
            </div>
          </div>
        </div>

        {/* INTEGRATED ACTION FOOTER */}
        <footer className="relative z-40 bg-white/60 backdrop-blur-xl border-t border-[#D4CDBA]/50 px-6 md:px-12 py-8 rounded-b-[2.5rem]">
          <div className="absolute -top-[1px] left-1/2 -translate-x-1/2 z-50">
            <SacredRibbon color1="#8B0000" color2="#D4AF37" className="transform scale-110 drop-shadow-md" />
          </div>
          <div className="flex justify-between items-center max-w-7xl mx-auto relative">
            <button 
              onClick={() => onChapterChange(c => Math.max(1, c - 1))} 
              disabled={chapter === 1 || loading}
              className="group flex items-center gap-4 transition-all disabled:opacity-20"
            >
              <div className="w-12 h-12 rounded-full border border-[#D4CDBA] bg-white flex items-center justify-center hover:bg-[#3C3830] hover:text-white transition-all shadow-sm">
                <span className="material-symbols-outlined text-xl text-[#7C7565] inherit-color">chevron_left</span>
              </div>
            </button>

            <div className="pt-2 text-center flex flex-col items-center gap-2">
              <p className="text-xl md:text-2xl font-serif italic text-[#3C3830]">
                {book.name} <span className="text-[#D4AF37] ml-2 font-sans not-italic font-black">{chapter}</span>
              </p>
            </div>

            <button 
              onClick={() => onChapterChange(c => Math.min(book.chapters, c + 1))} 
              disabled={chapter >= book.chapters || loading}
              className="group flex items-center gap-4 transition-all disabled:opacity-20"
            >
              <div className="w-12 h-12 rounded-full border border-[#D4CDBA] bg-white flex items-center justify-center hover:bg-[#3C3830] hover:text-white transition-all shadow-sm">
                <span className="material-symbols-outlined text-xl text-[#7C7565] inherit-color">chevron_right</span>
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
        className={`relative pl-10 pr-3 py-2 rounded-xl transition-all cursor-pointer hover:bg-[#D4CDBA]/15 ${isBookmarked ? 'bg-[#FDFBF7] border-l-2 border-[#D4AF37]/50' : ''}`}
        style={{ backgroundColor: highlights[v.number] || undefined }}
      >
        <span className="absolute left-2 top-3 text-[10px] font-bold text-[#7C7565]/40 font-sans">{v.number}</span>
        {activeVerseMenu === v.number && (
          <div className="absolute left-10 -top-11 flex gap-1 bg-white shadow-xl border border-[#D4CDBA]/30 p-1 rounded-xl z-[100]">
            <button onClick={(e) => { e.stopPropagation(); toggleBookmark(v.number); setActiveVerseMenu(null); }} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#FDFBF7]">
              <span className="material-symbols-outlined text-sm text-[#3C3830]">bookmark</span>
            </button>
            <button onClick={(e) => { e.stopPropagation(); applyHighlight(v.number, 'rgba(212, 175, 55, 0.15)'); setActiveVerseMenu(null); }} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[#FDFBF7]">
              <span className="material-symbols-outlined text-sm text-[#D4AF37]">stylus</span>
            </button>
          </div>
        )}
        <p className="leading-relaxed text-[#3C3830]">{v.text}</p>
      </div>
    );
  }
}