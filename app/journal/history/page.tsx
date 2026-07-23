'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/app/layout-components/Sidebar';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

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
  const { isDark } = useTheme();

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
    <div className={`flex min-h-screen antialiased selection:bg-orange-100 dark:selection:bg-orange-950/50 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'}`}>
      <Sidebar />

      {/* Main Content Stream Container */}
      <main className="flex-1 lg:ml-64 pt-24 px-4 md:px-8 pb-24 max-w-[850px] mx-auto w-full">
        
        {/* Editorial Feed Header bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12 pb-4 border-b border-zinc-100 dark:border-zinc-900">
          <div>
            <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-500 mb-2">
              <span className="material-symbols-outlined text-[14px]">auto_stories</span>
              <span className="text-[10px] font-sans font-semibold uppercase tracking-wider">Written Legacy</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-serif-sub font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Journal History
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="font-sans text-[12px] text-zinc-400 dark:text-zinc-500">
              {entries.length} reflections
            </span>
            <Link 
              href="/journal/create"
              className="bg-orange-600 hover:bg-orange-700 text-white font-medium text-[12px] px-4 py-1.5 rounded-full transition-colors shadow-sm inline-flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              <span>New Reflection</span>
            </Link>
          </div>
        </div>
        
        {/* Compact Clean Search and Order Row */}
        <div className="flex items-center gap-3 mb-10 max-w-[720px] mx-auto">
          <div className="relative flex-1">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 dark:text-zinc-500 text-[16px]">
              search
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search reflections..."
              className="w-full bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-900 rounded-lg py-2 pl-9 pr-4 text-[13px] font-sans text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:border-zinc-300 dark:focus:border-zinc-700 transition-colors"
            />
          </div>

          <button 
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-1.5 px-3 py-2 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-lg text-[12px] font-medium font-sans text-zinc-600 dark:text-zinc-400 transition-colors"
          >
            <span className="material-symbols-outlined text-[14px]">
              {sortOrder === 'desc' ? 'south' : 'north'}
            </span>
            <span>{sortOrder === 'desc' ? 'Newest' : 'Oldest'}</span>
          </button>
        </div>

        {/* Dynamic Publications Stream Feed */}
        <div className="max-w-[720px] mx-auto">
          {loading ? (
            <div className="space-y-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse pb-8 border-b border-zinc-100 dark:border-zinc-900">
                  <div className="h-4 w-24 bg-zinc-100 dark:bg-zinc-900 rounded mb-3" />
                  <div className="h-6 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded mb-2" />
                  <div className="h-4 w-full bg-zinc-100 dark:bg-zinc-900 rounded" />
                </div>
              ))}
            </div>
          ) : filteredAndSortedEntries.length > 0 ? (
            <div className="space-y-0">
              {filteredAndSortedEntries.map((entry) => (
                <Link href={`/journal/${entry.id}`} key={entry.id} className="block group border-b border-zinc-100 dark:border-zinc-900 py-8 first:pt-0 last:border-b-0">
                  <article className="transition-all">
                    
                    {/* Excerpt Meta Header Strip */}
                    <div className="flex items-center gap-3 text-[11px] font-sans text-zinc-400 dark:text-zinc-500 mb-2.5">
                      <span className="font-mono">
                        {new Date(entry.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </span>
                      <span>•</span>
                      <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
                        <span className="material-symbols-outlined text-[12px]">{getMoodIcon(entry.mood)}</span>
                        <span className="font-medium text-[10px] uppercase tracking-wider">{entry.mood}</span>
                      </div>
                    </div>

                    {/* Post Title */}
                    <h3 className="text-xl font-serif font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 group-hover:text-orange-600 dark:group-hover:text-orange-500 transition-colors mb-2 leading-snug">
                      {entry.title || 'Untitled Reflection'}
                    </h3>

                    {/* Excerpt Text Field */}
                    <p className="text-[14px] font-serif leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-2">
                      {entry.content || 'This reflection was committed without secondary context.'}
                    </p>

                    {/* Understated Read Interaction trigger */}
                    <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0">
                      <span className="text-[11px] font-sans font-medium text-orange-600 dark:text-orange-500">Read reflection</span>
                      <span className="material-symbols-outlined text-orange-600 dark:text-orange-500 text-[12px]">arrow_forward</span>
                    </div>

                  </article>
                </Link>
              ))}
            </div>
          ) : (
            /* Substack Empty Clean Canvas Frame */
            <div className="text-center py-20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-transparent">
              <div className="w-12 h-12 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-zinc-400 dark:text-zinc-500 text-xl">edit_note</span>
              </div>
              <p className="text-sm font-serif italic text-zinc-500 dark:text-zinc-400 mb-1">No reflections cataloged</p>
              <p className="text-[12px] text-zinc-400 dark:text-zinc-500 font-sans">
                {searchQuery ? 'Try matching alternative phrasing descriptors.' : 'Begin writing your permanent archives.'}
              </p>
              {!searchQuery && (
                <Link 
                  href="/journal/create"
                  className="mt-5 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:hover:bg-zinc-200 text-white dark:text-zinc-950 font-medium text-[11px] px-4 py-2 rounded-full transition-colors inline-flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[13px]">add</span>
                  <span>Write First Entry</span>
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Elegant Centered System Rule Dot Footer */}
        <div className="mt-24 pt-8 border-t border-zinc-100 dark:border-zinc-900 flex justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </main>
    </div>
  );
}