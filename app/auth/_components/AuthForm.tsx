'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import toast from 'react-hot-toast';

export function AuthForm({ onAuthSuccess }: { onAuthSuccess: (name: string) => void }) {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    agreeTerms: false
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
        toast.error(result.error || 'Failed to sign in');
      } else if (result?.ok) {
        toast.success('IDENTITY VERIFIED.');
        const computedName = formData.email.split('@')[0];
        onAuthSuccess(computedName);
      }
    } catch (error) {
      toast.error('An unexpected validation error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!formData.firstName || !formData.lastName || !formData.email || formData.password.length < 8 || !formData.agreeTerms) {
      toast.error('Complete all fields parameters correctly');
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
        toast.error(data.error || 'Registration failed');
      } else {
        toast.success('ACCOUNT CREATED. PROCEED TO SIGN IN.');
        setActiveTab('login');
        setFormData({ ...formData, password: '', agreeTerms: false });
      }
    } catch (error) {
      toast.error('Network execution fault');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center animate-in fade-in duration-200">
      <div className="mb-6 text-center">
        <h2 className="text-3xl font-black tracking-tight text-slate-900 mb-2">
          {activeTab === 'login' ? 'Welcome back.' : 'Join the tribe.'}
        </h2>
        <p className="text-sm font-medium text-slate-600">
          {activeTab === 'login' ? 'Access your private digital sanctuary space and stay grounded in your daily rhythm.' : 'Create an account to keep your journal, prayer life, and quiet-time plans in one place.'}
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-6 border-b border-orange-100">
        {(['login', 'register'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-xs font-black uppercase tracking-[0.22em] transition-all relative ${
              activeTab === tab ? 'text-orange-600' : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {tab === 'login' ? 'SIGN IN' : 'REGISTER'}
            {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-[2.5px] rounded-full bg-orange-500" />}
          </button>
        ))}
      </div>

      {activeTab === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-3">
          <input 
            required 
            type="email"
            className="w-full bg-white border border-zinc-300 focus:border-zinc-900 px-4 py-3 text-sm font-bold tracking-wide outline-none"
            placeholder="EMAIL ADDRESS"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
          />
          <div className="relative w-full">
            <input 
              required 
              type="password"
              className="w-full bg-white border border-zinc-300 focus:border-zinc-900 px-4 py-3 text-sm font-bold tracking-wide outline-none"
              placeholder="PASSWORD"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <Link href="/auth/forgot-password" className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-semibold uppercase text-slate-500 hover:text-orange-600">
              FORGOT?
            </Link>
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-2xl bg-orange-500 py-4 text-xs font-black uppercase tracking-[0.22em] text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600 disabled:opacity-50">
            {loading ? 'VERIFYING CREDENTIALS...' : 'ENTER SANCTUARY'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input required className="w-full rounded-2xl border border-orange-100 bg-orange-50/70 px-4 py-3 text-sm font-medium tracking-wide text-slate-700 outline-none transition focus:border-orange-400 focus:bg-white" placeholder="FIRST NAME" value={formData.firstName} onChange={(e) => setFormData({...formData, firstName: e.target.value})} />
            <input required className="w-full rounded-2xl border border-orange-100 bg-orange-50/70 px-4 py-3 text-sm font-medium tracking-wide text-slate-700 outline-none transition focus:border-orange-400 focus:bg-white" placeholder="LAST NAME" value={formData.lastName} onChange={(e) => setFormData({...formData, lastName: e.target.value})} />
          </div>
          <input required type="email" className="w-full rounded-2xl border border-orange-100 bg-orange-50/70 px-4 py-3 text-sm font-medium tracking-wide text-slate-700 outline-none transition focus:border-orange-400 focus:bg-white" placeholder="EMAIL ADDRESS" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          <input required type="password" className="w-full rounded-2xl border border-orange-100 bg-orange-50/70 px-4 py-3 text-sm font-medium tracking-wide text-slate-700 outline-none transition focus:border-orange-400 focus:bg-white" placeholder="PASSWORD (8+ CHARACTERS)" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          
          <div className="flex items-start gap-3 pt-1">
            <input type="checkbox" id="terms" className="mt-1 rounded border-orange-200 text-orange-500 focus:ring-orange-400" checked={formData.agreeTerms} onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})} />
            <label htmlFor="terms" className="text-[11px] font-medium leading-normal text-slate-600">
              I AGREE TO THE TERMS AND PRIVACY PROTOCOLS.
            </label>
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-2xl bg-orange-500 py-4 text-xs font-black uppercase tracking-[0.22em] text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600">
            {loading ? 'PROCESSING ACCOUNT...' : 'CREATE ACCOUNT'}
          </button>
        </form>
      )}
    </div>
  );
}