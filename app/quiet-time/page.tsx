'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '../layout-components/Sidebar';
import Header from '../layout-components/Header';
import Image from 'next/image';

const modules = [
  {
    title: 'Ambient Audio',
    desc: 'Begin with centering sounds, high-fidelity frequencies, or guided prayer.',
    path: '/quiet-time/audio',
    icon: 'graphic_eq',
    color: 'from-amber-500/10 to-amber-600/5',
    iconColor: 'text-amber-600',
    borderHover: 'group-hover:border-amber-300',
  },
  {
    title: 'Scripture Reading',
    desc: "Engage deeply with today's dynamic, curated passage matrix.",
    path: '/quiet-time/reading',
    icon: 'menu_book',
    color: 'from-amber-500/10 to-amber-600/5',
    iconColor: 'text-amber-600',
    borderHover: 'group-hover:border-amber-300',
  },
  {
    title: 'Heart Reflection',
    desc: 'Journal your personal thoughts, divine prompts, and revelations.',
    path: '/quiet-time/reflection',
    icon: 'edit_note',
    color: 'from-amber-500/10 to-amber-600/5',
    iconColor: 'text-amber-600',
    borderHover: 'group-hover:border-amber-300',
  },
  {
    title: 'Daily Summary',
    desc: 'Review metrics, track your active streak, and seal your session insights.',
    path: '/quiet-time/summary',
    icon: 'task_alt',
    color: 'from-amber-500/10 to-amber-600/5',
    iconColor: 'text-amber-600',
    borderHover: 'group-hover:border-amber-300',
  },
];

export default function QuietTimeLobby() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=2070"
          alt="Peaceful sanctuary background"
          fill
          className="object-cover scale-110 blur-xl opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/30"></div>
      </div>

      {/* Subtle Animated Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-amber-200/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-amber-300/8 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '-3s' }} />
      </div>

      <Sidebar />
      
      <div className="flex-1 lg:ml-56 relative">
        <Header />

        <main className="relative z-10 pt-20 pb-16 px-6 md:px-10 max-w-5xl mx-auto">
          
          {/* Sacred Hero Header */}
          <header className="mb-12 text-center md:text-left relative">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <div className="w-8 h-px bg-amber-400/40" />
              <span className="text-[8px] font-sans font-black uppercase tracking-wider text-amber-600">
                The Sanctuary Ecosystem
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-gray-800 tracking-tight mb-3">
              Quiet Time Sanctuary
            </h1>
            <div className="w-12 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 mb-5 mx-auto md:mx-0 rounded-full" />
            <p className="text-gray-600 max-w-xl font-sans text-sm leading-relaxed">
              Find your absolute center. Follow the architectural sequence below to complete your daily ritual and sync with your spiritual ledger.
            </p>
          </header>

          {/* Architectural Journey Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {modules.map((mod, idx) => (
              <Link 
                key={mod.path} 
                href={mod.path}
                className={`group relative bg-white/40 backdrop-blur-xl border border-white/60 p-6 rounded-xl transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:bg-white/60 ${mod.borderHover}`}
              >
                <div className="flex items-start justify-between">
                  {/* Icon Frame */}
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${mod.color} border border-white/60 mb-5 transition-all duration-500 group-hover:shadow-md`}>
                    <span className={`material-symbols-outlined text-[22px] ${mod.iconColor}`}>
                      {mod.icon}
                    </span>
                  </div>
                  {/* Sequence Number */}
                  <span className="text-4xl font-black italic text-gray-300/30 group-hover:text-amber-400/20 transition-colors duration-500 select-none">
                    0{idx + 1}
                  </span>
                </div>

                <h3 className="text-lg font-serif font-bold text-gray-800 mb-2 tracking-wide">
                  {mod.title}
                </h3>
                <p className="font-sans text-[10px] leading-relaxed text-gray-600 mb-5 max-w-sm">
                  {mod.desc}
                </p>

                {/* Micro-Interaction CTA */}
                <div className="flex items-center text-[8px] font-sans font-black uppercase tracking-wider text-amber-600 -translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  Enter Module 
                  <span className="material-symbols-outlined ml-1 text-[12px]">arrow_forward</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Premium Call to Action Block */}
          <div className="mt-10 p-6 md:p-8 rounded-xl bg-gradient-to-br from-amber-700 to-amber-800 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl relative overflow-hidden">
            {/* Background Light Spill */}
            <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -top-16 w-64 h-64 bg-black/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-1.5 mb-2">
                <span className="material-symbols-outlined text-amber-300 text-[14px]">auto_awesome</span>
                <span className="text-[7px] font-sans font-black uppercase tracking-wider text-amber-200">
                  Recommended Flow
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-serif font-bold mb-1 tracking-tight">Ready to align?</h2>
              <p className="font-sans text-[10px] text-amber-100/80 max-w-sm leading-relaxed">
                We recommend processing via the default liturgy matrix. Start with Ambient Audio to calm cognitive noise.
              </p>
            </div>
            
            <button 
              onClick={() => router.push('/quiet-time/audio')}
              className="relative z-10 px-8 py-3 bg-white text-amber-700 rounded-lg font-sans font-black text-[9px] tracking-wider hover:bg-amber-50 hover:scale-[1.02] shadow-lg transition-all active:scale-[0.98] whitespace-nowrap"
            >
              START LITURGY
            </button>
          </div>

          {/* Decorative Footer */}
          <div className="mt-10 flex justify-center items-center gap-4 opacity-30">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400" />
            <span className="material-symbols-outlined text-amber-400 text-sm">menu_book</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400" />
          </div>
        </main>
      </div>
    </div>
  );
}