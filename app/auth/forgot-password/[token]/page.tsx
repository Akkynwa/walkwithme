'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import Image from 'next/image';

export default function SetNewPasswordPage() {
  const params = useParams();
  const token = params?.token as string;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    if (password.length < 8) {
      toast.error('For your sanctuary security, use at least 8 characters.');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/auth/update-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });

      if (response.ok) {
        setIsSuccess(true);
        toast.success('Your credentials have been restored.');
      } else {
        const data = await response.json();
        toast.error(data.error || 'This link may have expired.');
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

      {/* Header */}
      <header className="relative z-10 w-full sticky top-0 bg-transparent">
        <div className="flex justify-center md:justify-start items-center px-6 py-6 md:px-12 max-w-7xl mx-auto">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-br from-amber-600 to-amber-700 rounded-xl flex items-center justify-center shadow-lg shadow-amber-900/30">
              <span className="material-symbols-outlined text-white text-[18px]">self_improvement</span>
            </div>
            <h1 className="font-serif text-xl font-black text-gray-800 tracking-tight">
              WalkWithMe
            </h1>
          </Link>
        </div>
      </header>

      <main className="relative z-10 flex-grow flex items-center justify-center px-6 py-12">
        <section className="w-full max-w-[480px] animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 md:p-10 border border-white/80 shadow-2xl">
            
            {!isSuccess ? (
              <>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-amber-100/50 text-amber-700 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'wght' 300" }}>verified_user</span>
                  </div>
                  <h2 className="font-serif text-2xl md:text-3xl font-semibold text-gray-800 mb-3 tracking-tight">Secure Your Account</h2>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Choose a strong, memorable password to re-enter your sanctuary.
                  </p>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-6">
                  <div className="space-y-4">
                    {/* New Password Field */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-wider text-amber-700 ml-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">lock</span>
                        New Password
                      </label>
                      <div className="relative">
                        <input 
                          required 
                          type={showPassword ? "text" : "password"}
                          className="w-full bg-white/60 border border-gray-200/60 focus:bg-white focus:border-amber-300 focus:ring-2 focus:ring-amber-500/20 px-5 py-4 rounded-xl text-sm transition-all outline-none text-gray-800 pr-12"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-600 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {showPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                    </div>

                    {/* Confirm Password Field */}
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black uppercase tracking-wider text-amber-700 ml-1 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">verified</span>
                        Confirm New Password
                      </label>
                      <div className="relative">
                        <input 
                          required 
                          type={showConfirmPassword ? "text" : "password"}
                          className="w-full bg-white/60 border border-gray-200/60 focus:bg-white focus:border-amber-300 focus:ring-2 focus:ring-amber-500/20 px-5 py-4 rounded-xl text-sm transition-all outline-none text-gray-800 pr-12"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-amber-600 transition-colors"
                        >
                          <span className="material-symbols-outlined text-[18px]">
                            {showConfirmPassword ? 'visibility_off' : 'visibility'}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Password Strength Indicator */}
                  {password && (
                    <div className="px-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div 
                            className={`h-full transition-all duration-300 ${
                              password.length < 4 ? 'w-1/4 bg-red-500' :
                              password.length < 8 ? 'w-2/4 bg-yellow-500' :
                              'w-full bg-green-500'
                            }`}
                          />
                        </div>
                        <span className="text-[8px] font-bold text-gray-500 uppercase">
                          {password.length < 4 ? 'Weak' : password.length < 8 ? 'Medium' : 'Strong'}
                        </span>
                      </div>
                      <p className="text-[8px] text-gray-400">
                        {password.length < 8 ? `Add ${8 - password.length} more characters` : 'Great password strength!'}
                      </p>
                    </div>
                  )}

                  <button 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-4 rounded-xl text-[11px] font-black uppercase tracking-wider hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
                        Updating Credentials...
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">restore</span>
                        Restore Access
                      </span>
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-16 h-16 bg-green-100/50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'wght' 300" }}>task_alt</span>
                </div>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold text-gray-800 mb-3 tracking-tight">Access Restored</h2>
                <p className="text-sm text-gray-600 leading-relaxed mb-6">
                  Your password has been successfully updated. You may now return to the login gate.
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
            "Your sanctuary is secure. Guard your heart and your path."
          </p>
        </section>
      </main>
    </div>
  );
}