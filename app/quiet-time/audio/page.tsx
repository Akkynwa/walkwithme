'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AudioPlayer } from '@/components/audio/AudioPlayer';
import Sidebar from '@/app/layout-components/Sidebar';
import { DownloadButton } from '@/components/audio/DownloadButton';
import Image from 'next/image';

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
  
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isLoadingNote, setIsLoadingNote] = useState(false);

  const passageReference = `${book} ${chapter}`;

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

  useEffect(() => {
    async function fetchScripture() {
      setScriptureText("The Lord is my shepherd; I shall not want. He makes me to lie down in green pastures...");
    }
    
    async function fetchJournalContext() {
      setIsLoadingNote(true);
      try {
        const res = await fetch(`/api/journal?reference=${encodeURIComponent(passageReference)}&type=quiet_time`);
        const data = await res.json();
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

  const saveStudyNotes = async () => {
    setIsSavingNote(true);
    try {
      const res = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reference: passageReference,
          type: 'quiet_time',
          content: noteContent,
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
    <div className="relative flex min-h-screen overflow-x-hidden">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=2070"
          alt="Peaceful sanctuary background"
          fill
          className="object-cover scale-110 blur-xl opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/30"></div>
      </div>

      {/* Subtle Animated Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-amber-200/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-amber-300/8 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '-3s' }} />
      </div>

      <Sidebar />

      <main className="relative z-10 lg:ml-56 flex-1 px-6 md:px-10 py-8 max-w-5xl mx-auto pb-20">
        
        {/* Selector Bar */}
        <section className="mb-8 bg-white/40 backdrop-blur-xl border border-white/60 p-3 rounded-xl flex flex-wrap lg:flex-nowrap items-center gap-3 shadow-lg">
          <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-lg border border-white/60 flex-1">
            <span className="material-symbols-outlined text-amber-600 text-[16px]">menu_book</span>
            <select 
              value={book} 
              onChange={(e) => setBook(e.target.value)}
              className="bg-transparent text-xs font-sans font-semibold text-gray-800 outline-none w-full appearance-none cursor-pointer"
            >
              {BOOKS.map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1 bg-white/50 px-3 py-1.5 rounded-lg border border-white/60 w-28">
            <span className="text-[8px] font-sans font-black text-amber-600 uppercase">Ch</span>
            <input 
              type="number" 
              value={chapter}
              onChange={(e) => setChapter(e.target.value)}
              className="bg-transparent text-xs font-sans font-semibold text-gray-800 w-full outline-none"
            />
          </div>

          <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-lg border border-white/60 flex-1">
            <span className="material-symbols-outlined text-amber-600 text-[16px]">language</span>
            <select 
              value={version} 
              onChange={(e) => setVersion(e.target.value)}
              className="bg-transparent text-xs font-sans font-semibold text-gray-800 outline-none w-full appearance-none cursor-pointer"
            >
              {BIBLE_VERSIONS.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
            </select>
          </div>

          <div className="flex items-center gap-1 px-2 border-l border-gray-200">
            <span className="material-symbols-outlined text-amber-600 text-[14px]">speed</span>
            <select 
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="bg-transparent text-[10px] font-sans font-bold text-gray-700 outline-none cursor-pointer"
            >
              <option value={0.8}>0.8x</option>
              <option value={1}>1.0x</option>
              <option value={1.2}>1.2x</option>
            </select>
          </div>
        </section>

        {/* Hero Audio Player */}
        <section className="mb-12 flex flex-col items-center">
          <div className="relative w-full max-w-3xl">
            {isLoadingAudio && (
              <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-[8px] font-sans font-black uppercase tracking-wider text-gray-600">Preparing Sanctuary...</p>
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
          
          <div className="mt-6 flex gap-6">
            {audioUrl && <DownloadButton audioUrl={audioUrl} title={`${book}_${chapter}`} />}
            <button className="group flex flex-col items-center gap-1 transition-all">
              <div className="w-10 h-10 rounded-full border border-gray-300 bg-white/60 flex items-center justify-center text-gray-600 group-hover:bg-amber-600 group-hover:text-white group-hover:border-amber-600 transition-all shadow-sm">
                <span className="material-symbols-outlined text-[18px]">bookmark_border</span>
              </div>
              <span className="text-[8px] font-sans font-bold text-gray-500 uppercase tracking-wider">Save</span>
            </button>
          </div>
        </section>

        {/* Scripture Text Card */}
        <section className="bg-white/40 backdrop-blur-xl border border-white/60 p-8 md:p-12 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="absolute top-6 right-8 opacity-5 select-none pointer-events-none">
             <span className="text-[8rem] font-black text-gray-800">{chapter}</span>
          </div>
          
          <div className="max-w-2xl relative z-10">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-px bg-amber-400/40" />
              <span className="text-[8px] font-black text-amber-600 uppercase tracking-wider">Scripture Reading</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">{book} {chapter}</h2>
            <p className="text-xl text-gray-700 leading-relaxed italic">
              "{scriptureText}"
            </p>
            
            <div className="mt-10 flex gap-4">
              <button 
                onClick={() => setIsNotesOpen(true)}
                className="bg-gradient-to-r from-amber-600 to-amber-700 text-white px-8 py-3 rounded-lg text-[9px] font-sans font-black uppercase tracking-wider hover:shadow-lg hover:shadow-amber-500/25 transition-all"
              >
                Study Notes
              </button>
              <button className="bg-white/50 border border-gray-200 text-gray-700 px-8 py-3 rounded-lg text-[9px] font-sans font-black uppercase tracking-wider hover:bg-white/80 transition-all">
                Share Verse
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Slide-out Panel for Journal Notes */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-md bg-white/95 backdrop-blur-xl border-l border-white/60 shadow-2xl z-50 transition-transform duration-500 ease-out ${isNotesOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col p-6 justify-between">
          
          <div>
            <div className="flex justify-between items-center mb-5 pb-4 border-b border-gray-200">
              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span className="material-symbols-outlined text-amber-500 text-[14px]">edit_note</span>
                  <span className="text-[7px] font-sans font-black uppercase tracking-wider text-amber-600">Journal Sync</span>
                </div>
                <h3 className="text-lg font-serif font-bold text-gray-800">{book} {chapter} Notes</h3>
              </div>
              <button 
                onClick={() => setIsNotesOpen(false)}
                className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            </div>

            <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 mb-5 relative min-h-[70px]">
              {isLoadingNote ? (
                <div className="flex items-center gap-2 justify-center py-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-[8px] font-sans font-bold uppercase tracking-wider text-gray-500">Syncing Journal...</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="material-symbols-outlined text-amber-500 text-[10px]">menu_book</span>
                    <h4 className="text-[7px] font-sans font-black uppercase tracking-wider text-amber-700">Passage Context</h4>
                  </div>
                  <p className="text-[9px] text-gray-600 italic line-clamp-2">"{scriptureText}"</p>
                </>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-500 text-[12px]">notes</span>
                <label className="text-[7px] font-sans font-black uppercase tracking-wider text-gray-500">Reflections & Insights</label>
              </div>
              <textarea 
                value={noteContent}
                disabled={isLoadingNote}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder={isLoadingNote ? "Waiting for journal sync..." : "Record structural insights or revelation notes here..."}
                className="w-full h-56 p-3 rounded-xl bg-white/50 border border-gray-200 text-xs text-gray-700 outline-none font-sans focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all resize-none leading-relaxed disabled:opacity-50 placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200 flex items-center justify-between">
            <span className="text-[8px] font-sans text-gray-400 italic">
              {noteContent.length > 0 ? `${noteContent.length} characters logged` : 'Empty sheet'}
            </span>
            <button 
              onClick={saveStudyNotes}
              disabled={isSavingNote || isLoadingNote}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white font-sans font-black text-[8px] tracking-wider uppercase rounded-lg transition-all disabled:opacity-50 flex items-center gap-2 shadow-md hover:shadow-lg hover:scale-[1.02]"
            >
              {isSavingNote ? (
                <>
                  <div className="w-2.5 h-2.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Syncing...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[12px]">save</span>
                  Save Entry
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}