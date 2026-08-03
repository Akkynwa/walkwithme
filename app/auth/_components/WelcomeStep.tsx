'use client';

import React from 'react';

interface WelcomeStepProps {
  onNext: () => void;
  userName: string;
}

export function WelcomeStep({ onNext, userName }: WelcomeStepProps) {
  return (
    <div className="flex min-h-[440px] w-full flex-col justify-between animate-in fade-in duration-200">
      <div className="my-auto space-y-6">
        <div>
          <span className="mb-1 block text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-500">
            Welcome aboard
          </span>
          <h2 className="text-3xl font-semibold tracking-tight text-slate-900">
            Hi {userName || 'there'},
            <br />
            <span className="text-slate-600">you’re ready to begin.</span>
          </h2>
        </div>

        <p className="text-sm leading-7 text-slate-600">
          We’ll help you settle into a simple routine with quiet time, journaling, and gentle reminders that feel easy to keep up with.
        </p>

        <div className="space-y-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-900">A calmer daily rhythm</h4>
            <p className="mt-1 text-sm text-slate-600">Create a quiet moment, reflect on your day, and build healthy habits step by step.</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900">A simple path forward</h4>
            <p className="mt-1 text-sm text-slate-600">We’ll guide you through a quick check-in so your next steps feel clear and manageable.</p>
          </div>
        </div>
      </div>

      <button
        onClick={onNext}
        className="w-full rounded-2xl bg-slate-900 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-slate-800"
      >
        Continue
      </button>
    </div>
  );
}