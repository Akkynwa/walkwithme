'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import Sidebar from '@/app/layout-components/Sidebar';
import MainHeader from '@/app/layout-components/Header';

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
      
      // Combine the reflection fields into a single structured content block
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
    <div className="min-h-screen bg-[#FDFDFF] font-serif">
      <Sidebar />
      <MainHeader />

      <main className="lg:ml-64 p-6 md:p-12 pt-28 max-w-[1200px] mx-auto animate-in fade-in duration-700">
        
        {/* Header */}
        <header className="mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#D4AF37]/10 text-[#D4AF37] font-sans text-[10px] font-black mb-4 uppercase tracking-[0.2em]">
            <span className="material-symbols-outlined text-[14px]">calendar_today</span>
            <span>{today}</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-serif text-[#3C3830] mb-3">Daily Reflection</h2>
          <p className="text-[#7C7565] italic border-l-2 border-[#D4AF37] pl-4 max-w-xl">
            Take a moment of stillness to process today's word and align your spirit.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Context Area */}
          <aside className="lg:col-span-4 lg:sticky lg:top-28 h-fit space-y-6">
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6 text-[#D4AF37]">
                <span className="material-symbols-outlined text-xl">self_improvement</span>
                <span className="font-sans text-[10px] font-black uppercase tracking-[0.2em]">Guided Stillness</span>
              </div>
              <p className="text-lg text-[#3C3830] leading-relaxed italic mb-6">
                "Be still, and know that I am God."
              </p>
              
              <div className="border-t border-gray-50 pt-6">
                <h4 className="font-sans text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Reflection Tip</h4>
                <p className="text-sm text-[#7C7565] leading-relaxed">
                  Don't rush. Let the thoughts flow naturally. This is your personal space for growth.
                </p>
              </div>

              {/* Ambient Breathe Component */}
              <div className="mt-10 flex flex-col items-center justify-center p-8 bg-gray-50/50 rounded-2xl group">
                <div className="w-12 h-12 bg-primary rounded-full opacity-20 animate-ping absolute"></div>
                <div className="w-12 h-12 bg-primary rounded-full shadow-lg shadow-primary/20 mb-4 relative z-10 transition-transform duration-1000 scale-110 group-hover:scale-125"></div>
                <p className="font-sans text-[10px] font-black text-gray-400 uppercase tracking-widest">Breathe.</p>
              </div>
            </div>
          </aside>

          {/* Right Column: Dynamic Form */}
          <section className="lg:col-span-8">
            <form onSubmit={handleSave} className="space-y-12">
              
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
              <div className="py-8 border-y border-gray-100 flex flex-wrap items-center gap-8">
                <span className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em]">Your Heart State</span>
                <div className="flex gap-4">
                  {moods.map((mood) => (
                    <button
                      key={mood.label}
                      type="button"
                      onClick={() => setSelectedMood(mood.label)}
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                        selectedMood === mood.label 
                          ? 'bg-primary text-white scale-110 shadow-lg' 
                          : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
                      }`}
                      title={mood.label}
                    >
                      <span className="material-symbols-outlined text-lg">{mood.icon}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row items-center justify-end gap-8 pt-4">
                <button 
                  type="button" 
                  onClick={() => router.back()}
                  className="text-[10px] font-black text-gray-300 uppercase tracking-widest hover:text-red-400 transition-colors"
                >
                  Discard Draft
                </button>
                <button 
                  type="submit" 
                  disabled={isSaving}
                  className="w-full sm:w-auto bg-primary text-white px-12 py-5 rounded-full text-[11px] font-black tracking-[0.2em] uppercase hover:shadow-2xl hover:shadow-primary/30 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSaving ? (
                    <span className="material-symbols-outlined animate-spin text-sm">sync</span>
                  ) : (
                    <span className="material-symbols-outlined text-sm">self_improvement</span>
                  )}
                  {isSaving ? 'Preserving...' : 'Seal Reflection'}
                </button>
              </div>
            </form>
          </section>
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
      <label className="block text-2xl font-serif text-[#3C3830] mb-4 group-focus-within:text-primary transition-colors duration-500">
        {label}
      </label>
      <div className="relative">
        <textarea
          rows={rows}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent border-none focus:ring-0 border-b border-gray-100 focus:border-primary transition-all duration-700 text-lg italic text-[#3C3830] placeholder:text-gray-200 p-0 py-4 resize-none leading-relaxed"
        ></textarea>
        <div className="absolute bottom-0 left-0 h-[1px] bg-primary w-0 group-focus-within:w-full transition-all duration-1000 ease-out"></div>
      </div>
    </div>
  );
}