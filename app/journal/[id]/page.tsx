'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/app/layout-components/Sidebar';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

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
  const { isDark } = useTheme();

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
      <div className={`flex min-h-screen ${isDark ? 'bg-zinc-950' : 'bg-white'}`}>
        <Sidebar />
        <main className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="text-center">
            <div className="w-6 h-6 border-[1.5px] border-zinc-200 dark:border-zinc-800 border-t-zinc-900 dark:border-t-white rounded-full animate-spin mx-auto mb-4"></div>
            <p className="font-serif italic text-zinc-500 dark:text-zinc-400 text-sm tracking-wide">Opening sanctuary logs...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen antialiased selection:bg-orange-100 dark:selection:bg-orange-950/50 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'}`}>
      <Sidebar />

      {/* Main Container - Padded correctly to match Substack's strict content column spacing */}
      <main className="flex-1 lg:ml-64 pt-24 px-4 md:px-8 pb-24 max-w-[850px] mx-auto w-full">
        
        {/* Navigation & Actions Row */}
        <div className="flex items-center justify-between mb-12 pb-4 border-b border-zinc-100 dark:border-zinc-900">
          <Link href="/journal" className="flex items-center gap-2 transition-colors text-zinc-500 hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-500 font-sans text-[12px] font-medium">
            <span className="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-1">arrow_back</span>
            <span>Back to Journal</span>
          </Link>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              disabled={loading || deleteLoading}
              className={`px-4 py-1.5 rounded-full text-[12px] font-medium transition-all border disabled:opacity-50 ${
                isEditing
                  ? 'bg-rose-50 dark:bg-rose-950/30 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50 hover:bg-rose-100'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800/80 shadow-xs'
              }`}
            >
              {isEditing ? 'Discard' : 'Edit Reflection'}
            </button>
            {!isEditing && (
              <button 
                onClick={handleDelete}
                disabled={deleteLoading}
                className="text-zinc-400 dark:text-zinc-500 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1"
                title="Delete Entry"
              >
                <span className="material-symbols-outlined text-[20px]">
                  {deleteLoading ? 'sync' : 'delete'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Entry Editorial Content */}
        <article className="max-w-[720px] mx-auto">
          {/* Metadata String Meta Row */}
          <div className="flex items-center gap-3 text-[12px] text-zinc-400 dark:text-zinc-500 mb-6 font-sans">
            <span className="text-orange-600 dark:text-orange-500 font-medium uppercase tracking-wider text-[10px]">
              {entry.mood}
            </span>
            <span>•</span>
            <span className="font-mono">
              {new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          {isEditing ? (
            <div className="space-y-6 animate-in fade-in duration-500">
              <input
                type="text"
                value={entry.title}
                onChange={(e) => setEntry({ ...entry, title: e.target.value })}
                className="w-full bg-transparent text-3xl md:text-4xl font-serif font-serif-sub pb-3 focus:outline-none transition-all border-b border-zinc-100 dark:border-zinc-900 text-zinc-900 dark:text-zinc-50 placeholder-zinc-300 dark:placeholder-zinc-700"
                placeholder="Title..."
              />
              <textarea
                value={entry.content}
                onChange={(e) => setEntry({ ...entry, content: e.target.value })}
                className="w-full bg-transparent text-[15px] font-serif leading-relaxed min-h-[450px] focus:outline-none transition-all resize-none text-zinc-800 dark:text-zinc-200 placeholder-zinc-400"
                placeholder="Pour out your heart..."
              />
              
              <div className="pt-4 border-t border-zinc-100 dark:border-zinc-900">
                <button 
                  onClick={handleSave}
                  disabled={loading}
                  className="bg-orange-600 hover:bg-orange-700 text-white font-medium text-[13px] px-6 py-2.5 rounded-full transition-colors shadow-sm disabled:opacity-50"
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                      Saving Changes...
                    </span>
                  ) : (
                    'Save Reflection'
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-700">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-serif-sub font-semibold tracking-tight mb-8 leading-[1.15] text-zinc-900 dark:text-zinc-50">
                {entry.title || 'Untitled Reflection'}
              </h1>
              
              {/* Plain Editorial Reading Column Layout */}
              <div className="text-[16px] md:text-[17px] font-serif leading-relaxed text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap selection:bg-orange-100">
                {entry.content || 'This entry has no written thoughts yet.'}
              </div>

              {/* Tags Cloud Stream Footer Divider */}
              {entry.tags && entry.tags.length > 0 && (
                <div className="mt-16 pt-8 border-t border-zinc-100 dark:border-zinc-900 flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="text-[11px] font-sans font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </article>

        {/* Minimalist Substack System Rule Line Divider */}
        <div className="mt-24 pt-8 border-t border-zinc-100 dark:border-zinc-900 flex justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </main>
    </div>
  );
}