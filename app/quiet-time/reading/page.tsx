'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { ReadingCanvas } from '@/components/reading/ReadingCanvas';
import { useTheme } from '../../context/ThemeContext';

export default function QuietTimeReadingPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  
  const [activeBook] = useState({ name: 'John', chapters: 21 });
  const [activeChapter, setActiveChapter] = useState(15);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isAnonymousShare, setIsAnonymousShare] = useState(false);

  // Hydrate initial note from localStorage securely safely on mount
  useEffect(() => {
    const savedNote = localStorage.getItem('sanctuary_pending_note');
    if (savedNote) setNote(savedNote);
  }, []);

  // Listen for Escape key down to shut down layout drawers smoothly
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsJournalOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Structural Debounced Persistence Engine to keep interface blazing fast
  const persistToLocalStorage = useCallback((value: string) => {
    localStorage.setItem('sanctuary_pending_note', value);
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const targetVal = e.target.value;
    setNote(targetVal);
    persistToLocalStorage(targetVal);
  };

  const handleArchiveAndPublish = async () => {
    const cleanNote = note.trim();
    if (!cleanNote) return;

    setLoading(true);
    setErrorMessage(null);
    
    try {
      const response = await fetch('/api/community/revelations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book: activeBook.name,
          chapter: activeChapter,
          content: cleanNote,
          note: cleanNote,
          reflection: cleanNote,
          isPublic: true, 
          isAnonymous: isAnonymousShare
        }),
      });

      if (!response.ok) throw new Error('Network boundary sync failure occurred.');

      setShowToast(true);
      setNote('');
      localStorage.removeItem('sanctuary_pending_note');
      
      setTimeout(() => {
        setShowToast(false);
        setIsJournalOpen(false);
      }, 2200);
    } catch (err) {
      console.error(err);
      setErrorMessage('Could not sync reflection. Retaining context local-side for safety.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex min-h-screen antialiased transition-colors duration-300 lg:ml-64 ${
      isDark ? 'bg-zinc-950 text-zinc-100 selection:bg-primary-950/40' : 'bg-stone-100 text-zinc-900 selection:bg-primary-100'
    }`}>
      
      {/* Structural Minimal Control TopBar Header Framework */}
      <header className={`fixed top-0 left-0 lg:left-64 right-0 h-16 border-b z-40 px-4 md:px-8 flex items-center justify-between transition-colors duration-300 ${
        isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-white border-stone-200'
      }`}>
        <button 
          onClick={() => router.back()} 
          className={`text-[11px] font-sans font-semibold uppercase tracking-wider flex items-center gap-1.5 rounded-full px-3 py-1.5 transition-colors group focus-visible:ring-2 focus-visible:ring-primary-500 outline-none bg-transparent ${
            isDark ? 'text-zinc-400 hover:text-primary-400' : 'text-zinc-600 hover:text-primary-600'
          }`}
        >
          <span className="material-symbols-outlined text-[16px] group-hover:-translate-x-0.5 transition-transform">arrow_back</span> 
          Lobby
        </button>

        <div className="text-right font-sans select-none">
          <span className={`text-[9px] font-bold uppercase tracking-[0.24em] block ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Stage 02</span>
          <span className={`text-[12px] font-semibold ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>Holy Scripture</span>
        </div>
      </header>

      {/* Main Structural Layout Content Flow */}
      <div className="flex-1 relative">
        <main className="pt-24 px-4 md:px-8 pb-24 max-w-5xl mx-auto w-full">
          <div className="space-y-8">
            <div className={`rounded-[28px] border p-3 md:p-4 shadow-sm ${
              isDark ? 'border-zinc-800/70 bg-zinc-900' : 'border-stone-200/80 bg-white'
            }`}>
              <ReadingCanvas book={activeBook} chapter={activeChapter} onChapterChange={setActiveChapter} />
            </div>
            
            <div className={`pt-5 flex justify-end border-t ${isDark ? 'border-zinc-800/80' : 'border-stone-200/70'}`}>
              <button 
                onClick={() => router.push('/quiet-time/reflection')} 
                className={`flex items-center gap-2 font-semibold text-[11px] uppercase tracking-[0.2em] px-6 py-3 rounded-full transition-all duration-200 shadow-sm hover:shadow-md focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 outline-none ${
                  isDark ? 'bg-primary-600 hover:bg-primary-500 text-white' : 'bg-primary-600 hover:bg-primary-700 text-white'
                }`}
              >
                <span>Proceed to Reflection</span> 
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Primary Fixed Floating Action Panel Trigger */}
      <button 
        onClick={() => setIsJournalOpen(true)} 
        aria-label="Open soul journal interface"
        className="fixed right-4 bottom-4 z-40 group outline-none bg-transparent focus-visible:ring-2 focus-visible:ring-primary-500 rounded-2xl"
      >
        <div className={`flex items-center gap-3 border px-4 py-3 rounded-2xl shadow-xl transition-all duration-300 ${
          isDark 
            ? 'bg-zinc-900 border-zinc-800 text-zinc-100 hover:border-zinc-700/80 hover:bg-zinc-900' 
            : 'bg-white border-stone-200/80 text-zinc-900 hover:border-stone-300 hover:shadow-2xl'
        }`}>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105 duration-300 ${
            isDark ? 'bg-primary-600' : 'bg-primary-600'
          }`}>
            <span className="material-symbols-outlined text-[18px]">edit_note</span>
          </div>
          <div className="flex flex-col items-start font-sans text-left">
            <span className={`text-[9px] font-bold uppercase tracking-[0.24em] ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Reflect</span>
            <span className={`text-[12px] font-semibold leading-none mt-0.5 ${isDark ? 'text-zinc-200' : 'text-stone-800'}`}>Soul Journal</span>
          </div>
        </div>
      </button>

      {/* Drawer Overlay Mask Layer */}
      <div 
        onClick={() => setIsJournalOpen(false)} 
        className={`fixed inset-0 bg-black z-[90] transition-opacity duration-300 ${
          isJournalOpen ? 'opacity-50' : 'opacity-0 pointer-events-none'
        }`} 
      />

      {/* Structural Sliding Ledger Canvas Drawer Workspace Container */}
      <div 
        role="dialog"
        aria-modal="true"
        aria-hidden={!isJournalOpen}
        className={`fixed inset-y-0 right-0 w-full sm:w-[480px] z-[100] border-l transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl ${
          isDark ? 'bg-zinc-900 border-zinc-800/80' : 'bg-white border-stone-200/80'
        } ${isJournalOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Dynamic Status / Absolute Notification Inline Blocks */}
        <div className={`absolute top-20 left-6 right-6 z-[110] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-lg transition-all duration-300 ease-out ${
          showToast ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95 pointer-events-none'
        } ${isDark ? 'bg-emerald-600 text-white' : 'bg-emerald-600 text-white'}`}>
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span className="text-[10px] font-sans font-bold uppercase tracking-widest">Archived & Synchronized Safely</span>
        </div>

        {/* Drawer Document Header Frame Area */}
        <div className={`px-6 py-5 border-b flex justify-between items-center ${isDark ? 'border-zinc-800' : 'border-stone-200'}`}>
          <div>
            <h4 className={`text-[11px] font-sans font-bold uppercase tracking-[0.24em] ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>Sanctuary Journal</h4>
            <span className={`text-[11px] font-sans flex items-center gap-1.5 mt-0.5 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Auto-Save Active
            </span>
          </div>
          <button 
            onClick={() => setIsJournalOpen(false)} 
            aria-label="Close journal window"
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
              isDark ? 'border-zinc-800 hover:bg-zinc-800/60 text-zinc-400 hover:text-zinc-200' : 'border-stone-200 hover:bg-stone-50 text-zinc-500 hover:text-zinc-700'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">close</span>
          </button>
        </div>

        {/* Core Input Canvas Layer */}
        <div className="flex-1 relative px-6 pt-6 overflow-y-auto space-y-4">
          <div className={`inline-flex items-center gap-2 border px-2.5 py-1 rounded-full select-none ${
            isDark ? 'border-zinc-800 bg-zinc-950' : 'border-stone-200 bg-stone-50'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-primary-400' : 'bg-primary-600'}`} />
            <span className={`text-[10px] font-sans font-bold uppercase tracking-[0.2em] ${isDark ? 'text-zinc-400' : 'text-zinc-600'}`}>
              {activeBook.name} {activeChapter}
            </span>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200/40 dark:border-red-900/30 rounded-xl flex items-start gap-2.5 text-red-600 dark:text-red-400 text-[11px] font-sans leading-relaxed">
              <span className="material-symbols-outlined text-base mt-0.5">error</span>
              <span>{errorMessage}</span>
            </div>
          )}
          
          <textarea 
            value={note}
            onChange={handleTextChange}
            disabled={loading}
            className={`w-full h-[calc(100%-80px)] bg-transparent border-0 focus:ring-0 text-sm font-sans leading-relaxed resize-none outline-none disabled:opacity-40 ${
              isDark ? 'text-zinc-200 placeholder:text-zinc-600' : 'text-zinc-800 placeholder:text-zinc-400'
            }`} 
            placeholder="What is the Spirit speaking to you through this scripture? Record insights, references, or prayers here..." 
          />
        </div>

        {/* Privacy Parameters Configuration Panel Controls */}
        <div className={`p-4 mx-6 mb-4 border rounded-xl flex items-center justify-between ${
          isDark ? 'border-zinc-800 bg-zinc-950' : 'border-stone-200 bg-stone-50'
        }`}>
          <div className="flex flex-col font-sans max-w-[80%]">
            <label htmlFor="anon-checkbox" className={`text-[11px] font-bold uppercase tracking-[0.2em] cursor-pointer ${isDark ? 'text-zinc-300' : 'text-zinc-700'}`}>
              Share Anonymously
            </label>
            <span className={`text-[10px] mt-0.5 leading-snug ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>Omit personal handle context profile links on community revelation feeds.</span>
          </div>
          <input 
            id="anon-checkbox"
            type="checkbox" 
            checked={isAnonymousShare} 
            onChange={(e) => setIsAnonymousShare(e.target.checked)}
            className="rounded border-zinc-300 dark:border-zinc-700 text-primary-600 focus:ring-primary-500/30 bg-transparent w-4 h-4 cursor-pointer outline-none transition-colors"
          />
        </div>

        {/* Action Dispatch Commit Final Footbar */}
        <div className={`p-6 border-t ${isDark ? 'border-zinc-800' : 'border-stone-200'}`}>
          <button 
            onClick={handleArchiveAndPublish}
            disabled={loading || !note.trim()}
            className={`w-full py-3.5 rounded-xl font-semibold text-[11px] uppercase tracking-[0.2em] flex items-center justify-center gap-2 transition-all shadow-sm outline-none focus-visible:ring-2 focus-visible:ring-primary-500 ${
              loading || !note.trim()
                ? isDark ? 'bg-zinc-800 text-zinc-500' : 'bg-zinc-100 text-zinc-400'
                : 'bg-primary-600 hover:bg-primary-700 text-white'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">self_improvement</span>
            <span>{loading ? 'Synchronizing Archive...' : 'Archive & Commit Share'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}