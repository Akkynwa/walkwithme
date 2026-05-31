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
    <div className="bg-[#FDFDFF] text-[#3C3830] min-h-screen w-screen flex flex-col font-sans selection:bg-[#D4AF37]/10">
      
      {/* Header Navigation */}
      <header className="w-full sticky top-0 bg-transparent z-50">
        <div className="flex justify-between items-center px-6 py-6 md:px-20 max-w-7xl mx-auto">
          <h1 className="font-serif text-2xl font-bold text-[#D4AF37] tracking-[0.05em]">
            WalkWithMe
          </h1>
          <button className="text-gray-400 hover:text-[#D4AF37] transition-colors">
            <span className="material-symbols-rounded" style={{ fontVariationSettings: "'wght' 300" }}>help</span>
          </button>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center relative overflow-hidden px-6 py-12">
        {/* Atmospheric Background Elements */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute -top-1/4 -right-1/4 w-[600px] h-[600px] rounded-full bg-[#D4AF37]/5 blur-[120px] animate-pulse"></div>
          <div className="absolute -bottom-1/4 -left-1/4 w-[500px] h-[500px] rounded-full bg-[#D4AF37]/5 blur-[120px] animate-pulse" style={{ animationDelay: '-3s' }}></div>
        </div>

        <section className="relative z-10 w-full max-w-[480px] animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="bg-white border border-gray-100 rounded-[32px] p-8 md:p-12 shadow-xl shadow-[#D4AF37]/5">
            
            {!isSubmitted ? (
              <>
                <div className="text-center mb-10">
                  <div className="w-16 h-16 bg-[#D4AF37]/5 text-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-rounded !text-3xl" style={{ fontVariationSettings: "'wght' 300" }}>lock_reset</span>
                  </div>
                  <h2 className="font-serif text-3xl font-medium text-[#3C3830] mb-3 tracking-tight">Forgot Your Password?</h2>
                  <p className="text-sm text-[#7C7565] leading-relaxed px-4 font-serif italic">
                    Enter your email address and we will send you a link to reset your password.
                  </p>
                </div>

                <form onSubmit={handleResetRequest} className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] ml-1">
                      Email Address
                    </label>
                    <input 
                      required 
                      type="email"
                      className="w-full bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/5 px-5 py-4 rounded-2xl text-sm transition-all outline-none text-[#3C3830]"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <button 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C19A28] text-white py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:shadow-xl hover:shadow-[#D4AF37]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    {loading ? 'Sending Request...' : (
                      <>
                        <span>Send Reset Link</span>
                        <span className="material-symbols-rounded text-sm group-hover:translate-x-1 transition-transform" style={{ fontVariationSettings: "'wght' 300" }}>arrow_forward</span>
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-16 h-16 bg-[#D4AF37]/5 text-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-rounded !text-3xl" style={{ fontVariationSettings: "'wght' 300" }}>mark_email_read</span>
                </div>
                <h2 className="font-serif text-3xl font-medium text-[#3C3830] mb-3 tracking-tight">Link Sent</h2>
                <p className="text-sm text-[#7C7565] leading-relaxed mb-8 px-4 font-serif italic">
                  If an account exists for <span className="text-[#3C3830] font-sans not-italic font-bold">{email}</span>, you will receive a reset link shortly. Please check your inbox.
                </p>
                <Link 
                  href="/auth/signin" 
                  className="inline-block w-full bg-gradient-to-r from-[#D4AF37] to-[#C19A28] text-white py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:shadow-xl hover:shadow-[#D4AF37]/20 transition-all text-center"
                >
                  Return to Login
                </Link>
              </div>
            )}

            <div className="mt-10 pt-6 border-t border-gray-100 text-center">
              <Link 
                href="/auth/signin" 
                className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 hover:text-[#D4AF37] transition-colors uppercase tracking-widest"
              >
                <span className="material-symbols-rounded text-sm" style={{ fontVariationSettings: "'wght' 400" }}>arrow_back</span>
                Back to Login
              </Link>
            </div>
          </div>

          <p className="text-center mt-8 text-xs text-[#7C7565]/60 italic px-10 leading-relaxed">
            &quot;In the quiet of your heart, you will find the way back home.&quot;
          </p>
        </section>
      </main>
    </div>
  );
}