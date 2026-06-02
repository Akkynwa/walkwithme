'use client';

import React from 'react';
import Link from 'next/link';

export function MorningGreeting({ name }: { name: string }) {
  const firstName = name.split(' ')[0];
  const hour = new Date().getHours();
  
  const getPeriod = () => {
    if (hour < 12) return { label: 'Morning', sub: 'The light is new, and so is His mercy.', theme: 'text-orange-700/60', glow: 'bg-orange-400/20' };
    if (hour < 17) return { label: 'Afternoon', sub: 'Stay anchored in the stillness.', theme: 'text-emerald-700/60', glow: 'bg-emerald-400/20' };
    return { label: 'Evening', sub: 'Reflect on the journey of today.', theme: 'text-indigo-900/60', glow: 'bg-indigo-400/20' };
  };

  const period = getPeriod();

  return (
    <section className="relative overflow-hidden rounded-[40px] p-8 md:p-12 bg-white/40 border border-white/60 backdrop-blur-md shadow-sm animate-in fade-in slide-in-from-top-4 duration-1000">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative z-10">
        <div className="space-y-2">
          <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${period.theme}`}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-[#161c22] tracking-tight">
            Good {period.label}, <span className="text-[#4d6054] italic">{firstName}</span>
          </h1>
          <p className="text-lg text-[#434844]/70 font-serif italic">
            {period.sub}
          </p>
        </div>
        
        {/* Interactive Alignment Indicator */}
        <Link 
          href="/streak" 
          className="group block bg-white/80 backdrop-blur-xl border border-white/80 px-6 py-4 rounded-3xl shadow-xl shadow-[#4d6054]/5 hover:shadow-2xl hover:shadow-[#4d6054]/10 hover:scale-[1.02] transition-all duration-300 cursor-pointer text-left"
        >
           <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#434844]/40 mb-2 group-hover:text-primary transition-colors">
             Consecutive Alignment
           </p>
           
           <div className="flex items-center gap-3">
              {/* Atmospheric visual instead of fire emoji */}
              <div className="relative w-8 h-8 flex items-center justify-center">
                <span className={`absolute inset-0 rounded-full ${period.glow} animate-ping duration-[3000ms]`} />
                <span className={`absolute inset-1 rounded-full ${period.glow} opacity-70`} />
                <span className="w-2 h-2 rounded-full bg-[#e0a96d] shadow-[0_0_10px_#e0a96d]" />
              </div>
              
              <div className="flex flex-col">
                <span className="text-2xl font-black text-[#161c22] leading-none">12 Days</span>
                <span className="text-[9px] text-[#434844]/50 group-hover:text-[#e0a96d] font-medium transition-colors mt-0.5 flex items-center gap-1">
                  View Journey <span className="text-[11px] transition-transform group-hover:translate-x-0.5">→</span>
                </span>
              </div>
           </div>
        </Link>
      </div>
    </section>
  );
}