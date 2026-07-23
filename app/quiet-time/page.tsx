'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '../layout-components/Sidebar';
import Header from '../layout-components/Header';
import { useTheme } from './../context/ThemeContext';

const modules = [
  {
    title: 'Ambient Audio',
    desc: 'Begin with centering sounds, high-fidelity frequencies, or guided prayer.',
    path: '/quiet-time/audio',
    icon: 'graphic_eq',
  },
  {
    title: 'Scripture Reading',
    desc: "Engage deeply with today's dynamic, curated passage matrix.",
    path: '/quiet-time/reading',
    icon: 'menu_book',
  },
  {
    title: 'Heart Reflection',
    desc: 'Journal your personal thoughts, divine prompts, and revelations.',
    path: '/quiet-time/reflection',
    icon: 'edit_note',
  },
  {
    title: 'Daily Summary',
    desc: 'Review metrics, track your active streak, and seal your session insights.',
    path: '/quiet-time/summary',
    icon: 'task_alt',
  },
];

export default function QuietTimeLobby() {
  const router = useRouter();
  const { isDark } = useTheme();

  return (
    <div className={`flex min-h-screen antialiased selection:bg-orange-100 dark:selection:bg-orange-950/50 ${
      isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'
    }`}>
      <Sidebar />
      
      <div className="flex-1 lg:ml-64 relative">

        {/* Main Column Framework Content Area */}
        <main className="pt-24 px-4 md:px-8 pb-24 max-w-5xl mx-auto w-full">
          
          {/* Editorial Substack Header Row */}
          <header className="mb-12 pb-4 border-b border-zinc-100 dark:border-zinc-900">
            <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-500 mb-2">
              <span className="material-symbols-outlined text-[14px]">self_improvement</span>
              <span className="text-[10px] font-sans font-semibold uppercase tracking-wider">The Sanctuary Ecosystem</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Quiet Time Sanctuary
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-sans mt-1.5 max-w-xl leading-relaxed">
              Find your absolute center. Follow the sequence below to complete your daily ritual and sync your progress.
            </p>
          </header>

          {/* Clean Geometric Module Journey Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((mod, idx) => (
              <Link 
                key={mod.path} 
                href={mod.path}
                className="group relative flex flex-col justify-between p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl transition-colors hover:border-zinc-300 dark:hover:border-zinc-700 bg-transparent select-none outline-none"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    {/* Minimalist Icon Indicator */}
                    <div className="text-orange-600 dark:text-orange-500">
                      <span className="material-symbols-outlined text-[20px]">
                        {mod.icon}
                      </span>
                    </div>
                    {/* Index Sequence Counter */}
                    <span className="text-2xl font-serif font-bold italic text-zinc-200 dark:text-zinc-800 transition-colors group-hover:text-orange-600/20 dark:group-hover:text-orange-500/20">
                      0{idx + 1}
                    </span>
                  </div>

                  <h3 className="text-base font-serif font-medium text-zinc-800 dark:text-zinc-200 mb-1 transition-colors group-hover:text-orange-600 dark:group-hover:text-orange-500">
                    {mod.title}
                  </h3>
                  <p className="text-[13px] font-sans text-zinc-500 dark:text-zinc-400 leading-relaxed max-w-sm mb-6">
                    {mod.desc}
                  </p>
                </div>

                {/* Understated Micro CTA Link */}
                <div className="flex items-center text-[11px] font-sans font-medium text-orange-600 dark:text-orange-500 -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
                  <span>Enter Module</span>
                  <span className="material-symbols-outlined ml-1 text-[12px]">arrow_forward</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Standardized Call to Action Block */}
          <div className="mt-6 p-6 border border-zinc-200 dark:border-zinc-800 rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-transparent">
            <div className="flex-1">
              <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-500 mb-1.5">
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                <span className="text-[10px] font-sans font-semibold uppercase tracking-wider">Recommended Flow</span>
              </div>
              <h2 className="text-base font-serif font-medium text-zinc-900 dark:text-zinc-50 mb-1">Ready to align?</h2>
              <p className="text-[13px] font-sans text-zinc-500 dark:text-zinc-400 max-w-xl leading-relaxed">
                We recommend processing via the default sequential track. Begin with Ambient Audio to settle cognitive noise before diving into text.
              </p>
            </div>
            
            <button 
              onClick={() => router.push('/quiet-time/audio')}
              className="w-full md:w-auto flex items-center justify-center bg-orange-600 hover:bg-orange-700 text-white font-medium text-[12px] px-5 py-2.5 rounded-full transition-colors shadow-sm whitespace-nowrap outline-none"
            >
              Start Liturgy
            </button>
          </div>

          {/* System Central Anchor Divider Dot */}
          <div className="mt-24 flex justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </main>
      </div>
    </div>
  );
}