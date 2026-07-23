'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleResetRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        toast.success('Reset link sent successfully');
      } else {
        const data = await response.json();
        toast.error(data.error || 'Something went wrong');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.16),_transparent_35%),linear-gradient(135deg,_#fff7ed_0%,_#ffffff_45%,_#fef2f2_100%)] p-4 font-sans sm:p-6">
      
      {/* BACKGROUND CONTENT LAYER (Simulates the parent dashboard sitting behind the modal view) */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none filter blur-sm flex flex-col p-8 justify-between">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-400 rounded-lg"></div>
            <div className="h-4 w-24 bg-zinc-300 rounded"></div>
          </div>
          <div className="h-4 w-32 bg-zinc-300 rounded"></div>
        </div>
        <div className="grid grid-cols-3 gap-6 my-auto max-w-4xl w-full mx-auto">
          <div className="h-32 bg-zinc-300 rounded-xl"></div>
          <div className="h-32 bg-zinc-300 rounded-xl"></div>
          <div className="h-32 bg-zinc-300 rounded-xl"></div>
        </div>
      </div>

      {/* SEMI-TRANSPARENT MODAL OVERLAY BACKDROP */}
      <div className="absolute inset-0 z-10 bg-white/35 backdrop-blur-[2px]" />

      {/* FLOATING DIALOG CARD */}
      <div className="relative z-20 flex min-h-[460px] w-full max-w-[460px] flex-col justify-between overflow-hidden rounded-[28px] border border-orange-100 bg-white/90 p-8 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-10">
        
        {/* ESCAPE / CLOSE CONTROL */}
        <Link 
          href="/auth" 
          className="absolute right-4 top-4 rounded-full bg-orange-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-600 transition hover:bg-orange-100"
          aria-label="Close recovery view"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </Link>

        <div className="my-auto">
          {!isSubmitted ? (
            <>
              {/* Header Context */}
              <div className="mb-6">
                <h2 className="mb-2 text-3xl font-black tracking-tight text-slate-900">
                  Recover password.
                </h2>
                <p className="text-sm leading-normal text-slate-600">
                  Enter your verification email below and we will distribute a secure recovery link to your inbox.
                </p>
              </div>

              {/* Form Input Container */}
              <form onSubmit={handleResetRequest} className="space-y-4">
                <input 
                  required 
                  type="email"
                  className="w-full rounded-2xl border border-orange-100 bg-orange-50/70 px-4 py-3 text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400 focus:border-orange-400 focus:bg-white"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <button 
                  disabled={loading}
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-3.5 text-xs font-black uppercase tracking-[0.24em] text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Success Response State */
            <div className="text-center py-4 animate-in fade-in zoom-in-95 duration-400">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-50 text-orange-600">
                <span className="material-symbols-outlined text-xl">mark_email_read</span>
              </div>
              <h3 className="mb-2 text-2xl font-black tracking-tight text-slate-900">
                Link Dispatched
              </h3>
              <p className="mb-6 text-sm leading-normal text-slate-600">
                If an account matches <span className="font-semibold text-slate-900">{email}</span>, instruction details will appear shortly.
              </p>
              <Link 
                href="/auth" 
                className="block w-full rounded-2xl bg-orange-500 py-3.5 text-center text-xs font-black uppercase tracking-[0.24em] text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
              >
                Return to Login
              </Link>
            </div>
          )}
        </div>

        {/* Card Footer Toggle Link */}
        <div className="mt-8 border-t border-orange-100 pt-5 text-center">
          <Link 
            href="/auth" 
            className="inline-flex items-center gap-1 text-xs font-medium text-slate-500 transition-colors hover:text-orange-600"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back to account registration</span>
          </Link>
        </div>

      </div>
    </div>
  );
}