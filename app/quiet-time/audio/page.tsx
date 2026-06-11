'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { AudioPlayer } from '@/components/audio/AudioPlayer';
import Sidebar from '@/app/layout-components/Sidebar';
import { DownloadButton } from '@/components/audio/DownloadButton';
import Image from 'next/image';

// Full Language Configuration Mapping
const BIBLE_VERSIONS = [
  { id: 'de4e12af7f29f59f-01', name: 'KJV', lang: 'English' },
  { id: '06125ad3d5662098-01', name: 'NIV', lang: 'English' },
  { id: 'yor-bm-id', name: 'Bibeli Mimọ', lang: 'Yoruba' },
  { id: 'ibo-izii-id', name: 'Izii', lang: 'Igbo' }
];

// Complete canonical structural reference map for proper API serialization
const BIBLE_STRUCTURE = [
  { name: 'Genesis', id: 'GEN', chapters: 50 },
  { name: 'Exodus', id: 'EXO', chapters: 40 },
  { name: 'Leviticus', id: 'LEV', chapters: 27 },
  { name: 'Numbers', id: 'NUM', chapters: 36 },
  { name: 'Deuteronomy', id: 'DEU', chapters: 34 },
  { name: 'Joshua', id: 'JOS', chapters: 24 },
  { name: 'Judges', id: 'JDG', chapters: 21 },
  { name: 'Ruth', id: 'RTH', chapters: 4 },
  { name: '1 Samuel', id: '1SA', chapters: 31 },
  { name: '2 Samuel', id: '2SA', chapters: 24 },
  { name: '1 Kings', id: '1KI', chapters: 22 },
  { name: '2 Kings', id: '2KI', chapters: 25 },
  { name: '1 Chronicles', id: '1CH', chapters: 29 },
  { name: '2 Chronicles', id: '2CH', chapters: 36 },
  { name: 'Ezra', id: 'EZR', chapters: 10 },
  { name: 'Nehemiah', id: 'NEH', chapters: 13 },
  { name: 'Esther', id: 'EST', chapters: 10 },
  { name: 'Job', id: 'JOB', chapters: 42 },
  { name: 'Psalms', id: 'PSA', chapters: 150 },
  { name: 'Proverbs', id: 'PRO', chapters: 31 },
  { name: 'Ecclesiastes', id: 'ECC', chapters: 12 },
  { name: 'Song of Solomon', id: 'SNG', chapters: 8 },
  { name: 'Isaiah', id: 'ISA', chapters: 66 },
  { name: 'Jeremiah', id: 'JER', chapters: 52 },
  { name: 'Lamentations', id: 'LAM', chapters: 5 },
  { name: 'Ezekiel', id: 'EZR', chapters: 48 },
  { name: 'Daniel', id: 'DAN', chapters: 12 },
  { name: 'Hosea', id: 'HOS', chapters: 14 },
  { name: 'Joel', id: 'JOL', chapters: 3 },
  { name: 'Amos', id: 'AMO', chapters: 9 },
  { name: 'Obadiah', id: 'OBD', chapters: 1 },
  { name: 'Jonah', id: 'JNH', chapters: 4 },
  { name: 'Micah', id: 'MIC', chapters: 7 },
  { name: 'Nahum', id: 'NAM', chapters: 3 },
  { name: 'Habakkuk', id: 'HAB', chapters: 3 },
  { name: 'Zephaniah', id: 'ZEP', chapters: 3 },
  { name: 'Haggai', id: 'HAG', chapters: 2 },
  { name: 'Zechariah', id: 'ZEC', chapters: 14 },
  { name: 'Malachi', id: 'MAL', chapters: 4 },
  { name: 'Matthew', id: 'MAT', chapters: 28 },
  { name: 'Mark', id: 'MRK', chapters: 16 },
  { name: 'Luke', id: 'LUK', chapters: 24 },
  { name: 'John', id: 'JHN', chapters: 21 },
  { name: 'Acts', id: 'ACT', chapters: 28 },
  { name: 'Romans', id: 'ROM', chapters: 16 },
  { name: '1 Corinthians', id: '1CO', chapters: 16 },
  { name: '2 Corinthians', id: '2CO', chapters: 13 },
  { name: 'Galatians', id: 'GAL', chapters: 6 },
  { name: 'Ephesians', id: 'EPH', chapters: 6 },
  { name: 'Philippians', id: 'PHP', chapters: 4 },
  { name: 'Colossians', id: 'COL', chapters: 4 },
  { name: '1 Thessalonians', id: '1TH', chapters: 5 },
  { name: '2 Thessalonians', id: '2TH', chapters: 3 },
  { name: '1 Timothy', id: '1TIM', chapters: 6 },
  { name: '2 Timothy', id: '2TIM', chapters: 4 },
  { name: 'Titus', id: 'TIT', chapters: 3 },
  { name: 'Philemon', id: 'PHM', chapters: 1 },
  { name: 'Hebrews', id: 'HEB', chapters: 13 },
  { name: 'James', id: 'JAS', chapters: 5 },
  { name: '1 Peter', id: '1PE', chapters: 5 },
  { name: '2 Peter', id: '2PE', chapters: 3 },
  { name: '1 John', id: '1JN', chapters: 5 },
  { name: '2 John', id: '2JN', chapters: 1 },
  { name: '3 John', id: '3JN', chapters: 1 },
  { name: 'Jude', 'id': 'JUD', chapters: 1 },
  { name: 'Revelation', id: 'REV', chapters: 22 }
];

