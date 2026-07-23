'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Sidebar from '@/app/layout-components/Sidebar';
import MainHeader from '@/app/layout-components/Header';
import { useTheme } from '../../context/ThemeContext';

export default function ReflectionPage() {
  const { status } = useSession();
  const router = useRouter();
  const { isDark } = useTheme();
  
  const [isSaving, setIsSaving] = useState(false);
  const [selectedMood, setSelectedMood] = useState('Peaceful');
  const [formData, setFormData] = useState({
    standingOut: '',
    application: '',
    intention: ''
  });

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
    { icon: 'spa', label: 'Peaceful' },
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

      <div className="flex-1 lg:ml-64 relative">
        <MainHeader />

        {/* Main Column Framework Content Area */}
        <main className="pt-24 px-4 md:px-8 pb-24 max-w-5xl mx-auto w-full">
          
          {/* Editorial Substack Header Row */}
          <header className="mb-12 pb-4 border-b border-zinc-100 dark:border-zinc-900">
            <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-500 mb-2">
              <span className="material-symbols-outlined text-[14px]">calendar_today</span>
              <span className="text-[10px] font-sans font-semibold uppercase tracking-wider">{today}</span>
              <span className="text-zinc-300 dark:text-zinc-700">|</span>
              <span className="text-[10px] font-sans font-semibold uppercase tracking-wider">Daily Practice</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Daily Reflection
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 font-sans mt-2 max-w-xl leading-relaxed">
              Take a moment of complete stillness to process today's session, examine structural insights, and align your mindset.
            </p>
          </header>

          {/* Two-Column Asymmetrical Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Column: Context Sidebar Panel */}
            <aside className="lg:col-span-4 space-y-4 lg:sticky lg:top-24 h-fit">
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 bg-transparent">
                <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-500 mb-4">
                  <span className="material-symbols-outlined text-[16px]">self_improvement</span>
                  <span className="text-[10px] font-sans font-semibold uppercase tracking-wider">Guided Alignment</span>
                </div>
                <p className="text-sm font-serif italic text-zinc-700 dark:text-zinc-300 leading-relaxed mb-6">
                  "Be still, and know that I am God."
                </p>
                
                <div className="border-t border-zinc-100 dark:border-zinc-900 pt-4">
                  <div className="flex items-center gap-1.5 mb-1.5 text-zinc-400 dark:text-zinc-500">
                    <span className="material-symbols-outlined text-[14px]">tips_and_updates</span>
                    <h4 className="text-[10px] font-sans font-semibold uppercase tracking-wider">System Prompt</h4>
                  </div>
                  <p className="text-[12px] font-sans text-zinc-500 dark:text-zinc-400 leading-relaxed">
                    Avoid rush parameters. Allow insights to stream naturally into documentation fields. This is your personal sandbox.
                  </p>
                </div>

                {/* Minimalist Visual Pacer Component */}
                <div className="mt-6 p-4 border border-zinc-100 dark:border-zinc-900 rounded-xl flex items-center gap-3 bg-transparent group">
                  <div className="relative flex items-center justify-center">
                    <div className="w-2.5 h-2.5 bg-orange-600 dark:bg-orange-500 rounded-full animate-ping absolute" />
                    <div className="w-2.5 h-2.5 bg-orange-600 dark:bg-orange-500 rounded-full relative z-10" />
                  </div>
                  <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    Paced Cycle Active
                  </span>
                </div>
              </div>

              {/* Auxiliary Context Block */}
              <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 text-center bg-transparent">
                <p className="text-[12px] font-serif italic text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  "Let the words of my mouth and the meditation of my heart be acceptable in your sight."
                </p>
                <p className="text-[10px] font-sans font-semibold uppercase text-orange-600 dark:text-orange-500 mt-2 tracking-wider">
                  — Psalm 19:14
                </p>
              </div>
            </aside>

            {/* Right Column: Main Native Form Area */}
            <section className="lg:col-span-8">
              <form onSubmit={handleSave} className="space-y-8">
                
                <ReflectionField 
                  label="What stood out to you in today's reading?" 
                  placeholder="Record initial core themes and structural highpoints..." 
                  value={formData.standingOut}
                  onChange={(val) => setFormData({...formData, standingOut: val})}
                />

                <ReflectionField 
                  label="How can you apply this to your track today?" 
                  placeholder="Isolate specific micro-actions or adjustments to workflow execution..." 
                  value={formData.application}
                  onChange={(val) => setFormData({...formData, application: val})}
                />

                <ReflectionField 
                  label="A statement of intent for the hours ahead" 
                  placeholder="Define focal parameters or grounding objectives..." 
                  value={formData.intention}
                  onChange={(val) => setFormData({...formData, intention: val})}
                  rows={4}
                />

                {/* Micro State Selector Panel */}
                <div className="py-6 border-y border-zinc-200 dark:border-zinc-800 flex flex-wrap items-center gap-6">
                  <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-500">
                    <span className="material-symbols-outlined text-[14px]">favorite</span>
                    <span className="text-[10px] font-sans font-semibold uppercase tracking-wider">System State</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {moods.map((mood) => (
                      <button
                        key={mood.label}
                        type="button"
                        onClick={() => setSelectedMood(mood.label)}
                        className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors outline-none ${
                          selectedMood === mood.label 
                            ? 'bg-orange-600 dark:bg-orange-500 border-orange-600 dark:border-orange-500 text-white' 
                            : 'bg-transparent border-zinc-200 dark:border-zinc-800 text-zinc-400 dark:text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 hover:border-zinc-300 dark:hover:border-zinc-700'
                        }`}
                        title={mood.label}
                      >
                        <span className="material-symbols-outlined text-[16px]">{mood.icon}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Form Navigation Actions Layout */}
                <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => router.back()}
                    className="w-full sm:w-auto text-center px-4 py-2.5 text-[11px] font-sans font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider hover:text-red-600 dark:hover:text-red-400 transition-colors bg-transparent border border-transparent outline-none"
                  >
                    Discard Draft
                  </button>
                  <button 
                    type="submit" 
                    disabled={isSaving}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-medium text-[12px] px-6 py-2.5 rounded-full transition-colors shadow-sm whitespace-nowrap outline-none disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <span className="material-symbols-outlined animate-spin text-[14px]">sync</span>
                        <span>Syncing Metrics...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>
                        <span>Seal Entry</span>
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
    </div>
  );
}

/**
 * COMPONENT COMPOSITION HELPERS
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
    <div className="flex flex-col gap-2 group">
      <label className="text-sm font-serif font-medium text-zinc-800 dark:text-zinc-200 group-focus-within:text-orange-600 dark:group-focus-within:text-orange-500 transition-colors duration-200">
        {label}
      </label>
      <div className="relative border border-zinc-200 dark:border-zinc-800 rounded-xl focus-within:border-zinc-300 dark:focus-within:border-zinc-700 transition-colors duration-200 overflow-hidden">
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent border-0 focus:ring-0 text-sm font-sans text-zinc-800 dark:text-zinc-200 placeholder:text-zinc-300 dark:placeholder:text-zinc-700 p-4 resize-none leading-relaxed outline-none"
        />
      </div>
    </div>
  );
}