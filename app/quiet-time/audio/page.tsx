'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from '@/app/layout-components/Sidebar';
import { DownloadButton } from '@/components/audio/DownloadButton';
import { useTheme } from '../../context/ThemeContext';

const BIBLE_VERSIONS = [
  { id: 'de4e12af7f29f59f-01', name: 'KJV', lang: 'English' },
  { id: '06125ad3d5662098-01', name: 'NIV', lang: 'English' },
  { id: 'yor-bm-id', name: 'Bibeli Mimọ', lang: 'Yoruba' },
  { id: 'ibo-izii-id', name: 'Izii', lang: 'Igbo' }
];

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
  { name: 'Ezekiel', id: 'EZK', chapters: 48 }, 
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
  { name: 'Jude', id: 'JUD', chapters: 1 },
  { name: 'Revelation', id: 'REV', chapters: 22 }
];

interface VerseLine {
  number: number;
  text: string;
}

export default function QuietTimeAudioPage() {
  const { isDark } = useTheme();
  
  const [book, setBook] = useState('Psalms');
  const [chapter, setChapter] = useState(23);
  const [version, setVersion] = useState(BIBLE_VERSIONS[0].id);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  
  const [verses, setVerses] = useState<VerseLine[]>([]);
  const [isLoadingText, setIsLoadingText] = useState(false);
  
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoadingAudio, setIsLoadingAudio] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const [isNotesOpen, setIsNotesOpen] = useState(false);
  const [noteContent, setNoteContent] = useState('');
  const [isSavingNote, setIsSavingNote] = useState(false);
  const [isLoadingNote, setIsLoadingNote] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const passageReference = `${book} ${chapter}`;
  const selectedBookData = BIBLE_STRUCTURE.find(b => b.name === book) || BIBLE_STRUCTURE[18];

  const fetchSanctuaryAudio = useCallback(async () => {
    setIsLoadingAudio(true);
    setAudioUrl(null); 
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);

    try {
      const res = await fetch(`/api/bible/audio?book=${selectedBookData.id}&chapter=${chapter}&versionId=${version}`);
      const data = await res.json();
      if (data.url) setAudioUrl(data.url);
    } catch (err) {
      console.error("Audio failure:", err);
    } finally {
      setIsLoadingAudio(false);
    }
  }, [selectedBookData, chapter, version]);

  useEffect(() => {
    async function fetchScriptureText() {
      setIsLoadingText(true);
      try {
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
        console.error("Text engine drop:", err);
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
        console.error("Journal pipeline query error:", err);
      } finally {
        setIsLoadingNote(false);
      }
    }

    fetchScriptureText();
    fetchSanctuaryAudio();
    fetchJournalContext();
  }, [book, chapter, version, passageReference, fetchSanctuaryAudio]);

  // Sync speed changes to the audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const togglePlay = () => {
    if (!audioRef.current || !audioUrl) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.error("Error playing audio:", err);
      });
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

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
      console.error("Journal commit trace error:", err);
    } finally {
      setIsSavingNote(false);
    }
  };

  return (
    <div className={`flex min-h-screen antialiased selection:bg-orange-100 dark:selection:bg-orange-950/50 ${
      isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'
    }`}>
      
      <Sidebar />

      {/* Main viewport frame safely pushing below global header space */}
      <main className="lg:ml-56 flex-1 pt-16 md:pt-20 grid grid-cols-1 md:grid-cols-2 h-screen overflow-hidden box-border">
        
        {/* LEFT COMPARTMENT: Configuration & Audio Controller */}
        <div className={`flex flex-col items-center justify-start p-6 md:p-8 border-b md:border-b-0 md:border-r overflow-y-auto space-y-6 w-full ${
          isDark ? 'border-zinc-900 bg-zinc-950' : 'border-zinc-100 bg-zinc-50/40'
        }`}>
          
          <div className="w-full max-w-sm flex flex-col items-center space-y-6 mt-2">
            
            {/* Centered Hero Context Header */}
            <div className="w-full text-center px-1">
              <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100 font-sans">
                Audio Sanctuary
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-2 font-medium leading-relaxed max-w-xs mx-auto">
                Stream scripture, configure translations, and synchronize your devotions.
              </p>
            </div>
            
            {/* Selection Panel */}
            <div className={`w-full p-4 border rounded-2xl space-y-4 shadow-sm ${
              isDark ? 'bg-zinc-900/50 border-zinc-900' : 'bg-white border-zinc-200'
            }`}>
              <div className="grid grid-cols-2 gap-3">
                {/* Book Picker */}
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border relative ${
                  isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                }`}>
                  <span className="material-symbols-outlined text-orange-600 dark:text-orange-500 text-[16px] shrink-0">menu_book</span>
                  <select 
                    value={book} 
                    onChange={(e) => {
                      setBook(e.target.value);
                      setChapter(1);
                    }}
                    className="bg-transparent text-xs font-sans font-medium text-zinc-800 dark:text-zinc-200 outline-none w-full appearance-none cursor-pointer"
                  >
                    {BIBLE_STRUCTURE.map(b => (
                      <option key={b.id} value={b.name} className={isDark ? 'bg-zinc-900' : 'bg-white'}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Chapter Picker */}
                <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border relative ${
                  isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                }`}>
                  <span className="text-[10px] font-sans font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider shrink-0">Ch</span>
                  <select 
                    value={chapter}
                    onChange={(e) => setChapter(Number(e.target.value))}
                    className="bg-transparent text-xs font-sans font-medium text-zinc-800 dark:text-zinc-200 outline-none w-full appearance-none cursor-pointer"
                  >
                    {Array.from({ length: selectedBookData.chapters }, (_, idx) => (
                      <option key={idx + 1} value={idx + 1} className={isDark ? 'bg-zinc-900' : 'bg-white'}>
                        {idx + 1}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Version Picker */}
              <div className={`flex items-center gap-2 px-3 py-2 rounded-xl border relative w-full ${
                isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
              }`}>
                <span className="material-symbols-outlined text-orange-600 dark:text-orange-500 text-[16px] shrink-0">language</span>
                <select 
                  value={version} 
                  onChange={(e) => setVersion(e.target.value)}
                  className="bg-transparent text-xs font-sans font-medium text-zinc-800 dark:text-zinc-200 outline-none w-full appearance-none cursor-pointer"
                >
                  {BIBLE_VERSIONS.map(v => (
                    <option key={v.id} value={v.id} className={isDark ? 'bg-zinc-900' : 'bg-white'}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>

              {/* Playback Speed Controller */}
              <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800/60">
                <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[16px]">speed</span> Playback Pace
                </span>
                <select 
                  value={playbackSpeed}
                  onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                  className="bg-transparent text-xs font-sans font-medium text-zinc-600 dark:text-zinc-400 outline-none cursor-pointer"
                >
                  <option value={0.8} className={isDark ? 'bg-zinc-900' : 'bg-white'}>0.8x pace</option>
                  <option value={1} className={isDark ? 'bg-zinc-900' : 'bg-white'}>1.0x normal</option>
                  <option value={1.2} className={isDark ? 'bg-zinc-900' : 'bg-white'}>1.2x swift</option>
                  <option value={1.5} className={isDark ? 'bg-zinc-900' : 'bg-white'}>1.5x accelerated</option>
                </select>
              </div>
            </div>

            {/* MINIMAL FUNCTIONAL AUDIO PLAYER */}
            <div className={`w-full p-6 border rounded-2xl flex flex-col items-center space-y-4 shadow-sm ${
              isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'
            }`}>
              {/* Native HTML5 Audio Tag (Hidden) */}
              {audioUrl && (
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
                  onLoadedMetadata={() => {
                    if (audioRef.current) {
                      setDuration(audioRef.current.duration);
                      audioRef.current.playbackRate = playbackSpeed;
                    }
                  }}
                  onEnded={() => setIsPlaying(false)}
                />
              )}

              <div className="text-center">
                <p className="text-xs font-semibold text-orange-600 dark:text-orange-500 uppercase tracking-widest mb-1">Now Playing</p>
                <h3 className="text-lg font-bold text-zinc-900 dark:text-zinc-100">{book} {chapter}</h3>
              </div>

              {/* Progress Slider */}
              <div className="w-full space-y-1">
                <input 
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  disabled={!audioUrl || isLoadingAudio}
                  className="w-full h-1 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Functional Play/Pause Button */}
              <button 
                onClick={togglePlay}
                disabled={isLoadingAudio || !audioUrl}
                className="w-16 h-16 rounded-full bg-orange-600 hover:bg-orange-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-800 text-white flex items-center justify-center shadow-lg transition-transform hover:scale-105 active:scale-95 disabled:scale-100 cursor-pointer"
              >
                {isLoadingAudio ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="material-symbols-outlined text-[32px] ml-0.5">
                    {isPlaying ? 'pause' : 'play_arrow'}
                  </span>
                )}
              </button>

              <p className="text-xs text-zinc-400 dark:text-zinc-500">
                {isLoadingAudio ? 'Loading audio stream...' : audioUrl ? (isPlaying ? 'Playing...' : 'Paused') : 'Audio stream unavailable'}
              </p>
            </div>

            {/* Downstream Actions */}
            <div className="flex flex-col gap-2 w-full">
              {audioUrl && <DownloadButton audioUrl={audioUrl} title={`${book}_${chapter}`} />}
              <button className={`flex items-center justify-center gap-2 py-2 border rounded-xl text-xs font-medium shadow-sm transition-colors w-full ${
                isDark 
                  ? 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200' 
                  : 'bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900'
              }`}>
                <span className="material-symbols-outlined text-[16px]">bookmark_border</span>
                <span>Bookmark Position</span>
              </button>
            </div>

          </div>
        </div>

        {/* RIGHT COMPARTMENT: Scripture Text Engine */}
        <div className="flex flex-col h-full overflow-y-auto p-6 md:p-8">
          <div className="w-full max-w-2xl mx-auto pb-28">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                {book} <span className="text-orange-600 dark:text-orange-500 font-light">{chapter}</span>
              </h2>
            </div>
            
            {isLoadingText ? (
              <div className="py-32 flex flex-col items-center justify-center gap-2 text-zinc-400 dark:text-zinc-500 text-xs">
                <div className="w-5 h-5 border-2 border-orange-600 dark:border-orange-500 border-t-transparent rounded-full animate-spin mb-2"/>
                Streaming text...
              </div>
            ) : (
              <div className="space-y-4 text-[15px] text-zinc-800 dark:text-zinc-200 leading-relaxed">
                {verses.map((v) => (
                  <div 
                    key={v.number} 
                    className={`p-2.5 rounded-xl transition-colors flex items-start gap-4 ${
                      isDark ? 'hover:bg-zinc-900/40' : 'hover:bg-zinc-100/50'
                    }`}
                  >
                    <span className="text-xs font-bold text-orange-600/60 dark:text-orange-500/50 mt-1 select-none min-w-[20px] text-right">
                      {v.number}
                    </span>
                    <p className="flex-1 text-zinc-700 dark:text-zinc-300">
                      {v.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
            
            <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800/80 flex gap-3 justify-center">
              <button 
                onClick={() => setIsNotesOpen(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white px-5 py-2 rounded-xl text-xs font-medium shadow-sm transition-colors flex items-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">edit_note</span> Open Study Journal
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Slide-out Journal Panel */}
      <div className={`fixed inset-y-0 right-0 w-full max-w-md border-l z-50 transition-transform duration-300 ease-out flex flex-col ${
        isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
      } ${isNotesOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        <div className="h-full flex flex-col p-6 justify-between overflow-y-auto pt-20">
          <div>
            <div className="flex justify-between items-center mb-5 pb-4 border-b border-zinc-100 dark:border-zinc-800">
              <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                  <span className="material-symbols-outlined text-orange-600 dark:text-orange-500 text-[16px]">edit_note</span>
                  <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-orange-600 dark:text-orange-500">
                    Journal Sync
                  </span>
                </div>
                <h3 className="text-base font-sans font-semibold text-zinc-900 dark:text-zinc-100">
                  {book} {chapter} Insights
                </h3>
              </div>
              
              <button 
                onClick={() => setIsNotesOpen(false)}
                className={`w-8 h-8 rounded-lg border flex items-center justify-center transition-colors ${
                  isDark ? 'border-zinc-800 text-zinc-500 hover:text-zinc-300' : 'border-zinc-200 text-zinc-400 hover:text-zinc-600'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            </div>

            <div className="flex flex-col gap-2">
              <textarea 
                value={noteContent}
                disabled={isLoadingNote}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder={isLoadingNote ? "Waiting for journal sync..." : "Record revelation notes here..."}
                className={`w-full h-80 p-3 rounded-xl text-xs font-sans outline-none border transition-all resize-none leading-relaxed disabled:opacity-50 ${
                  isDark 
                    ? 'bg-zinc-950 border-zinc-800 text-zinc-200 placeholder:text-zinc-700 focus:border-zinc-700' 
                    : 'bg-white border-zinc-200 text-zinc-800 placeholder:text-zinc-300 focus:border-zinc-300'
                }`}
              />
            </div>
          </div>

          <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between mt-6">
            <span className="text-xs font-sans text-zinc-400 dark:text-zinc-500">
              {noteContent.length} characters
            </span>
            
            <button 
              onClick={saveStudyNotes}
              disabled={isSavingNote || isLoadingNote}
              className="px-5 py-2 bg-orange-600 hover:bg-orange-700 disabled:bg-zinc-100 dark:disabled:bg-zinc-800 text-white disabled:text-zinc-400 dark:disabled:text-zinc-600 rounded-full font-sans font-medium text-xs transition-colors flex items-center gap-2"
            >
              {isSavingNote ? (
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span className="material-symbols-outlined text-[14px]">save</span>
                  <span>Save Entry</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}