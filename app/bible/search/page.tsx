'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function BibleSearch() {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close search results when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    if (query.trim().length < 3) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/bible/search?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (data.success) {
        setResults(data.results);
        setIsOpen(true);
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-sm lg:max-w-md">
      {/* Input Field - Glass Style */}
      <div className="w-full flex items-center gap-2 bg-white/40 backdrop-blur-sm border border-white/60 px-3 py-2 rounded-lg text-gray-600 focus-within:bg-white/60 focus-within:border-amber-300 focus-within:shadow-md transition-all group">
        <span className={`material-symbols-outlined text-[16px] transition-colors ${loading ? 'animate-spin' : 'group-focus-within:text-amber-500'}`}>
          {loading ? 'sync' : 'search'}
        </span>
        <input
          type="text"
          placeholder="Search the Word..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => searchQuery.length >= 3 && setIsOpen(true)}
          className="bg-transparent border-none focus:ring-0 text-[11px] w-full placeholder:text-gray-400 outline-none text-gray-700"
        />
        {searchQuery && (
          <button 
            onClick={() => { setSearchQuery(''); setResults([]); setIsOpen(false); }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">close</span>
          </button>
        )}
      </div>

      {/* Results Dropdown - Glass Style */}
      {isOpen && (searchQuery.length >= 3) && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-xl border border-white/60 rounded-xl shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="max-h-[380px] overflow-y-auto custom-scrollbar">
            {results.length > 0 ? (
              <div className="p-2">
                {results.map((result, idx) => (
                  <Link
                    key={`${result.book}-${result.chapter}-${result.verse}-${idx}`}
                    href={`/bible/${result.book.toLowerCase()}/${result.chapter}`}
                    onClick={() => setIsOpen(false)}
                    className="block p-3 rounded-lg hover:bg-amber-50 transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <div className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-amber-500 text-[10px]">menu_book</span>
                        <h4 className="text-[8px] font-black text-amber-700 uppercase tracking-wider">
                          {result.book} {result.chapter}:{result.verse}
                        </h4>
                      </div>
                      <span className="text-[6px] font-bold text-gray-400 uppercase tracking-wider px-1.5 py-0.5 border border-gray-200 rounded-md">
                        {result.translation || 'KJV'}
                      </span>
                    </div>
                    <p className="text-[9px] font-serif text-gray-600 leading-relaxed line-clamp-2">
                      {result.text}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-2">
                  <span className="material-symbols-outlined text-amber-400 text-2xl">find_in_page</span>
                </div>
                <p className="text-[9px] font-serif italic text-gray-500">
                  No matches found for "{searchQuery}"
                </p>
              </div>
            )}
          </div>
          
          {/* Quick Footer */}
          <div className="bg-white/50 p-2 text-center border-t border-white/60">
            <button className="text-[6px] font-black text-amber-600 uppercase tracking-wider hover:text-amber-700 transition-colors">
              View All Results
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(245, 158, 11, 0.3);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}