'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { BIBLE_TRANSLATIONS } from '@/lib/constants';
import Sidebar from '@/app/layout-components/Sidebar';
import { useRouter } from 'next/navigation';

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
    <div className="flex min-h-screen bg-[#FDFDFF] relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px]"></div>
      </div>

      <Sidebar />

      <main className="flex-1 lg:ml-64 pt-24 px-6 md:px-10 pb-32 max-w-3xl mx-auto w-full z-10 relative">
        <header className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1 h-1 rounded-full bg-primary"></span>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Scripture Reading</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif text-[#3C3830] tracking-tight">
            Bible <span className="italic font-serif text-primary">Preferences</span>
          </h1>
        </header>

        {loading ? (
          <div className="py-20 text-center animate-pulse text-[10px] font-black uppercase tracking-widest text-gray-400">
            Preparing your study tools...
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-6">
            <Card className="border-gray-100/60 bg-white/70 backdrop-blur-md p-6 rounded-[24px] space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Select
                  label="Primary Translation"
                  value={preferences.defaultTranslation}
                  onChange={e => setPreferences({ ...preferences, defaultTranslation: e.target.value })}
                  options={translationOptions}
                  className="rounded-xl border-gray-100 text-xs"
                />
                <Select
                  label="Viewing Format"
                  value={preferences.readingMode}
                  onChange={e => setPreferences({ ...preferences, readingMode: e.target.value })}
                  options={[
                    { value: 'verse', label: 'Verse by Verse' },
                    { value: 'passage', label: 'Grouped Passages' },
                    { value: 'chapter', label: 'Full Chapter' },
                  ]}
                  className="rounded-xl border-gray-100 text-xs"
                />
              </div>

              <div className="pt-4 border-t border-gray-100/50 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#3C3830] mb-4">Study Tools</p>
                
                {[
                  { key: 'showCrossReferences', label: 'Cross-References', icon: 'link', desc: 'Display related verses in the margins.' },
                  { key: 'showCommentary', label: 'Deep Commentary', icon: 'auto_stories', desc: 'Show historical and spiritual insights.' }
                ].map((tool) => (
                  <div 
                    key={tool.key}
                    onClick={() => setPreferences(prev => ({ ...prev, [tool.key]: !prev[tool.key as keyof typeof preferences] }))}
                    className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50/50 transition-colors cursor-pointer border border-transparent hover:border-gray-100"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-gray-400">
                        <span className="material-symbols-outlined text-lg">{tool.icon}</span>
                      </div>
                      <div>
                        <p className="text-[12px] font-bold text-[#3C3830]">{tool.label}</p>
                        <p className="text-[10px] text-[#7C7565] opacity-70">{tool.desc}</p>
                      </div>
                    </div>
                    <div className={`w-10 h-5 rounded-full transition-colors relative ${preferences[tool.key as keyof typeof preferences] ? 'bg-primary' : 'bg-gray-200'}`}>
                      <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full shadow-sm transition-transform ${preferences[tool.key as keyof typeof preferences] ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="flex items-center gap-3">
              <Button 
                type="submit" 
                disabled={saving}
                className="bg-primary hover:bg-primary-dark text-white rounded-full text-[10px] font-black uppercase tracking-widest px-10 py-3 shadow-lg shadow-primary/10"
              >
                {saving ? 'Saving...' : 'Apply Preferences'}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => router.push('/settings')}
                className="bg-white text-[#3C3830] rounded-full text-[10px] font-black uppercase tracking-widest px-10 py-3 border-gray-200"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}