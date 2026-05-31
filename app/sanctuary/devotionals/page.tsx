'use client';

import React, { useState } from 'react';
import Sidebar from '@/app/layout-components/Sidebar';
import MainHeader from '@/app/layout-components/Header';
import { DEVOTIONALS } from '../../data/devotionals';
import Image from 'next/image';

export default function DevotionalPage() {
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...new Set(DEVOTIONALS.map(d => d.category))];

  const filteredDevotionals = filter === 'All' 
    ? DEVOTIONALS 
    : DEVOTIONALS.filter(d => d.category === filter);

  return (
    <div className="flex min-h-screen bg-[#FDFDFF] text-[#1A1C1E]">
      <Sidebar />
      
      <main className="flex-1 lg:ml-64 pt-28 pb-20 px-6 md:px-12 max-w-[1600px] mx-auto w-full">
        <MainHeader />

        {/* --- HEADER SECTION --- */}
        <header className="mb-16 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-serif text-[#3C3830] mb-4 tracking-tight">
            The Daily Sanctuary
          </h1>
          <p className="text-[#7C7565] italic font-serif text-lg border-l-2 border-[#D4AF37] pl-6 py-1">
            &quot;Thy word is a lamp unto my feet, and a light unto my path.&quot;
          </p>
        </header>

        {/* --- CATEGORY FILTER --- */}
        <div className="flex items-center gap-3 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2.5 rounded-full text-[10px] font-black tracking-[0.2em] uppercase transition-all whitespace-nowrap
                ${filter === cat 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'bg-white border border-gray-100 text-gray-400 hover:border-primary/30 hover:text-primary'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* --- DEVOTIONAL GRID --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-y-16 gap-x-10">
          {filteredDevotionals.map((item) => (
            <a 
              key={item.id} 
              href={item.url} 
              target="_blank" 
              className="group relative flex flex-col items-center text-center"
            >
              {/* BRANDING GLOW AURA */}
              <div 
                className="absolute -top-4 w-32 h-32 opacity-0 group-hover:opacity-20 blur-[50px] transition-opacity duration-700 rounded-full pointer-events-none"
                style={{ backgroundColor: item.themeColor || '#D4AF37' }}
              />

              {/* BOOK COVER CONTAINER */}
              <div className="relative aspect-[2/3] w-full max-w-[200px] overflow-hidden rounded-md shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-l-[6px] border-black/20 transform transition-all duration-500 ease-out group-hover:-translate-y-3 group-hover:rotate-1 group-hover:shadow-[0_30px_70px_rgba(0,0,0,0.25)]">
                <Image
                  src={item.cover}
                  alt={item.title}
                  fill
                  className="object-cover grayscale-[0.2] sepia-[0.1] contrast-[1.1] transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
                />
                
                {/* OVERLAY GRADIENT */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/10 p-4 flex flex-col justify-end">
                   <span className="text-[8px] font-black text-[#D4AF37] tracking-[0.3em] uppercase mb-1">
                     {item.category}
                   </span>
                </div>

                {/* LIGHTING EFFECT (SPINE) */}
                <div className="absolute inset-y-0 left-0 w-4 bg-gradient-to-r from-black/30 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* BOOK INFO */}
              <div className="mt-6 space-y-1">
                <h3 className="font-serif text-[15px] font-bold text-[#3C3830] leading-snug group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-[10px] font-black text-[#7C7565]/60 uppercase tracking-[0.25em]">
                  {item.author}
                </p>
              </div>

              {/* ACTION INDICATOR */}
              <div className="mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                <div className="flex items-center gap-2 text-[9px] font-bold text-primary uppercase tracking-widest">
                  <span>Open Devotional</span>
                  <span className="material-symbols-outlined text-xs">arrow_right_alt</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </main>

      {/* --- ADD CUSTOM CSS FOR PERSPECTIVE --- */}
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}