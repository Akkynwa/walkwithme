'use client';

import React, { useState } from 'react';
import Sidebar from '@/app/layout-components/Sidebar';
import MainHeader from '@/app/layout-components/Header';
import { DEVOTIONALS } from '../../data/devotionals';
import Image from 'next/image';
import DevotionalCard from '@/components/DevotionalCard'; // Adjust path as needed

export default function DevotionalPage() {
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...new Set(DEVOTIONALS.map(d => d.category))];

  const filteredDevotionals = filter === 'All' 
    ? DEVOTIONALS 
    : DEVOTIONALS.filter(d => d.category === filter);

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
      
      <main className="relative z-10 flex-1 lg:ml-56 pt-20 pb-16 px-6 md:px-10 max-w-7xl mx-auto w-full">
        <MainHeader />

        {/* Header Section */}
        <header className="mb-12 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <div className="w-8 h-px bg-amber-400/40" />
            <span className="text-[8px] font-sans font-black uppercase tracking-wider text-amber-600">
              Daily Reading
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-800 mb-3 tracking-tight">
            The Daily Sanctuary
          </h1>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full" />
            <p className="text-gray-600 italic font-serif text-base">
              "Thy word is a lamp unto my feet"
            </p>
          </div>
        </header>

        {/* Category Filter */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-3 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-[8px] font-black tracking-wider uppercase transition-all whitespace-nowrap
                ${filter === cat 
                  ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-md shadow-amber-500/20' 
                  : 'bg-white/40 backdrop-blur-sm border border-white/60 text-gray-500 hover:border-amber-300 hover:text-amber-600'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Devotional Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-8 gap-y-12">
          {filteredDevotionals.map((item) => (
            <DevotionalCard key={item.id} item={item} />
          ))}
        </div>

        {/* Empty State */}
        {filteredDevotionals.length === 0 && (
          <div className="text-center py-20 bg-white/30 backdrop-blur-sm border border-dashed border-amber-200 rounded-xl mt-8">
            <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-3">
              <span className="material-symbols-outlined text-amber-400 text-2xl">menu_book</span>
            </div>
            <p className="text-sm text-gray-500 font-serif italic">No devotionals found in this category.</p>
            <button 
              onClick={() => setFilter('All')}
              className="mt-3 px-4 py-1.5 bg-amber-600 text-white rounded-lg text-[8px] font-black uppercase tracking-wider hover:bg-amber-700 transition-colors"
            >
              View All
            </button>
          </div>
        )}

        {/* Decorative Footer */}
        <div className="mt-12 flex justify-center items-center gap-4 opacity-30">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400" />
          <span className="material-symbols-outlined text-amber-400 text-sm">menu_book</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400" />
        </div>
      </main>

      <style jsx global>{`
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