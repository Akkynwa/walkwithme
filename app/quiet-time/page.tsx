'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '../layout-components/Sidebar';
import Header from '../layout-components/Header';

const modules = [
  {
    title: 'Ambient Audio',
    desc: 'Begin with centering sounds, high-fidelity frequencies, or guided prayer.',
    path: '/quiet-time/audio',
    icon: 'graphic_eq',
    color: 'bg-[#FDFBF7] text-[#8B0000] border-[#EAE5D8]',
    hoverColor: 'group-hover:bg-[#8B0000] group-hover:text-white',
  },
  {
    title: 'Scripture Reading',
    desc: "Engage deeply with today's dynamic, curated passage matrix.",
    path: '/quiet-time/reading',
    icon: 'menu_book',
    color: 'bg-[#FDFBF7] text-[#D4AF37] border-[#EAE5D8]',
    hoverColor: 'group-hover:bg-[#D4AF37] group-hover:text-white',
  },
  {
    title: 'Heart Reflection',
    desc: 'Journal your personal thoughts, divine prompts, and revelations.',
    path: '/quiet-time/reflection',
    icon: 'edit_note',
    color: 'bg-[#FDFBF7] text-[#3C3830] border-[#EAE5D8]',
    hoverColor: 'group-hover:bg-[#3C3830] group-hover:text-white',
  },
  {
    title: 'Daily Summary',
    desc: 'Review metrics, track your active streak, and seal your session insights.',
    path: '/quiet-time/summary',
    icon: 'task_alt',
    color: 'bg-[#FDFBF7] text-[#7C7565] border-[#EAE5D8]',
    hoverColor: 'group-hover:bg-[#7C7565] group-hover:text-white',
  },
];

export default function QuietTimeLobby() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-[#F4F1EA] font-serif selection:bg-[#D4AF37]/20">
      <Sidebar />
      
      <div className="flex-1 lg:ml-64 relative">
        <Header />

        {/* Textured background overlay to match the open book canvas */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.4] mix-blend-multiply z-0"
          style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` }}
        />

        <main className="relative z-10 pt-28 pb-16 px-6 md:px-12 max-w-5xl mx-auto">
          
          {/* --- SACRED HERO HEADER --- */}
          <header className="mb-14 text-center md:text-left relative">
            <span className="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-2 block">
              The Sanctuary Ecosystem
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-[#3C3830] tracking-tight mb-4">
              Quiet Time Sanctuary
            </h1>
            <div className="w-12 h-[2px] bg-[#D4AF37] mb-4 md:mx-0 mx-auto rounded-full" />
            <p className="text-[#7C7565] max-w-xl font-sans text-sm leading-relaxed">
              Find your absolute center. Follow the architectural sequence below to complete your daily ritual and sync with your spiritual ledger.
            </p>
          </header>

          {/* --- ARCHITECTURAL JOURNEY GRID --- */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {modules.map((mod, idx) => (
              <Link 
                key={mod.path} 
                href={mod.path}
                className="group relative bg-white/80 backdrop-blur-md border border-[#D4CDBA]/40 p-8 rounded-[2rem] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] shadow-[0_15px_45px_rgba(60,56,48,0.02)] hover:shadow-[0_30px_70px_rgba(60,56,48,0.08)] hover:-translate-y-1.5"
              >
                {/* Subtle internal border accent on hover */}
                <div className="absolute inset-3 rounded-[1.5rem] border border-transparent group-hover:border-[#D4AF37]/10 transition-all pointer-events-none" />

                <div className="flex items-start justify-between relative z-10">
                  {/* Icon Frame */}
                  <div className={`p-4 rounded-2xl border ${mod.color} ${mod.hoverColor} mb-8 transition-all duration-500 shadow-sm group-hover:shadow-md`}>
                    <span className="material-symbols-outlined text-2xl">
                      {mod.icon}
                    </span>
                  </div>
                  {/* Big Stylized Sequence Number */}
                  <span className="text-5xl font-black italic text-[#EAE5D8]/50 group-hover:text-[#D4AF37]/15 transition-colors duration-500 select-none">
                    0{idx + 1}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-[#3C3830] mb-3 tracking-wide">
                  {mod.title}
                </h3>
                <p className="font-sans text-xs leading-relaxed text-[#7C7565] mb-8 max-w-sm">
                  {mod.desc}
                </p>

                {/* Micro-Interaction CTA */}
                <div className="flex items-center text-[10px] font-sans font-black uppercase tracking-[0.2em] text-[#D4AF37] translate-x-[-4px] opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  Enter Module 
                  <span className="material-symbols-outlined ml-2 text-xs font-bold">arrow_forward</span>
                </div>
              </Link>
            ))}
          </div>

          {/* --- PREMIUM CALL TO ACTION BLOCK --- */}
          <div 
            className="mt-14 p-10 rounded-[2.5rem] bg-[#3C3830] text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_30px_60px_-15px_rgba(60,56,48,0.4)] relative overflow-hidden border border-[#524B3F]"
          >
            {/* Background Light Spill */}
            <div className="absolute -right-16 -bottom-16 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -left-16 -top-16 w-64 h-64 bg-[#8B0000]/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 text-center md:text-left">
              <span className="text-[9px] font-sans font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-2 block">
                Recommended Flow
              </span>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 tracking-tight">Ready to align?</h2>
              <p className="font-sans text-xs text-[#EAE5D8]/70 max-w-sm leading-relaxed">
                We recommend processing via the default liturgy matrix. Start with Ambient Audio to calm cognitive noise.
              </p>
            </div>
            
            <button 
              onClick={() => router.push('/quiet-time/audio')}
              className="relative z-10 px-10 py-4 bg-gradient-to-r from-[#D4AF37] to-[#AA8414] text-white rounded-xl font-sans font-black text-xs tracking-[0.15em] hover:brightness-110 shadow-lg shadow-[#D4AF37]/20 transition-all active:scale-[0.98] whitespace-nowrap"
            >
              START LITURGY
            </button>
          </div>

        </main>
      </div>
    </div>
  );
}