'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/app/layout-components/Sidebar';
import { toast } from 'react-hot-toast';
import { useTheme } from './../context/ThemeContext';

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
  const { isDark } = useTheme();

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

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating via grid/link wrapper clicks
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
      <div className={`flex items-center justify-center min-h-screen antialiased ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'}`}>
        <div className="flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center mb-3">
            <span className="material-symbols-outlined text-orange-600 dark:text-orange-500 text-xl animate-spin">
              sync
            </span>
          </div>
          <p className="font-serif italic text-zinc-500 dark:text-zinc-400 text-xs">Opening your sanctuary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen antialiased selection:bg-orange-100 dark:selection:bg-orange-950/50 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'}`}>
      <Sidebar />

      {/* Main Publication Container */}
      <main className="flex-1 lg:ml-64 pt-24 px-4 md:px-8 pb-24 max-w-[850px] mx-auto w-full">
        
        {/* Editorial Substack Header row */}
        <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 pb-4 border-b border-zinc-100 dark:border-zinc-900">
          <div>
            <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-500 mb-2">
              <span className="material-symbols-outlined text-[14px]">auto_stories</span>
              <span className="text-[10px] font-sans font-semibold uppercase tracking-wider">Written Legacy</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-serif-sub font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Spiritual Journal
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-sans mt-1.5">
              Documenting your walk of faith, one day at a time.
            </p>
          </div>

          {/* Understated Button Actions Group */}
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/journal/history"
              className="flex items-center gap-1 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-full text-[12px] font-medium font-sans text-zinc-600 dark:text-zinc-400 transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">history</span>
              <span>History</span>
            </Link>
            <Link
              href="/reflect"
              className="flex items-center gap-1 px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-full text-[12px] font-medium font-sans text-zinc-600 dark:text-zinc-400 transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">self_improvement</span>
              <span>Meditation</span>
            </Link>
            <Link
              href="/journal/create"
              className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white font-medium text-[12px] px-4 py-1.5 rounded-full transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              <span>New Entry</span>
            </Link>
          </div>
        </section>

        {/* Clean Feed Framework */}
        <div className="max-w-[720px] mx-auto">
          {entries.length === 0 ? (
            /* Substack Empty Blank Space Frame */
            <div className="text-center py-20 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-transparent">
              <div className="w-12 h-12 rounded-full bg-zinc-50 dark:bg-zinc-900 flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-zinc-400 dark:text-zinc-500 text-xl">edit_note</span>
              </div>
              <p className="text-sm font-serif italic text-zinc-500 dark:text-zinc-400 mb-1">
                The pages are empty, waiting for your first word.
              </p>
              <Link 
                href="/journal/create" 
                className="mt-4 text-orange-600 dark:text-orange-500 font-sans font-medium text-[12px] hover:text-orange-700 dark:hover:text-orange-400 transition-colors inline-block border-b border-orange-600/30 pb-0.5"
              >
                Begin Writing →
              </Link>
            </div>
          ) : (
            /* Pure Linear Column Stream (Replaces Cards/Grids) */
            <div className="space-y-0">
              {entries.map((entry) => (
                <div 
                  key={entry.id} 
                  className="group block border-b border-zinc-100 dark:border-zinc-900 py-8 first:pt-0 last:border-b-0"
                >
                  <article className="relative">
                    
                    {/* Meta Info Header Strip */}
                    <div className="flex items-center justify-between gap-4 mb-2.5">
                      <div className="flex items-center gap-3 text-[11px] font-sans text-zinc-400 dark:text-zinc-500">
                        <span className="font-mono">
                          {new Date(entry.createdAt).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: '2-digit', 
                            year: 'numeric' 
                          })}
                        </span>
                        {entry.mood && (
                          <>
                            <span>•</span>
                            <div className="flex items-center gap-1 text-zinc-500 dark:text-zinc-400">
                              <span className="material-symbols-outlined text-[12px]">{getMoodIcon(entry.mood)}</span>
                              <span className="font-medium text-[10px] uppercase tracking-wider">{entry.mood}</span>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Explicit Action Delete Selector */}
                      <button
                        onClick={(e) => handleDelete(entry.id, e)}
                        disabled={deleting === entry.id}
                        className="text-zinc-300 hover:text-red-600 dark:text-zinc-700 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                        title="Remove reflection"
                      >
                        <span className="material-symbols-outlined text-[15px] block">
                          {deleting === entry.id ? 'sync' : 'delete'}
                        </span>
                      </button>
                    </div>

                    {/* Interactive Title Link wrapper */}
                    <Link href={`/journal/${entry.id}`} className="block group/link">
                      <h3 className="text-xl font-serif font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 group-hover/link:text-orange-600 dark:group-hover/link:text-orange-500 transition-colors mb-2 leading-snug">
                        {entry.title || 'Untitled Entry'}
                      </h3>
                      
                      <p className="text-[14px] font-serif leading-relaxed text-zinc-600 dark:text-zinc-400 line-clamp-3 mb-3">
                        {entry.content}
                      </p>
                    </Link>

                    {/* Tags Footer Section */}
                    {entry.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 mb-1.5">
                        {entry.tags.slice(0, 4).map((tag, idx) => (
                          <span key={idx} className="text-[11px] font-sans text-zinc-400 dark:text-zinc-500">
                            #{tag}
                          </span>
                        ))}
                        {entry.tags.length > 4 && (
                          <span className="text-[10px] font-sans text-zinc-300 dark:text-zinc-600">
                            +{entry.tags.length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Subtle Read CTA Link Action row */}
                    <Link href={`/journal/${entry.id}`} className="inline-flex items-center gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-4px] group-hover:translate-x-0">
                      <span className="text-[11px] font-sans font-medium text-orange-600 dark:text-orange-500">Read entry</span>
                      <span className="material-symbols-outlined text-orange-600 dark:text-orange-500 text-[12px]">arrow_forward</span>
                    </Link>

                  </article>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Elegant Centered System Rule Dot Divider Footer */}
        {entries.length > 0 && (
          <div className="mt-24 pt-8 border-t border-zinc-100 dark:border-zinc-900 flex justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>
        )}
      </main>
    </div>
  );
}