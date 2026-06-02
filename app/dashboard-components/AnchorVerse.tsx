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

  useEffect(() => {
    async function fetchAnchorVerse() {
      try {
        const response = await fetch('/api/anchor-verse');
        const result = await response.json();
        if (result.success) {
          setVerseData(result.data);
        }
      } catch (error) {
        console.error('Failed to spool anchor verse:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAnchorVerse();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-64 bg-white/40 border border-white/60 rounded-[32px] animate-pulse flex flex-col justify-center px-8 md:px-12 space-y-4">
        <div className="h-4 bg-gray-300/40 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300/40 rounded w-1/2"></div>
        <div className="h-3 bg-gray-300/40 rounded w-1/4 pt-4"></div>
      </div>
    );
  }

  if (!verseData) return null;

  return (
    <section className="relative w-full min-h-[260px] rounded-[32px] overflow-hidden flex flex-col justify-end p-8 md:p-12 shadow-md group">
      {/* Background Image Layer with smooth zoom on hover */}
      <Image 
        src={verseData.bgImage} 
        alt="Sanctuary Ambience" 
        fill 
        className="object-cover absolute inset-0 transition-transform duration-[6000ms] ease-out group-hover:scale-105"
        priority
      />
      
      {/* Dark tint overlay to make typography pop effortlessly */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#161c22]/90 via-[#161c22]/50 to-[#161c22]/20" />

      {/* Content Layer */}
      <div className="relative z-10 max-w-2xl space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-700">
        <span className="text-[9px] font-black tracking-[0.4em] uppercase text-[#e0a96d]">
          Today's Anchor Focus
        </span>
        <h2 className="text-xl md:text-2xl lg:text-3xl font-serif text-white font-medium leading-relaxed tracking-wide italic">
          "{verseData.verse}"
        </h2>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/60 pt-2">
          — {verseData.reference}
        </p>
      </div>
    </section>
  );
}