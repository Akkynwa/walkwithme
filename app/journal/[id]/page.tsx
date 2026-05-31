'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/app/layout-components/Sidebar';
import MainHeader from '@/app/layout-components/Header';
import { toast } from 'react-hot-toast';

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
      <div className="flex min-h-screen bg-[#FDFDFF]">
        <Sidebar />
        <MainHeader />
        <main className="flex-1 lg:ml-64 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <span className="material-symbols-rounded text-3xl text-[#D4AF37] animate-spin" style={{ fontVariationSettings: "'wght' 300" }}>
              progress_activity
            </span>
            <p className="text-xs font-serif italic text-gray-400">Opening sanctuary logs...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FDFDFF]">
      <Sidebar />
      <MainHeader />

      <main className="flex-1 lg:ml-64 pt-28 pb-20 px-6 md:px-12 max-w-[900px] mx-auto w-full">
        
        {/* --- NAVIGATION & ACTIONS --- */}
        <div className="flex items-center justify-between mb-12">
          <Link href="/journal" className="flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors group">
            <span className="material-symbols-rounded text-sm group-hover:-translate-x-1 transition-transform" style={{ fontVariationSettings: "'wght' 300" }}>arrow_back</span>
            <span className="text-[10px] font-black tracking-widest uppercase">Back to Journal</span>
          </Link>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              disabled={loading || deleteLoading}
              className="px-5 py-2 rounded-full border border-gray-200 text-[10px] font-black tracking-widest text-[#3C3830] hover:bg-gray-50 hover:border-[#D4AF37]/30 transition-all uppercase disabled:opacity-50"
            >
              {isEditing ? 'Discard' : 'Edit Reflection'}
            </button>
            {!isEditing && (
              <button 
                onClick={handleDelete}
                disabled={deleteLoading}
                className="text-gray-300 hover:text-red-500 transition-colors disabled:opacity-50 flex items-center justify-center p-1"
                title="Delete Entry"
              >
                <span className="material-symbols-rounded text-[22px]" style={{ fontVariationSettings: "'wght' 300" }}>
                  {deleteLoading ? 'progress_activity' : 'delete'}
                </span>
              </button>
            )}
          </div>
        </div>

        {/* --- ENTRY CONTENT --- */}
        <article className="relative">
          {/* Metadata Bar */}
          <div className="flex items-center gap-6 mb-8 border-b border-gray-100 pb-8">
            <div>
              <p className="text-[9px] font-black text-[#D4AF37] uppercase tracking-[0.2em] mb-1">Date of Entry</p>
              <p className="text-sm font-serif text-[#3C3830]">
                {new Date(entry.createdAt).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="h-8 w-[1px] bg-gray-100" />
            <div>
              <p className="text-[9px] font-black text-[#D4AF37] uppercase tracking-[0.2em] mb-1">Heart State</p>
              <p className="text-sm font-serif text-[#3C3830]">{entry.mood}</p>
            </div>
          </div>

          {isEditing ? (
            <div className="space-y-6 animate-in fade-in duration-500">
              <input
                type="text"
                value={entry.title}
                onChange={(e) => setEntry({ ...entry, title: e.target.value })}
                className="w-full bg-transparent text-4xl font-serif text-[#3C3830] border-b border-[#D4AF37]/20 pb-2 focus:outline-none focus:border-[#D4AF37] transition-all"
                placeholder="Title..."
              />
              <textarea
                value={entry.content}
                onChange={(e) => setEntry({ ...entry, content: e.target.value })}
                className="w-full bg-gray-50/50 p-8 rounded-2xl text-lg font-serif italic leading-relaxed text-[#3C3830] min-h-[500px] focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/5 transition-all resize-none"
                placeholder="Pour out your heart..."
              />
              <button 
                onClick={handleSave}
                disabled={loading}
                className="w-full py-4 bg-[#D4AF37] text-white rounded-full text-[11px] font-black tracking-[0.2em] uppercase hover:shadow-xl hover:shadow-[#D4AF37]/20 transition-all disabled:opacity-50"
              >
                {loading ? 'Saving Changes...' : 'Save Reflection'}
              </button>
            </div>
          ) : (
            <div className="animate-in slide-in-from-bottom-4 duration-700">
              <h1 className="text-5xl font-serif text-[#3C3830] mb-10 leading-tight">
                {entry.title || 'Untitled Reflection'}
              </h1>
              
              {/* THE READING AREA */}
              <div className="prose prose-stone max-w-none">
                <p className="text-xl font-serif italic leading-[2.2rem] text-[#4A463C] first-letter:text-6xl first-letter:font-bold first-letter:text-[#D4AF37] first-letter:mr-3 first-letter:float-left whitespace-pre-wrap">
                  {entry.content || 'This entry has no written thoughts yet.'}
                </p>
              </div>

              {/* TAGS CLOUD */}
              {entry.tags && entry.tags.length > 0 && (
                <div className="mt-20 pt-10 border-t border-gray-100 flex flex-wrap gap-3">
                  {entry.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="text-[10px] font-black tracking-widest text-[#D4AF37] uppercase bg-[#D4AF37]/5 px-4 py-1.5 rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}
        </article>

        {/* --- DECORATIVE FOOTER --- */}
        <div className="mt-32 flex justify-center opacity-20">
          <div className="h-[1px] w-20 bg-[#D4AF37]" />
          <span className="material-symbols-rounded text-[#D4AF37] -mt-3 mx-4 text-xl" style={{ fontVariationSettings: "'wght' 300" }}>menu_book</span>
          <div className="h-[1px] w-20 bg-[#D4AF37]" />
        </div>
      </main>
    </div>
  );
}