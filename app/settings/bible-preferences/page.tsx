'use client';

import { useState, useEffect } from 'react';
import { BIBLE_TRANSLATIONS } from '@/lib/constants';
import Sidebar from '@/app/layout-components/Sidebar';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../context/ThemeContext';

export default function BiblePreferencesPage() {
  const router = useRouter();
  const { isDark } = useTheme();
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
    <div className={`flex min-h-screen antialiased selection:bg-orange-100 dark:selection:bg-orange-950/50 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'}`}>
      <Sidebar />

      {/* Main Single-Column Scripture Configurations Feed */}
      <main className="flex-1 lg:ml-64 pt-24 px-4 md:px-8 pb-24 max-w-[720px] mx-auto w-full">
        
        {/* Editorial Substack Header Row */}
        <header className="mb-12 pb-4 border-b border-zinc-100 dark:border-zinc-900">
          <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-500 mb-2">
            <span className="material-symbols-outlined text-[14px]">menu_book</span>
            <span className="text-[10px] font-sans font-semibold uppercase tracking-wider">Scripture Reading</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Bible Preferences
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-sans mt-1.5">
            Customize your text layouts, primary translations, and standard scholarly study configurations.
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-5 h-5 border-2 border-orange-600 dark:border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500 animate-pulse">
              Preparing your study tools...
            </span>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-10 animate-in fade-in duration-500">
            
            {/* Form Selection Field Segment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Dropdown 1: Translation Selection */}
              <div className="space-y-2">
                <label className="text-[11px] font-sans font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
                  Primary Translation
                </label>
                <div className="relative w-full">
                  <select
                    value={preferences.defaultTranslation}
                    onChange={e => setPreferences({ ...preferences, defaultTranslation: e.target.value })}
                    className="w-full bg-transparent border border-zinc-200 dark:border-zinc-800 focus:border-orange-600 dark:focus:border-orange-500 text-sm text-zinc-800 dark:text-zinc-200 rounded-lg px-3 py-2.5 outline-none transition-colors appearance-none font-sans"
                  >
                    {translationOptions.map(opt => (
                      <option key={opt.value} value={opt.value} className="dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-600">
                    <span className="material-symbols-outlined text-[16px]">unfold_more</span>
                  </div>
                </div>
              </div>

              {/* Dropdown 2: Reading Formats */}
              <div className="space-y-2">
                <label className="text-[11px] font-sans font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
                  Viewing Format
                </label>
                <div className="relative w-full">
                  <select
                    value={preferences.readingMode}
                    onChange={e => setPreferences({ ...preferences, readingMode: e.target.value })}
                    className="w-full bg-transparent border border-zinc-200 dark:border-zinc-800 focus:border-orange-600 dark:focus:border-orange-500 text-sm text-zinc-800 dark:text-zinc-200 rounded-lg px-3 py-2.5 outline-none transition-colors appearance-none font-sans"
                  >
                    <option value="verse" className="dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">Verse by Verse</option>
                    <option value="passage" className="dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">Grouped Passages</option>
                    <option value="chapter" className="dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">Full Chapter</option>
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-600">
                    <span className="material-symbols-outlined text-[16px]">unfold_more</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Study Tools Switch List Flow Container */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-1.5 mb-2">
                <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                  Study Tools Toggle
                </span>
              </div>
              
              <div className="border border-zinc-100 dark:border-zinc-900 rounded-xl overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-900">
                {[
                  { key: 'showCrossReferences', label: 'Cross-References', icon: 'link', desc: 'Display parallel historical references inside layout margins.' },
                  { key: 'showCommentary', label: 'Deep Commentary', icon: 'auto_stories', desc: 'Expose standard exegetical commentaries underneath verses.' }
                ].map((tool) => {
                  const value = preferences[tool.key as keyof typeof preferences];
                  return (
                    <div 
                      key={tool.key}
                      onClick={() => setPreferences(prev => ({ ...prev, [tool.key]: !prev[tool.key as keyof typeof preferences] }))}
                      className="flex items-center justify-between p-5 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors cursor-pointer select-none"
                    >
                      <div className="flex items-start gap-4 pr-6">
                        <div className="w-8 h-8 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-transparent flex items-center justify-center text-zinc-400 dark:text-zinc-500 mt-0.5">
                          <span className="material-symbols-outlined text-[16px]">{tool.icon}</span>
                        </div>
                        <div>
                          <h4 className="text-[13px] font-sans font-medium text-zinc-800 dark:text-zinc-200">
                            {tool.label}
                          </h4>
                          <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-sans leading-normal mt-0.5 max-w-lg">
                            {tool.desc}
                          </p>
                        </div>
                      </div>

                      {/* Structural Switch Element Toggle */}
                      <div className="relative shrink-0">
                        <div className={`w-8 h-4 rounded-full transition-colors duration-200 ${
                          value ? 'bg-orange-600 dark:bg-orange-500' : 'bg-zinc-200 dark:bg-zinc-800'
                        }`} />
                        <div className={`absolute top-0.5 left-0.5 bg-white dark:bg-zinc-100 w-3 h-3 rounded-full transition-transform duration-200 transform ${
                          value ? 'translate-x-4' : 'translate-x-0'
                        }`} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Structured Save/Form Action Controls Row */}
            <div className="flex items-center gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-900">
              <button 
                type="submit" 
                disabled={saving}
                className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white font-medium text-[12px] px-4 py-2 rounded-full transition-colors shadow-sm disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[14px]">sync</span>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[14px]">save</span>
                    <span>Apply Preferences</span>
                  </>
                )}
              </button>
              <button 
                type="button" 
                onClick={() => router.push('/settings')}
                className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-full text-[12px] font-sans font-medium text-zinc-600 dark:text-zinc-400 transition-colors bg-transparent"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Elegant Centered System Rule Dot Divider */}
        <div className="mt-24 flex justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </main>
    </div>
  );
}