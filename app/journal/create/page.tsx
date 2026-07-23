'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/app/layout-components/Sidebar';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

const MOOD_OPTIONS = [
  { label: 'Peaceful', icon: 'spa' },
  { label: 'Grateful', icon: 'favorite' },
  { label: 'Hopeful', icon: 'wb_sunny' },
  { label: 'Reflective', icon: 'auto_stories' },
  { label: 'Challenged', icon: 'terrain' },
  { label: 'Joyful', icon: 'celebration' }
];

export default function CreateJournalPage() {
  const { status } = useSession();
  const router = useRouter();
  const { isDark } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    mood: 'Peaceful',
    tags: '',
  });

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title?.trim() || !formData.content?.trim()) {
      toast.error('Please add a title and some thoughts.');
      return;
    }

    try {
      setLoading(true);
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(t => t.length > 0);

      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, tags }),
      });

      if (response.ok) {
        toast.success('Your reflection has been preserved.');
        router.push('/journal');
      }
    } catch (error) {
      toast.error('An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`flex min-h-screen antialiased selection:bg-orange-100 dark:selection:bg-orange-950/50 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'}`}>
      <Sidebar />

      {/* Main Content Column spacing configured identically to standard Substack specs */}
      <main className="flex-1 lg:ml-64 pt-24 px-4 md:px-8 pb-24 max-w-[850px] mx-auto w-full">
        
        {/* Navigation Action Strip */}
        <div className="flex items-center justify-between mb-12 pb-4 border-b border-zinc-100 dark:border-zinc-900">
          <Link href="/journal" className="flex items-center gap-2 transition-colors text-zinc-500 hover:text-orange-600 dark:text-zinc-400 dark:hover:text-orange-500 font-sans text-[12px] font-medium">
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Back to Journal</span>
          </Link>

          <span className="font-sans text-[11px] font-medium tracking-wider text-zinc-400 dark:text-zinc-500 uppercase">
            Draft
          </span>
        </div>

        {/* Editorial Writer Container */}
        <form onSubmit={handleSubmit} className="max-w-[720px] mx-auto space-y-10">
          
          {/* Metadata Meta String Row: Mood Dropdown / Config */}
          <div className="space-y-3">
            <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500">
              <span className="material-symbols-outlined text-[14px]">favorite</span>
              <label className="text-[10px] font-sans font-semibold uppercase tracking-wider">Current Heart State</label>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {MOOD_OPTIONS.map((mood) => (
                <button
                  key={mood.label}
                  type="button"
                  onClick={() => setFormData({ ...formData, mood: mood.label })}
                  className={`flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-medium transition-colors font-sans border ${
                    formData.mood === mood.label 
                      ? 'bg-zinc-900 dark:bg-zinc-100 border-zinc-900 dark:border-zinc-100 text-white dark:text-zinc-950' 
                      : 'bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:border-zinc-400 dark:hover:border-zinc-600'
                  }`}
                >
                  <span className="material-symbols-outlined text-[13px]">{mood.icon}</span>
                  {mood.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title Editor Row */}
          <div className="space-y-1">
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Title..."
              className="w-full bg-transparent text-3xl md:text-4xl font-serif font-serif-sub font-semibold tracking-tight pb-3 focus:outline-none text-zinc-900 dark:text-zinc-50 placeholder-zinc-300 dark:placeholder-zinc-700"
            />
          </div>

          {/* Content Field Row */}
          <div className="space-y-1">
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Pour out your heart..."
              rows={12}
              className="w-full bg-transparent text-[16px] md:text-[17px] font-serif leading-relaxed focus:outline-none transition-all resize-none text-zinc-800 dark:text-zinc-200 placeholder-zinc-400"
            />
          </div>

          {/* Tags String Row */}
          <div className="space-y-2 pt-4 border-t border-zinc-100 dark:border-zinc-900">
            <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500">
              <span className="material-symbols-outlined text-[14px]">local_offer</span>
              <label className="text-[10px] font-sans font-semibold uppercase tracking-wider">Keywords (Separated by commas)</label>
            </div>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Grace, breakthrough, morning reflection..."
              className="w-full bg-transparent border-b border-zinc-100 dark:border-zinc-900 py-1 text-[13px] text-zinc-600 dark:text-zinc-400 focus:outline-none focus:border-zinc-300 dark:focus:border-zinc-700 transition-colors placeholder-zinc-300 dark:placeholder-zinc-700 font-sans"
            />
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-6 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="bg-orange-600 hover:bg-orange-700 text-white font-medium text-[13px] px-6 py-2.5 rounded-full transition-colors shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                  Preserving...
                </span>
              ) : (
                'Publish Reflection'
              )}
            </button>
            <Link
              href="/journal"
              className="text-[12px] font-sans font-medium text-zinc-400 dark:text-zinc-500 hover:text-red-500 dark:hover:text-red-400 transition-colors"
            >
              Discard
            </Link>
          </div>
        </form>

        {/* Minimalist Substack System Rule Line Divider Footer */}
        <div className="mt-24 pt-8 border-t border-zinc-100 dark:border-zinc-900 flex justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </main>
    </div>
  );
}