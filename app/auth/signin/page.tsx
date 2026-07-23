/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';

// Import your logo source path (e.g., from public folder or assets)
import logo from '/public/logo.png'; 

// Auth Form Component (Right Panel inside the Modal)
function AuthForm({ activeTab, setActiveTab }: { activeTab: 'login' | 'register', setActiveTab: (tab: 'login' | 'register') => void }) {
  const router = useRouter();
  const searchParams = useSearchParams();
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
        toast.success('Welcome back to your sanctuary! Opening the gates...');
        router.push(searchParams.get('callbackUrl') || '/');
        router.refresh();
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || formData.password.length < 8 || !formData.agreeTerms) {
      toast.error('Please complete all fields correctly');
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
        toast.error(data.error || 'Failed to create account');
      } else {
        toast.success('Account created successfully! Please log in.');
        setActiveTab('login');
        setFormData({ ...formData, password: '', agreeTerms: false });
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col justify-center">
      {/* Dynamic Header Copy */}
      <div className="mb-6">
        <h2 className="text-3xl font-sans font-semibold tracking-tight text-zinc-900 mb-2">
          {activeTab === 'login' ? 'Welcome Back.' : 'Join the tribe.'}
        </h2>
        <p className="text-sm text-zinc-500">
          {activeTab === 'login' 
            ? 'Access your private digital sanctuary logs and community feed.' 
            : 'Receive access to your private journal and daily structured devotionals.'}
        </p>
      </div>

      {/* Tab Selectors */}
      <div className="flex gap-4 mb-6 border-b border-zinc-100">
        {(['login', 'register'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`pb-2 text-xs font-medium tracking-wide transition-all relative ${
              activeTab === tab ? 'text-zinc-900 font-semibold' : 'text-zinc-400 hover:text-zinc-600'
            }`}
          >
            {tab === 'login' ? 'Sign In' : 'Register'}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-zinc-900 rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div>
        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-3">
            <input 
              required 
              type="email"
              className="w-full bg-white border border-zinc-300 focus:border-zinc-900 px-4 py-3 text-sm transition-all outline-none placeholder:text-zinc-400"
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <div className="relative w-full">
              <input 
                required 
                type="password"
                className="w-full bg-white border border-zinc-300 focus:border-zinc-900 px-4 py-3 text-sm outline-none transition-all placeholder:text-zinc-400"
                placeholder="Password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
              <Link 
                href="/auth/forgot-password" 
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[11px] font-medium text-zinc-400 hover:text-zinc-600 transition-colors"
              >
                Forgot?
              </Link>
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-3.5 text-xs font-semibold tracking-wider uppercase transition-colors disabled:opacity-50"
            >
              {loading ? 'Opening Sanctuary...' : 'Enter Sanctuary'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input 
                required 
                className="w-full bg-white border border-zinc-300 focus:border-zinc-900 px-4 py-3 text-sm outline-none transition-all placeholder:text-zinc-400" 
                placeholder="First name" 
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
              <input 
                required 
                className="w-full bg-white border border-zinc-300 focus:border-zinc-900 px-4 py-3 text-sm outline-none transition-all placeholder:text-zinc-400" 
                placeholder="Last name" 
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
            <input 
              required 
              type="email"
              className="w-full bg-white border border-zinc-300 focus:border-zinc-900 px-4 py-3 text-sm outline-none transition-all placeholder:text-zinc-400" 
              placeholder="Email address"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <input 
              required 
              type="password"
              className="w-full bg-white border border-zinc-300 focus:border-zinc-900 px-4 py-3 text-sm outline-none transition-all placeholder:text-zinc-400" 
              placeholder="Password (8+ characters)"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            
            <div className="flex items-start gap-3 pt-1">
              <input 
                type="checkbox" 
                id="terms"
                className="rounded border-zinc-300 text-zinc-950 focus:ring-zinc-900 mt-1"
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})}
              />
              <label htmlFor="terms" className="text-[11px] text-zinc-500 leading-normal">
                I agree to the <Link href="/terms" className="text-zinc-900 font-semibold hover:underline">Terms</Link> and{' '}
                <Link href="/privacy" className="text-zinc-900 font-semibold hover:underline">Privacy Policy</Link>.
              </label>
            </div>

            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-3.5 text-xs font-semibold tracking-wider uppercase transition-colors"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
        )}

        {/* Dynamic Divider */}
        <div className="my-5">
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-zinc-200"></div>
            <span className="px-3 text-[10px] font-medium uppercase tracking-wider text-zinc-400">Or connection</span>
            <div className="flex-grow border-t border-zinc-200"></div>
          </div>
        </div>

        {/* Social Authentication Row */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            type="button"
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="flex items-center justify-center gap-2 bg-white border border-zinc-300 py-2.5 hover:bg-zinc-50 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-xs font-medium text-zinc-700">Google</span>
          </button>
          <button 
            type="button"
            className="flex items-center justify-center gap-2 bg-white border border-zinc-300 py-2.5 hover:bg-zinc-50 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-zinc-600">passkey</span>
            <span className="text-xs font-medium text-zinc-700">Passkey</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// Main Floating Modal View Layout Wrapper
export default function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.16),_transparent_35%),linear-gradient(135deg,_#fff7ed_0%,_#ffffff_45%,_#fef2f2_100%)] p-4 font-sans sm:p-6">
      
      {/* BACKGROUND CONTENT LAYER */}
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
      <div className="absolute inset-0 bg-white/35 z-10 backdrop-blur-[2px]" />

      {/* FLOATING DIALOG CARD */}
      <div className="relative z-20 w-full max-w-[920px] overflow-hidden rounded-[32px] border border-orange-100 bg-white/90 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl md:flex min-h-[560px]">
        
        {/* ESCAPE / CLOSE CONTROL CROSS */}
        <Link 
          href="/"
          className="absolute right-4 top-4 z-30 rounded-full bg-orange-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-600 transition hover:bg-orange-100"
          aria-label="Close form view"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </Link>

        {/* LEFT COMPONENT COLUMN: Brand Header & Showcase Container */}
        <div className="w-full md:w-1/2 bg-orange-50/70 p-8 flex flex-col justify-between border-r border-orange-100 select-none">
          {/* Brand Logo Header */}
          <div className="shrink-0">
            <Link href="/" className="inline-block">
              <div className="flex items-center gap-2.5">
                <Image
                  src={logo}
                  alt="WalkWithMe Logo"
                  priority
                  className="h-16 w-auto object-contain select-none pointer-events-none"
                />
                <span className="text-[11px] font-bold tracking-widest uppercase text-slate-800 dark:text-zinc-200">
                  WalkWithMe
                </span>
              </div>
            </Link>
          </div>

          {/* Image Asset Showcase */}
          <div className="my-auto py-6 flex items-center justify-center">
            <Image
              src="https://images.unsplash.com/photo-1653569746987-8c1c63b2ffe2?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="The Names of God Ebook Guide on Tablet"
              width={800}
              height={600}
              priority
              className="w-full h-auto max-w-lg object-contain drop-shadow-xl select-none pointer-events-none mx-auto"
            />
          </div>
        </div>

        {/* RIGHT COMPONENT COLUMN: Core Interactive Auth Container */}
        <div className="w-full md:w-1/2 bg-white/90 p-8 sm:p-12 flex flex-col justify-between">
          <Suspense fallback={
            <div className="h-full w-full flex flex-col items-center justify-center gap-3 py-20">
              <span className="material-symbols-outlined animate-spin text-zinc-900 text-2xl">sync</span>
              <p className="text-xs text-zinc-500">Preparing interface module...</p>
            </div>
          }>
            <AuthForm activeTab={activeTab} setActiveTab={setActiveTab} />
          </Suspense>
        </div>

      </div>
    </div>
  );
}