'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export interface Devotional {
  id: string;
  title: string;
  author: string;
  category: string;
  cover: string;
  verse: string;
  url: string;
  content?: string;
  themeColor?: string;
}

interface AIDevotionalCardProps {
  item: Devotional;
  isMobile?: boolean;
}

export default function AIDevotionalCard({ item, isMobile = false }: AIDevotionalCardProps) {
  return (
    <motion.a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      // Reduced 'x' offset on mobile from 300 to 60 for a subtler glide
      initial={isMobile ? { x: 60, opacity: 0 } : { opacity: 0, scale: 0.97 }}
      animate={{ x: 0, opacity: 1, scale: 1 }}
      exit={isMobile ? { x: -60, opacity: 0 } : { opacity: 0, scale: 1.03 }}
      // Increased duration to 1.5s and used an ultra-smooth cubic-bezier ease
      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
      className={`relative block w-full overflow-hidden shadow-2xl rounded-[32px] bg-white/10 backdrop-blur-md cursor-pointer ${
        isMobile ? 'h-[140px]' : 'h-[450px]'
      }`}
    >
      {/* High-Impact Image Base */}
      <div className="absolute inset-0 z-0">
        <Image
          src={item.cover}
          alt={item.title}
          fill
          priority
          className="object-cover transition-transform duration-10000 hover:scale-105"
        />
        {/* Soft Overlays for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
      </div>

      {/* Content Layer */}
      <div className={`relative z-10 h-full flex flex-col justify-between text-white ${
        isMobile ? 'p-4' : 'p-6'
      }`}>
        <div className="flex justify-between items-start">
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-[10px] font-black uppercase tracking-[0.2em]">
            {item.category}
          </span>
          <div className="w-8 h-8 rounded-full bg-amber-500/80 flex items-center justify-center backdrop-blur-sm">
            <span className="material-symbols-outlined text-xs">auto_awesome</span>
          </div>
        </div>

        <div className={isMobile ? 'space-y-1' : 'space-y-3'}>
          <h2 className={`font-serif leading-tight ${isMobile ? 'text-lg line-clamp-1' : 'text-3xl'}`}>
            {item.title}
          </h2>
          
          <div className="space-y-1">
            <p className={`italic font-serif text-white/80 ${isMobile ? 'text-[10px] line-clamp-1' : 'text-sm'}`}>
              "{item.verse}"
            </p>
            <div className="flex items-center gap-2 pt-1">
              <div className="w-4 h-px bg-amber-400" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-amber-400">
                {item.author}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Spine Light */}
      <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-r from-white/20 to-transparent pointer-events-none" />
    </motion.a>
  );
}