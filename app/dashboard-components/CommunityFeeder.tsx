'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

type CommunitySection = 'revelations' | 'intercession' | 'cohort';

interface CommunityFeederProps {
  activeSection: CommunitySection;
  onPostCreated?: (type: CommunitySection, freshData: any) => void;
}

export default function CommunityFeeder({ activeSection: initialSection, onPostCreated }: CommunityFeederProps) {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
  // Active section state with local tab switching support
  const [currentSection, setCurrentSection] = useState<'revelations' | 'intercession'>(
    initialSection === 'intercession' ? 'intercession' : 'revelations'
  );

  useEffect(() => {
    if (initialSection === 'revelations' || initialSection === 'intercession') {
      setCurrentSection(initialSection);
    }
  }, [initialSection]);
  
  // Revelation submission state
  const [revelationContent, setRevelationContent] = useState('');
  const [bibleBook, setBibleBook] = useState('Genesis');
  const [bibleChapter, setBibleChapter] = useState(1);
  const [submittingRevelation, setSubmittingRevelation] = useState(false);

  // Prayer submission state
  const [newPrayer, setNewPrayer] = useState('');
  const [submittingPrayer, setSubmittingPrayer] = useState(false);

  const contextConfig = {
    revelations: {
      placeholder: "What is your revelation today?",
      buttonText: "Post Reflection",
      actionLabel: "Post",
      icon: "menu_book",
      title: "Share Reflection"
    },
    intercession: {
      placeholder: "Drop a prayer request into the intercession circle...",
      buttonText: "Post Prayer",
      actionLabel: "Post",
      icon: "brightness_7",
      title: "Share Prayer"
    }
  };

  const handleCreateRevelation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revelationContent.trim()) return;

    setSubmittingRevelation(true);
    try {
      const res = await fetch('/api/community/revelations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: revelationContent.trim(),
          book: bibleBook,
          chapter: bibleChapter,
          isAnonymous: false
        })
      });
      if (res.ok) {
        const freshRevelation = await res.json();
        if (onPostCreated) onPostCreated('revelations', freshRevelation);
        setRevelationContent('');
        setIsOpen(false);
      }
    } catch (err) {
      console.error("Failed creating dynamic feed revelation:", err);
    } finally {
      setSubmittingRevelation(false);
    }
  };

  const handleCreatePrayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrayer.trim()) return;

    setSubmittingPrayer(true);
    try {
      const res = await fetch('/api/intercede', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPrayer.trim(), isAnonymous: false })
      });
      if (res.ok) {
        const freshPrayer = await res.json();
        if (onPostCreated) onPostCreated('intercession', freshPrayer);
        setNewPrayer('');
        setIsOpen(false);
      }
    } catch (err) {
      console.error("Failed creating dynamic feed prayer loop:", err);
    } finally {
      setSubmittingPrayer(false);
    }
  };

  if (initialSection === 'cohort') {
    return (
      <div className={`p-4 mb-6 border rounded-2xl flex items-center gap-3 ${
        isDark ? 'border-zinc-800 bg-zinc-950/40 text-zinc-400' : 'border-slate-200 bg-slate-50 text-slate-500'
      }`}>
        <span className="material-symbols-outlined text-sm text-amber-500">info</span>
        <span className="text-xs font-medium">
          Use the stream console at the bottom of your cohort card to share instant live circle responses.
        </span>
      </div>
    );
  }

  const current = contextConfig[currentSection];
  const charCount = currentSection === 'revelations' ? revelationContent.length : newPrayer.length;
  const maxChars = 280;

  return (
    <div className="w-full mb-6 max-w-xl mx-auto">
      {/* 1. INLINE TRIGGER BAR WITH QUICK TAB SWITCHER */}
      <div className={`p-3 border rounded-2xl transition-all duration-200 flex flex-col gap-3 shadow-sm ${
        isDark 
          ? 'border-zinc-800 bg-black/60' 
          : 'border-slate-200/80 bg-white'
      }`}>
        {/* Quick Segmented Control for Mobile/Desktop */}
        <div className={`flex p-1 rounded-xl text-xs font-bold ${
          isDark ? 'bg-zinc-900 text-zinc-400' : 'bg-slate-100 text-slate-500'
        }`}>
          <button
            type="button"
            onClick={() => setCurrentSection('revelations')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              currentSection === 'revelations' 
                ? 'bg-[#FF6221] text-white shadow-sm' 
                : 'hover:text-zinc-200'
            }`}
          >
            <span className="material-symbols-outlined text-sm">menu_book</span>
            <span>share Reflection</span>
          </button>
          <button
            type="button"
            onClick={() => setCurrentSection('intercession')}
            className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              currentSection === 'intercession' 
                ? 'bg-[#FF6221] text-white shadow-sm' 
                : 'hover:text-zinc-200'
            }`}
          >
            <span className="material-symbols-outlined text-sm">brightness_7</span>
            <span>share Prayer</span>
          </button>
        </div>

        {/* Input Trigger */}
        <div 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 cursor-pointer pt-1"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-sm">
            <span className="material-symbols-outlined text-base">person</span>
          </div>

          <div className="flex-1 min-w-0">
            <span className={`text-sm font-normal select-none truncate block ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
              {current.placeholder}
            </span>
          </div>

          <button
            type="button"
            className="shrink-0 bg-[#FF6221] hover:bg-[#e55318] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-sm"
          >
            {current.actionLabel}
          </button>
        </div>
      </div>

      {/* 2. FLOATING ACTION BUTTON (MOBILE QUICK OPEN) */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Create Post"
        className="sm:hidden fixed bottom-6 right-5 z-40 w-14 h-14 rounded-full bg-[#FF6221] text-white flex items-center justify-center shadow-2xl active:scale-90 transition-transform"
      >
        <span className="material-symbols-outlined text-2xl">edit</span>
      </button>

      {/* 3. MOBILE-OPTIMIZED FULL COMPOSER MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-md transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal Sheet */}
          <div className={`relative w-full sm:max-w-lg h-[92dvh] sm:h-auto sm:max-h-[85vh] rounded-t-3xl sm:rounded-2xl border-t sm:border shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 z-[101] ${
            isDark ? 'border-zinc-800 bg-zinc-950 text-white' : 'border-slate-200 bg-white text-slate-900'
          }`}>
            
            {/* Modal Header & Section Selector */}
            <div className={`p-3.5 border-b shrink-0 flex flex-col gap-3 ${
              isDark ? 'border-zinc-800 bg-zinc-950' : 'border-slate-100 bg-white'
            }`}>
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setIsOpen(false)}
                  className={`p-1.5 rounded-full transition-colors ${
                    isDark ? 'hover:bg-zinc-800 text-zinc-300' : 'hover:bg-slate-100 text-slate-600'
                  }`}
                >
                  <span className="material-symbols-outlined text-xl block">close</span>
                </button>
                
                <span className="text-xs font-bold tracking-tight">
                  {current.title}
                </span>

                <div className="w-8" />
              </div>

              {/* Segmented Switcher inside Modal */}
              <div className={`flex p-1 rounded-xl text-xs font-bold ${
                isDark ? 'bg-zinc-900 text-zinc-400' : 'bg-slate-100 text-slate-500'
              }`}>
                <button
                  type="button"
                  onClick={() => setCurrentSection('revelations')}
                  className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    currentSection === 'revelations' 
                      ? 'bg-[#FF6221] text-white shadow-sm' 
                      : 'hover:text-zinc-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">menu_book</span>
                  <span>Reflection</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentSection('intercession')}
                  className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                    currentSection === 'intercession' 
                      ? 'bg-[#FF6221] text-white shadow-sm' 
                      : 'hover:text-zinc-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">brightness_7</span>
                  <span>Prayer Request</span>
                </button>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 flex gap-3 flex-1 overflow-y-auto">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-sm">
                <span className="material-symbols-outlined text-base">person</span>
              </div>

              <div className="flex-1 min-w-0 flex flex-col justify-between">
                <div>
                  <div className="mb-3">
                    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border ${
                      isDark 
                        ? 'border-orange-500/30 text-orange-400 bg-orange-500/10' 
                        : 'border-orange-200 text-orange-600 bg-orange-50'
                    }`}>
                      <span>Everyone can reply</span>
                      <span className="material-symbols-outlined text-xs">expand_more</span>
                    </span>
                  </div>

                  {currentSection === 'revelations' ? (
                    <textarea
                      autoFocus
                      value={revelationContent}
                      onChange={(e) => setRevelationContent(e.target.value)}
                      placeholder={current.placeholder}
                      maxLength={maxChars}
                      className={`w-full bg-transparent border-none focus:ring-0 text-base font-normal leading-relaxed resize-none min-h-[150px] outline-none ${
                        isDark ? 'text-zinc-100 placeholder:text-zinc-600' : 'text-slate-800 placeholder:text-slate-400'
                      }`}
                    />
                  ) : (
                    <textarea
                      autoFocus
                      value={newPrayer}
                      onChange={(e) => setNewPrayer(e.target.value)}
                      placeholder={current.placeholder}
                      maxLength={maxChars}
                      className={`w-full bg-transparent border-none focus:ring-0 text-base font-normal leading-relaxed resize-none min-h-[150px] outline-none ${
                        isDark ? 'text-zinc-100 placeholder:text-zinc-600' : 'text-slate-800 placeholder:text-slate-400'
                      }`}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* STICKY ACTION FOOTER (Guaranteed visibility above mobile UI popups) */}
            <div className={`sticky bottom-0 z-30 px-4 py-3 border-t flex items-center justify-between gap-2 shrink-0 ${
              isDark ? 'border-zinc-800 bg-zinc-950' : 'border-slate-100 bg-white'
            }`}>
              {currentSection === 'revelations' ? (
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border ${
                    isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                  }`}>
                    <span className="material-symbols-outlined text-xs text-[#FF6221]">book</span>
                    <input 
                      type="text" 
                      value={bibleBook}
                      onChange={(e) => setBibleBook(e.target.value)}
                      placeholder="Book"
                      className="w-14 sm:w-16 bg-transparent border-none text-xs font-semibold focus:ring-0 outline-none p-0"
                    />
                  </div>

                  <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border ${
                    isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-slate-100 border-slate-200 text-slate-700'
                  }`}>
                    <span className="text-xs font-bold text-[#FF6221]">Ch.</span>
                    <input 
                      type="number" 
                      value={bibleChapter}
                      onChange={(e) => setBibleChapter(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-7 sm:w-8 bg-transparent border-none text-xs font-semibold focus:ring-0 outline-none p-0"
                    />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3 text-[#FF6221]">
                  <button type="button" className="p-1 hover:opacity-80 transition-opacity">
                    <span className="material-symbols-outlined text-xl block">image</span>
                  </button>
                  <button type="button" className="p-1 hover:opacity-80 transition-opacity">
                    <span className="material-symbols-outlined text-xl block">sentiment_satisfied</span>
                  </button>
                </div>
              )}

              <div className="flex items-center gap-3">
                {charCount > 0 && (
                  <span className={`text-xs font-mono ${
                    charCount >= maxChars - 20 ? 'text-red-500 font-bold' : isDark ? 'text-zinc-500' : 'text-slate-400'
                  }`}>
                    {maxChars - charCount}
                  </span>
                )}

                <button 
                  type="button"
                  onClick={currentSection === 'revelations' ? handleCreateRevelation : handleCreatePrayer}
                  disabled={
                    currentSection === 'revelations' 
                      ? submittingRevelation || !revelationContent.trim()
                      : submittingPrayer || !newPrayer.trim()
                  }
                  className="bg-[#FF6221] hover:bg-[#e55318] text-white text-xs font-bold px-5 py-2.5 rounded-full disabled:opacity-40 transition-all active:scale-95 shadow-md shrink-0"
                >
                  {currentSection === 'revelations' 
                    ? (submittingRevelation ? 'Posting...' : current.buttonText)
                    : (submittingPrayer ? 'Posting...' : current.buttonText)
                  }
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}