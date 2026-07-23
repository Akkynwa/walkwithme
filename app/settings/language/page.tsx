'use client';

import { useState, useEffect } from 'react';
import { LANGUAGES } from '@/lib/constants';
import Sidebar from '@/app/layout-components/Sidebar';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../context/ThemeContext';

export default function LanguageSettingsPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const languageOptions = Object.entries(LANGUAGES).map(([key, value]) => ({
    value: key,
    label: value as string,
  }));

  useEffect(() => {
    async function fetchLanguage() {
      try {
        const res = await fetch('/api/settings/language');
        if (res.ok) {
          const data = await res.json();
          if (data?.language) setLanguage(data.language);
        }
      } catch (err) {
        console.error('Failed reading native dialect specifications:', err);
      } finally {
  setLoading(false); // Clean execution, no call signature errors
}
    }
    fetchLanguage();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/settings/language', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        console.error('Server side rejected localization payload.');
      }
    } catch (err) {
      console.error('Failed to dispatch user language preferences:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={`flex min-h-screen antialiased selection:bg-orange-100 dark:selection:bg-orange-950/50 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'}`}>
      <Sidebar />

      {/* Main Single-Column Settings Feed Container */}
      <main className="flex-1 lg:ml-64 pt-24 px-4 md:px-8 pb-24 max-w-[720px] mx-auto w-full">
        
        {/* Editorial Substack Header Row */}
        <header className="mb-12 pb-4 border-b border-zinc-100 dark:border-zinc-900">
          <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-500 mb-2">
            <span className="material-symbols-outlined text-[14px]">language</span>
            <span className="text-[10px] font-sans font-semibold uppercase tracking-wider">Localization Parameters</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Language Interface
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-sans mt-1.5">
            Choose your preferred global system language for the sanctuary layout and interface translations.
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-5 h-5 border-2 border-orange-600 dark:border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500 animate-pulse">
              Parsing translations...
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-500">
            
            {/* Input Selection Block */}
            <div className="space-y-2">
              <label className="text-[11px] font-sans font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
                Preferred Dialect
              </label>
              <div className="relative w-full">
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-transparent border border-zinc-200 dark:border-zinc-800 focus:border-orange-600 dark:focus:border-orange-500 text-sm text-zinc-800 dark:text-zinc-200 rounded-lg px-3 py-2.5 outline-none transition-colors appearance-none font-sans"
                >
                  {languageOptions.map(opt => (
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

            {/* Informative Informational Box */}
            <div className="border border-zinc-100 dark:border-zinc-900/60 bg-zinc-50/50 dark:bg-zinc-900/20 p-4 rounded-lg flex items-start gap-3">
              <span className="material-symbols-outlined text-orange-600 dark:text-orange-500 text-[18px] shrink-0 mt-0.5">
                info
              </span>
              <p className="text-[12px] text-zinc-500 dark:text-zinc-400 leading-relaxed font-sans">
                Applying updates will trigger a fast client session hydration sync. Open dashboard workflows, journaling metrics, and server session states automatically read from this translation configuration.
              </p>
            </div>

            {/* Structured Action Controls Row */}
            <div className="flex items-center gap-3 pt-4 border-t border-zinc-100 dark:border-zinc-900">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white font-medium text-[12px] px-4 py-2 rounded-full transition-colors shadow-sm disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[14px]">sync</span>
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[14px]">check</span>
                    <span>Apply Changes</span>
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