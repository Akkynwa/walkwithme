'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

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
      // REAL API CALL: Update this URL to match your backend route
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
      {/* Input Field */}
       <div className="w-full flex items-center gap-2 bg-white/30 border border-white/40 px-3 py-1.5 rounded-full text-secondary/60 focus-within:bg-white/60 transition-all group">
        <span className="material-symbols-outlined text-[18px] group-focus-within:text-primary transition-colors">
          {loading ? 'sync' : 'search'}
        </span>
        <input
          type="text"
          placeholder="Search the Word..."
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => searchQuery.length >= 3 && setIsOpen(true)}
          className={`bg-transparent border-none focus:ring-0 text-[13px] w-full placeholder:text-secondary/50 p-0'}`}
        />
      </div>


      {/* Results Dropdown - Flat & Plain Visibility */}
      {isOpen && (searchQuery.length >= 3) && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-white border border-gray-100 rounded-[2rem] shadow-2xl overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            {results.length > 0 ? (
              <div className="p-2">
                {results.map((result) => (
                  <Link
                    key={`${result.book}-${result.chapter}-${result.verse}`}
                    href={`/bible/${result.book.toLowerCase()}/${result.chapter}`}
                    onClick={() => setIsOpen(false)}
                    className="block p-4 rounded-2xl hover:bg-[#FDFBF7] transition-colors group"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="text-[13px] font-black text-primary uppercase tracking-wider">
                        {result.book} {result.chapter}:{result.verse}
                      </h4>
                      <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest px-2 py-0.5 border border-gray-100 rounded-md">
                        {result.translation}
                      </span>
                    </div>
                    <p className="text-sm font-serif text-[#3C3830] opacity-80 leading-relaxed line-clamp-2">
                      {result.text}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center">
                <span className="material-symbols-outlined text-gray-200 text-4xl mb-2">find_in_page</span>
                <p className="text-sm font-serif italic text-gray-400">
                  No matches found for &quot;{searchQuery}&quot;
                </p>
              </div>
            )}
          </div>
          
          {/* Quick Footer */}
          <div className="bg-gray-50/50 p-3 text-center border-t border-gray-100">
             <button className="text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] hover:text-primary transition-colors">
               View All Results
             </button>
          </div>
        </div>
      )}
    </div>
  );
}