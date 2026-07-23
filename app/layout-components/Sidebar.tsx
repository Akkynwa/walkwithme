'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { useTheme } from '../context/ThemeContext';
import { useLayoutShell } from './layout-shell-context';

// Direct import for guaranteed static asset resolution
import logo from '@/public/logo.png';

export default function Sidebar() {
  const { renderInLayout } = useLayoutShell();
  const { data: session } = useSession();
  const pathname = usePathname();
  const { isDark } = useTheme();

  // Menu Control States
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const [isCreateMenuOpen, setIsCreateMenuOpen] = useState(false);
  const [isExploreRowOpen, setIsExploreRowOpen] = useState(false);

  const moreMenuRef = useRef<HTMLDivElement>(null);
  const createMenuRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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

  // Precise scrolling handler for the pills navigation row
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

  // Primary High-Level Substack Core Rows
  const primaryNavItems = [
    { icon: 'home', label: 'Home', href: '/dashboard' },
    { icon: 'subscriptions', label: 'bible', href: '/bible' },
    { icon: 'chat_bubble', label: 'chat', href: '/ai/chat' },
  ];

  // Extended Spiritual Sub-items styled precisely to mimic the categories strip
  const extendedSpiritualItems = [
    { label: 'Bible Scroll', href: '/bible' },
    { label: 'Devotionals', href: '/sanctuary/devotionals' },
    { label: 'Quiet Time', href: '/quiet-time' },
    { label: 'Journal', href: '/journal' },
    { label: 'Prayer', href: '/prayers' },
    { label: 'Community', href: '/community' },
  ];

  return (
    <>
      {/* ========================================================= */}
      {/* 1. DESKTOP SIDEBAR                                         */}
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
      <span className="text-[11px] font-bold tracking-widest uppercase text-slate-800 dark:text-zinc-200">
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
                      : 'text-slate-900 font-semibold'
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

          {/* Explore Trigger Toggle Button */}
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

          {/* Profile Quicklink */}
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

          {/* "Create" Custom Action Dropdown Button Block */}
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

        {/* Bottom "More" Popover Menu Anchor */}
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
                href=""
                className={`flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors ${
                  isDark
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'hover:bg-slate-50'
                }`}
              >
                <span className="material-symbols-outlined text-lg">
                  archive
                </span>{' '}
              </Link>
              <div
                className={`h-[1px] my-1 ${
                  isDark ? 'bg-gray-700' : 'bg-slate-100'
                }`}
              />
              <Link
                href="/settings"
                className={`flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors ${
                  isDark
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'hover:bg-slate-50'
                }`}
              >
                Appearance
              </Link>
              <Link
                href="/settings"
                className={`flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors ${
                  isDark
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'hover:bg-slate-50'
                }`}
              >
                Settings
              </Link>
              <Link
                href="/support"
                className={`flex items-center gap-3 px-4 py-2.5 text-[13px] transition-colors ${
                  isDark
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'hover:bg-slate-50'
                }`}
              >
                Support
              </Link>
              <button
                onClick={() => signOut()}
                className="w-full text-left flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                Sign out
              </button>
              <div
                className={`h-[1px] my-1 ${
                  isDark ? 'bg-gray-700' : 'bg-slate-100'
                }`}
              />
              <Link
                href="/apps"
                className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-medium text-[#FF6221] transition-colors hover:bg-orange-50 dark:hover:bg-orange-900/20"
              >
                Get the app
              </Link>
              <div
                className={`h-[1px] my-1 ${
                  isDark ? 'bg-gray-700' : 'bg-slate-100'
                }`}
              />
              <div className="px-4 py-1.5 flex flex-wrap gap-x-2 gap-y-0.5 text-[10px] text-slate-400 dark:text-gray-500 font-medium">
                <Link href="#" className="hover:underline">
                  About
                </Link>
                <Link href="#" className="hover:underline">
                  Privacy
                </Link>
                <Link href="#" className="hover:underline">
                  Terms
                </Link>
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. MOBILE BOTTOM FIXED STRIP NAV BAR                      */}
      {/* ========================================================= */}
      <div
        className={`lg:hidden fixed bottom-0 left-0 right-0 backdrop-blur-md border-t z-[90] px-4 py-2 shadow-lg ${
          isDark
            ? 'bg-black/80 border-white/10'
            : 'bg-white/80 border-slate-200/60'
        }`}
      >
        <div className="flex items-center justify-around max-w-md mx-auto">
          {primaryNavItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl ${
                  isActive
                    ? isDark
                      ? 'text-white font-bold'
                      : 'text-slate-950 font-bold'
                    : isDark
                    ? 'text-gray-500'
                    : 'text-slate-500'
                }`}
              >
                <span className="material-symbols-outlined text-[22px]">
                  {item.icon}
                </span>
                <span className="text-[11px] tracking-tight font-medium">
                  {item.label}
                </span>
              </Link>
            );
          })}

          <button
            onClick={() => setIsExploreRowOpen(!isExploreRowOpen)}
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-colors ${
              isExploreRowOpen
                ? isDark
                  ? 'text-orange-400 font-bold'
                  : 'text-[#FF6221] font-bold'
                : isDark
                ? 'text-gray-500'
                : 'text-slate-500'
            }`}
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
            <span className="text-[11px] tracking-tight font-medium">
              Explore
            </span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. REPLICATED SUBSTACK STYLE EXPLORE STRIPPER HEADER       */}
      {/* ========================================================= */}
      {isExploreRowOpen && (
        <div
          className={`w-full fixed inset-x-0 top-14 z-30 border-b transition-all animate-in slide-in-from-top-2 duration-300 ${
            isDark ? 'bg-zinc-950 border-white/10' : 'bg-white border-slate-200'
          }`}
        >
          <div className="max-w-[1400px] mx-auto px-4 lg:px-8 h-12 flex items-center justify-between gap-4 relative lg:pl-72 select-none">
            {/* Left Edge Left Arrow Fade Wrapper */}
            <div className="flex items-center relative flex-1 min-w-0 h-full overflow-hidden">
              <button
                onClick={() => handleScroll('left')}
                className={`absolute left-0 z-10 w-8 h-full flex items-center justify-start bg-gradient-to-r transition-opacity text-slate-400 hover:text-slate-700 dark:hover:text-white ${
                  isDark
                    ? 'from-zinc-950 via-zinc-950/70 to-transparent'
                    : 'from-white via-white/70 to-transparent'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  chevron_left
                </span>
              </button>

              {/* Precise Pills Track Row */}
              <div
                ref={scrollContainerRef}
                className="flex items-center gap-1.5 overflow-x-auto h-full w-full no-scrollbar px-6"
              >
                {extendedSpiritualItems.map((subItem) => {
                  const isSubActive = pathname === subItem.href;
                  return (
                    <Link
                      key={subItem.label}
                      href={subItem.href}
                      onClick={() => setIsExploreRowOpen(false)}
                      className={`px-3 py-1 text-[13px] font-medium rounded-full transition-all shrink-0 ${
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

              {/* Right Edge Arrow Fade Wrapper */}
              <button
                onClick={() => handleScroll('right')}
                className={`absolute right-0 z-10 w-8 h-full flex items-center justify-end bg-gradient-to-l transition-opacity text-slate-400 hover:text-slate-700 dark:hover:text-white ${
                  isDark
                    ? 'from-zinc-950 via-zinc-950/70 to-transparent'
                    : 'from-white via-white/70 to-transparent'
                }`}
              >
                <span className="material-symbols-outlined text-base">
                  chevron_right
                </span>
              </button>
            </div>

            {/* Substack Style Right Aligned Input Search Box */}
            <div className="relative shrink-0 w-44 sm:w-60 md:w-64">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-lg pointer-events-none">
                search
              </span>
              <input
                type="text"
                placeholder="Search the scriptures..."
                className={`w-full h-8 pl-8 pr-3 text-[13px] rounded-full outline-none transition-all border ${
                  isDark
                    ? 'bg-zinc-900 border-zinc-800 text-zinc-200 placeholder:text-zinc-500 focus:border-zinc-700'
                    : 'bg-zinc-50 border-zinc-200/80 text-slate-800 placeholder:text-zinc-400 focus:bg-white focus:border-zinc-300'
                }`}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}