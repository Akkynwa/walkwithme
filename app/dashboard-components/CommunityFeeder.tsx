'use client';

import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';

type CommunitySection = 'revelations' | 'intercession' | 'cohort';

interface CommunityFeederProps {
  activeSection: CommunitySection;
  onPostCreated?: (type: CommunitySection, freshData: any) => void;
}

export default function CommunityFeeder({ activeSection, onPostCreated }: CommunityFeederProps) {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  
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
      placeholder: "Share an insight or revelation from your quiet time...",
      buttonText: "Publish Reflection",
      actionLabel: "Write Reflection",
      icon: "menu_book"
    },
    intercession: {
      placeholder: "Drop a request or praise report into the intercession circle...",
      buttonText: "Request Prayer",
      actionLabel: "Write Request",
      icon: "brightness_7"
    },
    cohort: {
      placeholder: "Broadcast a message to your study circle...",
      buttonText: "Send Insight",
      actionLabel: "Write Insight",
      icon: "groups"
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

  if (activeSection === 'cohort') {
    return (
      <div className={`p-4 mb-6 border rounded-xl backdrop-blur-md flex items-center gap-3 transition-all ${
        isDark 
          ? 'border-primary-500/10 bg-black/40 text-zinc-400' 
          : 'border-amber-200/30 bg-white/40 text-gray-500'
      }`}>
        <span className={`material-symbols-outlined text-sm ${isDark ? 'text-primary-400' : 'text-amber-600'}`}>info</span>
        <span className="text-[10px] font-black tracking-wider uppercase opacity-90">
          Use the stream console at the bottom of your cohort card to share instant live circle responses.
        </span>
      </div>
    );
  }

  const current = contextConfig[activeSection];

  return (
    <div className="w-full mb-6 max-w-3xl mx-auto animate-fadeIn">
      {/* Compact Entry Bar */}
      <div 
        onClick={() => setIsOpen(true)}
        className={`p-3 border rounded-xl backdrop-blur-md shadow-sm flex items-center justify-between gap-4 cursor-pointer transition-all duration-300 hover:scale-[1.005] ${
          isDark 
            ? 'border-primary-500/15 bg-black/40 hover:bg-black/50 hover:border-primary-500/25' 
            : 'border-amber-200/30 bg-white/40 hover:bg-white/60 hover:border-amber-200/50'
        }`}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className={`material-symbols-outlined text-base opacity-75 ${isDark ? 'text-primary-400' : 'text-amber-600'}`}>
            {current.icon}
          </span>
          <span className={`text-[11px] font-medium truncate pointer-events-none ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
            {current.placeholder}
          </span>
        </div>
        <button
          type="button"
          className="shrink-0 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-[9px] font-black tracking-wider uppercase px-4 py-2 rounded-lg hover:shadow-md transition-all active:scale-95"
        >
          {current.actionLabel}
        </button>
      </div>

      {/* Structured Writing Modal Workspace */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          {/* Glassmorphic Overlay Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Input Box Container */}
          <div className={`relative w-full max-w-xl border rounded-xl shadow-2xl p-5 backdrop-blur-xl transform transition-all animate-scaleUp ${
            isDark ? 'border-primary-500/20 bg-zinc-950/95 text-zinc-200' : 'border-amber-200/50 bg-white/95 text-gray-800'
          }`}>
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-white/5">
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-md ${isDark ? 'text-primary-400' : 'text-amber-600'}`}>
                  {current.icon}
                </span>
                <h3 className="text-[10px] font-black tracking-wider uppercase opacity-90">
                  {activeSection === 'revelations' ? 'New Journal Reflection' : 'Submit Intercession Call'}
                </h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className={`material-symbols-outlined text-lg rounded-full p-1 transition-colors ${
                  isDark ? 'hover:bg-white/10 text-zinc-400' : 'hover:bg-gray-100 text-gray-500'
                }`}
              >
                close
              </button>
            </div>

            {activeSection === 'revelations' ? (
              <form onSubmit={handleCreateRevelation}>
                <div className="flex gap-2 mb-4">
                  <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${
                    isDark ? 'bg-primary-900/15 border-primary-500/15' : 'bg-amber-50/60 border-amber-200/40'
                  }`}>
                    <span className={`material-symbols-outlined text-[12px] ${isDark ? 'text-primary-400' : 'text-amber-600'}`}>menu_book</span>
                    <input 
                      type="text" 
                      value={bibleBook}
                      onChange={(e) => setBibleBook(e.target.value)}
                      placeholder="Book"
                      className={`w-20 bg-transparent border-none text-[9px] font-black uppercase tracking-wider focus:ring-0 outline-none p-0 ${
                        isDark ? 'text-primary-300 placeholder:text-primary-700/40' : 'text-amber-800 placeholder:text-amber-300'
                      }`}
                    />
                  </div>
                  <div className={`flex items-center px-2.5 py-1 rounded-lg border ${
                    isDark ? 'bg-primary-900/15 border-primary-500/15' : 'bg-amber-50/60 border-amber-200/40'
                  }`}>
                    <span className={`text-[9px] font-black mr-1 uppercase opacity-75 ${isDark ? 'text-primary-400' : 'text-amber-700'}`}>Ch.</span>
                    <input 
                      type="number" 
                      value={bibleChapter}
                      onChange={(e) => setBibleChapter(Math.max(1, parseInt(e.target.value) || 1))}
                      className={`w-12 bg-transparent border-none text-[9px] font-black focus:ring-0 outline-none p-0 ${
                        isDark ? 'text-primary-300' : 'text-amber-800'
                      }`}
                    />
                  </div>
                </div>

                <textarea
                  autoFocus
                  value={revelationContent}
                  onChange={(e) => setRevelationContent(e.target.value)}
                  placeholder={current.placeholder}
                  className={`w-full bg-transparent border-none focus:ring-0 text-[13px] font-medium leading-relaxed resize-none h-32 outline-none mb-4 ${
                    isDark ? 'text-zinc-300 placeholder:text-zinc-650' : 'text-gray-700 placeholder:text-gray-400'
                  }`}
                />

                <div className={`flex justify-end pt-3 border-t ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
                  <button 
                    type="submit" 
                    disabled={submittingRevelation || !revelationContent.trim()}
                    className="bg-gradient-to-r from-primary-500 to-primary-600 text-white text-[9px] font-black tracking-wider uppercase px-6 py-2.5 rounded-lg hover:shadow-md disabled:opacity-30 transition-all active:scale-95"
                  >
                    {submittingRevelation ? 'Publishing...' : current.buttonText}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleCreatePrayer}>
                <textarea
                  autoFocus
                  value={newPrayer}
                  onChange={(e) => setNewPrayer(e.target.value)}
                  placeholder={current.placeholder}
                  className={`w-full bg-transparent border-none focus:ring-0 text-[13px] font-medium leading-relaxed resize-none h-32 outline-none mb-4 ${
                    isDark ? 'text-zinc-300 placeholder:text-zinc-650' : 'text-gray-700 placeholder:text-gray-400'
                  }`}
                />

                <div className={`flex justify-end pt-3 border-t ${isDark ? 'border-white/10' : 'border-gray-100'}`}>
                  <button 
                    type="submit" 
                    disabled={submittingPrayer || !newPrayer.trim()}
                    className="bg-gradient-to-r from-primary-500 to-primary-600 text-white text-[9px] font-black tracking-wider uppercase px-6 py-2.5 rounded-lg hover:shadow-md disabled:opacity-30 transition-all active:scale-95"
                  >
                    {submittingPrayer ? 'Broadcasting...' : current.buttonText}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}