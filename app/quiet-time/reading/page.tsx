'use client';

import React, { useState, useEffect } from 'react';
import { ReadingCanvas } from '@/components/reading/ReadingCanvas';
import { SacredRibbon } from '@/components/reading/SacredRibbon';
import { useRouter } from 'next/navigation';

export default function QuietTimeReadingPage() {
  const router = useRouter();
  
  // Core UI States
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [activeBook, setActiveBook] = useState({ name: 'John', chapters: 21 });
  const [activeChapter, setActiveChapter] = useState(15);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // 1. LocalStorage Auto-Load on Mount
  useEffect(() => {
    const savedNote = localStorage.getItem('sanctuary_pending_note');
    if (savedNote) {
      setNote(savedNote);
    }
  }, []);

  // 2. Auto-Save to LocalStorage on Keystroke
  const handleTextChange = (val: string) => {
    setNote(val);
    localStorage.setItem('sanctuary_pending_note', val);
  };

  // 3. Simulated Archive Sequence (Safe Client-Side Flow)
  const handleArchive = async () => {
    const cleanNote = note.trim();
    if (!cleanNote) return;

    setLoading(true);

    // Simulating a perfect layout workflow for now
    setTimeout(() => {
      setLoading(false);
      setShowToast(true);
      
      // Wipe the workspace since it's safely archived
      setNote('');
      localStorage.removeItem('sanctuary_pending_note');
      
      setTimeout(() => {
        setShowToast(false);
        setIsJournalOpen(false);
      }, 2500);
    }, 1200);
  };

  return (
    <div className="relative flex min-h-screen bg-[#FDFDFF] text-[#1A1C1E] font-serif overflow-x-hidden">
      <SacredRibbon className="fixed top-0 left-24 z-10 opacity-40" color1="#D4AF37" color2="#AA8A2E" />

      {/* MAIN VIEWPORT */}
      <main className="flex-1 pt-12 pb-24 px-4 md:px-10 max-w-[1500px] mx-auto w-full">
        <header className="mb-8 flex justify-between items-center">
          <button onClick={() => router.back()} className="text-xs font-black tracking-widest text-gray-400 uppercase flex items-center gap-2 hover:text-[#3C3830] transition-colors">
            <span className="material-symbols-outlined text-sm">arrow_back</span> Lobby
          </button>
          <div className="hidden md:block text-right">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block">Stage 02</span>
            <span className="text-xs font-bold text-amber-700">Holy Scripture</span>
          </div>
        </header>

        <ReadingCanvas book={activeBook} chapter={activeChapter} onChapterChange={setActiveChapter} />

        <div className="mt-8 flex justify-end">
          <button onClick={() => router.push('/quiet-time/reflection')} className="flex items-center gap-2 bg-[#3C3830] text-white px-8 py-3.5 rounded-xl text-xs font-black tracking-widest hover:bg-black transition-all">
            PROCEED TO REFLECTION <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </button>
        </div>
      </main>

      {/* FLOATING ACTION BUTTON */}
      <button onClick={() => setIsJournalOpen(true)} className="fixed right-6 md:right-12 bottom-6 md:bottom-12 z-50 group flex items-center">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="relative flex items-center gap-4 bg-white/70 backdrop-blur-2xl border border-white px-5 md:px-8 py-4 md:py-5 rounded-[2rem] shadow-xl hover:-translate-y-1 transition-all duration-300">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:rotate-[12deg]">
            <span className="material-symbols-outlined text-white text-[24px]">stylus_note</span>
          </div>
          <div className="flex flex-col items-start pr-2">
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[#3C3830]">Reflect</span>
            <span className="text-[9px] font-bold text-primary/40 uppercase tracking-widest leading-none">Soul Journal</span>
          </div>
        </div>
      </button>

      {/* BACKDROP BLUR OVERLAY */}
      <div 
        onClick={() => setIsJournalOpen(false)}
        className={`fixed inset-0 bg-black/10 backdrop-blur-sm z-[90] transition-opacity duration-500 ${isJournalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      />

      {/* INTEGRATED JOURNAL DRAWER */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-[500px] bg-[#FDFDFB] z-[100] shadow-[-20px_0_80px_rgba(0,0,0,0.06)] transform transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isJournalOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* SUCCESS TOAST */}
        <div className={`absolute top-24 left-6 right-6 z-[110] flex items-center gap-3 bg-[#3C3830] text-white px-5 py-4 rounded-xl shadow-2xl border border-white/10 transition-all duration-500 ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
          <span className="material-symbols-outlined text-[#D4AF37]">check_circle</span>
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest leading-none mb-1">Archived to Workspace</span>
            <span className="text-[9px] text-gray-400">Local cache cleared cleanly.</span>
          </div>
        </div>

        <div className="h-full flex flex-col px-8 md:px-12 py-10 relative">
          <div className="flex justify-between items-center mb-8">
            <div className="flex flex-col">
              <h4 className="text-[11px] font-black text-primary uppercase tracking-[0.4em] mb-1">Sanctuary Notes</h4>
              <span className="text-[9px] font-bold text-amber-600 uppercase tracking-widest">Auto-Save Active</span>
            </div>
            <button onClick={() => setIsJournalOpen(false)} className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <span className="material-symbols-outlined text-gray-400">close</span>
            </button>
          </div>

          <div className="flex-1 relative mt-4">
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-white/90 backdrop-blur-md border border-gray-100 px-3 py-1.5 rounded-full shadow-sm">
              <span className="material-symbols-outlined text-[14px] text-primary">menu_book</span>
              <span className="text-[10px] font-black text-[#3C3830] uppercase">{activeBook.name} {activeChapter}</span>
            </div>

            <textarea 
              value={note}
              onChange={(e) => handleTextChange(e.target.value)}
              disabled={loading}
              className="w-full h-full bg-transparent border-none focus:ring-0 text-lg md:text-xl font-serif leading-relaxed text-[#3C3830] placeholder:text-gray-300 resize-none pt-16 disabled:opacity-50" 
              placeholder="What is the Spirit speaking to you through this scripture?..." 
            />
            
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] border-t border-black/10 mt-16" 
                 style={{ backgroundImage: 'linear-gradient(#000 1.5px, transparent 1.5px)', backgroundSize: '100% 2.8rem' }}>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 mt-4">
            <button 
              onClick={handleArchive}
              disabled={loading || !note.trim()}
              className="w-full h-14 bg-[#3C3830] text-white rounded-2xl font-black text-xs tracking-[0.25em] flex items-center justify-center gap-3 hover:bg-black disabled:opacity-40 transition-all"
            >
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              {loading ? 'ARCHIVING...' : 'ARCHIVE REFLECTION'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}