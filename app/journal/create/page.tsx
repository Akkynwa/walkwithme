'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/app/layout-components/Sidebar';
import Header from '@/app/layout-components/Header';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

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

      <main className="relative z-10 flex-1 lg:ml-56 pt-20 pb-16 px-6 md:px-10 max-w-3xl mx-auto w-full">
        {/* Header */}
        <section className="mb-10">
          <Link href="/journal" className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors mb-5 group">
            <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="text-[9px] font-black tracking-wider uppercase">Back to Library</span>
          </Link>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-px bg-gray-400/40" />
            <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em]">New Entry</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-gray-800 tracking-tight">Write a Reflection</h1>
          <p className="text-sm text-gray-600 italic border-l-2 border-indigo-400 pl-4 mt-2">
            Pour your heart out; this space is yours.
          </p>
        </section>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Title Input */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-500 text-[14px]">title</span>
              <label className="text-[8px] font-black text-indigo-600 uppercase tracking-wider">Entry Title</label>
            </div>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Give this moment a name..."
              className="w-full bg-transparent border-b border-gray-200 py-3 text-xl md:text-2xl font-serif text-gray-800 placeholder:text-gray-300 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Mood Selector */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-500 text-[14px]">favorite</span>
              <label className="text-[8px] font-black text-indigo-600 uppercase tracking-wider">Current Heart State</label>
            </div>
            <div className="flex flex-wrap gap-2">
              {MOOD_OPTIONS.map((mood) => (
                <button
                  key={mood.label}
                  type="button"
                  onClick={() => setFormData({ ...formData, mood: mood.label })}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-[10px] font-bold transition-all border ${
                    formData.mood === mood.label 
                      ? 'bg-indigo-600 border-indigo-600 text-white shadow-md shadow-indigo-500/20 scale-105' 
                      : 'bg-white/50 border-gray-200 text-gray-500 hover:border-indigo-300 hover:text-indigo-600'
                  }`}
                >
                  <span className="material-symbols-outlined text-[14px]">{mood.icon}</span>
                  {mood.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Textarea */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-500 text-[14px]">edit_note</span>
              <label className="text-[8px] font-black text-indigo-600 uppercase tracking-wider">The Reflection</label>
            </div>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="What is speaking to your heart today?"
              rows={10}
              className="w-full p-5 bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl text-base font-serif italic text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all resize-none leading-relaxed"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-500 text-[14px]">local_offer</span>
              <label className="text-[8px] font-black text-indigo-600 uppercase tracking-wider">Keywords (Separated by commas)</label>
            </div>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="Grace, breakthrough, morning reflection"
              className="w-full bg-transparent border-b border-gray-200 py-2 text-sm text-gray-600 focus:outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-8">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl text-[10px] font-black tracking-wider uppercase hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-[14px]">sync</span>
                  Preserving...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[14px]">save</span>
                  Seal Entry
                </span>
              )}
            </button>
            <Link
              href="/journal"
              className="text-[9px] font-bold text-gray-400 uppercase tracking-wider hover:text-red-500 transition-colors"
            >
              Discard Changes
            </Link>
          </div>
        </form>

        {/* Decorative Footer */}
        <div className="mt-16 flex justify-center items-center gap-4 opacity-30">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-indigo-400" />
          <span className="material-symbols-outlined text-indigo-400 text-sm">edit_note</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-indigo-400" />
        </div>
      </main>
    </div>
  );
}