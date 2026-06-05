'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/app/layout-components/Sidebar';
import MainHeader from '@/app/layout-components/Header';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface JournalEntry {
  title: string;
  content: string;
  mood: string;
  tags: string[];
  createdAt: string;
}

export default function JournalDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  
  const [entry, setEntry] = useState<JournalEntry>({
    title: '',
    content: '',
    mood: '',
    tags: [],
    createdAt: new Date().toISOString(),
  });

  // Fetch individual entry from database
  useEffect(() => {
    if (!id) return;

    const fetchEntry = async () => {
      try {
        setPageLoading(true);
        const response = await fetch(`/api/journal/${id}`);
        const data = await response.json();
        
        if (response.ok) {
          const actualEntry = data.entry ? data.entry : data;
          setEntry({
            title: actualEntry.title || '',
            content: actualEntry.content || '',
            mood: actualEntry.mood || 'Reflective',
            tags: actualEntry.tags || [],
            createdAt: actualEntry.createdAt || new Date().toISOString(),
          });
        } else {
          throw new Error('Failed to fetch entry status');
        }
      } catch (error) {
        console.error("Fetch error:", error);
        toast.error('Could not load reflection from server.');
      } finally {
        setPageLoading(false);
      }
    };

    fetchEntry();
  }, [id]);

  // Handle PUT Request (Save Changes)
  const handleSave = async () => {
    if (!entry.title.trim() || !entry.content.trim()) {
      toast.error('Title and Content cannot be empty.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`/api/journal/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: entry.title,
          content: entry.content,
          mood: entry.mood,
          tags: entry.tags,
        }),
      });

      if (response.ok) {
        setIsEditing(false);
        toast.success('Reflection updated successfully');
        router.refresh();
      } else {
        throw new Error('Failed to update');
      }
    } catch (error) {
      toast.error('Could not save your changes.');
    } finally {
      setLoading(false);
    }
  };

  // Handle DELETE Request
  const handleDelete = async () => {
    if (!window.confirm('Are you certain you want to permanently erase this reflection from your sanctuary logs?')) {
      return;
    }

    try {
      setDeleteLoading(true);
      const response = await fetch(`/api/journal/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Reflection deleted permanently.');
        router.push('/journal');
        router.refresh();
      } else {
        throw new Error('Failed to delete');
      }
    } catch (error) {
      toast.error('Could not delete entry.');
    } finally {
      setDeleteLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="relative flex min-h-screen bg-gradient-to-br from-indigo-50/30 via-white/40 to-purple-50/30">
        <Sidebar />
        <MainHeader />
        <main className="flex-1 lg:ml-56 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center animate-pulse">
              <span className="material-symbols-outlined text-indigo-500 text-2xl animate-spin">sync</span>
            </div>
            <p className="text-xs font-serif italic text-gray-500">Opening sanctuary logs...</p>
          </div>
        </main>
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
      <MainHeader />

      <main className="relative z-10 flex-1 lg:ml-56 pt-20 pb-16 px-6 md:px-10 max-w-4xl mx-auto w-full">
        
        {/* Navigation & Actions */}
        <div className="flex items-center justify-between mb-10">
          <Link href="/journal" className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors group">
            <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="text-[9px] font-black tracking-wider uppercase">Back to Journal</span>
          </Link>

          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              disabled={loading || deleteLoading}
              className="px-4 py-1.5 rounded-lg border border-gray-300 text-[9px] font-black tracking-wider text-gray-700 hover:bg-white/50 hover:border-indigo-300 transition-all uppercase disabled:opacity-50"
            >
              {isEditing ? 'Discard' : 'Edit Reflection'}
            </button>
            {!isEditing && (
              <button 
                onClick={handleDelete}
                disabled={deleteLoading}
                className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 flex items-center justify-center p-1"
                title="Delete Entry"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {deleteLoading ? 'sync' : 'delete'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Entry Content */}
        <article className="relative">
          {/* Metadata Bar */}
          <div className="flex flex-wrap items-center gap-4 mb-8 pb-6 border-b border-gray-200/50">
            <div>
              <div className="flex items-center gap-1 mb-1">
                <span className="material-symbols-outlined text-indigo-500 text-[12px]">calendar_today</span>
                <p className="text-[8px] font-black text-indigo-600 uppercase tracking-wider">Date of Entry</p>
              </div>
              <p className="text-sm font-serif text-gray-700">
                {new Date(entry.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="h-6 w-px bg-gray-200" />
            <div>
              <div className="flex items-center gap-1 mb-1">
                <span className="material-symbols-outlined text-indigo-500 text-[12px]">favorite</span>
                <p className="text-[8px] font-black text-indigo-600 uppercase tracking-wider">Heart State</p>
              </div>
              <p className="text-sm font-serif text-gray-700">{entry.mood}</p>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-5 animate-in fade-in duration-500">
              <input
                type="text"
                value={entry.title}
                onChange={(e) => setEntry({ ...entry, title: e.target.value })}
                className="w-full bg-transparent text-3xl md:text-4xl font-serif text-gray-800 border-b border-indigo-200 pb-2 focus:outline-none focus:border-indigo-500 transition-all"
                placeholder="Title..."
              />
              <textarea
                value={entry.content}
                onChange={(e) => setEntry({ ...entry, content: e.target.value })}
                className="w-full bg-white/50 backdrop-blur-sm p-6 rounded-xl text-base font-serif italic leading-relaxed text-gray-700 min-h-[400px] focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all resize-none border border-white/60"
                placeholder="Pour out your heart..."
              />
              <button 
                onClick={handleSave}
                disabled={loading}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl text-[10px] font-black tracking-wider uppercase hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] transition-all disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined animate-spin text-[14px]">sync</span>
                    Saving Changes...
                  </span>
                ) : (
                  'Save Reflection'
                )}
              </button>
            </div>
          ) : (
            <div className="animate-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-800 mb-8 leading-tight">
                {entry.title || 'Untitled Reflection'}
              </h1>
              
              {/* Reading Area */}
              <div className="bg-white/30 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/60">
                <p className="text-base md:text-lg font-serif italic leading-relaxed text-gray-700 first-letter:text-5xl first-letter:font-bold first-letter:text-indigo-500 first-letter:mr-3 first-letter:float-left whitespace-pre-wrap">
                  {entry.content || 'This entry has no written thoughts yet.'}
                </p>
              </div>

              {/* Tags Cloud */}
              {entry.tags && entry.tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-gray-200/50 flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="text-[8px] font-black tracking-wider text-indigo-600 uppercase bg-indigo-50 px-3 py-1 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </article>

        {/* Decorative Footer */}
        <div className="mt-24 flex justify-center items-center gap-4 opacity-30">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-indigo-400" />
          <span className="material-symbols-outlined text-indigo-400 text-sm">menu_book</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-indigo-400" />
        </div>
      </main>
    </div>
  );
}