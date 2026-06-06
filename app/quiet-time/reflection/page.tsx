'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Sidebar from '@/app/layout-components/Sidebar';
import MainHeader from '@/app/layout-components/Header';
import Image from 'next/image';

export default function ReflectionPage() {
  const { status } = useSession();
  const router = useRouter();
  
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
      <MainHeader />

      <main className="relative z-10 lg:ml-56 p-6 md:p-10 pt-20 max-w-6xl mx-auto w-full animate-in fade-in duration-700">
        
        {/* Header */}
        <header className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-700 font-sans text-[8px] font-black mb-4 uppercase tracking-wider">
            <span className="material-symbols-outlined text-[12px]">calendar_today</span>
            <span>{today}</span>
          </div>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-px bg-amber-400/40" />
            <span className="text-[9px] font-black text-amber-600 uppercase tracking-[0.2em]">Daily Practice</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-gray-800 mb-2">Daily Reflection</h2>
          <p className="text-sm text-gray-600 italic border-l-2 border-amber-400 pl-4 max-w-xl">
            Take a moment of stillness to process today's word and align your spirit.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Context Area */}
          <aside className="lg:col-span-4 lg:sticky lg:top-24 h-fit space-y-5">
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-5 text-amber-600">
                <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                <span className="font-sans text-[8px] font-black uppercase tracking-wider">Guided Stillness</span>
              </div>
              <p className="text-base text-gray-700 leading-relaxed italic mb-5">
                "Be still, and know that I am God."
              </p>
              
              <div className="border-t border-gray-200/50 pt-5">
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="material-symbols-outlined text-amber-500 text-[12px]">tips_and_updates</span>
                  <h4 className="font-sans text-[7px] font-black text-gray-500 uppercase tracking-wider">Reflection Tip</h4>
                </div>
                <p className="text-[10px] text-gray-600 leading-relaxed">
                  Don't rush. Let the thoughts flow naturally. This is your personal space for growth.
                </p>
              </div>

              {/* Ambient Breathe Component */}
              <div className="mt-8 flex flex-col items-center justify-center p-6 bg-amber-50/30 rounded-xl group">
                <div className="relative">
                  <div className="w-10 h-10 bg-amber-500 rounded-full opacity-20 animate-ping absolute"></div>
                  <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full shadow-lg shadow-amber-500/20 mb-3 relative z-10 transition-transform duration-1000 scale-110 group-hover:scale-125"></div>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-amber-500 text-[12px]">air</span>
                  <p className="font-sans text-[7px] font-black text-gray-500 uppercase tracking-wider">Breathe</p>
                </div>
              </div>
            </div>

            {/* Scripture Card */}
            <div className="bg-white/30 backdrop-blur-sm border border-white/50 rounded-xl p-4 text-center">
              <p className="text-[9px] font-serif italic text-gray-600 leading-relaxed">
                "Let the words of my mouth and the meditation of my heart be acceptable in your sight."
              </p>
              <p className="text-[7px] font-black text-amber-600 uppercase tracking-wider mt-2">— Psalm 19:14</p>
            </div>
          </aside>

          {/* Right Column: Dynamic Form */}
          <section className="lg:col-span-8">
            <form onSubmit={handleSave} className="space-y-8">
              
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

              {/* Mood Selector */}
              <div className="py-6 border-y border-gray-200/50 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-amber-500 text-[14px]">favorite</span>
                  <span className="text-[8px] font-black text-amber-600 uppercase tracking-wider">Heart State</span>
                </div>
                <div className="flex gap-3">
                  {moods.map((mood) => (
                    <button
                      key={mood.label}
                      type="button"
                      onClick={() => setSelectedMood(mood.label)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                        selectedMood === mood.label 
                          ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white scale-110 shadow-md' 
                          : 'bg-white/50 text-gray-500 hover:bg-amber-100'
                      }`}
                      title={mood.label}
                    >
                      <span className="material-symbols-outlined text-[16px]">{mood.icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-6 pt-6">
                <button 
                  type="button" 
                  onClick={() => router.back()}
                  className="text-[8px] font-black text-gray-400 uppercase tracking-wider hover:text-red-500 transition-colors"
                >
                  Discard Draft
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="w-full sm:w-auto bg-gradient-to-r from-amber-600 to-amber-700 text-white px-10 py-3.5 rounded-lg text-[9px] font-black tracking-wider uppercase hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[14px]">sync</span>
                      <span>Preserving...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                      <span>Seal Reflection</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </section>
        </div>

        {/* Decorative Footer */}
        <div className="mt-12 flex justify-center items-center gap-4 opacity-30">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400" />
          <span className="material-symbols-outlined text-amber-400 text-sm">edit_note</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400" />
        </div>
      </main>
    </div>
  );
}

/**
 * HELPER COMPONENT
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
    <div className="group">
      <label className="block text-xl md:text-2xl font-serif text-gray-800 mb-3 group-focus-within:text-amber-600 transition-colors duration-500">
        {label}
      </label>
      <div className="relative">
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent border-none focus:ring-0 border-b border-gray-200 focus:border-amber-500 transition-all duration-700 text-base italic text-gray-700 placeholder:text-gray-300 p-0 py-3 resize-none leading-relaxed outline-none"
        />
        <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 w-0 group-focus-within:w-full transition-all duration-700 ease-out rounded-full"></div>
      </div>
    </div>
  );
}