/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useTheme } from '../context/ThemeContext';
import { useLayoutShell } from './layout-shell-context';
import logo from '@/public/logo.png';


export default function Header() {
  const { renderInLayout } = useLayoutShell();
  const { data: session } = useSession();
  const pathname = usePathname();
  const { isDark } = useTheme();
  const [userName, setUserName] = useState<string>('Guest');
  const [userImage, setUserImage] = useState<string>('');
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  if (!renderInLayout) {
    return null;
  }

  const mobileNavItems = [
    { label: 'Home', href: '/dashboard', icon: 'home' },
    { label: 'Bible', href: '/bible', icon: 'menu_book' },
    { label: 'Quiet Time', href: '/quiet-time', icon: 'self_improvement' },
    { label: 'Journal', href: '/journal', icon: 'edit_note' },
    { label: 'Prayer', href: '/prayers', icon: 'volunteer_activism' },
    { label: 'Community', href: '/community', icon: 'groups' },
    { label: 'Settings', href: '/settings', icon: 'settings' },
  ];

  return (
    <>
      <header 
        className={`fixed top-0 left-0 lg:left-56 right-0 z-40 flex justify-between items-center px-4 md:px-6 py-2 backdrop-blur-xl border-b shadow-lg transition-all duration-500 h-14 
        ${isDark ? 'bg-zinc-950/75 border-white/10 text-zinc-50 shadow-black/20' : 'bg-white/40 border-white/50 text-slate-900 shadow-slate-200/70'}
        ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 lg:translate-y-0 lg:opacity-100'}`}
      >
        
        {/* BRAND SECTION - Mobile only */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open navigation menu"
            aria-expanded={isMobileMenuOpen}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-orange-200 bg-orange-500/10 text-orange-600 shadow-sm transition-all duration-200 hover:bg-orange-500/20 active:scale-95"
          >
            <span className="material-symbols-outlined text-[20px]">menu</span>
          </button>
          
          {/* Logo Container */}
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <Image
              src={logo} // Adjust path to match logo image location in your public folder
              alt="WalkWithMe Logo"
              width={32}
              height={32}
              priority
              className="h-16 w-auto object-contain select-none pointer-events-none"
            />
            
          </Link>
        </div>

        {/* MOBILE SEARCH BUTTON */}
        <button 
          onClick={() => setIsMobileSearchOpen(true)}
          className={`lg:hidden w-8 h-8 flex items-center justify-center rounded-full active:scale-90 transition-all ml-auto ${isDark ? 'bg-orange-500/15 text-orange-400' : 'bg-orange-500/10 text-orange-600'}`}
        >
          <span className="material-symbols-outlined text-[20px]">search</span>
        </button>

        {/* DESKTOP SEARCH BAR */}
        <div className="hidden lg:flex flex-grow items-center max-w-md relative mx-6" ref={searchRef}>
          <div className="w-full flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-white/60 px-4 py-2 rounded-xl text-gray-600 focus-within:bg-white/80 focus-within:border-orange-300 focus-within:shadow-lg transition-all duration-300 group">
            <span className={`material-symbols-outlined text-[18px] transition-colors ${loading ? 'animate-spin' : 'group-focus-within:text-orange-500'}`}>
              {loading ? 'sync' : 'search'}
            </span>
            <input 
              type="text" 
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => query.length >= 3 && setShowDropdown(true)}
              placeholder="Search the Word..." 
              className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-gray-400 p-0 outline-none"
            />
            {query && (
              <button onClick={() => { setQuery(''); setResults([]); }} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Results Dropdown */}
          {showDropdown && query.length >= 3 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-xl border border-white/60 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="max-h-[400px] overflow-y-auto p-2">
                {loading ? (
                  <div className="py-12 text-center">
                    <span className="material-symbols-outlined animate-spin text-orange-500 text-3xl">sync</span>
                    <p className="text-xs text-gray-500 mt-2">Searching scriptures...</p>
                  </div>
                ) : results.length > 0 ? (
                  results.map((res, i) => (
                    <Link 
                      key={i}
                      href={`/bible/${res.book.toLowerCase()}?chapter=${res.chapter}&verse=${res.verse}`}
                      onClick={() => { setShowDropdown(false); setQuery(''); }}
                      className="block p-3 rounded-xl hover:bg-orange-50 transition-all duration-200 group"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[9px] font-black text-orange-600 uppercase tracking-wider">{res.book} {res.chapter}:{res.verse}</span>
                        <span className="text-[8px] text-gray-400">•</span>
                        <span className="text-[8px] text-gray-500">Verse</span>
                      </div>
                      <p className="text-xs font-serif text-gray-700 leading-relaxed line-clamp-2 group-hover:text-gray-900">
                        {res.text}
                      </p>
                    </Link>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <span className="material-symbols-outlined text-gray-300 text-3xl">search_off</span>
                    <p className="text-xs text-gray-400 mt-2">No verses found for "{query}"</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex items-center gap-2">
          {/* Desktop Give Button */}
          <Link 
            href="/DonatePage"
            className="hidden lg:flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 active:scale-95"
          >
            <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              volunteer_activism
            </span>
            <span className="text-[10px] font-black uppercase tracking-wider">Give</span>
          </Link>

          {/* Desktop Notification */}
          <button className="hidden lg:flex relative w-8 h-8 items-center justify-center rounded-full hover:bg-white/60 transition-colors">
            <span className="material-symbols-outlined text-gray-600 text-[20px]">notifications_none</span>
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-orange-500 rounded-full ring-2 ring-white"></span>
          </button>

          {/* User Profile */}
          <Link href="/settings/profile" className="flex items-center gap-2 pl-2 lg:pl-3 lg:border-l lg:border-gray-200 hover:opacity-80 transition-all group">
            <div className="text-right hidden sm:block">
              <p className="text-[11px] font-bold text-gray-700 uppercase tracking-wider leading-tight">
                {userName.split(' ')[0]}
              </p>
              <p className="text-[8px] text-orange-500 font-bold uppercase tracking-wider">Gold Member</p>
            </div>
            <div className="relative">
              {userImage ? (
                <Image 
                  src={userImage} 
                  alt={userName} 
                  className="w-8 h-8 rounded-lg object-cover ring-2 ring-white shadow-md group-hover:ring-orange-200 transition-all"
                  width={32}
                  height={32}
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                  <span className="material-symbols-outlined text-white text-[18px]">person</span>
                </div>
              )}
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full ring-2 ring-white"></div>
            </div>
          </Link>
        </div>
      </header>

      {/* MOBILE DRAWER MENU */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[80]">
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/55 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Close navigation menu"
          />
          <div className={`relative flex h-full w-[84%] max-w-sm flex-col border-r p-5 shadow-2xl transition-all ${isDark ? 'border-white/10 bg-zinc-950 text-zinc-50' : 'border-slate-200 bg-white text-slate-900'}`}>
            <div className="flex items-center justify-between pb-5">
              <div className="flex items-center gap-3">
                <Image
                  src={logo}
                  alt="WalkWithMe Logo"
                  width={36}
                  height={36}
                  className="h-16 w-auto object-contain select-none pointer-events-none"
                />
                <div>
                  <p className="text-sm font-black tracking-tight">WalkWithMe</p>
                  <p className={`text-[11px] ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Spiritual guidance in one place</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex h-8 w-8 items-center justify-center rounded-full ${isDark ? 'bg-white/10 text-zinc-200' : 'bg-slate-100 text-slate-600'}`}
                aria-label="Close navigation menu"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <nav className="flex-1 space-y-2">
              {mobileNavItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all ${isActive ? (isDark ? 'bg-orange-500/15 text-orange-400' : 'bg-orange-50 text-orange-600') : (isDark ? 'text-zinc-300 hover:bg-white/10' : 'text-slate-700 hover:bg-slate-100')}`}
                  >
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className={`rounded-2xl border px-3 py-3 text-sm ${isDark ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
              <p className={`text-[11px] font-semibold uppercase tracking-[0.2em] ${isDark ? 'text-zinc-400' : 'text-slate-500'}`}>Quick access</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Link href="/DonatePage" onClick={() => setIsMobileMenuOpen(false)} className="rounded-full bg-gradient-to-r from-orange-500 to-orange-600 px-3 py-1.5 text-[11px] font-semibold text-white">Support</Link>
                <Link href="/settings" onClick={() => setIsMobileMenuOpen(false)} className={`rounded-full px-3 py-1.5 text-[11px] font-semibold ${isDark ? 'bg-white/10 text-zinc-200' : 'bg-white text-slate-700'}`}>Settings</Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MOBILE SEARCH MODAL */}
      {isMobileSearchOpen && (
        <div className="lg:hidden fixed inset-0 z-[60] bg-white/95 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="flex flex-col h-full">
            <div className="sticky top-0 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center gap-3">
              <button 
                onClick={() => { setIsMobileSearchOpen(false); setQuery(''); setResults([]); }}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
              >
                <span className="material-symbols-outlined text-gray-600 text-[18px]">arrow_back</span>
              </button>
              <div className="flex-1 flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-xl">
                <span className="material-symbols-outlined text-orange-500 text-[18px]">search</span>
                <input 
                  autoFocus
                  type="text"
                  value={query}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder="Search the Word..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-serif outline-none"
                />
                {query && (
                  <button onClick={() => { setQuery(''); setResults([]); }}>
                    <span className="material-symbols-outlined text-gray-400 text-[16px]">close</span>
                  </button>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <div className="py-20 text-center">
                  <span className="material-symbols-outlined animate-spin text-orange-500 text-4xl">sync</span>
                  <p className="text-sm text-gray-500 mt-3">Searching scriptures...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-3">
                  {results.map((res, i) => (
                    <Link 
                      key={i} 
                      href={`/bible/${res.book.toLowerCase()}?chapter=${res.chapter}&verse=${res.verse}`} 
                      onClick={() => setIsMobileSearchOpen(false)}
                      className="block p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                    >
                      <span className="text-[10px] font-black text-orange-600 uppercase tracking-wider">{res.book} {res.chapter}:{res.verse}</span>
                      <p className="text-sm font-serif text-gray-700 leading-relaxed mt-2 line-clamp-3">{res.text}</p>
                    </Link>
                  ))}
                </div>
              ) : query.length >= 3 ? (
                <div className="py-20 text-center">
                  <span className="material-symbols-outlined text-gray-300 text-4xl">search_off</span>
                  <p className="text-sm text-gray-400 mt-3">No verses found for "{query}"</p>
                </div>
              ) : (
                <div className="py-20 text-center">
                  <span className="material-symbols-outlined text-gray-300 text-4xl">menu_book</span>
                  <p className="text-sm text-gray-400 mt-3">Type at least 3 characters to search</p>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-white/80">
              <Link 
                href="/DonatePage" 
                onClick={() => setIsMobileSearchOpen(false)}
                className="w-full flex items-center justify-center gap-3 py-3.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-black text-xs tracking-widest shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all"
              >
                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>volunteer_activism</span>
                <span>SUPPORT THE MINISTRY</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}