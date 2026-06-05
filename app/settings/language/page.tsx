'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { LANGUAGES } from '@/lib/constants';
import Sidebar from '@/app/layout-components/Sidebar';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LanguageSettingsPage() {
  const router = useRouter();
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
        setLoading(false);
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

      <main className="relative z-10 flex-1 lg:ml-56 pt-20 px-6 md:px-10 pb-16 max-w-2xl mx-auto w-full">
        
        {/* Header Block */}
        <header className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-px bg-amber-400/40" />
            <span className="text-[8px] font-black uppercase tracking-wider text-amber-600">Localization</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif text-gray-800 tracking-tight">
            Language <span className="italic font-serif text-amber-600">Interface</span>
          </h1>
          <p className="text-sm text-gray-500 italic border-l-2 border-amber-400 pl-4 mt-2">
            Choose your preferred language for the sanctuary.
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[8px] font-black uppercase tracking-wider text-gray-500 animate-pulse">
              Parsing translations...
            </span>
          </div>
        ) : (
          <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-xl p-6 shadow-lg animate-in fade-in duration-500">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-amber-500 text-[14px]">language</span>
                  <label className="text-[7px] font-black text-amber-600 uppercase tracking-wider">
                    Preferred Dialect
                  </label>
                </div>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full bg-white/50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-700 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none transition-all"
                >
                  {languageOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Informative Toast Banner Container */}
              <div className="bg-amber-50/30 border border-amber-200/50 p-4 rounded-lg flex items-start gap-3">
                <span className="material-symbols-outlined text-amber-500 text-[18px] mt-0.5">
                  info
                </span>
                <p className="text-[9px] text-gray-600 leading-relaxed font-medium">
                  Applying changes requires a rapid framework restart. Your open dashboard layouts, journal entry instances, and workspace sessions will instantly synchronize to the updated selection.
                </p>
              </div>

              {/* Actions Section */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-amber-600 to-amber-700 hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.02] text-white rounded-lg text-[8px] font-black uppercase tracking-wider px-6 py-2.5 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[12px]">sync</span>
                      Syncing...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[12px]">check</span>
                      Apply Changes
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/settings')}
                  className="bg-white/50 backdrop-blur-sm border border-gray-200 text-gray-600 rounded-lg text-[8px] font-black uppercase tracking-wider px-5 py-2.5 hover:bg-white/80 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Decorative Footer */}
        <div className="mt-10 flex justify-center items-center gap-4 opacity-30">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400" />
          <span className="material-symbols-outlined text-amber-400 text-sm">language</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400" />
        </div>
      </main>
    </div>
  );
}