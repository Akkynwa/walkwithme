'use client';

import React from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const navItems = [
    { icon: 'grid_view', label: 'Home', href: '/', key: 'dashboard' },
    { icon: 'menu_book', label: 'Bible', href: '/bible', key: 'bible' },
    { icon: 'library_books', label: 'Devotionals', href: '/sanctuary/devotionals', key: 'devotionals' },
    { icon: 'bedtime', label: 'Quiet Time', href: '/quiet-time', key: 'quiet-time' },
    { icon: 'auto_awesome', label: 'AI Chat', href: '/ai/chat', key: 'chat' },
    { icon: 'history_edu', label: 'Journal', href: '/journal', key: 'history' },
    { icon: 'potted_plant', label: 'Prayers', href: '/prayers', key: 'prayers' },
    { icon: 'hub', label: 'Community', href: '/community', key: 'community' },
    { icon: 'settings', label: 'Settings', href: '/settings', key: 'profile' },
  ];

  return (
    <>
      {/* --- DESKTOP SIDEBAR (ULTRA GLASS) --- */}
      <aside className="hidden lg:flex flex-col h-screen fixed top-0 left-0 w-64 z-50 bg-white/10 backdrop-blur-2xl border-r border-white/20 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)]">
        
        {/* SCROLLABLE AREA */}
        <div className="flex-1 overflow-y-auto custom-sidebar-scrollbar flex flex-col">
          
          {/* Brand Header */}
          <div className="p-8 shrink-0">
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-orange-400 flex items-center justify-center rounded-2xl shadow-lg shadow-orange-500/20">
                <span className="material-symbols-outlined text-white text-[22px]">auto_awesome</span>
              </div>
              <div className="flex flex-col">
                <h1 className="text-lg text-[#3C3830] font-black tracking-tighter">WalkWithMe</h1>
              </div>
            </div>
          </div>
          
          {/* Main Navigation */}
          <nav className="px-4 space-y-1 mb-10">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-500 ${
                    isActive
                      ? 'bg-orange-400 text-white shadow-xl shadow-orange-500/20 scale-[1.02]'
                      : 'text-gray-500/70 hover:text-orange-500 hover:bg-white/20 hover:backdrop-blur-md'
                  }`}
                >
                  <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: isActive ? "'FILL' 1, 'wght' 500" : "'FILL' 0, 'wght' 300" }}>
                    {item.icon}
                  </span>
                  <span className={`text-sm tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div className="py-10" />

          {/* User Profile Section (Floating Glass Card) */}
          <div className="mt-auto p-4 shrink-0">
            <div className="flex items-center gap-3 p-3 bg-white/20 backdrop-blur-xl rounded-2xl border border-white/30 shadow-sm mb-3">
              <div className="relative">
                <Image 
                  src={session?.user?.image || `https://ui-avatars.com/api/?name=${session?.user?.name || 'User'}&background=fb923c&color=fff`} 
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-white/50"
                  alt="Avatar"
                />
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white/50 rounded-full"></div>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-[11px] font-black text-[#3C3830] truncate uppercase">
                  {session?.user?.name || 'Spiritual Walker'}
                </span>
                <span className="text-[9px] text-orange-500 font-bold tracking-widest">GOLD ACCESS</span>
              </div>
            </div>

            <button 
              onClick={() => signOut()}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-gray-400 hover:text-red-500 hover:bg-red-500/10 transition-all text-[10px] font-black tracking-widest uppercase"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              Exit Sanctuary
            </button>
          </div>
        </div>
      </aside>

      {/* --- MOBILE NAV (FLOATING GLASS ISLAND) --- */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 bg-white/10 backdrop-blur-2xl border border-white/20 px-2 py-2 z-[100] flex justify-around shadow-2xl rounded-[32px]">
        {navItems.slice(0, 5).map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.key} href={item.href} className="flex flex-col items-center py-1">
              <div className={`w-12 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? 'bg-orange-400 text-white shadow-lg shadow-orange-500/30' : 'text-gray-400'}`}>
                <span className="material-symbols-outlined text-[22px]">{item.icon}</span>
              </div>
              <span className={`text-[9px] mt-1 font-black uppercase tracking-tighter ${isActive ? 'text-orange-600' : 'text-gray-400'}`}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}