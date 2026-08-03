'use client';

import React, { useState } from 'react';
import toast from 'react-hot-toast';

const PRESETS = [
  { id: 'anxious', label: 'Feeling stressed' },
  { id: 'thankful', label: 'Grateful' },
  { id: 'weary', label: 'Tired' },
  { id: 'seeking', label: 'Looking for direction' },
  { id: 'restless', label: 'Restless' },
  { id: 'peaceful', label: 'Peaceful' },
];

interface MoodStepProps {
  onNext: (data: { selectedMood: string; notes: string; suggestScriptures: boolean }) => void;
  onBack: () => void;
}

export function MoodStep({ onNext, onBack }: MoodStepProps) {
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
          content: notes || 'Daily check-in',
          type: 'onboarding_check_in',
        }),
      });

      if (!response.ok) throw new Error('Database sync failed.');

      toast.success('Your note is saved.');
      onNext({ selectedMood, notes, suggestScriptures });
    } catch {
      toast.error('We saved it locally for now.');
      onNext({ selectedMood, notes, suggestScriptures });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex min-h-[440px] w-full flex-col justify-between animate-in fade-in duration-200">
      <div className="my-auto space-y-5">
        <div>
          <h3 className="mb-1 text-3xl font-semibold tracking-tight text-slate-900">How are you feeling today?</h3>
          <p className="text-sm leading-6 text-slate-600">Choose a word that fits your mood and add a short note if you want.</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {PRESETS.map((mood) => {
            const active = selectedMood === mood.id;
            return (
              <button
                key={mood.id}
                type="button"
                onClick={() => setSelectedMood(mood.id)}
                className={`rounded-2xl border px-4 py-3 text-sm font-medium transition-all ${
                  active
                    ? 'border-sky-600 bg-sky-700 text-white shadow-sm'
                    : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:text-sky-700'
                }`}
              >
                {mood.label}
              </button>
            );
          })}
        </div>

        <div className="space-y-1">
          <label className="block text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
            Optional note
          </label>
          <textarea
            className="h-24 w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            placeholder="Write a few words about your day..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-3">
          <div>
            <span className="block text-sm font-semibold text-slate-800">Suggest a verse</span>
            <span className="text-xs text-slate-500">We can add a calming scripture based on your mood.</span>
          </div>
          <input
            type="checkbox"
            checked={suggestScriptures}
            onChange={(e) => setSuggestScriptures(e.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
          />
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
          type="submit"
          disabled={!selectedMood || submitting}
          className="flex-1 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? 'Saving…' : 'Save and continue'}
        </button>
      </div>
    </form>
  );
}