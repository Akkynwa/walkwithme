'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';

const PRESETS = [
  { id: 'anxious', label: 'ANXIOUS' },
  { id: 'thankful', label: 'THANKFUL' },
  { id: 'weary', label: 'WEARY' },
  { id: 'seeking', label: 'SEEKING GUIDE' },
  { id: 'restless', label: 'RESTLESS' },
  { id: 'peaceful', label: 'PEACEFUL' },
];

export function MoodStep({ onNext, onBack }: { onNext: (data: any) => void; onBack: () => void }) {
  const [selectedMood, setSelectedMood] = useState('');
  const [notes, setNotes] = useState('');
  const [suggestScriptures, setSuggestScriptures] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMood || submitting) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/journal/entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mood: selectedMood,
          content: notes || "Daily prompt initialization log.",
          type: 'onboarding_check_in'
        })
      });

      if (!response.ok) throw new Error('Database sync failed.');

      toast.success('JOURNAL PERSISTENCE SUCCESSFUL.');
      onNext({ selectedMood, notes, suggestScriptures });
    } catch (error) {
      toast.error('PERSISTENCE FAULT. USING CLIENT STORAGE FALLBACK.');
      onNext({ selectedMood, notes, suggestScriptures });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col justify-between min-h-[440px] animate-in fade-in duration-200">
      <div className="space-y-5 my-auto">
        <div>
          <h3 className="text-3xl font-sans font-bold tracking-tight text-zinc-900 mb-1">
            FRAME OF MIND.
          </h3>
          <p className="text-xs font-bold uppercase tracking-wider text-zinc-400">Sync metrics with your private journal instance.</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((mood) => {
            const active = selectedMood === mood.id;
            return (
              <button
                key={mood.id}
                type="button"
                onClick={() => setSelectedMood(mood.id)}
                className={`px-4 py-3 border text-xs font-bold tracking-wider uppercase transition-all ${
                  active ? 'border-zinc-900 bg-zinc-900 text-white' : 'border-zinc-300 text-zinc-700 bg-white hover:border-zinc-900'
                }`}
              >
                {mood.label}
              </button>
            );
          })}
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
            POUR OUT YOUR THOUGHTS (OPTIONAL)
          </label>
          <textarea
            className="w-full bg-white border border-zinc-300 focus:border-zinc-900 px-4 py-3 text-xs font-bold transition-all outline-none placeholder:text-zinc-400 h-24 resize-none"
            placeholder="WRITE MENTAL LOGS RAW..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between p-3 border border-zinc-200 bg-zinc-50">
          <div>
            <span className="text-xs font-bold text-zinc-900 uppercase tracking-wide block">PRESCRIBE SCRIPTURES</span>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wide">Correlate contextual text packages.</span>
          </div>
          <input
            type="checkbox"
            checked={suggestScriptures}
            onChange={(e) => setSuggestScriptures(e.target.checked)}
            className="w-4 h-4 accent-zinc-900 text-zinc-950 focus:ring-zinc-900"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button type="button" onClick={onBack} className="px-6 py-4 border border-zinc-300 text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-zinc-900 transition-colors">
          BACK
        </button>
        <button type="submit" disabled={!selectedMood || submitting} className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white py-4 text-xs font-bold tracking-wider uppercase transition-colors disabled:opacity-40">
          {submitting ? 'SYNCHRONIZING...' : 'SAVE LOGS'}
        </button>
      </div>
    </form>
  );
}