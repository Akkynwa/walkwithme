'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';

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

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

const ITEMS_PER_PAGE = 4;

export default function PaginatedBibleSearch({ isDark = false }: { isDark?: boolean }) {
  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchLocal, setSearchLocal] = useState(true);
  const [searchWeb, setSearchWeb] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const debouncedQuery = useDebounce(inputValue, 350);

  // Close dropdown on outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch search results & reset pagination
  useEffect(() => {
    if (debouncedQuery.trim().length < 3) {
      setResults([]);
      setIsOpen(false);
      setCurrentPage(1);
      return;
    }

    const controller = new AbortController();

    const executeSearch = async () => {
      setLoading(true);
      setIsOpen(true);
      setCurrentPage(1); // Reset back to page 1 on new search parameter change

      try {
        const response = await fetch(
          `/api/bible/search?q=${encodeURIComponent(debouncedQuery)}&local=${searchLocal}&web=${searchWeb}`,
          { signal: controller.signal }
        );
        const data = await response.json();
        if (data.success) {
          setResults(data.results || []);
        }
      } catch (error: any) {
        if (error.name !== 'AbortError') {
          console.error('Search request failed:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    executeSearch();

    return () => {
      controller.abort();
    };
  }, [debouncedQuery, searchLocal, searchWeb]);

  // Pagination computations
  const totalPages = Math.ceil(results.length / ITEMS_PER_PAGE);

  const paginatedResults = useMemo(() => {
    const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
    return results.slice(startIdx, startIdx + ITEMS_PER_PAGE);
  }, [results, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-xl mx-auto">
      {/* Search Input Box */}
      <div className={`w-full flex items-center gap-3 backdrop-blur-md border px-4 py-3.5 rounded-2xl transition-all ${
        isDark ? 'bg-zinc-900/60 border-zinc-800 text-zinc-400' : 'bg-white/60 border-stone-200 text-stone-500'
      }`}>
        <span className={`material-symbols-outlined text-lg ${loading ? 'animate-spin text-amber-500' : ''}`}>
          {loading ? 'sync' : 'search'}
        </span>
        <input
          type="text"
          placeholder="Search scriptures or topics..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => inputValue.trim().length >= 3 && setIsOpen(true)}
          className={`bg-transparent border-none focus:ring-0 text-sm w-full outline-none ${
            isDark ? 'text-zinc-200 placeholder:text-zinc-600' : 'text-stone-700 placeholder:text-stone-400'
          }`}
        />
      </div>

      {/* Paginated Dropdown Results */}
      {isOpen && inputValue.trim().length >= 3 && (
        <div className={`absolute top-full left-0 right-0 mt-3 backdrop-blur-xl border rounded-2xl shadow-2xl overflow-hidden z-[100] ${
          isDark ? 'bg-zinc-900/95 border-zinc-800' : 'bg-white/95 border-stone-200'
        }`}>
          {loading ? (
            <div className="p-4 text-center text-xs text-stone-400">Searching...</div>
          ) : results.length > 0 ? (
            <div>
              {/* Item List */}
              <div className="p-2 space-y-1 min-h-[220px]">
                {paginatedResults.map((result, idx) => (
                  <div key={idx} className={`p-3 rounded-xl border transition-colors ${
                    isDark ? 'bg-zinc-900/40 border-zinc-800/60' : 'bg-stone-50/60 border-stone-100'
                  }`}>
                    {result.isExternal ? (
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-blue-500">
                          Web Reference
                        </span>
                        <h4 className={`text-xs font-bold ${isDark ? 'text-zinc-200' : 'text-stone-800'}`}>
                          {result.title}
                        </h4>
                        <p className={`text-xs line-clamp-1 ${isDark ? 'text-zinc-400' : 'text-stone-500'}`}>
                          {result.snippet}
                        </p>
                      </div>
                    ) : (
                      <div>
                        <span className="text-[9px] font-bold uppercase tracking-wider text-amber-500">
                          {result.book} {result.chapter}:{result.verse}
                        </span>
                        <p className={`text-xs font-serif line-clamp-2 ${isDark ? 'text-zinc-300' : 'text-stone-700'}`}>
                          {result.text}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Pagination Controls Footer */}
              {totalPages > 1 && (
                <div className={`flex items-center justify-between px-4 py-2.5 border-t text-xs select-none ${
                  isDark ? 'border-zinc-800/80 bg-zinc-950/40 text-zinc-400' : 'border-stone-100 bg-stone-50/60 text-stone-500'
                }`}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-2.5 py-1 rounded-lg border border-transparent hover:border-stone-200 dark:hover:border-zinc-700 disabled:opacity-40 disabled:hover:border-transparent transition-all"
                  >
                    Previous
                  </button>

                  <div className="flex items-center gap-1 font-mono text-[11px]">
                    <span>Page</span>
                    <span className={`font-bold ${isDark ? 'text-zinc-200' : 'text-stone-800'}`}>
                      {currentPage}
                    </span>
                    <span>of {totalPages}</span>
                  </div>

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-2.5 py-1 rounded-lg border border-transparent hover:border-stone-200 dark:hover:border-zinc-700 disabled:opacity-40 disabled:hover:border-transparent transition-all"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-stone-400">
              No results found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}