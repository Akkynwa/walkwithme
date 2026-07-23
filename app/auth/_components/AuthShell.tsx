'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

interface AuthShellProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
  backHref?: string;
  backLabel?: string;
}

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  backHref = '/',
  backLabel = 'Back to home',
}: AuthShellProps) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.16),_transparent_35%),linear-gradient(135deg,_#fff7ed_0%,_#ffffff_45%,_#fef2f2_100%)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(251,191,36,0.12),_transparent_30%)]" />

      <div className="relative z-10 w-full max-w-[520px]">
        <div className="mb-6 text-center">
          <Link href="/" className="inline-flex items-center gap-3 rounded-full border border-orange-200/80 bg-white/80 px-4 py-2 shadow-sm backdrop-blur-sm transition hover:shadow-md">
            <span className="material-symbols-outlined text-[20px] text-orange-600">self_improvement</span>
            <span className="text-sm font-black uppercase tracking-[0.28em] text-slate-800">WalkWithMe</span>
          </Link>
        </div>

        <div className="rounded-[28px] border border-orange-100 bg-white/90 p-6 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl sm:p-8">
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">{title}</h1>
            {subtitle ? <p className="mt-2 text-sm leading-6 text-slate-600">{subtitle}</p> : null}
          </div>

          {children}
        </div>

        {footer ? (
          <div className="mt-4 text-center text-sm text-slate-600">
            <Link href={backHref} className="inline-flex items-center gap-2 font-medium text-orange-600 transition hover:text-orange-700">
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              <span>{backLabel}</span>
            </Link>
          </div>
        ) : null}
      </div>
    </main>
  );
}
