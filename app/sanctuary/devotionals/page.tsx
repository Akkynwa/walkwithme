'use client';

import React, { useState } from 'react';
import Sidebar from '@/app/layout-components/Sidebar';
import { DEVOTIONALS } from '../../data/devotionals';
import DevotionalCard from '@/components/DevotionalCard';
import { useTheme } from '../../context/ThemeContext';

export default function DevotionalPage() {
  const { isDark } = useTheme();
  const [filter, setFilter] = useState('All');
  
  const categories = ['All', ...new Set(DEVOTIONALS.map(d => d.category))];

  const filteredDevotionals = filter === 'All' 
    ? DEVOTIONALS 
    : DEVOTIONALS.filter(d => d.category === filter);

  return (
    <div className={`flex min-h-screen antialiased selection:bg-orange-100 dark:selection:bg-orange-950/50 ${
      isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'
    }`}>
      <Sidebar />
      
      {/* Main Column Framework Content Area */}
      <main className="flex-1 lg:ml-64 pt-24 px-4 md:px-8 pb-24 max-w-7xl mx-auto w-full">

        {/* Editorial Substack Header Row */}
        <header className="mb-12 pb-4 border-b border-zinc-100 dark:border-zinc-900">
          <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-500 mb-2">
            <span className="material-symbols-outlined text-[14px]">auto_stories</span>
            <span className="text-[10px] font-sans font-semibold uppercase tracking-wider">Daily Reading</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            The Daily Sanctuary
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-serif italic mt-2 border-l-2 border-orange-500 dark:border-orange-500 pl-4">
            "Thy word is a lamp unto my feet"
          </p>
        </header>

        {/* Category Horizontal Filter Menu Container */}
        <div className="flex items-center gap-2 mb-10 overflow-x-auto pb-3 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = filter === cat;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-full text-[11px] font-sans font-medium tracking-normal transition-colors whitespace-nowrap outline-none
                  ${isSelected 
                    ? 'bg-orange-600 dark:bg-orange-500 text-white shadow-sm' 
                    : 'border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700 bg-transparent'
                  }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Adaptive Grid Array Display Framework */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 gap-y-10">
          {filteredDevotionals.map((item) => (
            <DevotionalCard key={item.id} item={item} />
          ))}
        </div>

        {/* Empty Search/Filter Fallback Grid State */}
        {filteredDevotionals.length === 0 && (
          <div className="text-center py-24 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl max-w-xl mx-auto mt-6">
            <div className="w-10 h-10 rounded-lg border border-zinc-100 dark:border-zinc-900 bg-transparent flex items-center justify-center mx-auto mb-4 text-zinc-400 dark:text-zinc-500">
              <span className="material-symbols-outlined text-[18px]">menu_book</span>
            </div>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-sans">
              No devotionals found inside this category.
            </p>
            <button 
              onClick={() => setFilter('All')}
              className="mt-4 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium text-[12px] rounded-full transition-colors shadow-sm"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* System Central Anchor Divider Dot */}
        <div className="mt-24 flex justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </main>
    </div>
  );
}