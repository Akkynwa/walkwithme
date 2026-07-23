'use client';

import React from 'react';

export function WelcomeStep({ onNext, userName }: { onNext: () => void; userName: string }) {
  return (
    <div className="w-full flex flex-col justify-between min-h-[440px] animate-in fade-in duration-200">
      <div className="my-auto space-y-6">
        <div>
          <span className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase block mb-1">SECURE PORTAL CORE</span>
          <h2 className="text-4xl font-sans font-bold tracking-tight text-zinc-900 leading-tight">
            GREETINGS, <br />
            <span className="text-zinc-500 font-bold uppercase">{userName || 'SEEKER'}.</span>
          </h2>
        </div>

        <p className="text-sm font-bold text-zinc-600 leading-relaxed uppercase tracking-wide">
          Your system parameters are ready. Let's calibrate your daily check-in sequence.
        </p>

        <div className="space-y-4 border-l-4 border-zinc-900 pl-4 py-1">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">QUIET TIME MANAGEMENT</h4>
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-wide mt-0.5">Engage structured daily readings paired with focus logs.</p>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-900">MONTHLY ECOSYSTEM REWARDS</h4>
            <p className="text-xs text-zinc-400 font-bold uppercase tracking-wide mt-0.5">Log habits sequentially to maintain active streaks.</p>
          </div>
        </div>
      </div>

      <button onClick={onNext} className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-4 text-xs font-bold tracking-wider uppercase transition-colors">
        PROCEED TO ANALYSIS
      </button>
    </div>
  );
}