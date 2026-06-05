'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/app/layout-components/Sidebar';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

export default function CreatePrayerPage() {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    prayerContent: '',
    category: 'general',
  });

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  const categories = ['general', 'health', 'work', 'family', 'spiritual', 'relationships', 'finances'];

  const getCategoryIcon = (category: string) => {
    const icons: Record<string, string> = {
      general: 'folder_open',
      health: 'favorite',
      work: 'work',
      family: 'family_restroom',
      spiritual: 'spa',
      relationships: 'diversity_3',
      finances: 'payments'
    };
    return icons[category] || 'folder_open';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.prayerContent.trim()) {
      toast.error('Please provide a title and your prayer request.');
      return;
    }

    try {
      setLoading(true);
      
      const payload = {
        title: formData.title,
        request: formData.prayerContent,
        category: formData.category
      };

      const response = await fetch('/api/prayers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.status === 401) {
        toast.error('Session expired. Please sign in again.');
        router.push('/auth/signin');
        return;
      }

      if (response.ok) {
        toast.success('Prayer request lifted up!');
        router.push('/prayers');
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to create prayer request');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('A connection error occurred. Please check your network.');
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
        <div className="absolute top-20 right-20 w-96 h-96 bg-amber-200/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-amber-300/8 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '-3s' }} />
      </div>

      <Sidebar />

      <main className="relative z-10 flex-1 lg:ml-56 pt-20 px-6 md:px-10 pb-16 max-w-3xl mx-auto w-full">
        
        {/* Navigation & Header */}
        <header className="mb-8 animate-in fade-in duration-700">
          <Link
            href="/prayers"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-amber-600 transition-all mb-5 text-[9px] font-black uppercase tracking-wider group"
          >
            <span className="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-1">arrow_back</span>
            <span>Back to Prayer Journal</span>
          </Link>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-px bg-amber-400/40" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-600">Altar Room</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-600"></div>
              <h1 className="text-3xl font-serif text-gray-800 tracking-tight">
                New <span className="font-serif italic text-amber-600">Petition</span>
              </h1>
            </div>
            <p className="text-sm text-gray-600 italic border-l-2 border-amber-400 pl-4 mt-1">
              Pour out what weighs heavy or brings hope onto your journal records today.
            </p>
          </div>
        </header>

        {/* Form Container */}
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-500 text-[14px]">title</span>
                <label className="block text-[8px] font-black text-amber-600 uppercase tracking-wider">
                  Prayer Reference Title
                </label>
              </div>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Clarity regarding business paths..."
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all placeholder:text-gray-400 text-gray-800"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-500 text-[14px]">local_offer</span>
                <label className="block text-[8px] font-black text-amber-600 uppercase tracking-wider">
                  Context Classification
                </label>
              </div>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold tracking-wide border transition-all ${
                      formData.category === cat
                        ? 'bg-amber-100 text-amber-700 border-amber-300'
                        : 'bg-white/40 text-gray-600 border-gray-200 hover:border-amber-300 hover:text-amber-600'
                    }`}
                  >
                    <span className="material-symbols-outlined text-[12px]">{getCategoryIcon(cat)}</span>
                    <span>{cat.charAt(0).toUpperCase() + cat.slice(1)}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Prayer Content */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-amber-500 text-[14px]">edit_note</span>
                <label className="block text-[8px] font-black text-amber-600 uppercase tracking-wider">
                  Deep Expression
                </label>
              </div>
              <textarea
                value={formData.prayerContent}
                onChange={(e) => setFormData({ ...formData, prayerContent: e.target.value })}
                placeholder="Pour out your heart unfiltered here..."
                rows={7}
                className="w-full px-4 py-3 bg-white/50 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all placeholder:text-gray-400 resize-none leading-relaxed text-gray-700 font-serif italic"
              />
            </div>

            {/* Stillness Note */}
            <div className="bg-amber-50/50 backdrop-blur-sm border border-amber-100 rounded-xl p-4 flex gap-3 items-start">
              <span className="material-symbols-outlined text-amber-500 text-[18px] mt-0.5">spa</span>
              <p className="text-[10px] text-gray-600 leading-relaxed">
                Take an intentional deep breath before submitting this card. Remember that He is familiar with even the unspoken movements of your soul.
              </p>
            </div>

            {/* Actions Panel */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200/50">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-wider shadow-md hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                <span>{loading ? 'Submitting Petition...' : 'Commit Request'}</span>
              </button>
              
              <Link
                href="/prayers"
                className="flex-1 px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-wider text-gray-600 border border-gray-200 bg-white/40 hover:bg-white/60 hover:border-amber-300 transition-all text-center flex items-center justify-center"
              >
                Cancel Draft
              </Link>
            </div>
          </form>
        </div>

        {/* Decorative Footer */}
        <div className="mt-8 flex justify-center items-center gap-4 opacity-30">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400" />
          <span className="material-symbols-outlined text-amber-400 text-sm">menu_book</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400" />
        </div>
      </main>
    </div>
  );
}