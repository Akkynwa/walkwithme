'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { ChapterList } from '@/components/bible/ChapterList';
import { TranslationSwitcher } from '@/components/bible/TranslationSwitcher';
import { useParams, useRouter } from 'next/navigation';
import { useTheme } from '@/app/context/ThemeContext';
import Sidebar from '@/app/layout-components/Sidebar';
import { motion, AnimatePresence } from 'framer-motion';

const BOOKS_OF_THE_BIBLE = [
  'Genesis', 'Exodus', 'Leviticus', 'Numbers', 'Deuteronomy',
  'Joshua', 'Judges', 'Ruth', '1 Samuel', '2 Samuel',
  '1 Kings', '2 Kings', '1 Chronicles', '2 Chronicles',
  'Ezra', 'Nehemiah', 'Esther', 'Job', 'Psalms',
  'Proverbs', 'Ecclesiastes', 'Song of Solomon', 'Isaiah',
  'Jeremiah', 'Lamentations', 'Ezekiel', 'Daniel', 'Hosea',
  'Joel', 'Amos', 'Obadiah', 'Jonah', 'Micah', 'Nahum',
  'Habakkuk', 'Zephaniah', 'Haggai', 'Zechariah', 'Malachi',
  'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans',
  '1 Corinthians', '2 Corinthians', 'Galatians', 'Ephesians',
  'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians',
  '1 Timothy', '2 Timothy', 'Titus', 'Philemon', 'Hebrews',
  'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John',
  'Jude', 'Revelation'
];

const normalizeBook = (input: string) => {
  if (!input) return 'Genesis';
  const trimmed = input.trim();
  const direct = trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase();
  const known = {
    genesis: 'Genesis',
    exodus: 'Exodus',
    leviticus: 'Leviticus',
    numbers: 'Numbers',
    deuteronomy: 'Deuteronomy',
    joshua: 'Joshua',
    judges: 'Judges',
    ruth: 'Ruth',
    '1-samuel': '1 Samuel',
    '2-samuel': '2 Samuel',
    '1-kings': '1 Kings',
    '2-kings': '2 Kings',
    '1-chronicles': '1 Chronicles',
    '2-chronicles': '2 Chronicles',
    ezra: 'Ezra',
    nehemiah: 'Nehemiah',
    esther: 'Esther',
    job: 'Job',
    psalms: 'Psalms',
    proverbs: 'Proverbs',
    ecclesiastes: 'Ecclesiastes',
    'song-of-solomon': 'Song of Solomon',
    isaiah: 'Isaiah',
    jeremiah: 'Jeremiah',
    lamentations: 'Lamentations',
    ezekiel: 'Ezekiel',
    daniel: 'Daniel',
    hosea: 'Hosea',
    joel: 'Joel',
    amos: 'Amos',
    obadiah: 'Obadiah',
    jonah: 'Jonah',
    micah: 'Micah',
    nahum: 'Nahum',
    habakkuk: 'Habakkuk',
    zephaniah: 'Zephaniah',
    haggai: 'Haggai',
    zechariah: 'Zechariah',
    malachi: 'Malachi',
    matthew: 'Matthew',
    mark: 'Mark',
    luke: 'Luke',
    john: 'John',
    acts: 'Acts',
    romans: 'Romans',
    '1-corinthians': '1 Corinthians',
    '2-corinthians': '2 Corinthians',
    galatians: 'Galatians',
    ephesians: 'Ephesians',
    philippians: 'Philippians',
    colossians: 'Colossians',
    '1-thessalonians': '1 Thessalonians',
    '2-thessalonians': '2 Thessalonians',
    '1-timothy': '1 Timothy',
    '2-timothy': '2 Timothy',
    titus: 'Titus',
    philemon: 'Philemon',
    hebrews: 'Hebrews',
    james: 'James',
    '1-peter': '1 Peter',
    '2-peter': '2 Peter',
    '1-john': '1 John',
    '2-john': '2 John',
    '3-john': '3 John',
    jude: 'Jude',
    revelation: 'Revelation',
  } as Record<string, string>;

  return known[trimmed.toLowerCase()] || direct;
};

const normalizeTranslation = (input: string) => {
  const trimmed = input?.trim().toUpperCase();
  if (trimmed === 'KJV') return 'KJV';
  if (trimmed === 'NIV') return 'NIV';
  if (trimmed === 'RVR09') return 'RVR09';
  return trimmed || 'KJV';
};

