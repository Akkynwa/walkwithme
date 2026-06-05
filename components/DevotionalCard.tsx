'use client';

import React from 'react';
import Image from 'next/image';

export interface Devotional {
  id: string;
  title: string;
  author: string;
  category: string;
  cover: string;
  url: string;
  themeColor?: string;
  verse?: string;
  content?: string;
}

interface DevotionalCardProps {
  item: Devotional;
}

export default function DevotionalCard({ item }: DevotionalCardProps) {
  return (
    <a 
      href={item.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="group relative flex flex-col items-center text-center"
    >
      {/* Glow Aura */}
      <div 
        className="absolute -top-4 w-28 h-28 opacity-0 group-hover:opacity-20 blur-[50px] transition-opacity duration-700 rounded-full pointer-events-none"
        style={{ backgroundColor: item.themeColor || '#D4AF37' }}
      />

      {/* Book Cover Container */}
      <div className="relative aspect-[2/3] w-full max-w-[180px] overflow-hidden rounded-lg shadow-xl border-l-4 border-amber-600/30 transform transition-all duration-500 ease-out group-hover:-translate-y-2 group-hover:rotate-1 group-hover:shadow-2xl">
        <Image
          src={item.cover}
          alt={item.title}
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          className="object-cover transition-all duration-700 group-hover:scale-105"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 p-3 flex flex-col justify-end">
          <span className="text-[6px] font-black text-amber-400 tracking-wider uppercase mb-0.5">
            {item.category}
          </span>
        </div>

        {/* Spine Lighting Effect */}
        <div className="absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/40 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* Book Info */}
      <div className="mt-4 space-y-0.5">
        <h3 className="font-serif text-sm font-semibold text-gray-800 leading-snug group-hover:text-amber-700 transition-colors line-clamp-2">
          {item.title}
        </h3>
        <p className="text-[7px] font-black text-gray-400 uppercase tracking-wider">
          {item.author}
        </p>
      </div>

      {/* Action Indicator */}
      <div className="mt-2 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-1 group-hover:translate-y-0">
        <div className="flex items-center gap-1 text-[7px] font-bold text-amber-600 uppercase tracking-wider">
          <span>Open Devotional</span>
          <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
        </div>
      </div>
    </a>
  );
}