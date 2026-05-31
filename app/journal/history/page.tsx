'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Sidebar from '@/app/layout-components/Sidebar';
import Header from '@/app/layout-components/Header';
import { toast } from 'react-hot-toast';

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

  return (
    <div className="flex min-h-screen bg-[#FDFDFF]">
      <Sidebar />
      <Header />

      <main className="flex-grow lg:ml-64 px-6 md:px-12 py-28 max-w-[800px] mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-serif text-[#3C3830] mb-8">Journal History</h1>
          
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 text-xl">search</span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search reflections..."
                className="w-full bg-gray-50/50 border border-gray-100 rounded-xl py-3 pl-10 pr-4 text-sm font-serif italic text-[#3C3830] focus:outline-none focus:border-primary focus:bg-white transition-all"
              />
            </div>

            {/* Sort Toggle */}
            <button 
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-100 rounded-xl text-[10px] font-black tracking-widest text-[#D4AF37] uppercase hover:border-primary/30 transition-all"
            >
              <span className="material-symbols-outlined text-sm">
                {sortOrder === 'desc' ? 'south' : 'north'}
              </span>
              {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
            </button>
          </div>
        </div>

        {/* Entries List */}
        <div className="space-y-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 w-full bg-gray-50 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : filteredAndSortedEntries.length > 0 ? (
            filteredAndSortedEntries.map((entry) => (
              <Link href={`/journal/${entry.id}`} key={entry.id} className="block group">
                <article className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-[9px] font-black text-[#D4AF37] uppercase tracking-[0.2em] mb-1">
                        {new Date(entry.createdAt).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric', 
                          year: 'numeric' 
                        })}
                      </p>
                      <h3 className="text-xl font-serif text-[#3C3830] group-hover:text-primary transition-colors">
                        {entry.title}
                      </h3>
                    </div>
                    <span className="text-[9px] font-bold text-gray-400 uppercase px-3 py-1 bg-gray-50 rounded-full">
                      {entry.mood}
                    </span>
                  </div>
                  <p className="text-sm font-serif italic text-[#7C7565] line-clamp-2 leading-relaxed">
                    {entry.content}
                  </p>
                </article>
              </Link>
            ))
          ) : (
            <div className="text-center py-20 border-2 border-dashed border-gray-50 rounded-3xl">
              <span className="material-symbols-outlined text-4xl text-gray-200 mb-2">history_edu</span>
              <p className="text-sm text-gray-400 font-serif italic">No entries found.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}