'use client';

import { useState, useEffect } from 'react';
import { BIBLE_TRANSLATIONS } from '@/lib/constants';
import Sidebar from '@/app/layout-components/Sidebar';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function BiblePreferencesPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [preferences, setPreferences] = useState({
    defaultTranslation: 'KJV',
    readingMode: 'verse',
    showCrossReferences: true,
    showCommentary: true,
  });

  const translationOptions = Object.entries(BIBLE_TRANSLATIONS).map(([key, value]) => ({
    value: key,
    label: value as string,
  }));

  useEffect(() => {
    async function fetchPrefs() {
      try {
        const res = await fetch('/api/settings/bible');
        if (res.ok) {
          const data = await res.json();
          if (data) setPreferences({
            defaultTranslation: data.bibleTranslation || 'KJV',
            readingMode: data.readingMode || 'verse',
            showCrossReferences: data.showCrossReferences ?? true,
            showCommentary: data.showCommentary ?? true,
          });
        }
      } catch (err) {
        console.error('Error fetching bible preferences:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchPrefs();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/settings/bible', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      });
      if (res.ok) router.push('/settings');
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setSaving(false);
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
        <header className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-px bg-amber-400/40" />
            <span className="text-[8px] font-black uppercase tracking-wider text-amber-600">Scripture Reading</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif text-gray-800 tracking-tight">
            Bible <span className="italic font-serif text-amber-600">Preferences</span>
          </h1>
          <p className="text-sm text-gray-500 italic border-l-2 border-amber-400 pl-4 mt-2">
            Customize your scripture reading experience.
          </p>
        </header>

        {loading ? (
          <div className="py-20 text-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-[8px] font-black uppercase tracking-wider text-gray-500">Preparing your study tools...</p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5">
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-xl p-6 space-y-5 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-amber-500 text-[14px]">translate</span>
                    <label className="text-[7px] font-black text-amber-600 uppercase tracking-wider">Primary Translation</label>
                  </div>
                  <select
                    value={preferences.defaultTranslation}
                    onChange={e => setPreferences({ ...preferences, defaultTranslation: e.target.value })}
                    className="w-full bg-white/50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                  >
                    {translationOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-amber-500 text-[14px]">view_agenda</span>
                    <label className="text-[7px] font-black text-amber-600 uppercase tracking-wider">Viewing Format</label>
                  </div>
                  <select
                    value={preferences.readingMode}
                    onChange={e => setPreferences({ ...preferences, readingMode: e.target.value })}
                    className="w-full bg-white/50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                  >
                    <option value="verse">Verse by Verse</option>
                    <option value="passage">Grouped Passages</option>
                    <option value="chapter">Full Chapter</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200/50 space-y-2">
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="material-symbols-outlined text-amber-500 text-[14px]">menu_book</span>
                  <p className="text-[7px] font-black text-amber-600 uppercase tracking-wider">Study Tools</p>
                </div>
                
                {[
                  { key: 'showCrossReferences', label: 'Cross-References', icon: 'link', desc: 'Display related verses in the margins.' },
                  { key: 'showCommentary', label: 'Deep Commentary', icon: 'auto_stories', desc: 'Show historical and spiritual insights.' }
                ].map((tool) => (
                  <div 
                    key={tool.key}
                    onClick={() => setPreferences(prev => ({ ...prev, [tool.key]: !prev[tool.key as keyof typeof preferences] }))}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-white/50 transition-colors cursor-pointer border border-transparent hover:border-amber-200"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500">
                        <span className="material-symbols-outlined text-[16px]">{tool.icon}</span>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-700">{tool.label}</p>
                        <p className="text-[8px] text-gray-500">{tool.desc}</p>
                      </div>
                    </div>
                    <div className={`w-8 h-4 rounded-full transition-colors relative ${preferences[tool.key as keyof typeof preferences] ? 'bg-amber-600' : 'bg-gray-300'}`}>
                      <div className={`absolute top-0.5 left-0.5 bg-white w-3 h-3 rounded-full shadow-sm transition-transform ${preferences[tool.key as keyof typeof preferences] ? 'translate-x-4' : 'translate-x-0'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button 
                type="submit" 
                disabled={saving}
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.02] text-white rounded-lg text-[8px] font-black uppercase tracking-wider px-8 py-2.5 transition-all disabled:opacity-50"
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined animate-spin text-[12px]">sync</span>
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[12px]">save</span>
                    Apply Preferences
                  </span>
                )}
              </button>
              <button 
                type="button" 
                onClick={() => router.push('/settings')}
                className="bg-white/50 backdrop-blur-sm border border-gray-200 text-gray-600 rounded-lg text-[8px] font-black uppercase tracking-wider px-6 py-2.5 hover:bg-white/80 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Decorative Footer */}
        <div className="mt-10 flex justify-center items-center gap-4 opacity-30">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400" />
          <span className="material-symbols-outlined text-amber-400 text-sm">menu_book</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400" />
        </div>
      </main>
    </div>
  );
}