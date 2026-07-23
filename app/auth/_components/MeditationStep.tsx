'use client';

import React, { useState, useEffect } from 'react';

export function MeditationStep({ 
  moodContext, 
  onBack, 
  onComplete 
}: { 
  moodContext: { selectedMood: string; suggestScriptures: boolean }; 
  onBack: () => void; 
  onComplete: (data: any) => void;
}) {
  const [selectedTime, setSelectedTime] = useState(10);
  const [fetching, setFetching] = useState(false);
  const [prescribedText, setPrescribedText] = useState({
    reference: 'PSALM 46:10',
    text: 'Be still, and know that I am God; I will be exalted among the nations, I will be exalted in the earth.'
  });

  useEffect(() => {
    if (!moodContext.selectedMood || !moodContext.suggestScriptures) return;

    const scoopScriptures = async () => {
      setFetching(true);
      try {
        const res = await fetch(`/api/scriptures?mood=${moodContext.selectedMood}`);
        if (!res.ok) throw new Error('Offline fallback execution');
        const data = await res.json();
        if (data.reference && data.text) {
          setPrescribedText({ reference: data.reference.toUpperCase(), text: data.text });
        }
      } catch (err) {
        const dictionary: Record<string, {reference: string, text: string}> = {
          anxious: { reference: "PHILIPPIANS 4:6-7", text: "Do not be anxious about anything, but in every situation, present your requests to God." },
          weary: { reference: "MATTHEW 11:28", text: "Come to me, all you who are weary and burdened, and I will give you rest." },
          thankful: { reference: "PSALM 100:4", text: "Enter his gates with thanksgiving and his courts with praise." }
        };
        const fallback = dictionary[moodContext.selectedMood];
        if (fallback) setPrescribedText(fallback);
      } finally {
        setFetching(false);
      }
    };

    scoopScriptures();
  }, [moodContext.selectedMood, moodContext.suggestScriptures]);

  return (
    <div className="w-full flex flex-col justify-between min-h-[440px] animate-in fade-in duration-200">
      <div className="space-y-6 my-auto">
        <div>
          <h3 className="text-3xl font-sans font-bold tracking-tight text-zinc-900 mb-1">
            SILENCE & MEDITATION.
          </h3>
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Configure continuous quiet interval blocks.</p>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
            MEDITATION DURATIONS
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[5, 10, 15, 30].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setSelectedTime(mins)}
                className={`py-3 text-center text-xs font-bold border transition-colors ${
                  selectedTime === mins ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-300 bg-white text-zinc-600 hover:border-zinc-900'
                }`}
              >
                {mins} MINS
              </button>
            ))}
          </div>
        </div>

        <div className="border border-zinc-300 bg-zinc-50 p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-900">
              {fetching ? 'SCOOPING REFERENCE...' : 'PRESCRIBED ANCHOR VERSE'}
            </span>
            <span className="text-xs font-bold text-zinc-900 uppercase tracking-wider">
              {prescribedText.reference}
            </span>
          </div>
          <p className="text-sm font-bold text-zinc-800 leading-relaxed italic">
            "{prescribedText.text}"
          </p>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button type="button" onClick={onBack} className="px-6 py-4 border border-zinc-300 text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-zinc-900 transition-colors">
          BACK
        </button>
        <button onClick={() => onComplete({ timeRange: selectedTime })} className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white py-4 text-xs font-bold tracking-wider uppercase transition-colors text-center">
          COMPLETE & OPEN DASHBOARD
        </button>
      </div>
    </div>
  );
}