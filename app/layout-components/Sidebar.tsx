'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useTheme } from '../context/ThemeContext';
import { useLayoutShell } from './layout-shell-context';

import logo from '@/public/logo.png';
import { UnifrakturMaguntia } from 'next/font/google';

const gothicFont = UnifrakturMaguntia({
  weight: '400',
  subsets: ['latin'],
});

export default function Sidebar() {
  const { renderInLayout } = useLayoutShell();
  const { data: session } = useSession();
  const pathname = usePathname();
  const { isDark } = useTheme();
  const isAdmin = session?.user?.role === 'ADMIN';

  // Menu Control States
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isExploreRowOpen, setIsExploreRowOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const moreMenuRef = useRef<HTMLDivElement>(null);
  const createMenuRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Track window scroll position to show support banner below top navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 1. In your component file (or top of page):

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setIsMoreMenuOpen(false);
      }
      if (createMenuRef.current && !createMenuRef.current.contains(event.target as Node)) {
        setIsCreateMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (!renderInLayout) {
    return null;
  }

  // Desktop primary items
  const primaryNavItems = [
    { icon: 'home', label: 'Home', href: '/dashboard' },
    { icon: 'subscriptions', label: 'Bible', href: '/bible' },
    { icon: 'chat_bubble', label: 'Chat', href: '/ai/chat' },
  ];

  // Mobile navigation items (with devotionals captured)
  const mobileNavItems = [
    { icon: 'home', label: 'Home', href: '/dashboard' },
    { icon: 'auto_stories', label: 'Devotionals', href: '/sanctuary/devotionals' },
    { icon: 'subscriptions', label: 'Bible', href: '/bible' },
    { icon: 'chat_bubble', label: 'Chat', href: '/ai/chat' },
  ];

  const extendedSpiritualItems = [
    { label: 'Devotionals', href: '/sanctuary/devotionals' },
    { label: 'Quiet Time', href: '/quiet-time' },
    { label: 'Journal', href: '/journal' },
    { label: 'Prayer', href: '/prayers' },
    { label: 'Community', href: '/community' },
  ];

  return (
    <>
      {/* ========================================================= */}
      {/* 1. MOBILE TOP NAVBAR (WITH HAMBURGER & AVATAR)            */}
      {/* ========================================================= */}
      <header
        className={`lg:hidden fixed top-0 left-0 right-0 z-[80] transition-all duration-300 border-b backdrop-blur-xl px-4 py-3 flex items-center justify-between ${
          isDark
            ? 'bg-zinc-950/90 border-white/10 text-white'
            : 'bg-white/90 border-slate-200/80 text-slate-800'
        }`}
      >
        {/* Left: Hamburger Toggle & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-1 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800"
            aria-label="Toggle Menu"
          >
            <span className="material-symbols-outlined text-2xl block">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>

          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src={logo}
              alt="Logo"
              width={28}
              height={28}
              className="object-contain"
            />
          </Link>
        </div>

        {/* Right: User Avatar */}
        <Link
          href="/settings"
          className="relative w-8 h-8 rounded-full overflow-hidden ring-2 ring-amber-500/30 flex items-center justify-center shrink-0"
        >
          <Image
            src={
              session?.user?.image ||
              `https://ui-avatars.com/api/?name=${
                session?.user?.name || 'U'
              }&background=ea580c&color=fff`
            }
            alt="Profile Avatar"
            fill
            className="object-cover"
          />
        </Link>
      </header>

      {/* ========================================================= */}
      {/* 2. MOBILE SCROLL-ONLY GIVE / SUPPORT BANNER BELOW NAVBAR  */}
      {/* ========================================================= */}
      {isScrolled && (
        <div
          className={`lg:hidden fixed top-[53px] left-0 right-0 z-[75] px-4 py-2 border-b backdrop-blur-md shadow-md animate-in slide-in-from-top-2 fade-in duration-200 flex items-center justify-between ${
            isDark
              ? 'bg-zinc-900/95 border-white/10 text-white'
              : 'bg-slate-50/95 border-slate-200 text-slate-800'
          }`}
        >
          <span className="text-xs font-medium text-slate-500 dark:text-zinc-400">
            Need assistance or want to give?
          </span>

          <div className="flex items-center gap-2">
            <Link
              href="/support"
              className={`text-xs px-3 py-1 rounded-lg border font-medium transition-colors ${
                isDark
                  ? 'border-zinc-700 bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
                  : 'border-slate-300 bg-white hover:bg-slate-100 text-slate-700'
              }`}
            >
              Support
            </Link>
            <Link
              href="/DonatePage"
              className="text-xs px-3 py-1 rounded-lg bg-[#FF6221] text-white font-medium hover:bg-[#e65217] transition-colors shadow-sm flex items-center gap-1"
            >
              <span>Give</span>
              <span className="material-symbols-outlined text-xs">add</span>
            </Link>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. MOBILE HAMBURGER SLIDE-OUT MENU DRAWER                 */}
      {/* ========================================================= */}
      {isMobileMenuOpen && (
        <div
          className={`lg:hidden fixed inset-0 top-[53px] z-[70] backdrop-blur-xl transition-all duration-300 animate-in fade-in slide-in-from-top-3 ${
            isDark ? 'bg-zinc-950/95 text-white' : 'bg-white/95 text-slate-800'
          }`}
        >
          <div className="p-6 space-y-4 flex flex-col h-full">
            <div className="space-y-1">
              <Link
                href="/settings"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isDark ? 'hover:bg-zinc-900' : 'hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined">person</span>
                Profile Settings
              </Link>
              <Link
                href="/support"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isDark ? 'hover:bg-zinc-900' : 'hover:bg-slate-100'
                }`}
              >
                <span className="material-symbols-outlined">help</span>
                Help & Support
              </Link>
            </div>

            <div className="pt-4 border-t border-slate-200 dark:border-white/10 mt-auto pb-12">
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  signOut();
                }}
                className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
              >
                <span className="material-symbols-outlined">logout</span>
                Sign out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. DESKTOP SIDEBAR (UNTOUCHED VIEW)                        */}
      {/* ========================================================= */}
      <aside
        className={`hidden lg:flex flex-col h-screen fixed top-0 left-0 w-64 z-50 backdrop-blur-xl border-r px-6 py-6 select-none transition-colors duration-300 ${
          isDark
            ? 'bg-black/40 border-white/10'
            : 'bg-white/40 border-slate-200/50 text-slate-700'
        }`}
      >
        <div className="mb-8 pl-2 shrink-0">
          <Link href="/dashboard" className="inline-block">
            <div className="flex items-center gap-2.5">
  <Image
    src={logo}
    alt="WalkWithMe Logo"
    priority
    className="h-16 w-auto object-contain select-none pointer-events-none"
  />
  <span className={`${gothicFont.className} text-base text-slate-900 dark:text-zinc-100 tracking-wider`}>
    WalkWithMe
  </span>
</div>
          </Link>
        </div>

        {/* Core Navigation Items */}
        <nav className="space-y-1 flex-1">
          {primaryNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-200 group text-[15px] ${
                  isActive
                    ? isDark
                      ? 'text-white font-semibold bg-white/10'
                      : 'text-slate-900 font-semibold bg-slate-900/5'
                    : isDark
                    ? 'text-gray-400 hover:text-white hover:bg-white/10'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-900/5'
                }`}
              >
                <span
                  className="material-symbols-outlined text-[24px] transition-colors"
                  style={{
                    fontVariationSettings: isActive
                      ? "'FILL' 1, 'wght' 400"
                      : "'FILL' 0, 'wght' 300",
                  }}
                >
                  {item.icon}
                </span>
                <span className="text-[16px]">{item.label}</span>
              </Link>
            );
          })}

          <button
            onClick={() => setIsExploreRowOpen(!isExploreRowOpen)}
            className={`w-full flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all duration-200 group text-[15px] ${
              isExploreRowOpen
                ? isDark
                  ? 'text-orange-400 font-semibold bg-orange-500/10'
                  : 'text-orange-600 font-semibold bg-orange-500/5'
                : isDark
                ? 'text-gray-400 hover:text-white hover:bg-white/10'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-900/5'
            }`}
          >
            <span className="material-symbols-outlined text-[23px] transition-colors">
              search
            </span>
            <span>More</span>
            <span className="ml-auto text-xs opacity-40 material-symbols-outlined">
              {isExploreRowOpen ? 'expand_less' : 'navigate_next'}
            </span>
          </button>

          <Link
            href="/settings"
            className={`flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all text-[15px] ${
              isDark
                ? 'text-gray-400 hover:text-white hover:bg-white/10'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-900/5'
            }`}
          >
            <div className="w-[23px] h-[23px] rounded-full overflow-hidden bg-amber-500 relative flex items-center justify-center ring-2 ring-amber-500/20">
              <Image
                src={
                  session?.user?.image ||
                  `https://ui-avatars.com/api/?name=${
                    session?.user?.name || 'U'
                  }&background=ea580c&color=fff`
                }
                alt="Profile"
                fill
                className="object-cover"
              />
            </div>
            <span>Profile</span>
          </Link>

          {isAdmin && (
            <Link
              href="/admin"
              className={`flex items-center gap-4 px-3 py-2.5 rounded-xl transition-all text-[15px] ${
                isDark
                  ? 'text-gray-400 hover:text-white hover:bg-white/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-900/5'
              }`}
            >
              <span className="material-symbols-outlined text-[23px]">shield_person</span>
              <span>Admin</span>
            </Link>
          )}

          <div className="pt-4 relative" ref={createMenuRef}>
            <button
              onClick={() => setIsCreateMenuOpen(!isCreateMenuOpen)}
              className="w-full bg-[#FF6221] hover:bg-[#e65217] text-white font-medium text-[14px] py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 transition-colors shadow-sm"
            >
              <span>Update</span>
              <span className="material-symbols-outlined text-xs leading-none">
                arrow_drop_down
              </span>
            </button>

            {isCreateMenuOpen && (
              <div
                className={`absolute left-0 right-0 mt-2 rounded-xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150 ${
                  isDark
                    ? 'bg-gray-800 border border-gray-700'
                    : 'bg-white border border-slate-200'
                }`}
              >
                <Link
                  href="/journal?new=true"
                  className={`flex items-center gap-2 px-4 py-2 text-xs transition-colors ${
                    isDark
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">edit_note</span>{' '}
                  Write Journal Entry
                </Link>
                <Link
                  href="/prayers?new=true"
                  className={`flex items-center gap-2 px-4 py-2 text-xs transition-colors ${
                    isDark
                      ? 'text-gray-300 hover:bg-gray-700'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-sm">potted_plant</span>{' '}
                  Add Prayer Point
                </Link>
              </div>
            )}
          </div>
        </nav>

        <div
          className={`relative mt-auto pt-4 border-t ${
            isDark ? 'border-white/10' : 'border-slate-200/40'
          }`}
          ref={moreMenuRef}
        >
          <button
            onClick={() => setIsMoreMenuOpen(!isMoreMenuOpen)}
            className={`w-full flex items-center gap-4 px-3 py-3 rounded-xl transition-all text-[15px] ${
              isDark
                ? 'text-gray-400 hover:text-white hover:bg-white/10'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-900/5'
            }`}
          >
            <span className="material-symbols-outlined text-[23px] transition-colors">
              menu
            </span>
            <span
              className={`font-medium ${
                isDark ? 'text-gray-300' : 'text-slate-700'
              }`}
            >
              Settings
            </span>
          </button>

          {isMoreMenuOpen && (
            <div
              className={`absolute bottom-full left-0 w-56 rounded-2xl shadow-2xl py-2 mb-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200 ${
                isDark
                  ? 'bg-gray-800 border border-gray-700'
                  : 'bg-white border border-slate-200'
              }`}
            >
              <Link
                href="/settings"
                className={`flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors ${
                  isDark ? 'text-gray-300 hover:bg-gray-700' : 'hover:bg-slate-50'
                }`}
              >
                Appearance
              </Link>
              <Link
                href="/settings"
                className={`flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors ${
                  isDark ? 'text-gray-300 hover:bg-gray-700' : 'hover:bg-slate-50'
                }`}
              >
                Settings
              </Link>
              <button
                onClick={() => signOut()}
                className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Sign out
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 5. MOBILE BOTTOM FIXED STRIP NAV BAR                       */}
      {/* ========================================================= */}
      <div
        className={`lg:hidden fixed bottom-3 left-3 right-3 rounded-2xl backdrop-blur-xl border z-[90] px-2 py-2 shadow-2xl transition-all duration-300 ${
          isDark
            ? 'bg-zinc-950/90 border-white/10 text-white'
            : 'bg-white/90 border-slate-200/80 text-slate-800'
        }`}
      >
        <div className="flex items-center justify-between max-w-md mx-auto px-1">
          {mobileNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-1 px-1.5 rounded-xl transition-colors ${
                  isActive
                    ? isDark
                      ? 'text-white font-bold'
                      : 'text-slate-950 font-bold'
                    : isDark
                    ? 'text-gray-400'
                    : 'text-slate-500'
                }`}
              >
                <span className="material-symbols-outlined text-[19px]">
                  {item.icon}
                </span>
                <span className="text-[9.5px] tracking-tight font-medium">
                  {item.label}
                </span>
              </Link>
            );
          })}

          <button
            onClick={() => setIsExploreRowOpen(!isExploreRowOpen)}
            className={`flex flex-col items-center gap-0.5 py-1 px-1.5 rounded-xl transition-colors ${
              isExploreRowOpen
                ? isDark
                  ? 'text-orange-400 font-bold'
                  : 'text-[#FF6221] font-bold'
                : isDark
                ? 'text-gray-400'
                : 'text-slate-500'
            }`}
          >
            <span className="material-symbols-outlined text-[19px]">search</span>
            <span className="text-[9.5px] tracking-tight font-medium">
              More
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 6. SUB-NAVIGATION EXPLORE ROW / MOBILE DRAWER            */}
      {/* ========================================================= */}
      {isExploreRowOpen && (
        <div
          className={`w-full fixed left-0 right-0 lg:top-14 bottom-20 lg:bottom-auto z-40 transition-all ease-out animate-in slide-in-from-bottom-2 lg:slide-in-from-top-2 duration-300 ${
            isDark ? 'bg-zinc-950/95 border-white/10' : 'bg-white/95 border-slate-200'
          } border-t lg:border-b shadow-xl backdrop-blur-md`}
        >
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8 h-14 lg:h-12 flex items-center justify-between gap-4 relative lg:pl-72 select-none">
            <div className="flex items-center relative flex-1 min-w-0 h-full overflow-hidden">
              <button
                onClick={() => handleScroll('left')}
                className={`absolute left-0 z-10 w-8 h-full flex items-center justify-start bg-gradient-to-r transition-opacity text-slate-400 ${
                  isDark
                    ? 'from-zinc-950 via-zinc-950/70 to-transparent'
                    : 'from-white via-white/70 to-transparent'
                }`}
              />

              <div
                ref={scrollContainerRef}
                className="flex items-center gap-2 overflow-x-auto h-full w-full no-scrollbar px-4"
              >
                {extendedSpiritualItems.map((subItem) => {
                  const isSubActive = pathname === subItem.href;
                  return (
                    <Link
                      key={subItem.label}
                      href={subItem.href}
                      onClick={() => setIsExploreRowOpen(false)}
                      className={`px-3.5 py-1.5 text-[12px] lg:text-[13px] font-medium rounded-full transition-all shrink-0 ${
                        isSubActive
                          ? isDark
                            ? 'bg-white text-black'
                            : 'bg-slate-900 text-white'
                          : isDark
                          ? 'bg-zinc-900 text-zinc-300 hover:bg-zinc-800'
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                      }`}
                    >
                      {subItem.label}
                    </Link>
                  );
                })}
              </div>

              <button
                onClick={() => handleScroll('right')}
                className={`absolute right-0 z-10 w-8 h-full flex items-center justify-end bg-gradient-to-l transition-opacity text-slate-400 ${
                  isDark
                    ? 'from-zinc-950 via-zinc-950/70 to-transparent'
                    : 'from-white via-white/70 to-transparent'
                }`}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}