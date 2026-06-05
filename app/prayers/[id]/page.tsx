'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/app/layout-components/Sidebar';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface Prayer {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'answered' | 'archived';
  answered: boolean;
  answer?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export default function PrayerDetailPage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const prayerId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [prayer, setPrayer] = useState<Prayer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending' as 'pending' | 'answered' | 'archived',
    answer: '',
  });

  const fetchPrayer = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/prayers/${prayerId}`);
      const data = await response.json();

      if (response.ok) {
        const prayerData = data.prayer || data; 
        
        setPrayer(prayerData);
        setFormData({
          title: prayerData.title || '',
          description: prayerData.description || '',
          status: prayerData.status || 'pending',
          answer: prayerData.answer || '',
        });
      } else {
        toast.error(data.error || 'Record not found');
        router.push('/prayers');
      }
    } catch (error) {
      toast.error('Failed to load prayer record');
    } finally {
      setLoading(false);
    }
  }, [prayerId, router]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchPrayer();
    }
  }, [status, router, prayerId, fetchPrayer]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch(`/api/prayers/${prayerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          answered: formData.status === 'answered'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedPrayer = data.prayer || data;
        setPrayer(updatedPrayer);
        setIsEditing(false);
        toast.success('Your prayer record has been updated.');
      } else {
        toast.error(data.error || 'Failed to update');
      }
    } catch (error) {
      toast.error('An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !prayer) {
    return (
      <div className="relative flex items-center justify-center min-h-screen">
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
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-600/20 border-t-amber-600 rounded-full animate-spin"></div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Entering Prayer Altar...</p>
        </div>
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
        <div className="absolute top-20 right-20 w-96 h-96 bg-amber-200/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-amber-300/8 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '-3s' }} />
      </div>

      <Sidebar />

      <main className="relative z-10 flex-1 lg:ml-56 pt-20 px-6 md:px-10 pb-16 max-w-6xl mx-auto w-full">
        <header className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5 animate-in fade-in duration-500">
          <div className="flex items-center gap-4">
            <Link 
              href="/prayers" 
              className="p-2.5 bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl text-gray-600 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200 transition-all duration-200 flex items-center justify-center group"
            >
              <span className="material-symbols-outlined text-base transition-transform group-hover:-translate-x-0.5">arrow_back</span>
            </Link>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-600"></div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-600">{prayer.category || 'General'}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-serif text-gray-800 tracking-tight">
                Prayer <span className="font-serif italic text-amber-600">Reflection</span>
              </h1>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 ${
              isEditing 
                ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100' 
                : 'bg-white/40 backdrop-blur-sm text-gray-700 border border-white/60 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200'
            }`}
          >
            <span className="material-symbols-outlined text-xs">{isEditing ? 'close' : 'edit'}</span>
            <span>{isEditing ? 'Cancel Edit' : 'Modify Record'}</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl p-6 md:p-8 shadow-lg transition-all">
              
              {!isEditing ? (
                <div className="space-y-6">
                  {/* Status and Date */}
                  <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-gray-200/50">
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                      prayer.status === 'answered' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : prayer.status === 'archived'
                        ? 'bg-gray-100 text-gray-600'
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {prayer.status}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-gray-400 text-[12px]">calendar_today</span>
                      <span className="text-[10px] text-gray-500">
                        {new Date(prayer.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <h2 className="text-xl md:text-2xl font-serif text-gray-800 font-semibold leading-tight tracking-tight">
                      {prayer.title}
                    </h2>
                  </div>
                  
                  {/* Description Card */}
                  <div className="bg-amber-50/30 backdrop-blur-sm p-6 rounded-xl border border-amber-100">
                    <div className="flex items-center gap-1.5 mb-3">
                      <span className="material-symbols-outlined text-amber-500 text-[14px]">favorite</span>
                      <h3 className="text-[8px] font-black text-amber-600 uppercase tracking-wider">Petition Focus</h3>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-serif italic">
                      "{prayer.description}"
                    </p>
                  </div>

                  {/* Answer Section */}
                  {prayer.answer && (
                    <div className="bg-emerald-50/30 backdrop-blur-sm border border-emerald-100 p-6 rounded-xl relative overflow-hidden animate-in fade-in duration-500">
                      <div className="absolute top-3 right-3 opacity-10 pointer-events-none">
                        <span className="material-symbols-outlined text-5xl text-emerald-600">self_improvement</span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-3">
                        <span className="material-symbols-outlined text-emerald-500 text-[14px]">celebration</span>
                        <h3 className="text-[8px] font-black text-emerald-600 uppercase tracking-wider">Answered Manifestation</h3>
                      </div>
                      <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                        {prayer.answer}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-5 animate-in fade-in duration-300">
                  {/* Title Input */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-[8px] font-black text-amber-600 uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[12px]">title</span>
                      Entry Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                    />
                  </div>

                  {/* Description Textarea */}
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-[8px] font-black text-amber-600 uppercase tracking-wider">
                      <span className="material-symbols-outlined text-[12px]">edit_note</span>
                      Petition Focus
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={6}
                      className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all resize-none font-serif italic"
                    />
                  </div>

                  {/* Status Select */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="flex items-center gap-1.5 text-[8px] font-black text-amber-600 uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[12px]">flag</span>
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full bg-white/50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                      >
                        <option value="pending">Pending</option>
                        <option value="answered">Answered</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  {/* Answer Field (conditional) */}
                  {formData.status === 'answered' && (
                    <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="flex items-center gap-1.5 text-[8px] font-black text-emerald-600 uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[12px]">celebration</span>
                        Manifestation Log
                      </label>
                      <textarea
                        value={formData.answer}
                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                        placeholder="Detail how this prayer was answered..."
                        rows={4}
                        className="w-full bg-emerald-50/30 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all resize-none"
                      />
                    </div>
                  )}

                  {/* Save Button */}
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3.5 rounded-xl text-[9px] font-black uppercase tracking-wider shadow-md hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {saving && <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>}
                    <span>{saving ? 'Syncing...' : 'Commit Changes'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-5">
            {/* Timeline Card */}
            <div className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-1.5 mb-4">
                <span className="material-symbols-outlined text-amber-500 text-[14px]">schedule</span>
                <h3 className="text-[8px] font-black text-amber-600 uppercase tracking-wider">Audit Timeline</h3>
              </div>
              <div className="space-y-4">
                <TimelineItem icon="calendar_today" label="Created" date={prayer.createdAt} />
                <TimelineItem icon="history" label="Last Updated" date={prayer.updatedAt} />
              </div>
            </div>

            {/* Inspiration Card */}
            <div className="bg-amber-50/30 backdrop-blur-sm border border-amber-100 rounded-xl p-5 text-center relative overflow-hidden group">
              <div className="absolute top-2 right-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-4xl text-amber-600">spa</span>
              </div>
              <span className="material-symbols-outlined text-amber-500 text-2xl mb-2 block">spa</span>
              <p className="text-[8px] font-black text-amber-600 uppercase tracking-wider">Sacred Silence</p>
              <p className="text-[10px] text-gray-600 mt-1 italic font-serif leading-relaxed">
                Allow your petitions to settle into divine order.
              </p>
            </div>

            {/* Scripture Verse */}
            <div className="bg-white/30 backdrop-blur-sm border border-white/40 rounded-xl p-4 text-center">
              <p className="text-[9px] font-serif italic text-gray-600 leading-relaxed">
                "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God."
              </p>
              <p className="text-[7px] font-black text-amber-600 uppercase tracking-wider mt-2">— Philippians 4:6</p>
            </div>
          </aside>
        </div>

        {/* Decorative Footer */}
        <div className="mt-12 flex justify-center items-center gap-4 opacity-30">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400" />
          <span className="material-symbols-outlined text-amber-400 text-sm">menu_book</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400" />
        </div>
      </main>
    </div>
  );
}

function TimelineItem({ icon, label, date }: { icon: string; label: string; date: string }) {
  return (
    <div className="flex gap-3 items-start">
      <div className="p-1.5 bg-amber-50 rounded-lg text-amber-500 flex items-center justify-center">
        <span className="material-symbols-outlined text-[14px]">{icon}</span>
      </div>
      <div className="space-y-0.5">
        <p className="text-[8px] font-black text-gray-500 uppercase tracking-wider">{label}</p>
        <p className="text-[10px] text-gray-700 font-medium">
          {new Date(date).toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })}
        </p>
      </div>
    </div>
  );
}