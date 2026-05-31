'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/app/layout-components/Sidebar';
import { toast } from 'react-hot-toast';

export default function CreatePrayerPage() {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  
  // UPDATED: Removed 'description' and 'request' from state to avoid confusion.
  // We use 'prayerContent' to collect the body of the prayer.
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.prayerContent.trim()) {
      toast.error('Please provide a title and your prayer request.');
      return;
    }

    try {
      setLoading(true);
      
      // PREPARING PAYLOAD: We map 'prayerContent' to the 'request' key 
      // because your API route expects 'request' in the body.
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
    <div className="flex min-h-screen bg-[#FDFDFF] relative overflow-hidden">
      {/* Ambient backgrounds */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[15%] right-[15%] w-[380px] h-[380px] rounded-full bg-primary/5 blur-[100px]"></div>
        <div className="absolute bottom-[10%] left-[20%] w-[320px] h-[320px] rounded-full bg-[#D4AF37]/5 blur-[90px]"></div>
      </div>

      <Sidebar />

      <main className="flex-1 lg:ml-64 pt-24 px-6 md:px-10 pb-32 max-w-4xl mx-auto w-full z-10 relative">
        
        {/* Navigation & Header */}
        <header className="mb-10 animate-in fade-in duration-700">
          <Link
            href="/prayers"
            className="inline-flex items-center gap-2 text-primary hover:text-[#D4AF37] transition-all mb-6 text-[11px] font-black uppercase tracking-widest group"
          >
            <span className="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-1">arrow_back</span>
            <span>Back to Journal</span>
          </Link>
          
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Altar Room</span>
            </div>
            <h1 className="text-3xl font-serif text-[#3C3830] tracking-tight">New <span className="font-serif italic text-primary">Petition</span></h1>
            <p className="text-sm text-[#7C7565] font-serif italic mt-1">Pour out what weighs heavy or brings hope onto your journal records today.</p>
          </div>
        </header>

        {/* Form Container */}
        <div className="bg-white border border-gray-100 rounded-[32px] p-6 md:p-10 shadow-sm relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Title */}
            <div className="space-y-2">
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Prayer Reference Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Clarity regarding business paths..."
                className="w-full px-5 py-4 bg-[#FDFDFF]/50 border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-primary focus:border-primary/40 outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            {/* Category */}
            <div className="space-y-3">
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Context Classification
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat })}
                    className={`px-4 py-2 rounded-full text-[11px] font-bold tracking-wide border transition-all ${
                      formData.category === cat
                        ? 'bg-primary/5 text-primary border-primary/20'
                        : 'bg-transparent text-[#7C7565] border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Prayer Content */}
            <div className="space-y-2">
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Deep Expression
              </label>
              <textarea
                value={formData.prayerContent}
                onChange={(e) => setFormData({ ...formData, prayerContent: e.target.value })}
                placeholder="Pour out your heart unfiltered here..."
                rows={7}
                className="w-full px-5 py-4 bg-[#FDFDFF]/50 border border-gray-100 rounded-xl text-sm focus:ring-1 focus:ring-primary focus:border-primary/40 outline-none transition-all placeholder:text-gray-300 resize-none leading-relaxed"
              />
            </div>

            {/* Stillness Note */}
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-5 flex gap-4 items-start">
              <span className="material-symbols-outlined text-primary text-xl mt-0.5">spa</span>
              <p className="text-[11px] text-[#7C7565] leading-relaxed">
                Take an intentional deep breath before submitting this card. Remember that He is familiar with even the unspoken movements of your soul.
              </p>
            </div>

            {/* Actions Panel */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-50">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary text-white px-6 py-4 rounded-full text-[11px] font-black uppercase tracking-widest shadow-sm hover:scale-[1.01] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <div className="w-3.5 h-3.5 border-2 border-white/30 border-b-white rounded-full animate-spin"></div>}
                <span>{loading ? 'Submitting Petition...' : 'Commit Request'}</span>
              </button>
              
              <Link
                href="/prayers"
                className="flex-1 px-6 py-4 rounded-full text-[11px] font-black uppercase tracking-widest text-[#3C3830] border border-gray-100 hover:bg-gray-50/50 transition-all text-center flex items-center justify-center"
              >
                Cancel Draft
              </Link>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}