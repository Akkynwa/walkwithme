'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface AuthFormProps {
  onAuthSuccess: (name: string) => void;
}

export function AuthForm({ onAuthSuccess }: AuthFormProps) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    agreeTerms: false,
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);

    try {
      const result = await signIn('credentials', {
        email: formData.email,
        password: formData.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('We could not sign you in. Please check your details and try again.');
      } else if (result?.ok) {
        toast.success('Welcome back. You are signed in.');
        const computedName = formData.email.split('@')[0];
        onAuthSuccess(computedName);
      }
    } catch {
      toast.error('Something went wrong. Please try again in a moment.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;

    if (!formData.firstName || !formData.lastName || !formData.email || formData.password.length < 8 || !formData.agreeTerms) {
      toast.error('Please complete everything and accept the terms before continuing.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: `${formData.firstName} ${formData.lastName}`,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        toast.error(data.error || 'We could not create your account right now.');
      } else {
        toast.success('Your account is ready. You can sign in now.');
        setActiveTab('login');
        setFormData({ ...formData, password: '', agreeTerms: false });
      }
    } catch {
      toast.error('The connection timed out. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex w-full flex-col justify-center animate-in fade-in duration-200">
      <div className="mb-6 text-center">
        <h2 className="mb-2 text-3xl font-semibold tracking-tight text-slate-900">
          {activeTab === 'login' ? 'Welcome back' : 'Create your account'}
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          {activeTab === 'login'
            ? 'Sign in to pick up where you left off and keep your quiet time, prayers, and journal in one place.'
            : 'Join in a few simple steps and start building a calmer daily routine.'}
        </p>
      </div>

      <div className="mb-6 flex justify-center gap-4 border-b border-slate-200">
        {(['login', 'register'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`relative pb-2 text-xs font-semibold uppercase tracking-[0.24em] transition-all ${
              activeTab === tab ? 'text-sky-700' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'login' ? 'Sign in' : 'Register'}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[2px] rounded-full bg-sky-600" />}
          </button>
        ))}
      </div>

      {activeTab === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-3">
          <input
            required
            type="email"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <div className="relative w-full">
            <input
              required
              type="password"
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <Link href="/auth/forgot-password" className="absolute right-3 top-1/2 -translate-y-1/2 text-[11px] font-medium text-slate-500 transition hover:text-sky-700">
              Forgot?
            </Link>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-sky-700 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-700/20 transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Signing you in…' : 'Continue to your space'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
              placeholder="First name"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
            />
            <input
              required
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
              placeholder="Last name"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
          <input
            required
            type="email"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
            placeholder="Email address"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <input
            required
            type="password"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100"
            placeholder="Password (8+ characters)"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />

          <div className="flex items-start gap-3 pt-1">
            <input
              type="checkbox"
              id="terms"
              className="mt-1 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              checked={formData.agreeTerms}
              onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
            />
            <label htmlFor="terms" className="text-[11px] leading-5 text-slate-600">
              I agree to the{' '}
              <Link href="/terms" className="font-medium text-sky-700 hover:text-sky-800">
                Terms
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="font-medium text-sky-700 hover:text-sky-800">
                Privacy Policy
              </Link>
              .
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-sky-700 py-3.5 text-sm font-semibold text-white shadow-lg shadow-sky-700/20 transition hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Creating your account…' : 'Create account'}
          </button>
        </form>
      )}
    </div>
  );
}