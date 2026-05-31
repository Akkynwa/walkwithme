'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AudioPlayer } from '@/components/audio/AudioPlayer';
import Sidebar from '@/app/layout-components/Sidebar';
import { DownloadButton } from '@/components/audio/DownloadButton';

// Configuration with valid API IDs
const BIBLE_VERSIONS = [
  { id: 'de4e12af7f29f59f-01', name: 'KJV', lang: 'English' },
  { id: '06125ad3d5662098-01', name: 'NIV', lang: 'English' },
  { id: 'yor-bm-id', name: 'Bibeli Mimọ', lang: 'Yoruba' },
  { id: 'ibo-izii-id', name: 'Izii', lang: 'Igbo' }
];

// Mapping readable names to API abbreviations (e.g., Genesis -> GEN)
const BOOK_MAP: Record<string, string> = {
  'Genesis': 'GEN', 'Exodus': 'EXO', 'Psalms': 'PSA', 
  'Proverbs': 'PRO', 'Matthew': 'MAT', 'John': 'JHN', 'Romans': 'ROM'
};

const BOOKS = Object.keys(BOOK_MAP);

export default function QuietTimeAudioPage() {
  const [book, setBook] = useState('Psalms');
  const [chapter, setChapter] = useState('23');
  const [version, setVersion] = useState(BIBLE_VERSIONS[1].id); // Default to NIV ID
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [scriptureText, setScriptureText] = useState("Loading the Word...");
  
  // Audio State
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);

  // 1. Logic to fetch the real Audio URL from your API Route
  const fetchSanctuaryAudio = useCallback(async () => {
    setIsLoadingAudio(true);
    setAudioUrl(null); // Clear previous to prevent old audio playing
    try {
      const apiBook = BOOK_MAP[book];
      const res = await fetch(`/api/bible/audio?book=${apiBook}&chapter=${chapter}&versionId=${version}`);
      const data = await res.json();
      
      if (data.url) {
        setAudioUrl(data.url);
      }
    } catch (err) {
      console.error("Sanctuary Error:", err);
    } finally {
      setIsLoadingAudio(false);
    }
  }, [book, chapter, version]);

  // 2. Fetch Scripture Text & Trigger Audio Fetch when selection changes
  useEffect(() => {
    async function fetchScripture() {
      // In production, fetch text here
      setScriptureText("The Lord is my shepherd; I shall not want. He makes me to lie down in green pastures...");
    }
    fetchScripture();
    fetchSanctuaryAudio(); // Fetch new audio link whenever Book/Chapter/Version changes
  }, [book, chapter, version, fetchSanctuaryAudio]);

  return (
    <div className="flex min-h-screen bg-[#f7f9ff]">
      <Sidebar />

      <main className="lg:ml-64 flex-1 px-6 md:px-12 py-12 max-w-5xl mx-auto pb-32">
        
        {/* SELECTOR BAR */}
        <section className="mb-10 bg-white/40 backdrop-blur-md border border-[#c3c8c2]/30 p-4 rounded-3xl flex flex-wrap lg:flex-nowrap items-center gap-4 shadow-sm">
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-[#c3c8c2]/20 flex-1">
            <span className="material-symbols-outlined text-[#4d6054] text-xl">search</span>
            <select 
              value={book} 
              onChange={(e) => setBook(e.target.value)}
              className="bg-transparent text-sm font-bold text-[#4d6054] outline-none w-full appearance-none cursor-pointer"
            >
              {BOOKS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-2xl border border-[#c3c8c2]/20 w-32">
            <span className="text-[10px] font-black text-[#4d6054]/40 uppercase">Ch</span>
            <input 
              type="number" 
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              className="bg-transparent text-sm font-bold text-[#4d6054] w-full outline-none"
            />
          </div>

          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-[#c3c8c2]/20 w-48">
            <span className="material-symbols-outlined text-[#4d6054] text-xl">language</span>
            <select 
              value={version} 
              onChange={(e) => setVersion(e.target.value)}
              className="bg-transparent text-sm font-bold text-[#4d6054] outline-none w-full appearance-none cursor-pointer"
            >
              {BIBLE_VERSIONS.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-2 px-4 border-l border-[#c3c8c2]/30">
            <span className="material-symbols-outlined text-sm text-[#4d6054]">speed</span>
            <select 
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="bg-transparent text-xs font-bold text-[#4d6054] outline-none cursor-pointer"
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
            {/* Loading Overlay */}
            {isLoadingAudio && (
              <div className="absolute inset-0 z-20 bg-white/10 backdrop-blur-sm rounded-[3rem] flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <div className="w-10 h-10 border-4 border-[#4d6054] border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#4d6054]">Preparing Sanctuary...</p>
                </div>
              </div>
            )}
            
            <AudioPlayer
              src={audioUrl || ''} // Pass the dynamic URL
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
                <div className="w-12 h-12 rounded-full border border-[#c3c8c2] bg-white/50 flex items-center justify-center text-[#4d6054] group-hover:bg-[#4d6054] group-hover:text-white transition-all">
                    <span className="material-symbols-outlined text-xl">bookmark</span>
                </div>
                <span className="text-[10px] font-bold text-[#5e5e5b] uppercase tracking-widest">Save Passage</span>
            </button>
          </div>
        </section>

        {/* SCRIPTURE TEXT CARD */}
        <section className="bg-white/70 backdrop-blur-xl border border-white p-8 md:p-16 rounded-[48px] shadow-sm relative transition-all overflow-hidden">
          <div className="absolute top-8 right-12 opacity-5 select-none pointer-events-none">
             <span className="font-serif text-[12rem]">{chapter}</span>
          </div>
          
          <div className="max-w-2xl relative z-10">
            <h2 className="font-serif text-3xl text-[#161c22] mb-8">{book} {chapter}</h2>
            <p className="text-2xl font-serif text-[#434844] leading-[1.9] italic">
              "{scriptureText}"
            </p>
            
            <div className="mt-12 flex gap-4">
              <button className="bg-[#4d6054] text-white px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:shadow-lg transition-all">
                Study Notes
              </button>
              <button className="bg-white border border-[#c3c8c2] text-[#4d6054] px-10 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-[#f7f9ff] transition-all">
                Share Verse
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}