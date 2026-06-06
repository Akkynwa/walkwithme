'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface VerseData {
  verse: string;
  reference: string;
  bgImage: string;
}

export function AnchorVerse() {
  const [verseData, setVerseData] = useState<VerseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    async function fetchAnchorVerse() {
      try {
        const response = await fetch('/api/anchor-verse');
        const result = await response.json();
        if (result.success) {
          setVerseData(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch anchor verse:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnchorVerse();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-64 bg-white/40 backdrop-blur-sm border border-white/60 rounded-3xl animate-pulse flex flex-col justify-center px-8 md:px-12 space-y-4">
        <div className="h-4 bg-gray-300/40 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300/40 rounded w-1/2"></div>
        <div className="h-3 bg-gray-300/40 rounded w-1/4"></div>
      </div>
    );
  }

  if (!verseData) return null;

  return (
    <section className="relative w-full min-h-[280px] rounded-3xl overflow-hidden shadow-2xl group cursor-pointer">
      {/* Background Image Layer with smooth zoom on hover */}
      <div className="absolute inset-0 overflow-hidden">
        <Image 
          src={verseData.bgImage} 
          alt="Sanctuary Ambience" 
          fill 
          className={`object-cover transition-all duration-[8000ms] ease-out group-hover:scale-110 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          priority
        />
        {/* Loading placeholder */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/40 to-amber-800/40 animate-pulse" />
        )}
      </div>
      
      {/* Enhanced Glass Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
      
      {/* Subtle Glass Reflection Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Content Layer */}
      <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8 lg:p-10 space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Decorative top line */}
        <div className="absolute top-6 left-6 right-6">
          <div className="w-12 h-[2px] bg-gradient-to-r from-amber-400 to-transparent rounded-full" />
        </div>

        {/* Label with icon */}
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-amber-400 text-[14px]">auto_awesome</span>
          <span className="text-[9px] font-black tracking-[0.3em] uppercase text-amber-300/90">
            Today's Anchor Focus
          </span>
        </div>

        {/* Verse Text */}
        <h2 className="text-xl md:text-2xl lg:text-3xl font-serif text-white font-light leading-relaxed tracking-wide">
          <span className="text-amber-400 text-2xl md:text-3xl lg:text-4xl mr-2">"</span>
          {verseData.verse}
          <span className="text-amber-400 text-2xl md:text-3xl lg:text-4xl ml-2">"</span>
        </h2>

        {/* Reference with decorative line */}
        <div className="flex items-center gap-3 pt-2">
          <div className="w-8 h-px bg-amber-400/50" />
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
            — {verseData.reference}
          </p>
        </div>

        {/* Daily reflection prompt */}
        <div className="pt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:translate-y-0 translate-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <span className="material-symbols-outlined text-[12px] text-amber-300">edit_note</span>
            <span className="text-[8px] font-medium text-white/80 tracking-wide">Reflect on this verse</span>
          </div>
        </div>
      </div>

      {/* Bottom decorative gradient line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
    </section>
  );
}