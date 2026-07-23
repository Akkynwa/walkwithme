'use client';

import { useState } from 'react';

export function AuthStep({ onComplete }: { onComplete: (data: any) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Execute credentials verification logic here
    onComplete({ email });
  };

  return (
    <div className="w-full max-w-[460px] bg-white border border-zinc-200 shadow-2xl p-8 sm:p-10 flex flex-col justify-between min-h-[500px] animate-in fade-in duration-200">
      <div className="my-auto space-y-6">
        <div>
          <h2 className="text-3xl font-sans font-semibold tracking-tight text-zinc-900 mb-1">
            WalkWithMe
          </h2>
          <p className="text-xs text-zinc-400 uppercase tracking-widest font-mono">Sanctuary Authentication Core</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            required
            type="email"
            placeholder="Email address"
            className="w-full bg-white border border-zinc-200 focus:border-zinc-900 px-4 py-3 text-sm transition-all outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            required
            type="password"
            placeholder="Security credentials"
            className="w-full bg-white border border-zinc-200 focus:border-zinc-900 px-4 py-3 text-sm transition-all outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="submit"
            className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-3.5 text-xs font-semibold tracking-wider uppercase transition-colors"
          >
            Authenticate Portal
          </button>
        </form>
      </div>

      <div className="mt-8 pt-4 border-t border-zinc-100 text-center">
        <span className="text-[10px] text-zinc-400 tracking-wide">Secure session encryption initialization active.</span>
      </div>
    </div>
  );
}