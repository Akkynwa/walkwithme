// app/DashboardContent.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '../layout-components/Sidebar';
import { useTheme } from '../context/ThemeContext';

// Components
import { TestimonyScroll } from '../dashboard-components/TestimonyScroll';
import { CommunityFellowshipStream } from '../dashboard-components/CommunityFellowshipStream';
import CommunityFeeder from '../dashboard-components/CommunityFeeder';

type CommunitySection = 'revelations' | 'intercession' | 'cohort';

export default function DashboardContent() {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(true);
  const [isExploreRowOpen, setIsExploreRowOpen] = useState(false);
  
  const [activeFeederSection, setActiveFeederSection] = useState<CommunitySection>('revelations');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      setLoading(false);
    }
  }, [status, router]);

  useEffect(() => {
    const handleStateChange = (e: Event) => {
      setIsExploreRowOpen((e as CustomEvent).detail);
    };
    window.addEventListener('sanctuary-explore-state', handleStateChange);
    return () => window.removeEventListener('sanctuary-explore-state', handleStateChange);
  }, []);

  const extendedSpiritualItems = [
    { label: 'Bible Scroll', href: '/bible' },
    { label: 'Devotionals', href: '/sanctuary/devotionals' },
    { label: 'Quiet Time', href: '/quiet-time' },
    { label: 'Journal Space', href: '/journal' },
    { label: 'Prayers', href: '/prayers' },
    { label: 'Community Hub', href: '/community' },
  ];

  if (status === 'loading' || loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${
        isDark ? 'bg-[#0f0f11]' : 'bg-[#fcfbf9]'
      }`}>
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 bg-primary-600 rounded-xl flex items-center justify-center mb-4 animate-pulse">
            <span className="material-symbols-outlined text-white text-2xl animate-spin">sync</span>
          </div>
          <p className={`font-serif italic text-sm tracking-wide ${isDark ? 'text-zinc-500' : 'text-slate-500'}`}>
            Preparing your Sanctuary...
          </p>
        </div>
      </div>
    );
  }

  const handleFreshPostCreated = (type: CommunitySection, freshData: any) => {
    console.log(`New item generated under context: ${type}`, freshData);
  };

  return (
    <div className={`min-h-screen font-sans antialiased selection:bg-amber-200/50 ${
      isDark ? 'bg-[#0f0f11] text-zinc-200' : 'bg-[#fcfbf9] text-stone-900'
    } flex`}>

      <Sidebar />
      
    <div className="flex-1 lg:ml-64 relative min-w-0 flex flex-col">
  {/* Dynamic Section Navigation Tab Strip (Substack Editorial-style Header) */}
  {/* Adjusted z-index from z-40 to z-20 so it never floats above or locks out your structural sidebar views */}
  <header className={`sticky top-0 z-20 backdrop-blur-md border-b px-4 md:px-8 py-3.5 flex items-center justify-between ${
    isDark ? 'bg-[#0f0f11]/90 border-zinc-800/80' : 'bg-[#fcfbf9]/90 border-stone-200/60'
  }`}>
    <div className="flex items-center gap-6">
      <button 
        onClick={() => setActiveFeederSection('revelations')}
        className={`text-xs font-semibold tracking-tight relative pb-1 transition-colors ${
          activeFeederSection === 'revelations' 
            ? isDark ? 'text-white font-bold' : 'text-stone-900 font-bold'
            : 'text-zinc-500 hover:text-zinc-400'
        }`}
      >
        Reflections
        {activeFeederSection === 'revelations' && (
          <span className="absolute bottom-[-15px] left-0 right-0 h-[2px] bg-primary-600 rounded-full" />
        )}
      </button>
      <button 
        onClick={() => setActiveFeederSection('intercession')}
        className={`text-xs font-semibold tracking-tight relative pb-1 transition-colors ${
          activeFeederSection === 'intercession' 
            ? isDark ? 'text-white font-bold' : 'text-stone-900 font-bold'
            : 'text-zinc-500 hover:text-zinc-400'
        }`}
      >
        Intercession Circle
        {activeFeederSection === 'intercession' && (
          <span className="absolute bottom-[-15px] left-0 right-0 h-[2px] bg-primary-600 rounded-full" />
        )}
      </button>
    </div>
    
    <div className="hidden sm:block text-[11px] font-mono tracking-wider text-zinc-500 uppercase">
      Sanctuary Feed
    </div>
  </header>

        <main className="pt-8 pb-16 px-4 md:px-6 xl:px-12 max-w-[1300px] w-full mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 xl:gap-12">
            
            {/* MIDDLE COLUMN (Feed Stream Component Workspace) */}
            <div className="flex-1 min-w-0 space-y-6">
              
              {isExploreRowOpen && (
                <div className="w-full bg-transparent pb-2 transition-all animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className={`flex items-center gap-5 overflow-x-auto no-scrollbar py-2.5 border-b ${
                    isDark ? 'border-zinc-800' : 'border-stone-200/80'
                  }`}>
                    <span className={`text-[10px] font-bold uppercase tracking-widest select-none shrink-0 ${
                      isDark ? 'text-zinc-600' : 'text-stone-400'
                    }`}>
                      Discover
                    </span>
                    <div className="flex items-center gap-5">
                      {extendedSpiritualItems.map((subItem) => {
                        const isSubActive = pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            onClick={() => window.dispatchEvent(new CustomEvent('set-sanctuary-explore', { detail: false }))}
                            className={`whitespace-nowrap text-xs tracking-tight transition-colors relative py-0.5 ${
                              isSubActive 
                                ? isDark ? 'text-white font-semibold' : 'text-stone-900 font-semibold'
                                : isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-stone-500 hover:text-stone-800'
                            }`}
                          >
                            {subItem.label}
                            {isSubActive && (
                              <span className="absolute bottom-[-11px] left-0 right-0 h-[1.5px] bg-primary-500 rounded-full" />
                            )}
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Modular Compact Action Trigger Feeder */}
              <CommunityFeeder 
                activeSection={activeFeederSection} 
                onPostCreated={handleFreshPostCreated}
              />

              {/* Feed Stream list component container */}
              <CommunityFellowshipStream status={status} />

            </div>

            {/* RIGHT COLUMN (Substack-style Context Clean Sidebar Layout) */}
            <div className="lg:w-72 xl:w-80 shrink-0">
              <div className="sticky top-24 space-y-8">
                
                {/* Search Box Panel */}
                <div className={`border rounded-lg p-2.5 flex items-center gap-2.5 transition-all ${
                  isDark 
                    ? 'bg-transparent border-zinc-800 text-zinc-500 focus-within:border-zinc-700 focus-within:text-zinc-400' 
                    : 'bg-transparent border-stone-200 text-stone-400 focus-within:border-stone-400 focus-within:text-stone-600'
                }`}>
                  <span className="material-symbols-outlined text-lg">search</span>
                  <input 
                    type="text" 
                    placeholder="Search archives..." 
                    className={`bg-transparent text-xs outline-none w-full font-serif tracking-wide ${
                      isDark ? 'text-zinc-200 placeholder-zinc-600' : 'text-stone-800 placeholder-stone-400'
                    }`}
                  />
                </div>

                {/* Body Encouragement Action Area */}
                <div className={`border rounded-xl p-5 space-y-4 ${
                  isDark ? 'border-zinc-800 bg-[#141416]/40' : 'border-stone-200 bg-stone-50/50'
                }`}>
                  <div className={`flex items-center gap-2 pb-2 border-b ${isDark ? 'border-zinc-800/80' : 'border-stone-200/60'}`}>
                    <span className="material-symbols-outlined text-primary-600 text-lg">groups</span>
                    <h3 className={`font-serif text-xs font-bold tracking-tight ${isDark ? 'text-zinc-300' : 'text-stone-800'}`}>Encourage the Body</h3>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setActiveFeederSection('intercession')}
                      className="flex-1 text-[9px] font-bold uppercase tracking-widest py-2.5 rounded border border-primary-600/30 text-primary-600 hover:bg-primary-600 hover:text-white transition-all duration-200"
                    >
                      Share Prayer
                    </button>
                    <button className={`flex-1 text-[9px] font-bold uppercase tracking-widest py-2.5 rounded border transition-all duration-200 ${
                      isDark 
                        ? 'border-zinc-700 bg-zinc-900 text-zinc-400 hover:bg-zinc-800' 
                        : 'border-stone-300 bg-white text-stone-600 hover:bg-stone-100'
                    }`}>
                      View All
                    </button>
                  </div>
                </div>

                {/* Testimony Feed Widget Loop Container */}
                <div className="space-y-3">
                  <div className={`pb-2 border-b ${isDark ? 'border-zinc-800' : 'border-stone-200'}`}>
                    <p className={`text-[10px] font-bold uppercase tracking-widest ${isDark ? 'text-zinc-600' : 'text-stone-400'}`}>
                      Shared Victories
                    </p>
                  </div>
                  <TestimonyScroll />
                </div>

              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}