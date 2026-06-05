'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/app/layout-components/Sidebar';
import Header from '@/app/layout-components/Header';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export default function JournalPage() {
  const { status } = useSession();
  const router = useRouter();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }
    if (status === 'authenticated') {
      fetchEntries();
    }
  }, [status, router]);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/journal');
      const data = await response.json();
      if (data.success) setEntries(data.entries);
    } catch (error) {
      toast.error('Failed to load journal entries');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reflection?')) return;
    try {
      setDeleting(id);
      const response = await fetch(`/api/journal/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setEntries(entries.filter(e => e.id !== id));
        toast.success('Reflection removed');
      }
    } catch (error) {
      toast.error('Failed to delete entry');
    } finally {
      setDeleting(null);
    }
  };

  const getMoodIcon = (mood?: string) => {
    const moodMap: Record<string, string> = {
      Peaceful: 'spa',
      Grateful: 'favorite',
      Hopeful: 'wb_sunny',
      Reflective: 'auto_stories',
      Challenged: 'terrain',
      Joyful: 'celebration'
    };
    return moodMap[mood || 'Reflective'] || 'auto_stories';
  };

  if (status === 'loading' || loading) {
    return (
      <div className="relative flex items-center justify-center min-h-screen">
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
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center animate-pulse mb-4">
            <span className="material-symbols-outlined text-indigo-500 text-2xl animate-spin">sync</span>
          </div>
          <p className="font-serif italic text-gray-500 text-sm">Opening your sanctuary...</p>
        </div>
      </div>
    );
  }

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

      <main className="relative z-10 flex-1 lg:ml-56 pt-20 pb-16 px-6 md:px-10 max-w-7xl mx-auto w-full">
        
        {/* Header Section */}
        <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-px bg-gray-400/40" />
              <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em]">Written Legacy</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-gray-800 mb-2 tracking-tight">
              Spiritual Journal
            </h1>
            <p className="text-sm text-gray-600 italic border-l-2 border-indigo-400 pl-4">
              Documenting your walk of faith, one day at a time.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Link
              href="/journal/history"
              className="flex items-center gap-1.5 px-4 py-2 bg-white/40 backdrop-blur-sm border border-white/60 rounded-lg text-[9px] font-black tracking-wider text-gray-700 hover:bg-white/60 hover:border-indigo-300 transition-all uppercase"
            >
              <span className="material-symbols-outlined text-[14px]">history</span>
              History
            </Link>
            <Link
              href="/reflect"
              className="flex items-center gap-1.5 px-4 py-2 bg-white/40 backdrop-blur-sm border border-white/60 rounded-lg text-[9px] font-black tracking-wider text-gray-700 hover:bg-white/60 hover:border-indigo-300 transition-all uppercase"
            >
              <span className="material-symbols-outlined text-[14px]">self_improvement</span>
              Meditation
            </Link>
            <Link
              href="/journal/create"
              className="flex items-center gap-1.5 px-5 py-2 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-lg text-[9px] font-black tracking-wider hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] transition-all uppercase"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              New Entry
            </Link>
          </div>
        </section>

        {/* Entries Grid */}
        {entries.length === 0 ? (
          <div className="h-[400px] flex flex-col items-center justify-center bg-white/30 backdrop-blur-sm border-2 border-dashed border-indigo-200 rounded-2xl">
            <div className="w-16 h-16 rounded-xl bg-indigo-100 flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-indigo-400 text-3xl">edit_note</span>
            </div>
            <p className="text-gray-500 font-serif italic mb-5">The pages are empty, waiting for your first word.</p>
            <Link href="/journal/create" className="text-indigo-600 font-black text-[10px] tracking-wider uppercase border-b-2 border-indigo-600 pb-1 hover:text-indigo-700 transition-colors">
              Begin Writing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="group relative bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl p-5 transition-all duration-300 hover:bg-white/60 hover:shadow-xl hover:-translate-y-0.5 flex flex-col"
              >
                {/* Date & Mood Badge */}
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-indigo-400 text-[12px]">calendar_today</span>
                    <span className="text-[8px] font-black tracking-wider text-indigo-600 uppercase">
                      {new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                    </span>
                  </div>
                  {entry.mood && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-indigo-50 rounded-full">
                      <span className="material-symbols-outlined text-indigo-500 text-[10px]">{getMoodIcon(entry.mood)}</span>
                      <span className="text-[7px] font-bold text-indigo-600 uppercase tracking-tighter">{entry.mood}</span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <h3 className="text-base font-serif font-semibold text-gray-800 mb-2 group-hover:text-indigo-700 transition-colors line-clamp-1">
                    {entry.title}
                  </h3>
                  <p className="text-[11px] text-gray-600 leading-relaxed line-clamp-3 font-serif italic mb-4">
                    {entry.content}
                  </p>
                </div>

                {/* Tags */}
                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {entry.tags.slice(0, 3).map((tag, idx) => (
                      <span key={idx} className="text-[8px] text-gray-400 font-medium">
                        #{tag}
                      </span>
                    ))}
                    {entry.tags.length > 3 && (
                      <span className="text-[8px] text-gray-400">+{entry.tags.length - 3}</span>
                    )}
                  </div>
                )}

                {/* Card Actions */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200/50">
                  <Link
                    href={`/journal/${entry.id}`}
                    className="text-[9px] font-black tracking-wider text-gray-600 uppercase hover:text-indigo-700 transition-colors flex items-center gap-0.5"
                  >
                    Read
                    <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    disabled={deleting === entry.id}
                    className="ml-auto text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[16px]">
                      {deleting === entry.id ? 'sync' : 'delete'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Decorative Footer */}
        {entries.length > 0 && (
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