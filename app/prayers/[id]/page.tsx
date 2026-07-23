'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/app/layout-components/Sidebar';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

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
  const { isDark } = useTheme();

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
      <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
        <div className="flex flex-col items-center gap-3">
          <div className={`w-8 h-8 border-2 ${isDark ? 'border-primary-400/20 border-t-primary-400' : 'border-amber-600/20 border-t-amber-600'} rounded-full animate-spin`}></div>
          <p className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Entering Prayer Altar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
      <Sidebar />

      <main className="relative z-10 flex-1 lg:ml-56 pt-20 px-6 md:px-10 pb-16 max-w-6xl mx-auto w-full">
        <header className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-5 animate-in fade-in duration-500">
          <div className="flex items-center gap-4">
            <Link 
              href="/prayers" 
              className={`p-2.5 backdrop-blur-sm border rounded-xl transition-all duration-200 flex items-center justify-center group ${
                isDark 
                  ? 'bg-black/40 border-white/10 text-gray-400 hover:bg-primary-500/20 hover:text-primary-400 hover:border-primary-500/30' 
                  : 'bg-white/40 border-white/60 text-gray-600 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200'
              }`}
            >
              <span className="material-symbols-outlined text-base transition-transform group-hover:-translate-x-0.5">arrow_back</span>
            </Link>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-primary-400' : 'bg-amber-600'}`}></div>
                <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-primary-400' : 'text-amber-600'}`}>{prayer.category || 'General'}</span>
              </div>
              <h1 className={`text-2xl md:text-3xl font-serif tracking-tight ${isDark ? 'text-text-primary' : 'text-gray-800'}`}>
                Prayer <span className={`font-serif italic ${isDark ? 'text-primary-400' : 'text-amber-600'}`}>Reflection</span>
              </h1>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-5 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all shadow-sm flex items-center gap-2 ${
              isEditing 
                ? 'bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 dark:bg-rose-950/20 dark:text-rose-400 dark:border-rose-800/30' 
                : isDark 
                  ? 'bg-black/40 backdrop-blur-sm text-gray-400 border-white/10 hover:bg-primary-500/20 hover:text-primary-400 hover:border-primary-500/30' 
                  : 'bg-white/40 backdrop-blur-sm text-gray-700 border-white/60 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200'
            }`}
          >
            <span className="material-symbols-outlined text-xs">{isEditing ? 'close' : 'edit'}</span>
            <span>{isEditing ? 'Cancel Edit' : 'Modify Record'}</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <div className={`backdrop-blur-xl border rounded-2xl p-6 md:p-8 shadow-lg transition-all ${
              isDark ? 'bg-black/40 border-white/10' : 'bg-white/40 border-white/60'
            }`}>
              
              {!isEditing ? (
                <div className="space-y-6">
                  {/* Status and Date */}
                  <div className={`flex flex-wrap items-center gap-3 pb-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200/50'}`}>
                    <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider ${
                      prayer.status === 'answered' 
                        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' 
                        : prayer.status === 'archived'
                        ? 'bg-gray-100 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400'
                        : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    }`}>
                      {prayer.status}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className={`material-symbols-outlined text-[12px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>calendar_today</span>
                      <span className={`text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                        {new Date(prayer.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <div>
                    <h2 className={`text-xl md:text-2xl font-serif font-semibold leading-tight tracking-tight ${isDark ? 'text-text-primary' : 'text-gray-800'}`}>
                      {prayer.title}
                    </h2>
                  </div>
                  
                  {/* Description Card */}
                  <div className={`backdrop-blur-sm p-6 rounded-xl border ${isDark ? 'bg-primary-500/10 border-primary-500/20' : 'bg-amber-50/30 border-amber-100'}`}>
                    <div className="flex items-center gap-1.5 mb-3">
                      <span className={`material-symbols-outlined text-[14px] ${isDark ? 'text-primary-400' : 'text-amber-500'}`}>favorite</span>
                      <h3 className={`text-[8px] font-black uppercase tracking-wider ${isDark ? 'text-primary-400' : 'text-amber-600'}`}>Petition Focus</h3>
                    </div>
                    <p className={`text-sm leading-relaxed whitespace-pre-wrap font-serif italic ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                      "{prayer.description}"
                    </p>
                  </div>

                  {/* Answer Section */}
                  {prayer.answer && (
                    <div className={`backdrop-blur-sm border p-6 rounded-xl relative overflow-hidden animate-in fade-in duration-500 ${
                      isDark ? 'bg-emerald-900/10 border-emerald-800/30' : 'bg-emerald-50/30 border-emerald-100'
                    }`}>
                      <div className="absolute top-3 right-3 opacity-10 pointer-events-none">
                        <span className={`material-symbols-outlined text-5xl ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>self_improvement</span>
                      </div>
                      <div className="flex items-center gap-1.5 mb-3">
                        <span className={`material-symbols-outlined text-[14px] ${isDark ? 'text-emerald-400' : 'text-emerald-500'}`}>celebration</span>
                        <h3 className={`text-[8px] font-black uppercase tracking-wider ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>Answered Manifestation</h3>
                      </div>
                      <p className={`text-sm leading-relaxed whitespace-pre-wrap ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                        {prayer.answer}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-5 animate-in fade-in duration-300">
                  {/* Title Input */}
                  <div className="space-y-1.5">
                    <label className={`flex items-center gap-1.5 text-[8px] font-black uppercase tracking-wider ${isDark ? 'text-primary-400' : 'text-amber-600'}`}>
                      <span className="material-symbols-outlined text-[12px]">title</span>
                      Entry Title
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all ${
                        isDark 
                          ? 'bg-black/30 border-white/10 text-text-primary' 
                          : 'bg-white/50 border-gray-200 text-gray-800'
                      }`}
                    />
                  </div>

                  {/* Description Textarea */}
                  <div className="space-y-1.5">
                    <label className={`flex items-center gap-1.5 text-[8px] font-black uppercase tracking-wider ${isDark ? 'text-primary-400' : 'text-amber-600'}`}>
                      <span className="material-symbols-outlined text-[12px]">edit_note</span>
                      Petition Focus
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={6}
                      className={`w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all resize-none font-serif italic ${
                        isDark 
                          ? 'bg-black/30 border-white/10 text-text-primary' 
                          : 'bg-white/50 border-gray-200 text-gray-700'
                      }`}
                    />
                  </div>

                  {/* Status Select */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className={`flex items-center gap-1.5 text-[8px] font-black uppercase tracking-wider ${isDark ? 'text-primary-400' : 'text-amber-600'}`}>
                        <span className="material-symbols-outlined text-[12px]">flag</span>
                        Status
                      </label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className={`w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-all ${
                          isDark 
                            ? 'bg-black/30 border-white/10 text-text-primary' 
                            : 'bg-white/50 border-gray-200 text-gray-800'
                        }`}
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
                      <label className={`flex items-center gap-1.5 text-[8px] font-black uppercase tracking-wider ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>
                        <span className="material-symbols-outlined text-[12px]">celebration</span>
                        Manifestation Log
                      </label>
                      <textarea
                        value={formData.answer}
                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                        placeholder="Detail how this prayer was answered..."
                        rows={4}
                        className={`w-full border rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all resize-none ${
                          isDark 
                            ? 'bg-emerald-900/10 border-emerald-800/30 text-text-primary' 
                            : 'bg-emerald-50/30 border-emerald-200 text-gray-700'
                        }`}
                      />
                    </div>
                  )}

                  {/* Save Button */}
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3.5 rounded-xl text-[9px] font-black uppercase tracking-wider shadow-md hover:shadow-lg hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
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
            <div className={`backdrop-blur-sm border rounded-xl p-5 shadow-sm ${isDark ? 'bg-black/40 border-white/10' : 'bg-white/40 border-white/60'}`}>
              <div className="flex items-center gap-1.5 mb-4">
                <span className={`material-symbols-outlined text-[14px] ${isDark ? 'text-primary-400' : 'text-amber-500'}`}>schedule</span>
                <h3 className={`text-[8px] font-black uppercase tracking-wider ${isDark ? 'text-primary-400' : 'text-amber-600'}`}>Audit Timeline</h3>
              </div>
              <div className="space-y-4">
                <TimelineItem icon="calendar_today" label="Created" date={prayer.createdAt} isDark={isDark} />
                <TimelineItem icon="history" label="Last Updated" date={prayer.updatedAt} isDark={isDark} />
              </div>
            </div>

            {/* Inspiration Card */}
            <div className={`backdrop-blur-sm border rounded-xl p-5 text-center relative overflow-hidden group ${
              isDark ? 'bg-primary-500/10 border-primary-500/20' : 'bg-amber-50/30 border-amber-100'
            }`}>
              <div className="absolute top-2 right-2 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className={`material-symbols-outlined text-4xl ${isDark ? 'text-primary-400' : 'text-amber-600'}`}>spa</span>
              </div>
              <span className={`material-symbols-outlined text-2xl mb-2 block ${isDark ? 'text-primary-400' : 'text-amber-500'}`}>spa</span>
              <p className={`text-[8px] font-black uppercase tracking-wider ${isDark ? 'text-primary-400' : 'text-amber-600'}`}>Sacred Silence</p>
              <p className={`text-[10px] mt-1 italic font-serif leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                Allow your petitions to settle into divine order.
              </p>
            </div>

            {/* Scripture Verse */}
            <div className={`backdrop-blur-sm border rounded-xl p-4 text-center ${isDark ? 'bg-black/30 border-white/10' : 'bg-white/30 border-white/40'}`}>
              <p className={`text-[9px] font-serif italic leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God."
              </p>
              <p className={`text-[7px] font-black uppercase tracking-wider mt-2 ${isDark ? 'text-primary-400' : 'text-amber-600'}`}>— Philippians 4:6</p>
            </div>
          </aside>
        </div>

        {/* Decorative Footer */}
        <div className="mt-12 flex justify-center items-center gap-4 opacity-30">
          <div className={`h-px w-16 bg-gradient-to-r from-transparent ${isDark ? 'to-primary-400' : 'to-amber-400'}`} />
          <span className={`material-symbols-outlined text-sm ${isDark ? 'text-primary-400' : 'text-amber-400'}`}>menu_book</span>
          <div className={`h-px w-16 bg-gradient-to-l from-transparent ${isDark ? 'to-primary-400' : 'to-amber-400'}`} />
        </div>
      </main>
    </div>
  );
}

function TimelineItem({ icon, label, date, isDark }: { icon: string; label: string; date: string; isDark: boolean }) {
  return (
    <div className="flex gap-3 items-start">
      <div className={`p-1.5 rounded-lg flex items-center justify-center ${
        isDark ? 'bg-primary-500/20 text-primary-400' : 'bg-amber-50 text-amber-500'
      }`}>
        <span className="material-symbols-outlined text-[14px]">{icon}</span>
      </div>
      <div className="space-y-0.5">
        <p className={`text-[8px] font-black uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>{label}</p>
        <p className={`text-[10px] font-medium ${isDark ? 'text-text-primary' : 'text-gray-700'}`}>
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