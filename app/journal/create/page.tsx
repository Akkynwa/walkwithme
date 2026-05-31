'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/app/layout-components/Sidebar';
import Header from '@/app/layout-components/Header';
import { toast } from 'react-hot-toast';

const MOOD_OPTIONS = [
  { label: 'Peaceful', icon: 'scuba_diving' },
  { label: 'Grateful', icon: 'favorite' },
  { label: 'Hopeful', icon: 'wb_sunny' },
  { label: 'Reflective', icon: 'auto_stories' },
  { label: 'Challenged', icon: 'mountain_flag' },
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
    <div className="flex min-h-screen bg-[#FDFDFF]">
      <Sidebar />
      <Header />

      <main className="flex-1 lg:ml-64 pt-28 pb-20 px-6 md:px-12 max-w-[1000px] mx-auto w-full">
        {/* --- HEADER --- */}
        <section className="mb-12">
          <Link href="/journal" className="flex items-center gap-2 text-gray-400 hover:text-[#D4AF37] transition-colors mb-6 group">
            <span className="material-symbols-rounded text-sm group-hover:-translate-x-1 transition-transform" style={{ fontVariationSettings: "'wght' 300" }}>arrow_back</span>
            <span className="text-[10px] font-black tracking-widest uppercase">Back to Library</span>
          </Link>
          <h1 className="text-4xl font-serif text-[#3C3830] tracking-tight">New Reflection</h1>
          <p className="text-[#7C7565] italic font-serif mt-2 border-l-2 border-[#D4AF37] pl-4">
            Pour your heart out; this space is yours.
          </p>
        </section>

        {/* --- FORM --- */}
        <form onSubmit={handleSubmit} className="space-y-10">
          
          {/* Title Input */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em]">Entry Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Give this moment a name..."
              className="w-full bg-transparent border-b border-gray-200 py-4 text-2xl font-serif text-[#3C3830] placeholder:text-gray-200 focus:outline-none focus:border-[#D4AF37] transition-all"
            />
          </div>

          {/* Mood Selector (Tactile Chips) */}
          <div className="space-y-4">
            <label className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em]">Current Heart State</label>
            <div className="flex flex-wrap gap-3">
              {MOOD_OPTIONS.map((mood) => (
                <button
                  key={mood.label}
                  type="button"
                  onClick={() => setFormData({ ...formData, mood: mood.label })}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-[11px] font-bold transition-all border ${
                    formData.mood === mood.label 
                      ? 'bg-[#D4AF37] border-[#D4AF37] text-white shadow-lg shadow-[#D4AF37]/20 scale-105' 
                      : 'bg-white border-gray-100 text-gray-400 hover:border-[#D4AF37]/30'
                  }`}
                >
                  <span className="material-symbols-rounded text-sm" style={{ fontVariationSettings: "'wght' 300" }}>{mood.icon}</span>
                  {mood.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content Textarea */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em]">The Reflection</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="What is God speaking to you today?"
              rows={10}
              className="w-full p-8 bg-gray-50/50 border border-gray-100 rounded-2xl text-lg font-serif italic text-[#3C3830] placeholder:text-gray-300 focus:outline-none focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/5 transition-all resize-none leading-relaxed"
            />
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em]">Keywords (Separated by commas)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g. Grace, breakthrough, Lagos morning"
              className="w-full bg-transparent border-b border-gray-100 py-3 text-sm text-[#7C7565] focus:outline-none focus:border-[#D4AF37] transition-all"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-6 pt-10">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 md:flex-none px-12 py-4 bg-[#D4AF37] text-white rounded-full text-[11px] font-black tracking-[0.2em] uppercase hover:shadow-2xl hover:shadow-[#D4AF37]/30 transition-all disabled:opacity-50"
            >
              {loading ? 'Preserving...' : 'Seal Entry'}
            </button>
            <Link
              href="/journal"
              className="text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-red-400 transition-colors"
            >
              Discard Changes
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}