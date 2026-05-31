'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/app/layout-components/Sidebar';
import Header from '@/app/layout-components/Header';
import { toast } from 'react-hot-toast';

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

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FDFDFF]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="font-serif italic text-primary/60">Opening your sanctuary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FDFDFF]">
      <Sidebar />
      <Header />

      <main className="flex-1 lg:ml-64 pt-28 pb-20 px-6 md:px-12 max-w-[1400px] mx-auto w-full">
        
        {/* --- REFINED HEADER SECTION --- */}
        <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif text-[#3C3830] mb-3 tracking-tight">
              Spiritual Journal
            </h1>
            <p className="text-[#7C7565] italic font-serif border-l-2 border-[#D4AF37] pl-4">
              Documenting your walk of faith, one day at a time.
            </p>
          </div>

          {/* --- NEW ACTION BUTTONS --- */}
          <div className="flex flex-wrap gap-3">
            <Link
              href="/journal/history"
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-full text-[10px] font-black tracking-widest text-[#3C3830] hover:bg-gray-50 transition-all uppercase"
            >
              <span className="material-symbols-outlined text-sm">history</span>
              Journal History
            </Link>
            <Link
              href="/reflect"
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-full text-[10px] font-black tracking-widest text-[#3C3830] hover:bg-gray-50 transition-all uppercase"
            >
              <span className="material-symbols-outlined text-sm">self_improvement</span>
              Meditation
            </Link>
            <Link
              href="/journal/create"
              className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-full text-[10px] font-black tracking-widest hover:shadow-lg hover:shadow-primary/20 transition-all uppercase"
            >
              <span className="material-symbols-outlined text-sm">add_notes</span>
              New Entry
            </Link>
          </div>
        </section>

        {/* --- ENTRIES GRID --- */}
        {entries.length === 0 ? (
          <div className="h-[400px] flex flex-col items-center justify-center border-2 border-dashed border-gray-100 rounded-3xl bg-gray-50/50">
            <span className="material-symbols-outlined text-5xl text-gray-300 mb-4 font-light">edit_note</span>
            <p className="text-[#7C7565] font-serif italic mb-6">The pages are empty, waiting for your first word.</p>
            <Link href="/journal/create" className="text-primary font-black text-[11px] tracking-[0.2em] uppercase border-b-2 border-primary pb-1">
              Begin Writing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="group relative bg-white border border-gray-100 rounded-2xl p-8 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:-translate-y-1 flex flex-col"
              >
                {/* DATE & MOOD BADGE */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-[10px] font-black tracking-[0.15em] text-[#D4AF37] uppercase">
                    {new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })}
                  </span>
                  {entry.mood && (
                    <span className="px-3 py-1 bg-primary/5 text-primary text-[9px] font-black rounded-full uppercase tracking-tighter">
                      {entry.mood}
                    </span>
                  )}
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-serif text-[#3C3830] mb-3 group-hover:text-primary transition-colors line-clamp-1">
                    {entry.title}
                  </h3>
                  <p className="text-[#7C7565] text-sm leading-relaxed line-clamp-4 font-serif italic opacity-80 mb-6">
                    "{entry.content}"
                  </p>
                </div>

                {/* TAGS */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {entry.tags.map((tag, idx) => (
                    <span key={idx} className="text-[10px] text-gray-400 font-medium italic">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* CARD ACTIONS */}
                <div className="flex items-center gap-4 pt-6 border-t border-gray-50">
                  <Link
                    href={`/journal/${entry.id}`}
                    className="text-[10px] font-black tracking-[0.2em] text-[#3C3830] uppercase hover:text-primary transition-colors flex items-center gap-1"
                  >
                    Read <span className="material-symbols-outlined text-xs">arrow_right_alt</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(entry.id)}
                    disabled={deleting === entry.id}
                    className="ml-auto text-gray-300 hover:text-red-400 transition-colors"
                  >
                    <span className="material-symbols-outlined text-lg">
                      {deleting === entry.id ? 'sync' : 'delete'}
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}