export default function BibleChapterPage() {
  const params = useParams();
  const router = useRouter();
  const { isDark } = useTheme();

  const { book = 'Genesis', chapter = '1', language = 'en', translation = 'KJV' } = params as any;

  const normalizedBook = useMemo(() => normalizeBook(book as string), [book]);
  const normalizedTranslation = useMemo(() => normalizeTranslation(translation as string), [translation]);
  const normalizedLanguage = useMemo(() => (language as string)?.toLowerCase() || 'en', [language]);

  const [currentTranslation, setCurrentTranslation] = useState(normalizedTranslation);
  const [verses, setVerses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookDropdownOpen, setIsBookDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const loadPassage = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/bible/passage?bibleId=${encodeURIComponent(normalizedTranslation)}&passageId=${encodeURIComponent(`${normalizedBook}.${chapter}`)}`);
      const data = await response.json();

      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'Unable to load this chapter right now.');
      }

      const normalizedVerses = (data.verses || []).map((item: any, index: number) => ({
        book: normalizedBook,
        chapter: Number(chapter || 1),
        verse: item.verse || item.verseNumber || index + 1,
        text: item.text || item.content || item.verseText || '',
      })).filter((item: any) => item.text);

      setVerses(normalizedVerses);
    } catch (err) {
      console.error('Bible chapter load failed', err);
      setVerses([]);
      setError(err instanceof Error ? err.message : 'Unable to load this chapter right now.');
    } finally {
      setLoading(false);
    }
  }, [chapter, normalizedBook, normalizedTranslation]);

  useEffect(() => {
    setCurrentTranslation(normalizedTranslation);
    loadPassage();
  }, [loadPassage, normalizedTranslation]);

  const handleChapterChange = (ch: number) => {
    router.push(`/bible/${normalizedLanguage}/${currentTranslation}/${encodeURIComponent(normalizedBook)}/${ch}`);
  };

  const handleBookSelect = (selectedBook: string) => {
    router.push(`/bible/${normalizedLanguage}/${currentTranslation}/${encodeURIComponent(selectedBook)}/1`);
    setIsBookDropdownOpen(false);
    setSearchTerm('');
  };

  const filteredBooks = BOOKS_OF_THE_BIBLE.filter(book => 
    book.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-stone-900'
    }`}>
      
      <Sidebar />

      <main className="flex-1 lg:ml-56 pt-20 pb-16 px-4 sm:px-6 md:px-10 max-w-4xl mx-auto w-full">
        
        {/* Back Button */}
        <button 
          onClick={() => router.back()}
          className={`group flex items-center gap-1.5 text-xs font-medium transition-all duration-300 hover:scale-105 mb-6 ${
            isDark ? 'text-zinc-400 hover:text-amber-400' : 'text-stone-500 hover:text-stone-950'
          }`}
        >
          <span className="material-symbols-outlined text-base group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span>Return</span>
        </button>

        {/* Header Section */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-6 h-px ${isDark ? 'bg-amber-500/40' : 'bg-amber-400/40'}`} />
              <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>
                Scripture Reading
              </span>
            </div>
            
            {/* Book Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsBookDropdownOpen(!isBookDropdownOpen)}
                className={`group flex items-center gap-3 text-3xl sm:text-4xl md:text-5xl font-serif font-light tracking-tight leading-[1.1] transition-colors ${
                  isDark 
                    ? 'text-zinc-100 hover:text-amber-400' 
                    : 'text-stone-900 hover:text-amber-700'
                }`}
              >
                <span>{normalizedBook}</span>
                <span className={`text-xl sm:text-2xl font-serif font-light ${isDark ? 'text-zinc-600' : 'text-stone-400'}`}>
                  {chapter}
                </span>
                <span className={`material-symbols-outlined text-2xl sm:text-3xl transition-transform duration-300 ${
                  isBookDropdownOpen ? 'rotate-180' : ''
                } ${isDark ? 'text-zinc-500' : 'text-stone-400'}`}>
                  expand_more
                </span>
              </button>

              {/* Dropdown */}
              <AnimatePresence>
                {isBookDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className={`absolute left-0 top-full mt-2 w-64 sm:w-72 max-h-80 overflow-hidden rounded-xl shadow-2xl z-50 ${
                      isDark 
                        ? 'bg-zinc-900 border border-zinc-700/50' 
                        : 'bg-white border border-stone-200'
                    }`}
                  >
                    {/* Search Input */}
                    <div className={`p-3 border-b ${isDark ? 'border-zinc-700/50' : 'border-stone-200'}`}>
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${
                        isDark ? 'bg-zinc-800' : 'bg-stone-100'
                      }`}>
                        <span className={`material-symbols-outlined text-sm ${isDark ? 'text-zinc-500' : 'text-stone-400'}`}>
                          search
                        </span>
                        <input
                          type="text"
                          placeholder="Search books..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className={`w-full bg-transparent text-sm outline-none ${
                            isDark ? 'text-zinc-100 placeholder-zinc-500' : 'text-stone-900 placeholder-stone-400'
                          }`}
                          autoFocus
                        />
                        {searchTerm && (
                          <button
                            onClick={() => setSearchTerm('')}
                            className={`p-0.5 rounded-full hover:bg-opacity-20 transition-colors ${
                              isDark ? 'hover:bg-white/10' : 'hover:bg-black/5'
                            }`}
                          >
                            <span className={`material-symbols-outlined text-sm ${isDark ? 'text-zinc-500' : 'text-stone-400'}`}>
                              close
                            </span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Books List */}
                    <div className="overflow-y-auto max-h-60 p-1 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full">
                      {filteredBooks.length > 0 ? (
                        filteredBooks.map((bookName) => (
                          <button
                            key={bookName}
                            onClick={() => handleBookSelect(bookName)}
                            className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ${
                              bookName === normalizedBook
                                ? isDark
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : 'bg-amber-100/60 text-amber-800'
                                : isDark
                                  ? 'text-zinc-300 hover:bg-zinc-800'
                                  : 'text-stone-700 hover:bg-stone-100'
                            }`}
                          >
                            <span className="font-medium">{bookName}</span>
                            {bookName === normalizedBook && (
                              <span className={`ml-2 text-[8px] font-bold tracking-[0.15em] uppercase ${
                                isDark ? 'text-amber-400' : 'text-amber-600'
                              }`}>
                                ● Current
                              </span>
                            )}
                          </button>
                        ))
                      ) : (
                        <div className={`px-3 py-6 text-center text-sm ${isDark ? 'text-zinc-500' : 'text-stone-400'}`}>
                          No books found
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          
          <div className="w-full sm:w-48">
            <TranslationSwitcher
              currentTranslation={currentTranslation}
              onTranslationChange={setCurrentTranslation}
            />
          </div>
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-20 gap-4"
            >
              <div className={`w-8 h-8 border-2 rounded-full animate-spin ${
                isDark 
                  ? 'border-amber-500 border-t-transparent' 
                  : 'border-amber-600 border-t-transparent'
              }`} />
              <p className={`text-[8px] font-black uppercase tracking-[0.2em] ${
                isDark ? 'text-zinc-500' : 'text-stone-400'
              }`}>
                Loading verses...
              </p>
            </motion.div>
          ) : error ? (
            <motion.div
              key="error"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`rounded-xl border p-6 text-sm ${
                isDark 
                  ? 'border-zinc-800 bg-zinc-900 text-zinc-300' 
                  : 'border-stone-200 bg-stone-50 text-stone-700'
              }`}
            >
              <p className="font-semibold">We couldn&apos;t load this chapter right now.</p>
              <p className="mt-2 text-sm opacity-80">{error}</p>
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`border rounded-xl overflow-hidden transition-colors ${
                isDark ? 'border-zinc-800/50 bg-zinc-900' : 'border-stone-200 bg-white'
              }`}
            >
              <ChapterList
                book={normalizedBook}
                chapterCount={50}
                currentChapter={parseInt(chapter as string)}
                verses={verses}
                onChapterChange={handleChapterChange}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Chapter Navigation Info */}
        {!loading && !error && verses.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className={`mt-6 flex flex-wrap items-center justify-between gap-2 text-xs ${
              isDark ? 'text-zinc-500' : 'text-stone-400'
            }`}
          >
            <span>{verses.length} verses</span>
            <span className="flex items-center gap-2">
              <span className={`w-1 h-1 rounded-full ${isDark ? 'bg-zinc-700' : 'bg-stone-300'}`} />
              {normalizedTranslation}
              <span className={`w-1 h-1 rounded-full ${isDark ? 'bg-zinc-700' : 'bg-stone-300'}`} />
              {normalizedBook} {chapter}
            </span>
          </motion.div>
        )}

        {/* Decorative Footer */}
        <div className="mt-12 flex justify-center items-center gap-4 opacity-20">
          <div className={`h-px w-12 sm:w-20 ${
            isDark ? 'bg-gradient-to-r from-transparent to-amber-400' : 'bg-gradient-to-r from-transparent to-amber-600'
          }`} />
          <span className={`material-symbols-outlined text-sm ${isDark ? 'text-amber-500' : 'text-amber-600'}`}>
            menu_book
          </span>
          <div className={`h-px w-12 sm:w-20 ${
            isDark ? 'bg-gradient-to-l from-transparent to-amber-400' : 'bg-gradient-to-l from-transparent to-amber-600'
          }`} />
        </div>
      </main>
    </div>
  );
}