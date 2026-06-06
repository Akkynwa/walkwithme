'use client';

import { useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Image from 'next/image';

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
    <div className="relative min-h-screen w-full flex flex-col font-sans overflow-hidden">
      
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=2070"
          alt="Peaceful sanctuary background"
          fill
          className="object-cover"
          priority
        />
        {/* Subtle overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-white/20 to-white/10"></div>
      </div>

      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-amber-200/20 rounded-full blur-[80px] animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-amber-300/15 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '-3s' }}></div>
      </div>
      
      {/* Header Navigation */}
      <header className="relative z-10 w-full sticky top-0 bg-transparent">
        <div className="flex justify-between items-center px-6 py-6 md:px-12 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center shadow-lg shadow-amber-900/30">
              <span className="material-symbols-outlined text-white text-[18px]">auto_awesome</span>
            </div>
            <h1 className="font-serif text-xl font-black text-gray-800 tracking-tight">
              WalkWithMe
            </h1>
          </Link>
          <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white/40 backdrop-blur-sm text-gray-600 hover:text-amber-700 hover:bg-white/60 transition-all">
            <span className="material-symbols-outlined text-[18px]">help</span>
          </button>
        </div>
      </header>

      <main className="relative z-10 flex-grow flex items-center justify-center overflow-hidden px-6 py-12">
        <section className="w-full max-w-[480px] animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/80 shadow-2xl">
            
            {!isSubmitted ? (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-amber-100/50 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'wght' 300" }}>lock_reset</span>
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl font-semibold text-gray-800 mb-3 tracking-tight">Forgot Your Password?</h2>
                  <p className="text-sm text-gray-600 leading-relaxed px-4">
                    Enter your email address and we will send you a link to reset your password.
                  </p>
                </div>

                <form onSubmit={handleResetRequest} className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black uppercase tracking-wider text-amber-700 ml-1 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">email</span>
                      Email Address
                    </label>
                    <input 
                      required 
                      type="email"
                      className="w-full bg-white/60 border border-gray-200/60 focus:bg-white focus:border-amber-300 focus:ring-2 focus:ring-amber-500/20 px-5 py-4 rounded-xl text-sm transition-all outline-none text-gray-800"
                      placeholder="hello@walkwithme.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <button 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-4 rounded-xl text-[11px] font-black uppercase tracking-wider hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
                        Sending Request...
                      </span>
                    ) : (
                      <>
                        <span>Send Reset Link</span>
                        <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-16 h-16 bg-green-100/50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'wght' 300" }}>mark_email_read</span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold text-gray-800 mb-3 tracking-tight">Link Sent</h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-6 px-4">
                  If an account exists for <span className="text-amber-700 font-bold">{email}</span>, you will receive a reset link shortly. Please check your inbox.
                </p>
                <Link 
                  href="/auth/signin" 
                  className="inline-block w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-4 rounded-xl text-[11px] font-black uppercase tracking-wider hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.02] transition-all text-center"
                >
                  Return to Login
                </Link>
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-200/50 text-center">
              <Link 
                href="/auth/signin" 
                className="inline-flex items-center gap-2 text-[9px] font-black text-gray-500 hover:text-amber-700 transition-colors uppercase tracking-wider"
              >
                <span className="material-symbols-outlined text-sm">arrow_back</span>
                Back to Login
              </Link>
            </div>
          </div>

          <p className="text-center mt-8 text-[10px] text-gray-500 italic px-10 leading-relaxed">
            "In the quiet of your heart, you will find the way back home."
          </p>
        </section>
      </main>
    </div>
  );
}