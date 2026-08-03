'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../context/ThemeContext';

const BIBLE_BOOKS = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy', 'Joshua', 'Judges', 'Ruth',
  '1 Samuel', '2 Samuel', '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles', 'Ezra',
  'Nehemiah', 'Esther', 'Job', 'Psalms', 'Proverbs', 'Ecclesiastes', 'Song of Solomon',
  'Isaiah', 'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea', 'Joel', 'Amos',
  'Obadiah', 'Jonah', 'Micah', 'Nahum', 'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah',
  'Malachi', 'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians',
  '2 Corinthians', 'Galatians', 'Ephesians', 'Philippians', 'Colossians',
  '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy', 'Titus', 'Philemon',
  'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation'
];

interface VerseItem {
  verse: number;
  text: string;
}

interface ScriptureResponse {
  reference: string;
  verses: VerseItem[];
  text: string;
  translation_name: string;
}

export default function QuietTimeReadingPage() {
  const router = useRouter();
  const { isDark } = useTheme();

  // Navigation & Scripture State
  const [selectedBook, setSelectedBook] = useState('John');
  const [selectedChapter, setSelectedChapter] = useState(15);
  const [scripture, setScripture] = useState<ScriptureResponse | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [apiError, setApiError] = useState<string | null>(null);

  // Journal Drawer State
  const [note, setNote] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isAnonymousShare, setIsAnonymousShare] = useState(false);

  // Fetch scripture passage
  const loadPassage = useCallback(async (book: string, chapter: number) => {
    setIsFetching(true);
    setApiError(null);
    try {
      const res = await fetch(
        `https://bible-api.com/${encodeURIComponent(book)}+${chapter}?translation=web`
      );
      if (!res.ok) throw new Error('Could not fetch passage');
      const data: ScriptureResponse = await res.json();
      setScripture(data);
    } catch (err) {
      console.error('Scripture fetch error:', err);
      setApiError('Unable to load scripture passage. Please check your connection.');
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    loadPassage(selectedBook, selectedChapter);
  }, [selectedBook, selectedChapter, loadPassage]);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsJournalOpen(false);
        return;
      }

      const activeTag = document.activeElement?.tagName;
      if (activeTag === 'TEXTAREA' || activeTag === 'INPUT') return;

      if (e.key === 'ArrowRight') {
        setSelectedChapter((prev) => prev + 1);
      } else if (e.key === 'ArrowLeft') {
        setSelectedChapter((prev) => Math.max(1, prev - 1));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Hydrate local note
  useEffect(() => {
    const saved = localStorage.getItem('sanctuary_pending_note');
    if (saved) setNote(saved);
  }, []);

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setNote(val);
    localStorage.setItem('sanctuary_pending_note', val);
  };

  const handleArchiveAndPublish = async () => {
    const clean = note.trim();
    if (!clean) return;

    setIsSyncing(true);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/community/revelations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book: selectedBook,
          chapter: selectedChapter,
          content: clean,
          note: clean,
          reflection: clean,
          isPublic: true,
          isAnonymous: isAnonymousShare,
        }),
      });

      if (!res.ok) throw new Error('Sync failed');

      setShowToast(true);
      setNote('');
      localStorage.removeItem('sanctuary_pending_note');

      setTimeout(() => {
        setShowToast(false);
        setIsJournalOpen(false);
      }, 2000);
    } catch (err) {
      setErrorMessage('Could not publish revelation. Local copy retained.');
    } finally {
      setIsSyncing(false);
    }
  };

  const goToBiblePage = () => {
    router.push(`/bible?book=${encodeURIComponent(selectedBook)}&chapter=${selectedChapter}`);
  };

  return (
    <div
      className={`relative min-h-[calc(100vh-4rem)] flex flex-col antialiased transition-colors duration-300 ${
        isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-stone-50 text-zinc-900'
      }`}
    >
      {/* 1. Main Reader Viewport (pushed further down with pt-20 sm:pt-28) */}
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pt-20 sm:pt-28 pb-32 flex flex-col items-center">
        
        {/* Book & Chapter Selector Box */}
        <div
          className={`w-full mb-6 p-2.5 sm:p-3 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-xs shadow-xs ${
            isDark ? 'bg-zinc-900/80 border-zinc-800' : 'bg-white border-stone-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500">
              Book:
            </span>
            <div className="relative">
              <select
                value={selectedBook}
                onChange={(e) => {
                  setSelectedBook(e.target.value);
                  setSelectedChapter(1);
                }}
                className={`appearance-none text-xs font-bold pl-2.5 pr-6 py-1 rounded-lg border outline-none cursor-pointer ${
                  isDark
                    ? 'bg-zinc-950 border-zinc-700 text-zinc-100 focus:border-orange-500'
                    : 'bg-stone-50 border-stone-300 text-zinc-900 focus:border-orange-500'
                }`}
              >
                {BIBLE_BOOKS.map((b) => (
                  <option
                    key={b}
                    value={b}
                    className={isDark ? 'bg-zinc-900 text-zinc-100' : 'bg-white text-zinc-900'}
                  >
                    {b}
                  </option>
                ))}
              </select>
              <span className="material-symbols-outlined text-[16px] pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-orange-500">
                arrow_drop_down
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-500">
              Chapter:
            </span>
            <div className="flex items-center gap-1">
              <button
                disabled={selectedChapter <= 1}
                onClick={() => setSelectedChapter((prev) => Math.max(1, prev - 1))}
                className={`p-1 rounded-md border disabled:opacity-30 hover:border-orange-500 transition-colors ${
                  isDark ? 'bg-zinc-950 border-zinc-700' : 'bg-stone-50 border-stone-300'
                }`}
                title="Previous Chapter"
              >
                <span className="material-symbols-outlined text-[14px]">chevron_left</span>
              </button>

              <span className="text-xs font-mono font-bold px-1.5">
                {selectedChapter}
              </span>

              <button
                onClick={() => setSelectedChapter((prev) => prev + 1)}
                className={`p-1 rounded-md border hover:border-orange-500 transition-colors ${
                  isDark ? 'bg-zinc-950 border-zinc-700' : 'bg-stone-50 border-stone-300'
                }`}
                title="Next Chapter"
              >
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Scaled Passage Heading */}
        <div className="w-full mb-6 border-b pb-4 border-stone-200/80 dark:border-zinc-800/80 flex items-end justify-between">
          <div>
            <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-orange-500 block mb-0.5">
              Quiet Time Reading
            </span>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold tracking-tight">
              {selectedBook} {selectedChapter}
            </h1>
          </div>

          <span className="text-[10px] text-zinc-400 font-medium">
            {scripture?.translation_name || 'World English Bible'}
          </span>
        </div>

        {/* Passage Text */}
        <div className="w-full">
          {isFetching ? (
            <div className="h-48 flex flex-col items-center justify-center gap-2 text-zinc-400">
              <div className="w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <span className="text-[10px] uppercase tracking-widest font-sans">Fetching Scripture...</span>
            </div>
          ) : apiError ? (
            <div className="p-6 text-center space-y-3">
              <p className="text-xs text-red-500">{apiError}</p>
              <button
                onClick={() => loadPassage(selectedBook, selectedChapter)}
                className="px-3 py-1 text-[11px] bg-orange-600 text-white rounded-md"
              >
                Retry
              </button>
            </div>
          ) : (
            <article className="font-serif leading-relaxed text-base sm:text-lg space-y-4">
              {scripture?.verses?.map((v) => (
                <span key={v.verse} className="inline hover:bg-orange-500/10 transition-colors rounded px-0.5">
                  <sup className="text-orange-500 font-sans font-bold text-[10px] mr-1 select-none">
                    {v.verse}
                  </sup>
                  <span className={isDark ? 'text-zinc-200' : 'text-zinc-800'}>{v.text} </span>
                </span>
              ))}
            </article>
          )}
        </div>
      </main>

      {/* 2. Floating Action Controls (Right-aligned) */}
      <div className="fixed right-5 bottom-16 sm:bottom-20 z-40 flex flex-col items-end gap-2.5">
        
        {/* Deep Study Button */}
        <button
          onClick={goToBiblePage}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-orange-600 hover:bg-orange-500 text-white transition-all shadow-md active:scale-95"
        >
          <span className="material-symbols-outlined text-[13px]">menu_book</span>
          <span>Deep Study</span>
          <span className="material-symbols-outlined text-[11px]">open_in_new</span>
        </button>

        {/* Main Journal Button */}
        <button
          onClick={() => setIsJournalOpen(true)}
          className="group outline-none"
        >
          <div
            className={`flex items-center gap-2 border px-3.5 py-2 rounded-full shadow-xl transition-all ${
              isDark
                ? 'bg-zinc-900 border-zinc-700 text-zinc-100 hover:border-orange-500'
                : 'bg-white border-stone-200 text-zinc-900 hover:border-orange-500 shadow-orange-500/10'
            }`}
          >
            <div className="w-7 h-7 rounded-full bg-orange-600 flex items-center justify-center text-white shadow-xs">
              <span className="material-symbols-outlined text-[16px]">edit_note</span>
            </div>
            <div className="flex flex-col text-left pr-1">
              <span className="text-[8px] font-bold uppercase tracking-wider text-orange-500">
                Journal
              </span>
              <span className="text-[11px] font-bold leading-none">Write Insights</span>
            </div>
          </div>
        </button>
      </div>

      {/* 3. Journal Backdrop Overlay */}
      <div
        onClick={() => setIsJournalOpen(false)}
        className={`fixed inset-0 bg-black/50 backdrop-blur-xs z-[90] transition-opacity duration-300 ${
          isJournalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* 4. Journal Side Drawer */}
      <aside
        className={`fixed right-0 top-14 bottom-14 w-full sm:w-[400px] z-[100] border-l border-y rounded-l-2xl transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-stone-200'
        } ${isJournalOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        {/* Toast Alert */}
        <div
          className={`absolute top-12 left-4 right-4 z-[110] flex items-center gap-2 px-3 py-2 rounded-lg shadow-md bg-emerald-600 text-white transition-all ${
            showToast ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
          }`}
        >
          <span className="material-symbols-outlined text-[16px]">check_circle</span>
          <span className="text-xs font-medium">Reflection Saved & Shared!</span>
        </div>

        <div className="px-4 py-3.5 border-b flex justify-between items-center border-stone-200 dark:border-zinc-800">
          <div>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-orange-500">
              Sanctuary Journal
            </h3>
            <p className="text-[11px] text-zinc-400 mt-0.5">
              {selectedBook} {selectedChapter} Notes
            </p>
          </div>
          <button
            onClick={() => setIsJournalOpen(false)}
            className="w-7 h-7 rounded-md border flex items-center justify-center border-stone-200 dark:border-zinc-800 text-zinc-400 hover:text-zinc-100"
          >
            <span className="material-symbols-outlined text-[15px]">close</span>
          </button>
        </div>

        <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto">
          {errorMessage && (
            <div className="p-2.5 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-xs">
              {errorMessage}
            </div>
          )}

          <textarea
            value={note}
            onChange={handleNoteChange}
            disabled={isSyncing}
            placeholder="Record revelation notes, personal applications, or prayers here..."
            className={`w-full flex-1 p-3 rounded-xl text-xs font-sans leading-relaxed outline-none border transition-all resize-none ${
              isDark
                ? 'bg-zinc-950 border-zinc-800 text-zinc-100 focus:border-orange-500'
                : 'bg-stone-50 border-stone-200 text-zinc-800 focus:border-orange-500'
            }`}
          />

          <div className="p-3 border rounded-lg flex items-center justify-between border-stone-200 dark:border-zinc-800">
            <div className="flex flex-col">
              <label htmlFor="anon-toggle" className="text-[11px] font-semibold cursor-pointer">
                Share Anonymously
              </label>
              <span className="text-[9px] text-zinc-400">Hide handle on community feed</span>
            </div>
            <input
              id="anon-toggle"
              type="checkbox"
              checked={isAnonymousShare}
              onChange={(e) => setIsAnonymousShare(e.target.checked)}
              className="w-3.5 h-3.5 rounded text-orange-600 focus:ring-orange-500"
            />
          </div>
        </div>

        <div className="p-4 border-t border-stone-200 dark:border-zinc-800 flex flex-col gap-2">
          <button
            onClick={handleArchiveAndPublish}
            disabled={isSyncing || !note.trim()}
            className="w-full py-2.5 bg-orange-600 hover:bg-orange-500 disabled:opacity-40 text-white rounded-lg font-semibold text-[11px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5"
          >
            {isSyncing ? (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="material-symbols-outlined text-[15px]">save</span>
                <span>Save & Publish Entry</span>
              </>
            )}
          </button>
        </div>
      </aside>
    </div>
  );
}