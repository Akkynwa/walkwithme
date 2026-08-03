'use client';

import React, { useState, useEffect } from 'react';

interface MeditationStepProps {
  moodContext: { selectedMood: string; suggestScriptures: boolean };
  onBack: () => void;
  onComplete: (data: { timeRange: number }) => void;
}

export function MeditationStep({ moodContext, onBack, onComplete }: MeditationStepProps) {
  const [selectedTime, setSelectedTime] = useState(10);
  const [fetching, setFetching] = useState(false);
  const [prescribedText, setPrescribedText] = useState({
    reference: 'Psalm 46:10',
    text: 'Be still, and know that I am God.',
  });

  useEffect(() => {
    if (!moodContext.selectedMood || !moodContext.suggestScriptures) return;

    const scoopScriptures = async () => {
      setFetching(true);
      try {
        const res = await fetch(`/api/scriptures?mood=${moodContext.selectedMood}`);
        if (!res.ok) throw new Error('Offline fallback');
        const data = await res.json();
        if (data.reference && data.text) {
          setPrescribedText({ reference: data.reference.toUpperCase(), text: data.text });
        }
      } catch {
        const dictionary: Record<string, { reference: string; text: string }> = {
          anxious: {
            reference: 'Philippians 4:6-7',
            text: 'Do not be anxious about anything. Present your requests to God with thanksgiving.',
          },
          weary: {
            reference: 'Matthew 11:28',
            text: 'Come to me, all you who are weary and burdened, and I will give you rest.',
          },
          thankful: {
            reference: 'Psalm 100:4',
            text: 'Enter his gates with thanksgiving and his courts with praise.',
          },
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
    <div className="flex min-h-[440px] w-full flex-col justify-between animate-in fade-in duration-200">
      <div className="my-auto space-y-6">
        <div>
          <h3 className="mb-1 text-3xl font-semibold tracking-tight text-slate-900">A calm moment for you</h3>
          <p className="text-sm leading-6 text-slate-600">Choose how long you want to sit quietly and breathe before you continue.</p>
        </div>

        <div className="space-y-2">
          <label className="block text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
            Quiet time length
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[5, 10, 15, 30].map((mins) => (
              <button
                key={mins}
                type="button"
                onClick={() => setSelectedTime(mins)}
                className={`rounded-2xl border px-3 py-3 text-center text-sm font-medium transition-all ${
                  selectedTime === mins
                    ? 'border-sky-600 bg-sky-700 text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-sky-300 hover:text-sky-700'
                }`}
              >
                {mins} min
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600">
              {fetching ? 'Finding a verse…' : 'Suggested verse'}
            </span>
            <span className="text-sm font-semibold text-slate-800">{prescribedText.reference}</span>
          </div>
          <p className="mt-3 text-sm leading-7 text-slate-700">“{prescribedText.text}”</p>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={onBack}
          className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-medium text-slate-600 transition hover:border-slate-300 hover:text-slate-800"
        >
          Back
        </button>
        <button
          onClick={() => onComplete({ timeRange: selectedTime })}
          className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
        >
          Continue to your dashboard
        </button>
      </div>
    </div>
  );
}