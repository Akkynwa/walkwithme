'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

interface VerseRendererProps {
  verses: Verse[];
  translation: string;
  isDark?: boolean;
}

export function VerseRenderer({ verses, translation, isDark = false }: VerseRendererProps) {
  const [copiedVerse, setCopiedVerse] = useState<string | null>(null);
  const [savedVerses, setSavedVerses] = useState<string[]>([]);

  const getVerseKey = (verse: Verse, index: number) => 
    `${verse.book}-${verse.chapter}-${verse.verse}-${index}`;

  const handleCopy = (verse: Verse, key: string) => {
    navigator.clipboard.writeText(`${verse.book} ${verse.chapter}:${verse.verse} - ${verse.text}`);
    setCopiedVerse(key);
    setTimeout(() => setCopiedVerse(null), 2000);
  };

  const handleSave = (key: string) => {
    setSavedVerses((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const handleShare = (verse: Verse) => {
    const shareData = {
      title: `${verse.book} ${verse.chapter}:${verse.verse}`,
      text: `${verse.text}`,
    };
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(`${verse.book} ${verse.chapter}:${verse.verse} - ${verse.text}`);
    }
  };

  if (!verses || verses.length === 0) {
    return (
      <p className={`text-sm italic text-center py-12 ${isDark ? 'text-zinc-500' : 'text-zinc-400'}`}>
        No verses available for this chapter.
      </p>
    );
  }

  return (
    <div className={`flex flex-col gap-4 py-2 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'}`}>
      {verses.map((verse, index) => {
        const verseKey = getVerseKey(verse, index);
        const isCopied = copiedVerse === verseKey;
        const isSaved = savedVerses.includes(verseKey);

        return (
          <motion.div
            key={verseKey}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15, delay: Math.min(index * 0.01, 0.3) }}
            className={`group relative flex gap-3 md:gap-4 items-baseline p-3.5 rounded-lg transition-colors ${
              isDark ? 'hover:bg-zinc-900/40' : 'hover:bg-zinc-50'
            }`}
          >
            {/* VERSE NUMBER */}
            <div className="flex justify-end min-w-[20px]">
              <span
                className={`text-xs font-mono font-semibold select-none transition-colors ${
                  isDark ? 'text-zinc-500 group-hover:text-zinc-300' : 'text-zinc-400 group-hover:text-zinc-700'
                }`}
              >
                {verse.verse}
              </span>
            </div>

            {/* SCRIPTURE CONTENT */}
            <div className="flex-1 min-w-0">
              {/* Reference Badge */}
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`text-[9px] font-sans font-medium uppercase tracking-wider ${
                  isDark ? 'text-zinc-400' : 'text-zinc-500'
                }`}>
                  {verse.book} {verse.chapter}:{verse.verse}
                </span>
                <div className={`h-px flex-1 ${isDark ? 'bg-zinc-800' : 'bg-zinc-200'}`} />
                <span className={`text-[9px] font-sans font-medium uppercase tracking-wider ${
                  isDark ? 'text-zinc-500' : 'text-zinc-400'
                }`}>
                  {translation}
                </span>
              </div>

              {/* Expanded Verse Text */}
              <p className={`font-serif text-lg md:text-xl leading-relaxed tracking-normal ${
                isDark ? 'text-zinc-100' : 'text-zinc-900'
              }`}>
                {verse.text}
              </p>

              {/* Compact Action Buttons */}
              <div className={`flex items-center gap-1 mt-2 transition-opacity duration-200 ${
                isDark ? 'text-zinc-400' : 'text-zinc-500'
              }`}>
                <button
                  onClick={() => handleCopy(verse, verseKey)}
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
                    isDark ? 'hover:text-zinc-100 hover:bg-zinc-800' : 'hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px]">
                    {isCopied ? 'check' : 'content_copy'}
                  </span>
                  {isCopied ? 'Copied' : 'Copy'}
                </button>

                <button
                  onClick={() => handleSave(verseKey)}
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
                    isDark ? 'hover:text-zinc-100 hover:bg-zinc-800' : 'hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px]">
                    {isSaved ? 'bookmark' : 'bookmark_border'}
                  </span>
                  {isSaved ? 'Saved' : 'Save'}
                </button>

                <button
                  onClick={() => handleShare(verse)}
                  className={`flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium transition-colors ${
                    isDark ? 'hover:text-zinc-100 hover:bg-zinc-800' : 'hover:text-zinc-900 hover:bg-zinc-100'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px]">share</span>
                  Share
                </button>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}