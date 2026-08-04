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
  
  const [currentSection, setCurrentSection] = useState<'revelations' | 'intercession'>(
    initialSection === 'intercession' ? 'intercession' : 'revelations'
  );

  useEffect(() => {
    if (initialSection === 'revelations' || initialSection === 'intercession') {
      setCurrentSection(initialSection);
    }
  }, [initialSection]);
  
  const [revelationContent, setRevelationContent] = useState('');
  const [bibleBook, setBibleBook] = useState('Genesis');
  const [bibleChapter, setBibleChapter] = useState(1);
  const [submittingRevelation, setSubmittingRevelation] = useState(false);

  const [newPrayer, setNewPrayer] = useState('');
  const [submittingPrayer, setSubmittingPrayer] = useState(false);

  const contextConfig = {
    revelations: {
      placeholder: "What insight is God revealing to you?",
      buttonText: "Share Reflection",
      actionLabel: "Reflect",
      icon: "📖",
      title: "Share a Revelation",
      emoji: "✨"
    },
    intercession: {
      placeholder: "What's on your heart to pray about?",
      buttonText: "Share Prayer",
      actionLabel: "Pray",
      icon: "🙏",
      title: "Share a Prayer Request",
      emoji: "🕊️"
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
      <div className={`p-4 rounded-xl border flex items-start gap-3 ${
        isDark ? 'border-zinc-800/60 bg-zinc-900/30' : 'border-slate-200/60 bg-slate-50/50'
      }`}>
        <span className="text-lg mt-0.5">💡</span>
        <div>
          <p className={`text-xs font-medium ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>
            Use the stream console at the bottom of your cohort card to share instant live circle responses.
          </p>
        </div>
      </div>
    );
  }

  const current = contextConfig[currentSection];
  const charCount = currentSection === 'revelations' ? revelationContent.length : newPrayer.length;
  const maxChars = 280;

  return (
    <div className="w-full mb-6 max-w-2xl mx-auto">
      {/* 1. INLINE TRIGGER BAR */}
      <div className={`p-3 rounded-2xl border transition-all duration-200 ${
        isDark 
          ? 'border-zinc-800/60 bg-zinc-900/40 hover:border-zinc-700' 
          : 'border-slate-200/60 bg-white/80 hover:border-slate-300'
      }`}>
        {/* Segmented Control */}
        <div className={`flex p-1 rounded-xl mb-3 ${
          isDark ? 'bg-zinc-800/60' : 'bg-slate-100'
        }`}>
          <button
            type="button"
            onClick={() => setCurrentSection('revelations')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
              currentSection === 'revelations' 
                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25' 
                : isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>📖</span>
            <span>Reflection</span>
          </button>
          <button
            type="button"
            onClick={() => setCurrentSection('intercession')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
              currentSection === 'intercession' 
                ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' 
                : isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <span>🙏</span>
            <span>Prayer</span>
          </button>
        </div>

        {/* Input Trigger */}
        <div 
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-bold shadow-sm ${
            currentSection === 'revelations' 
              ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/20' 
              : 'bg-gradient-to-br from-orange-400 to-rose-500 shadow-orange-500/20'
          }`}>
            <span className="text-base">✝</span>
          </div>

          <div className="flex-1 min-w-0">
            <span className={`text-sm font-normal select-none truncate block transition-colors ${
              isDark ? 'text-zinc-500 group-hover:text-zinc-400' : 'text-slate-400 group-hover:text-slate-500'
            }`}>
              {current.placeholder}
            </span>
          </div>

          <button
            type="button"
            className={`shrink-0 text-white text-xs font-semibold px-5 py-2 rounded-full transition-all active:scale-95 shadow-sm ${
              currentSection === 'revelations'
                ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/25'
                : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/25'
            }`}
          >
            {current.actionLabel}
          </button>
        </div>
      </div>

      {/* 2. MOBILE FAB */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Create Post"
        className="sm:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-amber-500 to-orange-500 text-white flex items-center justify-center shadow-2xl shadow-orange-500/30 active:scale-90 transition-transform"
      >
        <span className="text-2xl">✏️</span>
      </button>

      {/* 3. FULL COMPOSER MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal Sheet */}
          <div className={`relative w-full sm:max-w-lg h-[90dvh] sm:h-auto sm:max-h-[80vh] rounded-t-3xl sm:rounded-2xl border shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200 z-[101] ${
            isDark ? 'border-zinc-800/60 bg-zinc-900' : 'border-slate-200/60 bg-white'
          }`}>
            
            {/* Modal Header */}
            <div className={`px-4 py-3.5 border-b shrink-0 ${
              isDark ? 'border-zinc-800/60' : 'border-slate-100'
            }`}>
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setIsOpen(false)}
                  className={`p-1.5 rounded-full transition-colors ${
                    isDark ? 'hover:bg-zinc-800 text-zinc-400' : 'hover:bg-slate-100 text-slate-500'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                
                <span className={`text-sm font-semibold ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>
                  {current.title}
                </span>

                <div className="w-8" />
              </div>

              {/* Modal Segmented Switcher */}
              <div className={`flex p-1 rounded-xl mt-3 ${
                isDark ? 'bg-zinc-800/60' : 'bg-slate-100'
              }`}>
                <button
                  type="button"
                  onClick={() => setCurrentSection('revelations')}
                  className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                    currentSection === 'revelations' 
                      ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/25' 
                      : isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <span>📖</span>
                  <span>Reflection</span>
                </button>
                <button
                  type="button"
                  onClick={() => setCurrentSection('intercession')}
                  className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-2 text-xs font-semibold transition-all ${
                    currentSection === 'intercession' 
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' 
                      : isDark ? 'text-zinc-400 hover:text-zinc-200' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  <span>🙏</span>
                  <span>Prayer</span>
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-white text-sm font-bold shadow-sm ${
                    currentSection === 'revelations' 
                      ? 'bg-gradient-to-br from-amber-400 to-orange-500 shadow-amber-500/20' 
                      : 'bg-gradient-to-br from-orange-400 to-rose-500 shadow-orange-500/20'
                  }`}>
                    <span className="text-base">✝</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                        isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500'
                      }`}>
                        {currentSection === 'revelations' ? '📖 Everyone can reply' : '🙏 Prayer circle'}
                      </span>
                    </div>

                    {currentSection === 'revelations' ? (
                      <textarea
                        autoFocus
                        value={revelationContent}
                        onChange={(e) => setRevelationContent(e.target.value)}
                        placeholder={current.placeholder}
                        maxLength={maxChars}
                        className={`w-full bg-transparent border-none focus:ring-0 text-base font-normal leading-relaxed resize-none min-h-[120px] outline-none ${
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
                        className={`w-full bg-transparent border-none focus:ring-0 text-base font-normal leading-relaxed resize-none min-h-[120px] outline-none ${
                          isDark ? 'text-zinc-100 placeholder:text-zinc-600' : 'text-slate-800 placeholder:text-slate-400'
                        }`}
                      />
                    )}
                  </div>
                </div>

                {/* Bible Reference for Revelations */}
                {currentSection === 'revelations' && (
                  <div className="flex items-center gap-2 pl-13">
                    <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border ${
                      isDark ? 'bg-zinc-800/60 border-zinc-700' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span className="text-amber-500 text-sm">📖</span>
                      <input 
                        type="text" 
                        value={bibleBook}
                        onChange={(e) => setBibleBook(e.target.value)}
                        placeholder="Book"
                        className={`w-16 bg-transparent border-none text-xs font-medium focus:ring-0 outline-none p-0 ${
                          isDark ? 'text-zinc-300' : 'text-slate-700'
                        }`}
                      />
                    </div>

                    <div className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border ${
                      isDark ? 'bg-zinc-800/60 border-zinc-700' : 'bg-slate-50 border-slate-200'
                    }`}>
                      <span className="text-amber-500 text-xs font-bold">Ch.</span>
                      <input 
                        type="number" 
                        value={bibleChapter}
                        onChange={(e) => setBibleChapter(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-10 bg-transparent border-none text-xs font-medium focus:ring-0 outline-none p-0"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action Footer */}
            <div className={`px-4 py-3 border-t shrink-0 ${
              isDark ? 'border-zinc-800/60 bg-zinc-900' : 'border-slate-100 bg-white'
            }`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-1">
                  {charCount > 0 && (
                    <span className={`text-xs font-mono ${
                      charCount >= maxChars - 20 ? 'text-rose-500 font-bold' : isDark ? 'text-zinc-500' : 'text-slate-400'
                    }`}>
                      {maxChars - charCount}
                    </span>
                  )}
                </div>

                <button 
                  type="button"
                  onClick={currentSection === 'revelations' ? handleCreateRevelation : handleCreatePrayer}
                  disabled={
                    currentSection === 'revelations' 
                      ? submittingRevelation || !revelationContent.trim()
                      : submittingPrayer || !newPrayer.trim()
                  }
                  className={`text-white text-sm font-semibold px-6 py-2.5 rounded-full transition-all active:scale-95 shadow-lg disabled:opacity-40 disabled:cursor-not-allowed ${
                    currentSection === 'revelations'
                      ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/30'
                      : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/30'
                  }`}
                >
                  {currentSection === 'revelations' 
                    ? (submittingRevelation ? 'Sharing...' : current.buttonText)
                    : (submittingPrayer ? 'Sharing...' : current.buttonText)
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