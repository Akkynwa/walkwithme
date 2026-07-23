'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/app/layout-components/Sidebar';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

export default function CreatePrayerPage() {
  const { status } = useSession();
  const router = useRouter();
  const { isDark } = useTheme();
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
    <div className={`flex min-h-screen ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
      <Sidebar />

      <main className="relative z-10 flex-1 lg:ml-56 pt-20 px-6 md:px-10 pb-16 max-w-3xl mx-auto w-full">
        
        {/* Navigation & Header */}
        <header className="mb-8 animate-in fade-in duration-700">
          <Link
            href="/prayers"
            className={`inline-flex items-center gap-2 transition-all mb-5 text-[9px] font-black uppercase tracking-wider group ${
              isDark ? 'text-gray-400 hover:text-primary-400' : 'text-gray-500 hover:text-amber-600'
            }`}
          >
            <span className="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-1">arrow_back</span>
            <span>Back to Prayer Journal</span>
          </Link>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-px ${isDark ? 'bg-primary-400/40' : 'bg-amber-400/40'}`} />
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-primary-400' : 'text-amber-600'}`}>Altar Room</span>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-primary-400' : 'bg-amber-600'}`}></div>
              <h1 className={`text-3xl font-serif tracking-tight ${isDark ? 'text-text-primary' : 'text-gray-800'}`}>
                New <span className={`font-serif italic ${isDark ? 'text-primary-400' : 'text-amber-600'}`}>Petition</span>
              </h1>
            </div>
            <p className={`text-sm italic border-l-2 ${isDark ? 'border-primary-400/40 text-text-secondary' : 'border-amber-400 text-gray-600'} pl-4 mt-1`}>
              Pour out what weighs heavy or brings hope onto your journal records today.
            </p>
          </div>
        </header>

        {/* Form Container */}
        <div className={`backdrop-blur-xl border rounded-2xl p-6 md:p-8 shadow-lg relative overflow-hidden ${
          isDark ? 'bg-black/40 border-white/10' : 'bg-white/40 border-white/60'
        }`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Title */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5">
                <span className={`material-symbols-outlined text-[14px] ${isDark ? 'text-primary-400' : 'text-amber-500'}`}>title</span>
                <label className={`block text-[8px] font-black uppercase tracking-wider ${isDark ? 'text-primary-400' : 'text-amber-600'}`}>
                  Prayer Reference Title
                </label>
              </div>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Clarity regarding business paths..."
                className={`w-full px-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-gray-400 ${
                  isDark 
                    ? 'bg-black/30 border-white/10 text-text-primary placeholder:text-gray-600' 
                    : 'bg-white/50 border-gray-200 text-gray-800'
                }`}
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <span className={`material-symbols-outlined text-[14px] ${isDark ? 'text-primary-400' : 'text-amber-500'}`}>local_offer</span>
                <label className={`block text-[8px] font-black uppercase tracking-wider ${isDark ? 'text-primary-400' : 'text-amber-600'}`}>
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
                        ? isDark 
                          ? 'bg-primary-500/20 text-primary-400 border-primary-500/30' 
                          : 'bg-amber-100 text-amber-700 border-amber-300'
                        : isDark 
                          ? 'bg-black/30 text-gray-400 border-white/10 hover:border-primary-500/30 hover:text-primary-400' 
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
                <span className={`material-symbols-outlined text-[14px] ${isDark ? 'text-primary-400' : 'text-amber-500'}`}>edit_note</span>
                <label className={`block text-[8px] font-black uppercase tracking-wider ${isDark ? 'text-primary-400' : 'text-amber-600'}`}>
                  Deep Expression
                </label>
              </div>
              <textarea
                value={formData.prayerContent}
                onChange={(e) => setFormData({ ...formData, prayerContent: e.target.value })}
                placeholder="Pour out your heart unfiltered here..."
                rows={7}
                className={`w-full px-4 py-3 border rounded-lg text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all placeholder:text-gray-400 resize-none leading-relaxed font-serif italic ${
                  isDark 
                    ? 'bg-black/30 border-white/10 text-text-primary placeholder:text-gray-600' 
                    : 'bg-white/50 border-gray-200 text-gray-700'
                }`}
              />
            </div>

            {/* Stillness Note */}
            <div className={`backdrop-blur-sm border rounded-xl p-4 flex gap-3 items-start ${
              isDark 
                ? 'bg-primary-500/10 border-primary-500/20' 
                : 'bg-amber-50/50 border-amber-100'
            }`}>
              <span className={`material-symbols-outlined text-[18px] mt-0.5 ${isDark ? 'text-primary-400' : 'text-amber-500'}`}>spa</span>
              <p className={`text-[10px] leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Take an intentional deep breath before submitting this card. Remember that He is familiar with even the unspoken movements of your soul.
              </p>
            </div>

            {/* Actions Panel */}
            <div className={`flex flex-col sm:flex-row gap-3 pt-4 border-t ${isDark ? 'border-white/10' : 'border-gray-200/50'}`}>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-wider shadow-md hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>}
                <span>{loading ? 'Submitting Petition...' : 'Commit Request'}</span>
              </button>
              
              <Link
                href="/prayers"
                className={`flex-1 px-6 py-3 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all text-center flex items-center justify-center ${
                  isDark 
                    ? 'text-gray-400 border-white/10 bg-black/30 hover:bg-black/50 hover:border-primary-500/30' 
                    : 'text-gray-600 border-gray-200 bg-white/40 hover:bg-white/60 hover:border-amber-300'
                } border`}
              >
                Cancel Draft
              </Link>
            </div>
          </form>
        </div>

        {/* Decorative Footer */}
        <div className="mt-8 flex justify-center items-center gap-4 opacity-30">
          <div className={`h-px w-16 bg-gradient-to-r from-transparent ${isDark ? 'to-primary-400' : 'to-amber-400'}`} />
          <span className={`material-symbols-outlined text-sm ${isDark ? 'text-primary-400' : 'text-amber-400'}`}>menu_book</span>
          <div className={`h-px w-16 bg-gradient-to-l from-transparent ${isDark ? 'to-primary-400' : 'to-amber-400'}`} />
        </div>
      </main>
    </div>
  );
}