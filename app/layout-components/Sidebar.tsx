'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Sidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { icon: 'grid_view', label: 'Home', href: '/', key: 'dashboard' },
    { icon: 'menu_book', label: 'Bible', href: '/bible', key: 'bible' },
    { icon: 'library_books', label: 'Devotionals', href: '/sanctuary/devotionals', key: 'devotionals' },
    { icon: 'bedtime', label: 'Quiet Time', href: '/quiet-time', key: 'quiet-time' },
    { icon: 'self_improvement', label: 'AI spiritual assistance', href: '/ai/chat', key: 'chat' },
    { icon: 'history_edu', label: 'Journal', href: '/journal', key: 'history' },
    { icon: 'potted_plant', label: 'Prayers', href: '/prayers', key: 'prayers' },
    { icon: 'hub', label: 'Community', href: '/community', key: 'community' },
    { icon: 'settings', label: 'Settings', href: '/settings', key: 'profile' },
  ];

  return (
    <>
      {/* --- DESKTOP SIDEBAR (CLEAN GLASS) --- */}
      <aside className="hidden lg:flex flex-col h-screen fixed top-0 left-0 w-56 z-50 bg-white/40 backdrop-blur-xl border-r border-white/60 shadow-xl">
        
        <div className="flex-1 overflow-y-auto custom-sidebar-scrollbar flex flex-col">
          
          {/* Brand Header */}
          <div className="px-6 pt-6 pb-4 shrink-0 border-b border-white/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 bg-orange-500 flex items-center justify-center rounded-xl shadow-lg shadow-orange-500/30">
                <span className="material-symbols-outlined text-white text-[18px]">self_improvement</span>
              </div>
              <div>
                <h1 className="text-sm text-gray-800 font-black tracking-tight">WalkWithMe</h1>
                <p className="text-[9px] text-gray-500 font-medium tracking-wide">Sanctuary</p>
              </div>
            </div>
          </div>
          
          {/* Main Navigation */}
          <nav className="px-3 py-4 space-y-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.key}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300 group ${
                    isActive
                      ? 'bg-orange-500 text-white shadow-md'
                      : 'text-gray-600 hover:text-orange-600 hover:bg-white/50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isActive ? "'FILL' 1, 'wght' 400" : "'FILL' 0, 'wght' 300" }}>
                    {item.icon}
                  </span>
                  <span className={`text-xs tracking-tight ${isActive ? 'font-semibold' : 'font-medium'}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="ml-auto w-1 h-5 bg-white rounded-full"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          <div className="flex-1" />

          {/* User Profile Section */}
          <div className="p-4 shrink-0 border-t border-white/50">
            <div className="flex items-center gap-3 p-2 bg-white/60 backdrop-blur-sm rounded-xl border border-white/60 mb-3 transition-all hover:bg-white/80">
              <div className="relative">
                <Image
                  src={session?.user?.image || `https://ui-avatars.com/api/?name=${session?.user?.name || 'User'}&background=ea580c&color=fff&bold=true&length=2&size=32`} 
                  className="w-8 h-8 rounded-lg object-cover ring-2 ring-white"
                  alt="Avatar"
                  width={32}
                  height={32}
                />
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-bold text-gray-700 truncate">
                  {session?.user?.name || 'Spiritual Walker'}
                </p>
                <p className="text-[7px] text-orange-500 font-bold tracking-wider uppercase">GOLD ACCESS</p>
              </div>
              <span className="material-symbols-outlined text-orange-400 text-sm">verified</span>
            </div>

            <button 
              onClick={() => signOut()}
              className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-gray-500 hover:text-red-500 hover:bg-red-50 transition-all text-[9px] font-bold tracking-wider uppercase group"
            >
              <span className="material-symbols-outlined text-sm group-hover:scale-110 transition-transform">logout</span>
              Exit Sanctuary
            </button>
          </div>
        </div>
      </aside>

      {/* --- MOBILE NAV (CLEAN SLIDING GRID) --- */}
      <div className="lg:hidden fixed bottom-5 left-5 right-5 z-[100]">
        {/* Sliding Grid Menu */}
        <div 
          className={`
            absolute bottom-full left-0 right-0 mb-3
            transition-all duration-300 ease-out origin-bottom
            ${isMobileMenuOpen 
              ? 'opacity-100 scale-y-100 translate-y-0 pointer-events-auto' 
              : 'opacity-0 scale-y-95 translate-y-4 pointer-events-none'
            }
          `}
        >
          <div className="bg-white/80 backdrop-blur-xl border border-white/80 rounded-2xl p-3 shadow-2xl">
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`
                      flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl transition-all duration-200
                      ${isActive 
                        ? 'bg-orange-500 text-white shadow-md' 
                        : 'text-gray-600 hover:text-orange-500 hover:bg-white/60'
                      }
                    `}
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span className={`text-[8px] font-bold uppercase tracking-wide ${isActive ? 'text-white' : 'text-gray-500'}`}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Floating Action Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`
            w-full bg-white/80 backdrop-blur-xl border border-white/80 px-4 py-2.5
            flex items-center justify-between rounded-xl transition-all duration-300
            hover:bg-white/90 active:scale-[0.98] cursor-pointer shadow-lg
            ${isMobileMenuOpen ? 'border-orange-300' : ''}
          `}
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center shadow-md">
              <span className="material-symbols-outlined text-white text-[16px]">menu</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[8px] text-gray-400 font-black uppercase tracking-wider">Navigate</span>
              <span className="text-[11px] text-gray-700 font-bold tracking-tight">Sanctuary Menu</span>
            </div>
          </div>
          <span className={`material-symbols-outlined text-gray-400 text-base transition-all duration-300 ${isMobileMenuOpen ? 'rotate-180' : ''}`}>
            expand_less
          </span>
        </button>
      </div>
    </>
  );
}