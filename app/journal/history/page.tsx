'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/app/layout-components/Sidebar';
import Header from '@/app/layout-components/Header';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood: string;
  createdAt: string;
}

export default function HistoryPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch('/api/journal');
        const data = await response.json();
        if (data.success) {
          setEntries(data.entries);
        }
      } catch (error) {
        toast.error('Failed to load journal history.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredAndSortedEntries = entries
    .filter(entry =>
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const getMoodIcon = (mood: string) => {
    const moodMap: Record<string, string> = {
      Peaceful: 'spa',
      Grateful: 'favorite',
      Hopeful: 'wb_sunny',
      Reflective: 'auto_stories',
      Challenged: 'terrain',
      Joyful: 'celebration'
    };
    return moodMap[mood] || 'favorite';
  };

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
        <div className="absolute top-20 right-20 w-96 h-96 bg-indigo-200/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-200/8 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '-3s' }} />
      </div>

      <Sidebar />
      <Header />

      <main className="relative z-10 flex-grow lg:ml-56 px-6 md:px-10 py-20 max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-px bg-gray-400/40" />
            <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em]">Written Legacy</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <h1 className="text-3xl md:text-4xl font-serif text-gray-800 tracking-tight">Journal History</h1>
            
            <div className="flex items-center gap-2 text-[9px] text-gray-500">
              <span className="material-symbols-outlined text-[14px]">edit_note</span>
              <span>{entries.length} reflections</span>
            </div>
          </div>
        </div>
        
        {/* Search and Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          {/* Search */}
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reflections..."
              className="w-full bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl py-2.5 pl-9 pr-4 text-sm font-serif italic text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
            />
          </div>

          {/* Sort Toggle */}
          <button 
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="flex items-center justify-center gap-2 px-5 py-2.5 bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl text-[9px] font-black tracking-wider text-indigo-600 uppercase hover:bg-white/60 hover:border-indigo-300 transition-all"
          >
            <span className="material-symbols-outlined text-[14px]">
              {sortOrder === 'desc' ? 'south' : 'north'}
            </span>
            {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
          </button>
        </div>

        {/* Create New Entry Button */}
        <div className="mb-6">
          <Link 
            href="/journal/create"
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-[9px] font-black tracking-wider uppercase hover:bg-indigo-700 hover:scale-[1.02] transition-all shadow-md"
          >
            <span className="material-symbols-outlined text-[14px]">add</span>
            New Reflection
          </Link>
        </div>

        {/* Entries List */}
        <div className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-28 w-full bg-white/40 backdrop-blur-sm animate-pulse rounded-xl border border-white/60" />
              ))}
            </div>
          ) : filteredAndSortedEntries.length > 0 ? (
            filteredAndSortedEntries.map((entry) => (
              <Link href={`/journal/${entry.id}`} key={entry.id} className="block group">
                <article className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl p-5 hover:bg-white/60 hover:shadow-xl hover:border-indigo-200 transition-all duration-300">
                  <div className="flex justify-between items-start gap-3 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="material-symbols-outlined text-indigo-500 text-[12px]">calendar_today</span>
                        <p className="text-[8px] font-black text-indigo-600 uppercase tracking-wider">
                          {new Date(entry.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </p>
                      </div>
                      <h3 className="text-lg font-serif text-gray-800 group-hover:text-indigo-700 transition-colors truncate">
                        {entry.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 bg-indigo-50 rounded-full shrink-0">
                      <span className="material-symbols-outlined text-indigo-500 text-[12px]">{getMoodIcon(entry.mood)}</span>
                      <span className="text-[8px] font-bold text-indigo-600 uppercase tracking-wider">{entry.mood}</span>
                    </div>
                  </div>
                  <p className="text-[11px] font-serif italic text-gray-600 line-clamp-2 leading-relaxed pl-5">
                    {entry.content}
                  </p>
                  <div className="flex items-center gap-1 mt-2 pl-5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[7px] font-medium text-indigo-500 uppercase tracking-wider">Read</span>
                    <span className="material-symbols-outlined text-indigo-500 text-[10px]">arrow_forward</span>
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <div className="text-center py-16 bg-white/30 backdrop-blur-sm border border-dashed border-indigo-200 rounded-2xl">
              <div className="w-14 h-14 rounded-xl bg-indigo-100 flex items-center justify-center mx-auto mb-3">
                <span className="material-symbols-outlined text-indigo-400 text-2xl">edit_note</span>
              </div>
              <p className="text-sm text-gray-500 font-serif italic mb-2">No reflections found</p>
              <p className="text-[10px] text-gray-400">
                {searchQuery ? 'Try a different search term' : 'Start writing your first reflection'}
              </p>
              {!searchQuery && (
                <Link 
                  href="/journal/create"
                  className="inline-flex items-center gap-1 mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider hover:bg-indigo-700 transition-all"
                >
                  <span className="material-symbols-outlined text-[12px]">add</span>
                  Write First Entry
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Decorative Footer */}
        {filteredAndSortedEntries.length > 0 && (
          <div className="mt-12 flex justify-center items-center gap-4 opacity-30">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-indigo-400" />
            <span className="material-symbols-outlined text-indigo-400 text-sm">edit_note</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-indigo-400" />
          </div>
        )}
      </main>
    </div>
  );
}