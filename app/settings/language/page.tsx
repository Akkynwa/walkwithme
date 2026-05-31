'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { LANGUAGES } from '@/lib/constants';
import Sidebar from '@/app/layout-components/Sidebar';
import { useRouter } from 'next/navigation';

export default function LanguageSettingsPage() {
  const router = useRouter();
  const [language, setLanguage] = useState('en');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const languageOptions = Object.entries(LANGUAGES).map(([key, value]) => ({
    value: key,
    label: value as string,
  }));

  // Fetch initial profile baseline configuration mapping
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
        // Force a native workspace refresh to cleanly hot-reload layout context translations
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
    <div className="flex min-h-screen bg-[#FDFDFF] relative overflow-hidden">
      {/* Background ambient aesthetic */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[15%] right-[10%] w-[350px] h-[350px] rounded-full bg-primary/5 blur-[100px]"></div>
        <div className="absolute bottom-[15%] left-[15%] w-[300px] h-[300px] rounded-full bg-[#D4AF37]/5 blur-[90px]"></div>
      </div>

      <Sidebar />

      <main className="flex-1 lg:ml-64 pt-24 px-6 md:px-10 pb-32 max-w-2xl mx-auto w-full z-10 relative">
        
        {/* Header Block */}
        <header className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1 h-1 rounded-full bg-primary"></span>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Localization</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif text-[#3C3830] tracking-tight">
            Language <span className="italic font-serif text-primary">Interface</span>
          </h1>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 animate-pulse">
              Parsing translations...
            </span>
          </div>
        ) : (
          <Card className="border-gray-100/60 bg-white/70 backdrop-blur-md p-6 rounded-[24px] animate-in fade-in duration-500">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-[#3C3830]">
                  Preferred Dialect
                </label>
                <Select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  options={languageOptions}
                  className="w-full bg-white/50 border-gray-100 rounded-xl text-xs font-medium text-[#3C3830] focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                />
              </div>

              {/* Informative Toast Banner Container */}
              <div className="bg-[#4d6054]/5 border border-[#4d6054]/10 p-4 rounded-xl flex items-start gap-3">
                <span className="material-symbols-outlined text-primary text-lg mt-0.5">
                  info
                </span>
                <p className="text-[11px] text-[#7C7565] leading-relaxed font-medium">
                  Applying changes requires a rapid framework restart. Your open dashboard layouts, journal entry instances, and workspace sessions will instantly synchronize to the updated selection.
                </p>
              </div>

              {/* Actions Section */}
              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-primary hover:bg-primary-dark text-white rounded-full text-[10px] font-black uppercase tracking-widest px-8 py-3 shadow-sm min-w-[140px]"
                >
                  {saving ? 'Syncing...' : 'Apply Changes'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push('/settings')}
                  className="bg-white/80 backdrop-blur-sm border-gray-200 text-[#3C3830] hover:bg-gray-50 rounded-full text-[10px] font-black uppercase tracking-widest px-8 py-3"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}
      </main>
    </div>
  );
}