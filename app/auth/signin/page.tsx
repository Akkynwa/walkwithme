/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';
import Image from 'next/image';

// Auth Form Component
function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
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
    <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/80 shadow-2xl">
      {/* Tab Headers */}
      <div className="flex gap-6 mb-6 border-b border-gray-200/50">
        {(['login', 'register'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-[10px] font-black uppercase tracking-wider transition-all relative ${
              activeTab === tab ? 'text-amber-700' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            {tab === 'login' ? 'Welcome Back' : 'Join Us'}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="min-h-[400px]">
        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[9px] font-black uppercase tracking-wider text-gray-500 ml-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">email</span>
                Email Address
              </label>
              <input 
                required type="email"
                className="w-full bg-white/60 border border-gray-200/60 focus:bg-white focus:border-amber-300 focus:ring-2 focus:ring-amber-500/20 px-4 py-3 rounded-xl text-sm transition-all outline-none"
                placeholder="hello@walkwithme.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between px-1">
                <label className="text-[9px] font-black uppercase tracking-wider text-gray-500 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  Password
                </label>
                <Link 
                  href="/auth/forgot-password" 
                  className="text-[9px] font-bold text-amber-600 hover:text-amber-700 transition-colors"
                >
                  Forgot?
                </Link>
              </div>
              <input 
                required type="password"
                className="w-full bg-white/60 border border-gray-200/60 focus:bg-white focus:border-amber-300 focus:ring-2 focus:ring-amber-500/20 px-4 py-3 rounded-xl text-sm outline-none transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3.5 rounded-xl text-[11px] font-black uppercase tracking-wider hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
                  Opening Sanctuary...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">self_improvement</span>
                  Enter Sanctuary
                </span>
              )}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase tracking-wider text-gray-500 ml-1">First Name</label>
                <input 
                  required 
                  className="w-full bg-white/60 border border-gray-200/60 focus:bg-white focus:border-amber-300 focus:ring-2 focus:ring-amber-500/20 px-4 py-3 rounded-xl text-sm outline-none transition-all" 
                  placeholder="John" 
                  value={formData.firstName}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                />
              </div>
              <div className="space-y-1">
                <label className="text-[8px] font-black uppercase tracking-wider text-gray-500 ml-1">Last Name</label>
                <input 
                  required 
                  className="w-full bg-white/60 border border-gray-200/60 focus:bg-white focus:border-amber-300 focus:ring-2 focus:ring-amber-500/20 px-4 py-3 rounded-xl text-sm outline-none transition-all" 
                  placeholder="Doe" 
                  value={formData.lastName}
                  onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-wider text-gray-500 ml-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">email</span>
                Email Address
              </label>
              <input 
                required type="email"
                className="w-full bg-white/60 border border-gray-200/60 focus:bg-white focus:border-amber-300 focus:ring-2 focus:ring-amber-500/20 px-4 py-3 rounded-xl text-sm outline-none transition-all" 
                placeholder="hello@walkwithme.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-[8px] font-black uppercase tracking-wider text-gray-500 ml-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">lock</span>
                Password (8+ characters)
              </label>
              <input 
                required type="password"
                className="w-full bg-white/60 border border-gray-200/60 focus:bg-white focus:border-amber-300 focus:ring-2 focus:ring-amber-500/20 px-4 py-3 rounded-xl text-sm outline-none transition-all" 
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <div className="flex items-start gap-3 px-1 pt-2">
              <input 
                type="checkbox" id="terms"
                className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 mt-0.5"
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})}
              />
              <label htmlFor="terms" className="text-[10px] text-gray-600 leading-relaxed">
                I agree to the <Link href="/terms" className="text-amber-700 font-bold hover:underline">Terms of Service</Link> and{' '}
                <Link href="/privacy" className="text-amber-700 font-bold hover:underline">Privacy Policy</Link>.
              </label>
            </div>
            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-3.5 rounded-xl text-[11px] font-black uppercase tracking-wider hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
                  Creating Account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[16px]">person_add</span>
                  Create Account
                </span>
              )}
            </button>
          </form>
        )}

        {/* Divider */}
        <div className="my-8">
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-200/50"></div>
            <span className="px-4 text-[8px] font-black uppercase tracking-[0.2em] text-gray-400">Or continue with</span>
            <div className="flex-grow border-t border-gray-200/50"></div>
          </div>
        </div>

        {/* Social Login Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button 
            type="button"
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="flex items-center justify-center gap-2 bg-white/60 border border-gray-200/60 py-3 rounded-xl hover:bg-white/80 hover:border-amber-300 transition-all duration-200 group"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span className="text-[10px] font-bold text-gray-700 group-hover:text-amber-700">Google</span>
          </button>
          <button 
            type="button"
            className="flex items-center justify-center gap-2 bg-white/60 border border-gray-200/60 py-3 rounded-xl hover:bg-white/80 hover:border-amber-300 transition-all duration-200 group"
          >
            <span className="material-symbols-outlined text-[18px] text-gray-600 group-hover:text-amber-700">passkey</span>
            <span className="text-[10px] font-bold text-gray-700 group-hover:text-amber-700">Passkey</span>
          </button>
        </div>
      </div>

      {/* Footer Toggle */}
      <div className="mt-8 pt-6 border-t border-gray-200/50 text-center">
        <p className="text-[10px] text-gray-500 font-medium">
          {activeTab === 'login' ? "New to WalkWithMe? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
            className="text-amber-700 font-black hover:underline underline-offset-4 transition-all"
          >
            {activeTab === 'login' ? 'Start your journey' : 'Return to sanctuary'}
          </button>
        </p>
      </div>
    </div>
  );
}