interface VerseLine {
  number: number;
  text: string;
}

export default function QuietTimeAudioPage() {
  const [book, setBook] = useState('Psalms');
  const [chapter, setChapter] = useState(23);
  const [version, setVersion] = useState(BIBLE_VERSIONS[0].id);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  // Real dynamic verse line array state mapping
  const [verses, setVerses] = useState<VerseLine[]>([]);
  const [isLoadingText, setIsLoadingText] = useState(false);
  
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isLoadingNote, setIsLoadingNote] = useState(false);

  const passageReference = `${book} ${chapter}`;
  const selectedBookData = BIBLE_STRUCTURE.find(b => b.name === book) || BIBLE_STRUCTURE[18];

  // Fetch real-time audio route configurations
  const fetchSanctuaryAudio = useCallback(async () => {
    setIsLoadingAudio(true);
    setAudioUrl(null); 
    try {
      const res = await fetch(`/api/bible/audio?book=${selectedBookData.id}&chapter=${chapter}&versionId=${version}`);
      const data = await res.json();
      if (data.url) setAudioUrl(data.url);
    } catch (err) {
      console.error("Sanctuary Audio Engine failure:", err);
    } finally {
      setIsLoadingAudio(false);
    }
  }, [selectedBookData, chapter, version]);

  // Combined tracking effect dependencies updates text + journal syncs cleanly
  useEffect(() => {
    async function fetchScriptureText() {
      setIsLoadingText(true);
      try {
        // Calling public REST API mapping engine layers directly
        const res = await fetch(`https://bible-api.com/${book}+${chapter}?translation=kjv`);
        if (res.ok) {
          const data = await res.json();
          const parsedVerses = data.verses.map((v: any) => ({
            number: v.verse,
            text: v.text.trim()
          }));
          setVerses(parsedVerses);
        }
      } catch (err) {
        console.error("Failed to collect text layout nodes:", err);
      } finally {
        setIsLoadingText(false);
      }
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

    fetchScriptureText();
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
      {/* Background Image Elements */}
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

      {/* Ambient Pulsing Glow Filters */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-amber-200/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-amber-300/8 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '-3s' }} />
      </div>

      <Sidebar />

      <main className="relative z-10 lg:ml-56 flex-1 px-4 md:px-10 py-8 max-w-5xl mx-auto pb-20 w-full">
        
        {/* Dynamic Selector Bar Section */}
        <section className="mb-8 bg-white/40 backdrop-blur-xl border border-white/60 p-3 rounded-xl flex flex-wrap md:flex-nowrap items-center gap-3 shadow-lg">
          
          {/* Complete Scripture Book Dropdown Selector */}
          <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-lg border border-white/60 flex-1 min-w-[140px]">
            <span className="material-symbols-outlined text-amber-600 text-[16px]">menu_book</span>
            <select 
              value={book} 
              onChange={(e) => {
                setBook(e.target.value);
                setChapter(1); // Auto reset chapter to 1 when shifting books safely
              }}
              className="bg-transparent text-xs font-sans font-semibold text-gray-800 outline-none w-full appearance-none cursor-pointer"
            >
              {BIBLE_STRUCTURE.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
            </select>
          </div>

          {/* Scaled Chapter Input Sync Dropdown */}
          <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-lg border border-white/60 w-full md:w-32">
            <span className="text-[8px] font-sans font-black text-amber-600 uppercase">Chapter</span>
            <select 
              value={chapter}
              onChange={(e) => setChapter(Number(e.target.value))}
              className="bg-transparent text-xs font-sans font-semibold text-gray-800 outline-none w-full appearance-none cursor-pointer"
            >
              {Array.from({ length: selectedBookData.chapters }, (_, idx) => (
                <option key={idx + 1} value={idx + 1}>{idx + 1}</option>
              ))}
            </select>
          </div>

          {/* Language Version Dropdown Selection */}
          <div className="flex items-center gap-2 bg-white/50 px-3 py-1.5 rounded-lg border border-white/60 flex-1 min-w-[120px]">
            <span className="material-symbols-outlined text-amber-600 text-[16px]">language</span>
            <select 
              value={version} 
              onChange={(e) => setVersion(e.target.value)}
              className="bg-transparent text-xs font-sans font-semibold text-gray-800 outline-none w-full appearance-none cursor-pointer"
            >
              {BIBLE_VERSIONS.map(v => <option key={v.id} value={v.id}>{v.name} ({v.lang})</option>)}
            </select>
          </div>

          {/* Audio Playback Speed Modifier */}
          <div className="flex items-center gap-1 px-2 border-l border-gray-200/80">
            <span className="material-symbols-outlined text-amber-600 text-[14px]">speed</span>
            <select 
              value={playbackSpeed}
              onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
              className="bg-transparent text-[10px] font-sans font-bold text-gray-700 outline-none cursor-pointer"
            >
              <option value={0.8}>0.8x</option>
              <option value={1}>1.0x</option>
              <option value={1.2}>1.2x</option>
              <option value={1.5}>1.5x</option>
            </select>
          </div>
        </section>

        {/* Media Control Card Section */}
        <section className="mb-12 flex flex-col items-center">
          <div className="relative w-full max-w-3xl">
            {isLoadingAudio && (
              <div className="absolute inset-0 z-20 bg-white/60 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-[8px] font-sans font-black uppercase tracking-wider text-gray-600">Preparing Sanctuary Audio...</p>
                </div>
              </div>
            )}
            
            <AudioPlayer
              src={audioUrl || ''} 
              title={book}
              book={book}
              chapter={chapter}
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

        {/* Re-modeled Interactive Line Scripture Reader Card Section */}
        <section className="bg-white/40 backdrop-blur-xl border border-white/60 p-6 md:p-10 rounded-2xl shadow-xl relative overflow-hidden">
          <div className="absolute top-4 right-6 opacity-5 select-none pointer-events-none">
             <span className="text-[7rem] font-black text-gray-800">{chapter}</span>
          </div>
          
          <div className="relative z-10 w-full">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-px bg-amber-400/40" />
              <span className="text-[8px] font-black text-amber-600 uppercase tracking-wider">Scripture Study Sanctuary</span>
            </div>
            
            <h2 className="text-2xl font-serif font-bold text-gray-800 mb-6">{book} {chapter}</h2>
            
            {isLoadingText ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2 text-gray-400 font-serif italic text-xs">
                <div className="w-5 h-5 border border-amber-600 border-t-transparent rounded-full animate-spin mb-1"/>
                Unrolling scripture text...
              </div>
            ) : (
              // Renders line-by-line verses matching AudioVerse system behavior
              <div className="space-y-4 font-serif text-lg md:text-xl text-gray-700 leading-relaxed selection:bg-amber-100">
                {verses.map((v) => (
                  <div 
                    key={v.number} 
                    className="p-2 rounded-xl transition-all hover:bg-white/30 flex items-start gap-3 group"
                  >
                    <span className="text-xs font-sans font-black text-amber-600/50 mt-1.5 select-none min-w-[20px] text-right">
                      {v.number}
                    </span>
                    <p className="flex-1 text-slate-800 transition-colors">
                      {v.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
            
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
                  <p className="text-[9px] text-gray-600 italic line-clamp-2">
                    {verses.length > 0 ? `"${verses[0].text}..."` : '"Reading active scripture scrolls..."'}
                  </p>
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