'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useTheme } from '../../context/ThemeContext';

interface SearchResult {
  book?: string;
  chapter?: number;
  verse?: number;
  text?: string;
  translation?: string;
  title?: string;
  snippet?: string;
  link?: string;
  isExternal?: boolean;
}

interface SearchHint {
  label: string;
  icon: string;
  query: string;
  color: string;
}

const SEARCH_HINTS: readonly SearchHint[] = [
  { label: 'Love & Grace', icon: 'favorite', query: 'God so loved the world', color: 'from-rose-500/10 to-pink-500/5 dark:from-rose-500/20 dark:to-transparent' },
  { label: 'Peace in Anxiety', icon: 'spa', query: 'do not be anxious', color: 'from-emerald-500/10 to-teal-500/5 dark:from-emerald-500/20 dark:to-transparent' },
  { label: 'Strength & Courage', icon: 'shield', query: 'be strong and courageous', color: 'from-amber-500/10 to-orange-500/5 dark:from-amber-500/20 dark:to-transparent' },
  { label: 'Faith & Hope', icon: 'wb_sunny', query: 'faith is the assurance', color: 'from-blue-500/10 to-indigo-500/5 dark:from-blue-500/20 dark:to-transparent' },
] as const;

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

export default function BibleSearchPage() {
  const { isDark } = useTheme();
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  
  const [searchLocal, setSearchLocal] = useState(true);
  const [searchWeb, setSearchWeb] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(inputValue, 350);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (debouncedQuery.trim().length < 3) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const executeSearch = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/bible/search?q=${encodeURIComponent(debouncedQuery)}&local=${searchLocal}&web=${searchWeb}`
        );
        const data = await response.json();
        if (data.success) {
          setResults(data.results || []);
          setIsOpen(true);
        }
      } catch (error) {
        console.error('Search request failed:', error);
      } finally {
        setLoading(false);
      }
    };

    executeSearch();
  }, [debouncedQuery, loading, searchLocal, searchWeb]);

  const handleHintClick = (query: string) => {
    setInputValue(query);
    setIsOpen(true);
  };

  const clearSearch = () => {
    setInputValue('');
    setResults([]);
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full min-h-screen flex flex-col items-center justify-center px-4 md:px-6 py-12 transition-colors duration-300 ${
      isDark ? 'bg-zinc-950 text-zinc-50' : 'bg-[#FAF9F5] text-stone-800'
    }`}>
      
      {/* Decorative Blur Backdrops */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[160px] opacity-40 transition-colors ${
          isDark ? 'bg-amber-500/10' : 'bg-amber-200/40'
        }`} />
      </div>

      <div ref={searchRef} className="relative w-full max-w-xl z-10 space-y-6">
        
        {/* Navigation & Context Header Row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b pb-4 border-dashed border-stone-200 dark:border-zinc-800">
          <Link 
            href="/bible" 
            className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider transition-all group px-3 py-1.5 rounded-xl border focus-visible:outline-none focus-visible:ring-2 ${
              isDark 
                ? 'bg-zinc-900/30 border-zinc-800/80 hover:border-zinc-700 text-zinc-400 hover:text-zinc-200 focus-visible:ring-zinc-700' 
                : 'bg-white/40 border-stone-200/60 hover:border-stone-300 text-stone-500 hover:text-stone-800 focus-visible:ring-amber-500'
            }`}
          >
            <span className="material-symbols-outlined text-[13px] transition-transform duration-300 group-hover:-translate-x-0.5">
              arrow_back
            </span>
            Back to Hub
          </Link>

          {/* Unified Scope Toggle Switches */}
          <div className={`flex items-center gap-1 p-1 rounded-xl border text-[10px] font-bold uppercase tracking-wider select-none ${
            isDark ? 'bg-zinc-900/40 border-zinc-800/80' : 'bg-white/40 border-stone-200/60'
          }`}>
            <button
              onClick={() => {
                const next = !searchLocal;
                if (next || searchWeb) setSearchLocal(next);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                searchLocal 
                  ? 'bg-amber-500 text-white shadow-sm' 
                  : 'text-stone-500 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800/50'
              }`}
            >
              <span className="material-symbols-outlined text-[12px]">menu_book</span>
              Scripture
            </button>
            <button
              onClick={() => {
                const next = !searchWeb;
                if (next || searchLocal) setSearchWeb(next);
              }}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg transition-all ${
                searchWeb 
                  ? 'bg-amber-500 text-white shadow-sm' 
                  : 'text-stone-500 dark:text-zinc-400 hover:bg-stone-100 dark:hover:bg-zinc-800/50'
              }`}
            >
              <span className="material-symbols-outlined text-[12px]">public</span>
              Web Resources
            </button>
          </div>
        </div>

        {/* Typographic Introduction */}
        <header className="space-y-2 text-center pt-2">
          <h1 className={`text-3xl md:text-4xl font-serif font-normal tracking-tight ${
            isDark ? 'text-zinc-100' : 'text-stone-900'
          }`}>
            Sacred Search
          </h1>
          <p className={`text-xs md:text-sm max-w-md mx-auto leading-relaxed ${
            isDark ? 'text-zinc-400' : 'text-stone-500'
          }`}>
            Explore direct scripture parameters or pull educational context and articles from the wider web.
          </p>
        </header>

        {/* Search Input Box */}
        <div className="relative">
          <div className={`w-full flex items-center gap-3 backdrop-blur-md border px-4 py-3.5 rounded-2xl transition-all group focus-within:shadow-xl ${
            isDark
              ? 'bg-zinc-900/60 border-zinc-800 focus-within:bg-zinc-900/90 focus-within:border-zinc-700 focus-within:shadow-zinc-950/60 text-zinc-400'
              : 'bg-white/60 border-stone-200 focus-within:bg-white/90 focus-within:border-amber-300 focus-within:shadow-stone-200/40 text-stone-500'
          }`}>
            <span 
              className={`material-symbols-outlined text-lg transition-colors duration-300 ${
                loading 
                  ? 'animate-spin text-amber-500' 
                  : 'group-focus-within:text-amber-600 dark:group-focus-within:text-amber-400'
              }`}
              aria-hidden="true"
            >
              {loading ? 'sync' : 'search'}
            </span>
            
            <input
              type="text"
              placeholder={searchLocal && searchWeb ? "Search scriptures and articles..." : searchWeb ? "Search outside web resources..." : "Type a scripture passage..."}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onFocus={() => inputValue.trim().length >= 3 && setIsOpen(true)}
              className={`bg-transparent border-none focus:ring-0 text-sm w-full outline-none transition-colors ${
                isDark ? 'text-zinc-200 placeholder:text-zinc-600' : 'text-stone-700 placeholder:text-stone-400'
              }`}
            />
            
            {inputValue && (
              <button 
                onClick={clearSearch}
                className="flex items-center justify-center transition-colors hover:text-stone-700 dark:hover:text-zinc-200"
                aria-label="Clear search input"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            )}
          </div>

          {/* Inline Dropdown Panel handles mixed content card layouts */}
          {isOpen && inputValue.trim().length >= 3 && (
            <div className={`absolute top-full left-0 right-0 mt-3 text-left backdrop-blur-xl border rounded-2xl shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200 ${
              isDark ? 'bg-zinc-900/95 border-zinc-800' : 'bg-white/95 border-stone-200'
            }`}>
              <div className="max-h-[340px] overflow-y-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-stone-500/10 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-700/30">
                {results.length > 0 ? (
                  <div className="p-2 space-y-1">
                    {results.map((result, idx) => {
                      if (result.isExternal) {
                        return (
                          <a
                            key={`ext-${idx}`}
                            href={result.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={`block p-3.5 rounded-xl transition-colors group ${
                              isDark ? 'hover:bg-zinc-800/40' : 'hover:bg-blue-50/40'
                            }`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <div className="flex items-center gap-1.5 min-w-0">
                                <span className="material-symbols-outlined text-blue-500 text-sm flex-shrink-0" aria-hidden="true">
                                  language
                                </span>
                                <h4 className={`text-xs font-bold line-clamp-1 ${
                                  isDark ? 'text-zinc-200 group-hover:text-blue-400' : 'text-stone-800 group-hover:text-blue-700'
                                }`}>
                                  {result.title}
                                </h4>
                              </div>
                              <span className={`text-[8px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ml-2 flex-shrink-0 ${
                                isDark ? 'text-blue-400 border-blue-900/50 bg-blue-950/20' : 'text-blue-600 border-blue-100 bg-blue-50/50'
                              }`}>
                                EXT REF
                              </span>
                            </div>
                            <p className={`text-xs leading-relaxed line-clamp-2 ${
                              isDark ? 'text-zinc-500 group-hover:text-zinc-400' : 'text-stone-500 group-hover:text-stone-600'
                            }`}>
                              {result.snippet}
                            </p>
                          </a>
                        );
                      }

                      return (
                        <Link
                          key={`local-${result.book}-${result.chapter}-${result.verse}-${idx}`}
                          href={`/bible/${result.book?.toLowerCase()}/${result.chapter}`}
                          onClick={() => setIsOpen(false)}
                          className={`block p-3.5 rounded-xl transition-colors group ${
                            isDark ? 'hover:bg-zinc-800/50' : 'hover:bg-amber-50/50'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-1.5">
                            <div className="flex items-center gap-1.5">
                              <span className="material-symbols-outlined text-amber-600 dark:text-amber-400 text-sm" aria-hidden="true">
                                menu_book
                              </span>
                              <h4 className={`text-xs font-bold uppercase tracking-wider ${
                                isDark ? 'text-amber-400' : 'text-amber-800'
                              }`}>
                                {result.book} {result.chapter}:{result.verse}
                              </h4>
                            </div>
                            <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border rounded-md ${
                              isDark ? 'text-zinc-500 border-zinc-800 bg-zinc-950/40' : 'text-stone-400 border-stone-200 bg-stone-50/40'
                            }`}>
                              {result.translation || 'KJV'}
                            </span>
                          </div>
                          <p className={`text-xs font-serif leading-relaxed line-clamp-2 ${
                            isDark ? 'text-zinc-400 group-hover:text-zinc-300' : 'text-stone-600 group-hover:text-stone-800'
                          }`}>
                            {result.text}
                          </p>
                        </Link>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-12 text-center select-none">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-3 ${
                      isDark ? 'bg-zinc-800/40' : 'bg-amber-50'
                    }`}>
                      <span className="material-symbols-outlined text-amber-500/70 text-2xl" aria-hidden="true">
                        find_in_page
                      </span>
                    </div>
                    <p className={`text-sm font-serif italic ${isDark ? 'text-zinc-500' : 'text-stone-400'}`}>
                      No matches found for "{inputValue}"
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Discover Suggestion Matrix Container */}
        {!isOpen && (
          <section className="space-y-4 text-center animate-in fade-in slide-in-from-bottom-2 duration-500" aria-label="Suggested Search Prompts">
            <h3 className={`text-[10px] font-bold uppercase tracking-[0.2em] ${
              isDark ? 'text-zinc-500' : 'text-stone-400'
            }`}>
              Or Explore Biblical Themes
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-left">
              {SEARCH_HINTS.map((hint) => (
                <button
                  key={hint.label}
                  onClick={() => handleHintClick(hint.query)}
                  className={`group relative p-3 rounded-xl border text-left flex flex-col justify-between h-20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md bg-gradient-to-br ${hint.color} ${
                    isDark 
                      ? 'border-zinc-900 hover:border-zinc-800 focus:ring-zinc-700' 
                      : 'border-stone-200/40 hover:border-stone-200 focus:ring-amber-500'
                  }`}
                >
                  <span className={`material-symbols-outlined text-sm ${
                    isDark ? 'text-zinc-500 group-hover:text-amber-400' : 'text-stone-400 group-hover:text-amber-700'
                  } transition-colors`}>
                    {hint.icon}
                  </span>
                  <span className={`text-[11px] font-medium tracking-tight ${
                    isDark ? 'text-zinc-300 group-hover:text-zinc-100' : 'text-stone-700 group-hover:text-stone-900'
                  }`}>
                    {hint.label}
                  </span>
                </button>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}