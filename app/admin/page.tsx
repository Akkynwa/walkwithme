'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/auth/signin?callbackUrl=/admin');
    }
  }, [router, status]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
        <p className="text-sm">Preparing admin workspace...</p>
      </div>
    );
  }

  if (session?.user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-6 text-white">
        <div className="max-w-md rounded-2xl border border-white/10 bg-white/10 p-6 text-center backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Access denied</p>
          <h1 className="mt-3 text-2xl font-semibold">Admin access is restricted</h1>
          <p className="mt-3 text-sm text-slate-300">
            Your account is not marked as an administrator yet. Ask the project owner to grant the ADMIN role.
          </p>
          <Link href="/dashboard" className="mt-6 inline-flex rounded-full bg-[#183b63] px-4 py-2 text-sm font-medium text-white">
            Return to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">Admin console</p>
          <h1 className="mt-3 text-3xl font-semibold">Welcome to your admin workspace</h1>
          <p className="mt-3 max-w-2xl text-sm text-slate-300">
            This page is now protected and available to signed-in administrators. You can extend it with moderation, analytics, and content tools later.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
              <p className="text-sm font-semibold text-slate-200">Moderation</p>
              <p className="mt-2 text-sm text-slate-400">Review community posts and manage sensitive content.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5">
              <p className="text-sm font-semibold text-slate-200">Users</p>
              <p className="mt-2 text-sm text-slate-400">Manage accounts, permissions, and access for the platform.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
