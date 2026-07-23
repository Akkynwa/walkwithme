'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Sidebar from '@/app/layout-components/Sidebar';
import MainHeader from '@/app/layout-components/Header';
import { useTheme } from './../context/ThemeContext';

export default function ReflectionPage() {
  const { status } = useSession();
  const { isDark } = useTheme();
  const router = useRouter();
  
  const [isSaving, setIsSaving] = useState(false);
  const [selectedMood, setSelectedMood] = useState('Peaceful');
  const [formData, setFormData] = useState({
    standingOut: '',
    application: '',
    intention: ''
  });

  // Today's Date Formatting
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/auth/signin');
  }, [status, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.standingOut.trim()) {
      toast.error("Please record at least one reflection before saving.");
      return;
    }

    try {
      setIsSaving(true);
      
      const combinedContent = `
What stood out:
${formData.standingOut}

Application:
${formData.application}

Prayer/Intention:
${formData.intention}
      `.trim();

      const response = await fetch('/api/journal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `Daily Reflection: ${today}`,
          content: combinedContent,
          mood: selectedMood,
          tags: ['DailyReflection', 'WalkWithMe'],
        }),
      });

      if (response.ok) {
        toast.success('Your reflection has been preserved in your journal.');
        router.push('/journal');
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      toast.error('Could not save reflection. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const moods = [
    { icon: 'nature', label: 'Peaceful' },
    { icon: 'explore', label: 'Seeking' },
    { icon: 'favorite', label: 'Grateful' },
    { icon: 'bedtime', label: 'Tired' },
  ];

  if (status === 'loading') return null;

  return (
    <div className={`flex min-h-screen antialiased selection:bg-orange-100 dark:selection:bg-orange-950/50 ${
      isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'
    }`}>
      <Sidebar />

      {/* Main Framework Content Area */}
      <main className="flex-1 lg:ml-64 pt-24 px-4 md:px-8 pb-24 max-w-7xl mx-auto w-full">
        
        {/* Editorial Substack Header Row */}
        <header className="mb-12 pb-4 border-b border-zinc-100 dark:border-zinc-900">
          <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-500 mb-2">
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            <span className="text-[10px] font-sans font-semibold uppercase tracking-wider">{today}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Daily Reflection
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-serif italic mt-2 border-l-2 border-orange-500 dark:border-orange-500 pl-4">
            Take a moment of stillness to process today's word and align your spirit.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Column: Context Card Panel */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 space-y-6">
            <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-transparent">
              <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-500 mb-4">
                <span className="material-symbols-outlined text-[16px]">self_improvement</span>
                <span className="text-[10px] font-sans font-semibold uppercase tracking-wider">Guided Stillness</span>
              </div>
              <p className="text-base text-zinc-800 dark:text-zinc-200 font-serif italic leading-relaxed mb-6">
                "Be still, and know that I am God."
              </p>
              
              <div className="border-t border-zinc-100 dark:border-zinc-900 pt-4">
                <h4 className="text-[10px] font-sans font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-2">
                  Reflection Tip
                </h4>
                <p className="text-[13px] text-zinc-500 dark:text-zinc-400 font-sans leading-relaxed">
                  Don't rush. Let the thoughts flow naturally. This is your personal space for growth.
                </p>
              </div>

              {/* Centralized Focus Dot Indicator Component */}
              <div className="mt-8 flex flex-col items-center justify-center p-6 border border-zinc-100 dark:border-zinc-900 rounded-xl bg-transparent">
                <div className="w-2 h-2 rounded-full bg-orange-600 dark:bg-orange-500 animate-pulse mb-3" />
                <p className="text-[10px] font-sans font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  Breathe.
                </p>
              </div>
            </div>
          </aside>

          {/* Right Column: Interactive Reflection Form Area */}
          <section className="lg:col-span-8">
            <form onSubmit={handleSave} className="space-y-10">
              
              <ReflectionField 
                label="What stood out to you in today's reading?" 
                placeholder="Pour your initial thoughts here..." 
                value={formData.standingOut}
                onChange={(val) => setFormData({...formData, standingOut: val})}
              />

              <ReflectionField 
                label="How can you apply this to your life today?" 
                placeholder="Think of a specific action or shift in perspective..." 
                value={formData.application}
                onChange={(val) => setFormData({...formData, application: val})}
              />

              <ReflectionField 
                label="A prayer or intention for the hours ahead" 
                placeholder="May my steps be guided..." 
                value={formData.intention}
                onChange={(val) => setFormData({...formData, intention: val})}
                rows={4}
              />

              {/* Heart State Section Grid */}
              <div className="py-6 border-y border-zinc-100 dark:border-zinc-900 flex flex-wrap items-center gap-6">
                <span className="text-[10px] font-sans font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  Your Heart State
                </span>
                <div className="flex gap-3">
                  {moods.map((mood) => {
                    const isSelected = selectedMood === mood.label;
                    return (
                      <button
                        key={mood.label}
                        type="button"
                        onClick={() => setSelectedMood(mood.label)}
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors outline-none ${
                          isSelected 
                            ? 'bg-orange-600 dark:bg-orange-500 text-white shadow-sm' 
                            : 'border border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 hover:border-zinc-300 dark:hover:border-zinc-700 bg-transparent'
                        }`}
                        title={mood.label}
                      >
                        <span className="material-symbols-outlined text-[18px]">{mood.icon}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Controller Panel Area */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-2">
                <button 
                  type="button" 
                  onClick={() => router.back()}
                  className="px-4 py-2 text-[12px] font-sans font-medium text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition-colors bg-transparent outline-none"
                >
                  Discard Draft
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white font-medium text-[12px] px-6 py-2.5 rounded-full transition-colors shadow-sm disabled:opacity-50 outline-none"
                >
                  {isSaving ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[14px]">sync</span>
                      <span>Preserving...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[14px]">self_improvement</span>
                      <span>Seal Reflection</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* System Central Anchor Divider Dot */}
        <div className="mt-24 flex justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </main>
    </div>
  );
}

/**
 * REUSABLE MODULAR ENTRY FIELD FRAMEWORK
 */
function ReflectionField({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  rows = 5 
}: { 
  label: string; 
  placeholder: string; 
  value: string;
  onChange: (val: string) => void;
  rows?: number 
}) {
  return (
    <div className="group flex flex-col">
      <label className="text-base font-serif font-medium text-zinc-800 dark:text-zinc-200 mb-2 transition-colors">
        {label}
      </label>
      <div className="relative">
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent border-0 border-b border-zinc-200 dark:border-zinc-800 text-zinc-800 dark:text-zinc-100 placeholder:text-zinc-300 dark:placeholder:text-zinc-700 focus:ring-0 focus:border-orange-600 dark:focus:border-orange-500 transition-colors text-base font-sans font-normal py-3 resize-none leading-relaxed outline-none"
        />
      </div>
    </div>
  );
}