// Main Auth Page
export default function AuthPage() {
  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 md:p-8 overflow-hidden font-sans">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=2070"
          alt="Peaceful mountain sanctuary"
          fill
          className="object-cover"
          priority
        />
        {/* Subtle overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/20 to-white/10"></div>
      </div>

      {/* Animated Background Elements - Subtle */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-amber-200/20 rounded-full blur-[80px] animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-amber-300/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '-3s' }}></div>
      </div>

      <main className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
        {/* Left Column - Branding */}
        <div className="w-full lg:w-1/2 space-y-6 text-center lg:text-left backdrop-blur-sm rounded-3xl p-6 lg:p-8 bg-white/20">
          {/* Logo */}
          <div className="flex items-center justify-center lg:justify-start gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl flex items-center justify-center shadow-xl shadow-amber-900/30">
              <span className="material-symbols-outlined text-white text-2xl">self_improvement</span>
            </div>
            <h1 className="font-serif text-3xl md:text-4xl font-black text-gray-800 tracking-tight">WalkWithMe</h1>
          </div>
          
          {/* Hero Text */}
          <div className="space-y-3">
            <h2 className="font-serif text-2xl md:text-3xl font-semibold text-gray-800 leading-tight">
              Your Digital Sanctuary for
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-700 to-amber-800">
                Spiritual Growth
              </span>
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed max-w-md mx-auto lg:mx-0">
              Find stillness in a noisy world. Track daily verses, journal your thoughts, 
              and grow in faith with a community of believers.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto lg:mx-0 pt-4">
            {[
              { icon: 'menu_book', label: 'Daily Bible' },
              { icon: 'edit_note', label: 'Journal' },
              { icon: 'forum', label: 'Community' },
              { icon: 'psychology', label: 'AI Insights' },
            ].map((feature) => (
              <div key={feature.label} className="flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-xl px-3 py-2 border border-white/70">
                <span className="material-symbols-outlined text-amber-700 text-[16px]">{feature.icon}</span>
                <span className="text-[9px] font-bold text-gray-700 uppercase tracking-wider">{feature.label}</span>
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="hidden lg:block mt-8 p-4 bg-white/40 backdrop-blur-md rounded-2xl border border-white/60 max-w-md">
            <div className="flex gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full flex items-center justify-center text-white text-[12px] font-bold">JD</div>
              <div>
                <p className="text-[11px] text-gray-700 italic">"WalkWithMe has transformed my daily quiet time. The peaceful design makes it feel so serene!"</p>
                <p className="text-[9px] font-bold text-amber-700 mt-1">— Sarah Johnson</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Auth Card */}
        <div className="w-full lg:w-[480px]">
          <Suspense fallback={
            <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-10 h-[500px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <span className="material-symbols-outlined animate-spin text-amber-600 text-3xl">sync</span>
                <p className="text-xs text-gray-600">entering sanctuary...</p>
              </div>
            </div>
          }>
            <AuthForm />
          </Suspense>
        </div>
      </main>
    </div>
  );
}