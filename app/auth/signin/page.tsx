/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import Link from 'next/link';

// 1. Move the logic into a Sub-Component to support Suspense
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
        toast.success('Welcome back to your sanctuary!');
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
      const response = await fetch('/api/auth/register', { // Updated path to match common naming
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
        toast.success('Account created successfully!');
        setActiveTab('login');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-6 md:p-10 border border-white shadow-xl shadow-black/[0.02]">
      {/* Tab Headers */}
      <div className="flex gap-8 mb-8 border-b border-[#c3c8c2]/20">
        {(['login', 'register'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-xs font-bold uppercase tracking-widest transition-all relative ${
              activeTab === tab ? 'text-[#4d6054]' : 'text-[#434844]/50 hover:text-[#4d6054]'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#4d6054] rounded-full" />
            )}
          </button>
        ))}
      </div>

      <div className="min-h-[380px]">
        {activeTab === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#434844]/40 ml-1">Email Address</label>
              <input 
                required type="email"
                className="w-full bg-[#eff4fc]/50 border border-white focus:bg-white focus:ring-4 focus:ring-[#4d6054]/10 px-4 py-3.5 rounded-xl text-sm transition-all outline-none"
                placeholder="name@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between px-1">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#434844]/40">Password</label>
                <Link 
  href="/auth/forgot-password" 
  className="text-[10px] font-bold text-[#4d6054] hover:underline"
>
  Forgot?
</Link>
              </div>
              <input 
                required type="password"
                className="w-full bg-[#eff4fc]/50 border border-white focus:bg-white focus:ring-4 focus:ring-[#4d6054]/10 px-4 py-3.5 rounded-xl text-sm outline-none transition-all"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
              />
            </div>
            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-[#4d6054] text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-[#4d6054]/90 active:scale-95 transition-all shadow-lg shadow-[#4d6054]/20 disabled:opacity-50"
            >
              {loading ? 'Opening Sanctuary...' : 'Enter Sanctuary'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <input 
                required className="w-full bg-[#eff4fc]/50 border border-white px-4 py-3 rounded-xl text-sm outline-none" 
                placeholder="First Name" 
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
              />
              <input 
                required className="w-full bg-[#eff4fc]/50 border border-white px-4 py-3 rounded-xl text-sm outline-none" 
                placeholder="Last Name" 
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
            <input 
              required type="email"
              className="w-full bg-[#eff4fc]/50 border border-white px-4 py-3 rounded-xl text-sm outline-none" 
              placeholder="Email Address" 
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
            <input 
              required type="password"
              className="w-full bg-[#eff4fc]/50 border border-white px-4 py-3 rounded-xl text-sm outline-none" 
              placeholder="Password (8+ chars)" 
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
            <div className="flex items-start gap-3 px-1 pt-1">
              <input 
                type="checkbox" id="terms"
                className="rounded border-[#c3c8c2] text-[#4d6054] focus:ring-[#4d6054] mt-1"
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({...formData, agreeTerms: e.target.checked})}
              />
              <label htmlFor="terms" className="text-[11px] text-[#5e5e5b] leading-tight">
                I agree to the <span className="text-[#4d6054] font-bold">Terms</span> and <span className="text-[#4d6054] font-bold">Privacy</span>.
              </label>
            </div>
            <button 
              disabled={loading}
              type="submit"
              className="w-full bg-[#4d6054] text-white py-4 rounded-xl text-xs font-bold uppercase tracking-widest shadow-lg shadow-[#4d6054]/20"
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
        )}

        <div className="mt-8">
          <div className="relative flex items-center mb-6">
            <div className="flex-grow border-t border-[#c3c8c2]/30"></div>
            <span className="px-3 text-[9px] font-black uppercase text-[#c3c8c2] tracking-[0.3em]">Easy Access</span>
            <div className="flex-grow border-t border-[#c3c8c2]/30"></div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              type="button"
              onClick={() => signIn('google', { callbackUrl: '/' })}
              className="flex items-center justify-center gap-2 border border-[#c3c8c2]/40 py-3 rounded-xl hover:bg-[#eff4fc] transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-[11px] font-bold">Google</span>
            </button>
            <button type="button" className="flex items-center justify-center gap-2 border border-[#c3c8c2]/40 py-3 rounded-xl hover:bg-[#eff4fc] transition-all">
              <span className="material-symbols-outlined text-lg">passkey</span>
              <span className="text-[11px] font-bold">Passkey</span>
            </button>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-4 border-t border-[#c3c8c2]/20 text-center">
        <p className="text-[11px] text-[#5e5e5b] font-medium">
          {activeTab === 'login' ? "New here? " : "Been here before? "}
          <button 
            type="button"
            onClick={() => setActiveTab(activeTab === 'login' ? 'register' : 'login')}
            className="text-[#4d6054] font-black hover:underline underline-offset-4"
          >
            {activeTab === 'login' ? 'Create an account' : 'Log in now'}
          </button>
        </p>
      </div>
    </div>
  );
}

// 2. Main Page Component
export default function AuthPage() {
  return (
    <div className="bg-[#f7f9ff] text-[#161c22] h-screen w-screen flex items-center justify-center p-4 md:p-8 overflow-hidden relative font-sans selection:bg-[#4d6054]/20">
      
      {/* Atmospheric Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-[#4d6054]/10 blur-[100px] animate-pulse"></div>
        <div className="absolute -bottom-20 -right-20 w-96 h-96 rounded-full bg-[#605b55]/10 blur-[120px] animate-pulse" style={{ animationDelay: '-5s' }}></div>
      </div>

      <main className="relative z-10 w-full max-w-5xl h-full max-h-[700px] flex flex-col md:flex-row items-center justify-between gap-8 md:gap-16">
        
        {/* Left Column: Branding */}
        <section className="w-full md:w-5/12 flex flex-col justify-center space-y-6">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#4d6054] text-4xl">auto_awesome</span>
            <h1 className="font-serif text-3xl font-bold text-[#4d6054] tracking-tight">WalkWithMe</h1>
          </div>
          
          <div className="space-y-2">
            <h2 className="font-serif text-2xl font-semibold text-[#434844] leading-tight">
              A Digital Sanctuary for Your Spiritual Journey.
            </h2>
            <p className="text-sm text-[#5e5e5b] leading-relaxed max-w-sm">
              Find stillness in a loud world. Track daily verses and reflect with intention in a space built for peace.
            </p>
          </div>

          <div className="hidden md:block relative w-full aspect-[4/3] max-h-[280px] rounded-2xl overflow-hidden border border-[#c3c8c2]/30 shadow-sm group">
            <img 
              alt="Serene path" 
              className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-105" 
              src="https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&q=80&w=800" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#4d6054]/60 via-transparent to-transparent"></div>
            <div className="absolute bottom-4 left-4">
              <p className="font-serif text-white text-base italic">"Be still, and know..."</p>
              <p className="text-[10px] text-white/80 uppercase tracking-widest font-bold">Daily Insight • 5m Read</p>
            </div>
          </div>
        </section>

        {/* Right Column: Auth Card with Suspense */}
        <section className="w-full md:w-[420px]">
          <Suspense fallback={
            <div className="bg-white/70 backdrop-blur-xl rounded-[32px] p-10 h-[500px] flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4d6054]"></div>
            </div>
          }>
            <AuthForm />
          </Suspense>
        </section>
      </main>
    </div>
  );
}