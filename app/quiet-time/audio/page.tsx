'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AudioPlayer } from '@/components/audio/AudioPlayer';
import Sidebar from '@/app/layout-components/Sidebar';
import { DownloadButton } from '@/components/audio/DownloadButton';

const BIBLE_VERSIONS = [
  { id: 'de4e12af7f29f59f-01', name: 'KJV', lang: 'English' },
  { id: '06125ad3d5662098-01', name: 'NIV', lang: 'English' },
  { id: 'yor-bm-id', name: 'Bibeli Mimọ', lang: 'Yoruba' },
  { id: 'ibo-izii-id', name: 'Izii', lang: 'Igbo' }
];

const BOOK_MAP: Record<string, string> = {
  'Genesis': 'GEN', 'Exodus': 'EXO', 'Psalms': 'PSA', 
  'Proverbs': 'PRO', 'Matthew': 'MAT', 'John': 'JHN', 'Romans': 'ROM'
};

const BOOKS = Object.keys(BOOK_MAP);

export default function QuietTimeAudioPage() {
  const [book, setBook] = useState('Psalms');
  const [chapter, setChapter] = useState('23');
  const [version, setVersion] = useState(BIBLE_VERSIONS[1].id);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [scriptureText, setScriptureText] = useState("Loading the Word...");
  
  // Audio Engine State
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  // --- CONNECTED TO JOURNAL ROUTE STATES ---
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isLoadingNote, setIsLoadingNote] = useState(false);

  // Compute a unified reference tag to group/identify the journal context
  const passageReference = `${book} ${chapter}`;

  // Fetch Audio Stream Context
  const fetchSanctuaryAudio = useCallback(async () => {
    setIsLoadingAudio(true);
    setAudioUrl(null); 
    try {
      const apiBook = BOOK_MAP[book];
      const res = await fetch(`/api/bible/audio?book=${apiBook}&chapter=${chapter}&versionId=${version}`);
      const data = await res.json();
      if (data.url) setAudioUrl(data.url);
    } catch (err) {
      console.error("Sanctuary Error:", err);
    } finally {
      setIsLoadingAudio(false);
    }
  }, [book, chapter, version]);

  // Pull existing log content directly from your established journal route on passage transition
  useEffect(() => {
    async function fetchScripture() {
      setScriptureText("The Lord is my shepherd; I shall not want. He makes me to lie down in green pastures...");
    }
    
    async function fetchJournalContext() {
      setIsLoadingNote(true);
      try {
        // Querying your active journal route matching this reference
        const res = await fetch(`/api/journal?reference=${encodeURIComponent(passageReference)}&type=quiet_time`);
        const data = await res.json();
        
        // Extract content depending on your journal schema layout (e.g., body, content, or text)
        setNoteContent(data.content || data.body || '');
      } catch (err) {
        console.error("Failed to query journal pipeline:", err);
      } finally {
        setIsLoadingNote(false);
      }
    }

    fetchScripture();
    fetchSanctuaryAudio();
    fetchJournalContext();
  }, [book, chapter, version, passageReference, fetchSanctuaryAudio]);

  // Submit/Upsert the entry to your journals database route
  const saveStudyNotes = async () => {
    setIsSavingNote(true);
    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reference: passageReference,
          type: 'quiet_time',
          content: noteContent, // Adjust key if your route accepts 'body'
          title: `Reflections on ${passageReference}`
        })
      });
      if (!res.ok) throw new Error('Journal transaction failed');
    } catch (err) {
      console.error("Failed to commit entry to journals ledger:", err);
    } finally {
      setIsSavingNote(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F4F1EA] font-serif overflow-x-hidden selection:bg-[#D4AF37]/20 relative">
      <Sidebar />

      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.35] mix-blend-multiply z-0"
        style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` }}
      />

      <main className="relative z-10 lg:ml-64 flex-1 px-6 md:px-12 py-12 max-w-5xl mx-auto pb-32">
        
        {/* SELECTOR BAR */}
        <section className="mb-10 bg-white/80 backdrop-blur-md border border-[#D4CDBA]/60 p-4 rounded-3xl flex flex-wrap lg:flex-nowrap items-center gap-4 shadow-[0_10px_30px_rgba(60,56,48,0.02)]">
          <div className="flex items-center gap-3 bg-[#FDFBF7] px-4 py-2 rounded-2xl border border-[#D4CDBA]/30 flex-1">
            <span className="material-symbols-outlined text-[#3C3830] text-xl">search</span>
            <select 
              value={book} 
              onChange={(e) => setBook(e.target.value)}
              className="bg-transparent text-sm font-sans font-bold text-[#3C3830] outline-none w-full appearance-none cursor-pointer"
            >
              {BOOKS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-[#FDFBF7] px-4 py-2 rounded-2xl border border-[#D4CDBA]/30 w-32">
            <span className="text-[10px] font-sans font-black text-[#7C7565] uppercase">Ch</span>
            <input 
              type="number" 
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              className="bg-transparent text-sm font-sans font-bold text-[#3C3830] w-full outline-none"
            />
          </div>

          <div className="flex items-center gap-3 bg-[#FDFBF7] px-4 py-2 rounded-2xl border border-[#D4CDBA]/30 w-48">
            <span className="material-symbols-outlined text-[#7C7565] text-xl">language</span>
            <select 
              value={version} 
              onChange={(e) => setVersion(e.target.value)}
              className="bg-transparent text-sm font-sans font-bold text-[#3C3830] outline-none w-full appearance-none cursor-pointer"
            >
              {BIBLE_VERSIONS.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 px-4 border-l border-[#D4CDBA]/40">
            <span className="material-symbols-outlined text-sm text-[#7C7565]">speed</span>
            <select 
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="bg-transparent text-xs font-sans font-bold text-[#3C3830] outline-none cursor-pointer"
            >
              <option value={0.8}>0.8x</option>
              <option value={1}>1.0x</option>
              <option value={1.2}>1.2x</option>
            </select>
          </div>
        </section>

        {/* HERO AUDIO PLAYER */}
        <section className="mb-16 flex flex-col items-center">
          <div className="relative w-full max-w-4xl">
            {isLoadingAudio && (
              <div className="absolute inset-0 z-20 bg-[#FDFBF7]/60 backdrop-blur-sm rounded-[3rem] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-10 h-10 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-[10px] font-sans font-black uppercase tracking-widest text-[#3C3830]">Preparing Sanctuary...</p>
                </div>
              </div>
            )}
            
            <AudioPlayer
              src={audioUrl || ''} 
              title={book}
              book={book}
              chapter={parseInt(chapter)}
              playbackSpeed={playbackSpeed}
              bgImage="https://images.unsplash.com/photo-1501854140801-50d01698950b"
            />
          </div>
          
          <div className="mt-8 flex gap-8">
            {audioUrl && <DownloadButton audioUrl={audioUrl} title={`${book}_${chapter}`} />}
            <button className="group flex flex-col items-center gap-2 transition-all">
                <div className="w-12 h-12 rounded-full border border-[#D4CDBA] bg-white/80 flex items-center justify-center text-[#3C3830] group-hover:bg-[#3C3830] group-hover:text-white transition-all shadow-sm">
                    <span className="material-symbols-outlined text-xl">bookmark</span>
                </div>
                <span className="text-[10px] font-sans font-bold text-[#7C7565] uppercase tracking-widest">Save Passage</span>
            </button>
          </div>
        </section>

        {/* SCRIPTURE TEXT CARD */}
        <section className="bg-white/80 backdrop-blur-xl border border-[#D4CDBA]/30 p-8 md:p-16 rounded-[2.5rem] shadow-[0_30px_70px_rgba(60,56,48,0.04)] relative overflow-hidden">
          <div className="absolute top-8 right-12 opacity-5 select-none pointer-events-none">
             <span className="text-[12rem] font-black">{chapter}</span>
          </div>
          
          <div className="max-w-2xl relative z-10">
            <h2 className="text-3xl font-bold text-[#3C3830] mb-8">{book} {chapter}</h2>
            <p className="text-2xl text-[#3C3830] leading-[1.9] italic">
              "{scriptureText}"
            </p>
            
            <div className="mt-12 flex gap-4">
              <button 
                onClick={() => setIsNotesOpen(true)}
                className="bg-gradient-to-r from-[#D4AF37] to-[#AA8414] text-white px-10 py-4 rounded-xl text-xs font-sans font-black uppercase tracking-widest hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 transition-all"
              >
                Study Notes
              </button>
              <button className="bg-white border border-[#D4CDBA] text-[#3C3830] px-10 py-4 rounded-xl text-xs font-sans font-black uppercase tracking-widest hover:bg-[#FDFBF7] transition-all">
                Share Verse
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* --- SLIDE-OUT PANEL COUPLING JOURNAL ROUTE --- */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-white border-l border-[#D4CDBA]/60 shadow-[-20px_0_60px_rgba(60,56,48,0.08)] z-50 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isNotesOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col p-8 justify-between relative">
          
          <div>
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#D4CDBA]/40">
              <div className="flex flex-col">
                <span className="text-[9px] font-sans font-black uppercase tracking-[0.2em] text-[#D4AF37]">Journal Link Sync</span>
                <h3 className="text-xl font-bold text-[#3C3830]">{book} {chapter} Notes</h3>
              </div>
              <button 
                onClick={() => setIsNotesOpen(false)}
                className="w-8 h-8 rounded-full border border-[#D4CDBA]/40 flex items-center justify-center text-[#7C7565] hover:bg-gray-50 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>

            <div className="p-4 bg-[#FDFBF7] rounded-2xl border border-[#D4CDBA]/30 mb-6 relative min-h-[76px] flex flex-col justify-center">
              {isLoadingNote ? (
                <div className="flex items-center gap-2 justify-center py-2 animate-pulse">
                  <div className="w-3 h-3 rounded-full bg-[#D4AF37] animate-ping" />
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-[#7C7565]">Syncing Journal...</span>
                </div>
              ) : (
                <>
                  <h4 className="text-[10px] font-sans font-black uppercase tracking-widest text-[#3C3830] mb-1">Passage Context</h4>
                  <p className="text-xs text-[#7C7565] italic line-clamp-2">"{scriptureText}"</p>
                </>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-sans font-black uppercase tracking-widest text-[#7C7565]">Divine Prompts & Reflections</label>
              <textarea 
                value={noteContent}
                disabled={isLoadingNote}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder={isLoadingNote ? "Waiting for journal sync..." : "Record structural insights or revelation notes here..."}
                className="w-full h-64 p-4 rounded-2xl bg-[#FAFAFA] border border-[#D4CDBA]/40 text-sm text-[#3C3830] outline-none font-sans focus:border-[#D4AF37] transition-all resize-none leading-relaxed disabled:opacity-50"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-[#D4CDBA]/40 flex items-center justify-between">
            <span className="text-[10px] font-sans text-gray-400 italic">
              {noteContent.length > 0 ? `${noteContent.length} characters logged` : 'Empty sheet'}
            </span>
            <button 
              onClick={saveStudyNotes}
              disabled={isSavingNote || isLoadingNote}
              className="px-8 py-3 bg-[#3C3830] hover:bg-[#524B3F] text-white font-sans font-black text-xs tracking-widest uppercase rounded-xl transition-all disabled:opacity-50 flex items-center gap-2 shadow-md"
            >
              {isSavingNote ? (
                <>
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Syncing...
                </>
              ) : (
                'Save Entry'
              )}
            </button>
          </div>
        </div>
      </div>
      
    </div>
  );
}