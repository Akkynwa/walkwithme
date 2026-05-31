'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from '../layout-components/Sidebar';
import MainHeader from '../layout-components/Header';
import bibleData from '../data/bible-metadata.json';

interface BibleMetadata {
  languages: Array<{ code: string; name: string; translations: Array<{ id: string; name: string }> }>;
  bibleNames: Record<string, Record<string, string>>;
  structure: {
    oldTestament: Array<{ name: string; chapters: number }>;
    newTestament: Array<{ name: string; chapters: number }>;
  };
}

const metadata = bibleData as BibleMetadata;

export default function QuietTimePage() {
  const [selectedLanguage, setSelectedLanguage] = useState(metadata.languages[0]);
  const [selectedTranslation] = useState(metadata.languages[0].translations[0]);
  const [activeBook, setActiveBook] = useState(metadata.structure.oldTestament[0]);
  const [activeChapter, setActiveChapter] = useState(1);
  const [loading, setLoading] = useState(false);
  const [passageData, setPassageData] = useState<{ verses?: { number: number; text: string }[]; audio: string; passage: string; } | null>(null);

  // UI States
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeVerseMenu, setActiveVerseMenu] = useState<number | null>(null);

  // Customization States
  const [fontSize, setFontSize] = useState(20);
  const [fontFamily, setFontFamily] = useState('font-serif');
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [highlights, setHighlights] = useState<Record<number, string>>({});

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

  const handleOpenSanctuary = useCallback(async () => {
    setLoading(true);
    setShowSettings(false);
    try {
      const isCustomTranslation = selectedTranslation.id.includes('custom') || selectedLanguage.code === 'yo';
      const endpoint = isCustomTranslation ? `/api/bible/local-passage` : `/api/bible/passage`;
      const res = await fetch(`${endpoint}?book=${activeBook.name}&chapter=${activeChapter}&lang=${selectedLanguage.code}&versionId=${selectedTranslation.id}`);
      const data = await res.json();
      setPassageData(data);
    } catch (err) {
      console.error("Sanctuary Error:", err);
    } finally {
      setLoading(false);
    }
  }, [activeBook.name, activeChapter, selectedTranslation.id, selectedLanguage.code]);

  // Automatically fetch new content when chapter or book changes
  useEffect(() => {
    // Only trigger if we already have a bible open
    if (passageData) {
      handleOpenSanctuary();
    }
  }, [activeChapter, activeBook.name, selectedTranslation.id, handleOpenSanctuary, passageData]);

  const toggleBookmark = (num: number) => {
    setBookmarks(prev => prev.includes(num) ? prev.filter(n => n !== num) : [...prev, num]);
  };

  const applyHighlight = (num: number, color: string) => {
    setHighlights(prev => ({ ...prev, [num]: color }));
  };

  const getLocalizedName = (bookCode: string) => metadata.bibleNames[selectedLanguage.code]?.[bookCode] || bookCode;

  return (
    <div className={`flex min-h-screen bg-[#FDFDFF] text-[#1A1C1E] overflow-x-hidden ${fontFamily}`}>
      <Sidebar />
      <MainHeader />

      {/* --- PROFESSIONAL SOUL JOURNAL DRAWER --- */}
<div className={`fixed inset-y-0 right-0 w-full md:w-[500px] bg-[#FDFDFB] z-[100] shadow-[-20px_0_80px_rgba(0,0,0,0.08)] transform transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${isJournalOpen ? 'translate-x-0' : 'translate-x-full'}`}>
  
  {/* Tactile Edge Detail */}
  <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-primary/10 via-primary/30 to-primary/10"></div>

  <div className="h-full flex flex-col px-8 md:px-12 py-10 relative">
    
    {/* Header Section */}
    <div className="flex justify-between items-center mb-8">
      <div className="flex flex-col">
        <h4 className="text-[11px] font-black text-primary uppercase tracking-[0.4em] mb-1">Sanctuary Notes</h4>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-secondary animate-pulse"></div>
          <span className="text-[10px] font-medium text-gray-400 uppercase tracking-widest">Auto-saving</span>
        </div>
      </div>
      
      <button 
        onClick={() => setIsJournalOpen(false)} 
        className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-all"
      >
        <span className="material-symbols-outlined text-gray-400">close</span>
      </button>
    </div>

    {/* Text Area Container with Floating Metadata */}
    <div className="flex-1 relative group mt-4">
      
      {/* --- NEW FLOATING METADATA BAR --- */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-primary/10 backdrop-blur-md border border-primary/20 px-3 py-1.5 rounded-full shadow-sm">
        <span className="material-symbols-outlined text-[14px] text-primary">menu_book</span>
        <span className="text-[10px] font-black text-primary tracking-tight uppercase">
          {getLocalizedName(activeBook.name)} {activeChapter}
        </span>
        <div className="w-px h-3 bg-primary/20 mx-1"></div>
        <span className="text-[9px] font-bold text-primary/60 uppercase">
          {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </span>
      </div>

      {/* Text Area: Using a "Paper" feel */}
      <textarea 
        className="w-full h-full bg-transparent border-none focus:ring-0 text-lg md:text-xl font-serif leading-relaxed text-[#3C3830] placeholder:text-gray-200 resize-none custom-scrollbar pt-16 relative z-10" 
        placeholder="What is the Spirit speaking to you today?..." 
      />
      
      {/* Visual Guide: Notebook lines */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] border-t border-black/10 mt-16" 
           style={{ backgroundImage: 'linear-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '100% 2.8rem' }}>
      </div>
    </div>

    {/* Action Footer */}
    <div className="grid grid-cols-5 gap-3 pt-6 border-t border-gray-100 mt-4">
      <button className="col-span-1 h-14 rounded-2xl border-2 border-gray-100 flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary transition-all">
        <span className="material-symbols-outlined">share</span>
      </button>
      
      <button className="col-span-4 h-14 bg-primary text-white rounded-2xl font-black text-xs tracking-[0.25em] shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-3">
        <span className="material-symbols-outlined text-sm">auto_awesome</span>
        ARCHIVE REFLECTION
      </button>
    </div>
  </div>
</div>

      <main className="flex-1 lg:ml-64 pt-28 pb-20 px-4 md:px-10 max-w-[1700px] mx-auto w-full relative">

{/* --- PRODUCTION-READY COMMAND CENTER --- */}
<div className="mb-12 flex flex-wrap items-center justify-between gap-6 bg-white/40 backdrop-blur-2xl border border-white/60 p-4 md:p-6 rounded-[3rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] relative z-[60]">
  
  <div className="flex flex-wrap items-center gap-4 md:gap-10 ml-4">
    {/* Language Selector: Custom Pill Style */}
    <div className="group flex flex-col">
      <span className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] mb-2 group-hover:text-primary transition-colors">Language</span>
      <div className="relative flex items-center gap-2 bg-gray-100/50 hover:bg-white px-4 py-2 rounded-full border border-transparent hover:border-primary/20 transition-all cursor-pointer">
        <span className="material-symbols-outlined text-sm text-primary">language</span>
        <select 
          value={selectedLanguage.code} 
          onChange={(e) => setSelectedLanguage(metadata.languages.find(l => l.code === e.target.value)!)} 
          className="bg-transparent border-none text-[13px] font-bold focus:ring-0 p-0 pr-4 appearance-none cursor-pointer text-[#3C3830]"
        >
          {metadata.languages.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
        </select>
      </div>
    </div>

    {/* Scripture Navigator: Integrated Multi-Pill */}
    <div className="group flex flex-col">
      <span className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] mb-2 group-hover:text-primary transition-colors">Scripture Navigation</span>
      <div className="flex items-center bg-gray-100/50 p-1.5 rounded-full border border-transparent group-hover:border-primary/10 group-hover:bg-white transition-all">
        
        {/* Book Selector */}
        <select 
          value={activeBook.name} 
          onChange={(e) => setActiveBook([...metadata.structure.oldTestament, ...metadata.structure.newTestament].find(b => b.name === e.target.value)!)} 
          className="bg-transparent border-none text-[13px] font-bold focus:ring-0 py-1 px-4 hover:text-primary transition-colors cursor-pointer"
        >
          <optgroup label="Old Testament" className="font-sans text-gray-400">
            {metadata.structure.oldTestament.map(b => <option key={b.name} value={b.name}>{getLocalizedName(b.name)}</option>)}
          </optgroup>
          <optgroup label="New Testament" className="font-sans text-gray-400">
            {metadata.structure.newTestament.map(b => <option key={b.name} value={b.name}>{getLocalizedName(b.name)}</option>)}
          </optgroup>
        </select>

        <div className="w-px h-4 bg-gray-300 mx-1"></div>

        {/* Chapter Selector */}
        <select 
          value={activeChapter} 
          onChange={(e) => setActiveChapter(Number(e.target.value))} 
          className="bg-transparent border-none text-[13px] font-bold focus:ring-0 py-1 px-4 hover:text-primary transition-colors cursor-pointer text-primary"
        >
          {Array.from({ length: activeBook.chapters }, (_, i) => i + 1).map(c => (
            <option key={c} value={c}>Chapter {c}</option>
          ))}
        </select>
      </div>
    </div>
  </div>

  {/* Actions Area */}
  <div className="flex items-center gap-3 pr-2">
    {passageData && (
       <button 
        onClick={() => setPassageData(null)} 
        className="hidden md:flex items-center gap-2 text-[10px] font-black tracking-widest uppercase text-red-600/40 hover:text-red-600 transition-all mr-4 group"
       >
         <span className="material-symbols-outlined text-sm transition-transform group-hover:rotate-90">close</span>
         Close Bible
       </button>
    )}

    {/* Preferences Toggle */}
    <button 
      onClick={() => setShowSettings(!showSettings)} 
      className={`relative w-12 h-12 rounded-full flex items-center justify-center transition-all overflow-hidden
        ${showSettings ? 'bg-primary text-white shadow-lg ring-4 ring-primary/10' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}
      `}
    >
      <span className="material-symbols-outlined text-[20px]">tune</span>
    </button>

    {/* Primary Action Button */}
    <button 
      onClick={handleOpenSanctuary} 
      className="relative group bg-primary text-white px-8 md:px-12 py-4 rounded-full text-xs font-black tracking-[0.2em] shadow-[0_15px_30px_-10px_rgba(var(--primary-rgb),0.4)] active:scale-95 transition-all overflow-hidden"
    >
      <span className="relative z-10">{loading ? 'OPENING...' : 'OPEN BIBLE'}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
    </button>

    {/* SETTINGS DROPDOWN: Polished */}
    {showSettings && (
      <div className="absolute top-[calc(100%+1rem)] right-0 w-80 bg-white/90 backdrop-blur-2xl border border-white shadow-[0_30px_100px_rgba(0,0,0,0.15)] rounded-[2.5rem] p-8 animate-in slide-in-from-top-4 duration-300 z-[90]">
        <div className="flex justify-between items-center mb-8">
          <h6 className="text-[11px] font-black uppercase tracking-widest text-primary/40">Visual Settings</h6>
          <div className="h-1 w-8 bg-primary/10 rounded-full"></div>
        </div>

        <div className="space-y-10">
          {/* Font Size Slider */}
          <div>
            <div className="flex justify-between mb-4">
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Reading Size</label>
              <span className="text-xs font-black text-primary bg-primary/5 px-2 py-0.5 rounded-md">{fontSize}px</span>
            </div>
            <input 
              type="range" min="16" max="40" value={fontSize} 
              onChange={(e) => setFontSize(Number(e.target.value))} 
              className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary" 
            />
          </div>

          {/* Font Type Selection */}
          <div className="space-y-3">
             <label className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Typeface</label>
             <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => setFontFamily('font-serif')} 
                  className={`flex flex-col items-center py-4 rounded-2xl border-2 transition-all
                    ${fontFamily === 'font-serif' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'}
                  `}
                >
                  <span className="text-xl font-serif mb-1">Aa</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest">Serif</span>
                </button>
                <button 
                  onClick={() => setFontFamily('font-sans')} 
                  className={`flex flex-col items-center py-4 rounded-2xl border-2 transition-all
                    ${fontFamily === 'font-sans' ? 'border-primary bg-primary/5 text-primary' : 'border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200'}
                  `}
                >
                  <span className="text-xl font-sans mb-1">Aa</span>
                  <span className="text-[9px] font-bold uppercase tracking-widest">Sans</span>
                </button>
             </div>
          </div>
        </div>
      </div>
    )}
  </div>
</div>

        {/* --- THE SANCTUARY ENGINE --- */}
        <section 
          className={`relative w-full transition-all duration-1000 ease-[cubic-bezier(0.23,1,0.32,1)] min-h-[850px] flex flex-col overflow-visible
            ${passageData 
              ? 'bg-[#F9F7F2] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15),0_30px_60px_-30px_rgba(0,0,0,0.3)]' 
              : 'bg-[#121212] border-l-[18px] border-black shadow-[30px_0_70px_-10px_rgba(0,0,0,0.7)] rounded-r-[4rem] items-center justify-center'
            }`}
          style={{ 
            backgroundImage: passageData 
              ? `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` 
              : `url("https://www.transparenttextures.com/patterns/leather.png")` 
          }}
        >
          {!passageData ? (
            /* --- BIBLE COVER --- */
            <div className="relative flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in-95 duration-1000">
              <div className="border-[4px] border-[#D4AF37]/30 p-12 md:p-20 relative outline outline-1 outline-[#D4AF37]/10 outline-offset-8">
                <span className="absolute -top-6 -left-6 text-[#D4AF37] opacity-60 text-6xl font-serif hidden md:block">⌜</span>
                <span className="absolute -top-6 -right-6 text-[#D4AF37] opacity-60 text-6xl font-serif hidden md:block">⌝</span>
                <span className="absolute -bottom-6 -left-6 text-[#D4AF37] opacity-60 text-6xl font-serif hidden md:block">⌞</span>
                <span className="absolute -bottom-6 -right-6 text-[#D4AF37] opacity-60 text-6xl font-serif hidden md:block">⌟</span>

                <span className="material-symbols-outlined text-[80px] md:text-[100px] mb-8 text-[#D4AF37] drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
                  auto_stories
                </span>
                
                <h1 className="text-5xl md:text-7xl font-serif text-[#D4AF37] tracking-[0.2em] uppercase mb-4 drop-shadow-2xl">
                  Holy Bible
                </h1>
                
                <div className="flex items-center gap-4 justify-center mb-6">
                  <div className="h-px w-12 bg-[#D4AF37]/40"></div>
                  <p className="text-[#D4AF37]/60 font-serif italic text-lg md:text-xl tracking-widest">SANCTUARY EDITION</p>
                  <div className="h-px w-12 bg-[#D4AF37]/40"></div>
                </div>
              </div>
              <p className="mt-16 text-white/20 font-serif italic tracking-[0.3em] uppercase text-sm animate-pulse">
                Tap &quot;Open Bible&quot; to begin
              </p>
            </div>
          ) : (
            /* --- THE OPEN BIBLE SPREAD --- */
            <div className="flex-1 flex flex-col md:flex-row relative">
              {/* PAGE EDGES */}
              <div className="absolute top-0 right-[-8px] bottom-0 w-[8px] bg-[#E8E3D5] border-r border-[#D4CDBA] rounded-r-sm hidden lg:block opacity-80"></div>
              <div className="absolute top-2 right-[-14px] bottom-2 w-[6px] bg-[#E8E3D5]/60 border-r border-[#D4CDBA]/40 rounded-r-sm hidden lg:block opacity-60"></div>

              {/* RIBBON */}
              <div className="absolute top-0 left-[52%] w-5 h-48 bg-gradient-to-b from-[#8B0000] via-[#A52A2A] to-[#8B0000] z-30 shadow-[2px_10px_20px_rgba(0,0,0,0.3)] rounded-b-[2px] hidden md:block pointer-events-none">
                 <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20"></div>
              </div>

              {/* SPINE SHADOW */}
              <div className="hidden md:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-10 z-20 bg-gradient-to-r from-black/[0.03] via-black/[0.1] to-black/[0.03] pointer-events-none"></div>

              {[0, 1].map((pageIndex) => (
                <div key={pageIndex} className={`flex-1 px-8 md:px-14 py-10 relative ${pageIndex === 0 ? 'md:border-r border-[#D4CDBA]/40' : ''}`}>
                  <div className={`max-w-lg ${pageIndex === 0 ? 'ml-auto' : 'mr-auto'}`}>
                    
                    <header className="mb-10 flex justify-between items-end relative">
                      <div className="flex flex-col">
                        <span className="text-[9px] font-black uppercase tracking-[0.25em] text-primary/50 mb-1">
                          {pageIndex === 0 ? 'Old Testament' : 'The Holy Word'}
                        </span>
                        <h2 className="text-sm font-bold uppercase tracking-widest text-[#3C3830]">
                          {activeBook.name}
                        </h2>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-serif italic text-2xl text-primary/80 leading-none">{activeChapter}</span>
                        <div className="h-[2px] w-8 bg-gradient-to-l from-primary/40 to-transparent mt-1"></div>
                      </div>
                      <div className="absolute -bottom-4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#D4CDBA]/60 to-transparent"></div>
                    </header>

                    <div className="space-y-3" style={{ fontSize: `${fontSize}px` }}>
                      {passageData.verses?.slice(
                        pageIndex === 0 ? 0 : Math.ceil(passageData.verses.length / 2),
                        pageIndex === 0 ? Math.ceil(passageData.verses.length / 2) : undefined
                      ).map((v) => (
                        <div 
                          key={v.number} 
                          onClick={() => setActiveVerseMenu(activeVerseMenu === v.number ? null : v.number)}
                          className={`relative pl-10 pr-3 py-2 rounded-lg transition-all cursor-pointer hover:bg-primary/[0.03]
                            ${bookmarks.includes(v.number) ? 'bg-secondary/5 border-l-2 border-secondary/50' : ''}
                          `}
                          style={{ backgroundColor: highlights[v.number] || undefined }}
                        >
                          <span className="absolute left-1 top-2.5 text-[10px] font-bold text-primary/40 font-sans tracking-tighter">{v.number}</span>
                          
                          {activeVerseMenu === v.number && (
                            <div className="absolute left-8 -top-10 flex gap-1 bg-white shadow-xl border border-[#D4CDBA]/50 p-1 rounded-xl z-[100] animate-in zoom-in-95">
                              <button onClick={(e) => { e.stopPropagation(); toggleBookmark(v.number); setActiveVerseMenu(null); }} className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${bookmarks.includes(v.number) ? 'text-secondary bg-secondary/10' : 'text-gray-400 hover:bg-gray-50'}`}>
                                <span className="material-symbols-outlined text-xs">bookmark</span>
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); applyHighlight(v.number, '#fef08a80'); setActiveVerseMenu(null); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-yellow-600 hover:bg-yellow-50">
                                <span className="material-symbols-outlined text-xs">stylus</span>
                              </button>
                              <button onClick={(e) => { e.stopPropagation(); applyHighlight(v.number, ''); setActiveVerseMenu(null); }} className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50">
                                <span className="material-symbols-outlined text-xs">format_color_reset</span>
                              </button>
                            </div>
                          )}
                          <p className="leading-[1.7] text-[#3C3830] tracking-tight selection:bg-primary/20">{v.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

         {/* --- PREMIUM FUNCTIONAL FOOTER --- */}
{passageData && (
  <footer className="relative z-40 bg-white/60 backdrop-blur-xl border-t border-[#D4CDBA]/50 px-6 md:px-12 py-8 overflow-hidden">
    
    {/* GILDED EDGE DETAIL */}
    <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent opacity-50"></div>

    <div className="flex justify-between items-center max-w-7xl mx-auto relative">
      
      {/* PREVIOUS BUTTON */}
      <button 
        onClick={() => setActiveChapter(c => Math.max(1, c - 1))} 
        disabled={activeChapter === 1 || loading}
        className="group flex items-center gap-4 transition-all disabled:opacity-20"
      >
        <div className="w-12 h-12 rounded-full border border-[#D4CDBA] flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all shadow-sm">
          <span className="material-symbols-outlined text-xl text-[#7C7565] group-hover:text-primary group-hover:-translate-x-1 transition-all">
            chevron_left
          </span>
        </div>
        <div className="hidden sm:flex flex-col items-start">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/40">Previous</span>
          <span className="text-xs font-bold text-[#3C3830]">Chapter {activeChapter - 1}</span>
        </div>
      </button>

      {/* CENTERPIECE: TACTILE RIBBON */}
      <div className="flex flex-col items-center">
        {/* Animated Crimson Ribbon */}
        <div className="absolute -top-[52px] w-5 h-16 bg-gradient-to-b from-[#8B0000] to-[#5a0000] rounded-b-sm shadow-lg transform transition-transform duration-500 group-hover:translate-y-2">
           <div className="absolute bottom-1 left-0 right-0 h-px bg-white/20"></div>
        </div>
        
        <div className="pt-6 text-center">
          <p className="text-xl md:text-2xl font-serif italic text-[#3C3830]">
            {getLocalizedName(activeBook.name)} 
            <span className="text-primary ml-2 font-sans not-italic font-black">{activeChapter}</span>
          </p>
          {loading && (
            <div className="flex gap-1 justify-center mt-2">
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce"></div>
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.2s]"></div>
              <div className="w-1 h-1 bg-primary rounded-full animate-bounce [animation-delay:0.4s]"></div>
            </div>
          )}
        </div>
      </div>

      {/* NEXT BUTTON */}
      <button 
        onClick={() => setActiveChapter(c => Math.min(activeBook.chapters, c + 1))} 
        disabled={activeChapter >= activeBook.chapters || loading}
        className="group flex items-center gap-4 transition-all disabled:opacity-20 text-right"
      >
        <div className="hidden sm:flex flex-col items-end">
          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/40">Next Up</span>
          <span className="text-xs font-bold text-[#3C3830]">Chapter {activeChapter + 1}</span>
        </div>
        <div className="w-12 h-12 rounded-full border border-[#D4CDBA] flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-all shadow-sm">
          <span className="material-symbols-outlined text-xl text-[#7C7565] group-hover:text-primary group-hover:translate-x-1 transition-all">
            chevron_right
          </span>
        </div>
      </button>

    </div>
  </footer>
)}
        </section>

       {/* --- POLISHED FLOATING JOURNAL TRIGGER --- */}
<button 
  onClick={() => setIsJournalOpen(true)} 
  className="fixed right-6 md:right-12 bottom-6 md:bottom-12 z-50 group flex items-center"
>
  {/* The "Aura" - Animated pulse behind the button */}
  <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-secondary/30 transition-all duration-700 animate-pulse"></div>

  <div className="relative flex items-center gap-4 bg-white/70 backdrop-blur-2xl border border-white px-5 md:px-8 py-4 md:py-5 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.15)] hover:-translate-y-1 active:scale-95 transition-all duration-500 overflow-hidden">
    
    {/* Subtle Inner Glow */}
    <div className="absolute inset-0 bg-gradient-to-tr from-primary/[0.02] to-transparent pointer-events-none"></div>

    {/* Icon Container with dynamic rotation */}
    <div className="relative w-8 h-8 md:w-10 md:h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20 transition-transform duration-500 group-hover:rotate-[15deg]">
      <span className="material-symbols-outlined text-white text-[20px] md:text-[24px]">
        stylus_note
      </span>
    </div>

    {/* Text with high-end tracking */}
    <div className="flex flex-col items-start pr-2">
      <span className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-[#3C3830]">
        Reflect
      </span>
      <span className="text-[9px] font-bold text-primary/40 uppercase tracking-widest leading-none">
        Soul Journal
      </span>
    </div>

    {/* Hover Indicator Line */}
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-primary group-hover:w-1/2 transition-all duration-500 rounded-full"></div>
  </div>
</button>
      </main>
    </div>
  );
}