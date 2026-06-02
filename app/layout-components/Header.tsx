/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  const { data: session } = useSession();
  const [userName, setUserName] = useState<string>('Guest');
  const [userImage, setUserImage] = useState<string>('');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Search & UI States
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        if (query.length === 0) setIsMobileSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [query]);

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (val.trim().length < 3) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/bible/search?q=${encodeURIComponent(val)}`);
      const data = await res.json();
      setResults(data.results || []);
      setShowDropdown(true);
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Scroll logic
  useEffect(() => {
    const controlHeader = () => {
      if (typeof window !== 'undefined') {
        if (window.scrollY > lastScrollY && window.innerWidth < 1024 && window.scrollY > 50) {
          setIsVisible(false);
        } else {
          setIsVisible(true);
        }
        setLastScrollY(window.scrollY);
      }
    };
    window.addEventListener('scroll', controlHeader);
    return () => window.removeEventListener('scroll', controlHeader);
  }, [lastScrollY]);

  useEffect(() => {
    if (session?.user) {
      setUserName(session.user.name || 'User');
      setUserImage(session.user.image || '');
    }
  }, [session]);

  return (
    <>
      <header 
        className={`fixed top-0 left-0 lg:left-64 right-0 z-40 flex justify-between items-center px-4 md:px-6 py-2 bg-white/40 backdrop-blur-md border-b border-white/20 shadow-sm transition-all duration-500 h-14 
        ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 lg:translate-y-0 lg:opacity-100'}`}
      >
        
        {/* BRAND SECTION: Visible ONLY on mobile, hidden on desktop layout */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 lg:hidden">
            <h1 className="font-serif text-base text-[#3C3830] font-black tracking-tighter">WalkWithMe</h1>
          </div>

          {/* MOBILE ONLY SEARCH ICON */}
          {!isMobileSearchOpen && (
            <button 
              onClick={() => setIsMobileSearchOpen(true)}
              className="lg:hidden w-8 h-8 flex items-center justify-center rounded-full bg-primary/5 text-primary active:scale-90 transition-all"
            >
              <span className="material-symbols-outlined text-[20px]">search</span>
            </button>
          )}
        </div>

        {/* DESKTOP SEARCH BAR: EXACTLY AS IT WAS */}
        <div className="hidden lg:flex flex-grow items-center max-w-sm relative" ref={searchRef}>
          <div className="w-full flex items-center gap-2 bg-white/30 border border-white/40 px-3 py-1.5 rounded-full text-secondary/60 focus-within:bg-white/60 transition-all group">
            <span className={`material-symbols-outlined text-[18px] transition-colors ${loading ? 'animate-spin' : 'group-focus-within:text-primary'}`}>
              {loading ? 'sync' : 'search'}
            </span>
            <input 
              type="text" 
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => query.length >= 3 && setShowDropdown(true)}
              placeholder="Search the Word..." 
              className="bg-transparent border-none focus:ring-0 text-[13px] w-full placeholder:text-secondary/50 p-0"
            />
          </div>

          {/* Results Dropdown */}
          {showDropdown && query.length >= 3 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-[1.5rem] shadow-2xl overflow-hidden z-50">
              <div className="max-h-[350px] overflow-y-auto p-2">
                {results.length > 0 ? (
                  results.map((res, i) => (
                    <Link 
                      key={i}
                      href={`/bible/${res.book.toLowerCase()}?chapter=${res.chapter}&verse=${res.verse}`}
                      onClick={() => setShowDropdown(false)}
                      className="block p-4 rounded-xl hover:bg-primary/5 transition-colors"
                    >
                      <span className="text-[10px] font-black text-primary uppercase">{res.book} {res.chapter}:{res.verse}</span>
                      <p className="text-xs font-serif text-[#3C3830] opacity-70 line-clamp-2">{res.text}</p>
                    </Link>
                  ))
                ) : (
                  <div className="py-8 text-center text-[11px] font-serif italic text-gray-400">No verses found</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ACTIONS SECTION: Desktop Unchanged / Mobile Profile Only */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* Give Button - Desktop only */}
          <Link 
            href="/DonatePage"
            className="hidden lg:flex relative group overflow-hidden px-4 py-1.5 rounded-full transition-all duration-300 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-primary bg-[length:200%_auto] animate-gradient-x opacity-10 group-hover:opacity-20"></div>
            <div className="flex items-center gap-2 relative z-10">
              <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                volunteer_activism
              </span>
              <span className="text-[11px] font-black text-primary uppercase tracking-[0.1em]">
                Give
              </span>
            </div>
          </Link>

          <button className="hidden lg:block p-1.5 rounded-full hover:bg-white/40 transition-colors relative">
            <span className="material-symbols-outlined text-on-surface-variant text-[22px]">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full border border-white"></span>
          </button>

          <Link href="/settings/profile" className="flex items-center gap-2 pl-2 lg:pl-4 lg:border-l lg:border-white/30 hover:opacity-80 transition-all">
            <div className="text-right hidden md:block">
              <p className="text-[10px] font-black text-[#3C3830] uppercase tracking-widest leading-none mb-0.5">{userName.split(' ')[0]}</p>
              <p className="text-[9px] text-primary font-bold uppercase opacity-60 leading-none">Member</p>
            </div>
            <div className="relative">
              {userImage ? (
                <Image src={userImage} alt={userName} className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center border-2 border-white">
                  <span className="material-symbols-outlined text-primary text-lg">person</span>
                </div>
              )}
            </div>
          </Link>
        </div>
      </header>

      {/* MOBILE SEARCH OVERLAY (POP-UP STYLE) */}
      {isMobileSearchOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-[#FDFBF7]/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="p-6 pt-20" ref={searchRef}>
            <div className="flex items-center gap-3 bg-white border border-primary/20 px-4 py-3 rounded-2xl shadow-xl shadow-primary/5">
              <span className="material-symbols-outlined text-primary">search</span>
              <input 
                autoFocus
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search the Word..."
                className="w-full bg-transparent border-none focus:ring-0 text-lg font-serif"
              />
              <button onClick={() => {setIsMobileSearchOpen(false); setQuery('');}}>
                <span className="material-symbols-outlined text-gray-400">close</span>
              </button>
            </div>

            {/* Mobile Results */}
            <div className="mt-8 space-y-6 overflow-y-auto max-h-[50vh]">
              {results.map((res, i) => (
                <Link key={i} href={`/bible/${res.book.toLowerCase()}?chapter=${res.chapter}&verse=${res.verse}`} onClick={() => setIsMobileSearchOpen(false)} className="block border-b border-gray-100 pb-4">
                  <span className="text-[10px] font-black text-primary uppercase">{res.book} {res.chapter}:{res.verse}</span>
                  <p className="text-sm font-serif text-[#3C3830] leading-relaxed mt-1">{res.text}</p>
                </Link>
              ))}
            </div>

            {/* GIVE BUTTON AS POP-UP ACTION */}
            <Link 
              href="/DonatePage" 
              className="mt-12 w-full py-4 bg-primary text-white rounded-2xl font-black text-xs tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-3 decoration-none"
            >
              <span className="material-symbols-outlined text-[18px]">volunteer_activism</span>
              <span>GIVE TO THE MINISTRY</span>
            </Link>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          animation: gradient-x 3s ease infinite;
        }
      `}</style>
    </>
  );
}