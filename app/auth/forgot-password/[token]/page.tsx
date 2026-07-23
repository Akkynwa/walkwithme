'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

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
      toast.error('For security, use at least 8 characters.');
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
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-zinc-100 font-sans overflow-hidden">
      
      {/* BACKGROUND CONTENT LAYER (Simulates dashboard background layout contextual frames) */}
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

      {/* MODAL OVERLAY BACKDROP */}
      <div className="absolute inset-0 bg-black/20 z-10 backdrop-blur-[2px]" />

      {/* FLOATING DIALOG CARD */}
      <div className="relative z-20 w-full max-w-[460px] bg-white rounded-md shadow-2xl overflow-hidden p-8 sm:p-10 flex flex-col justify-between min-h-[480px]">
        
        {/* ESCAPE CONTROL */}
        <Link 
          href="/auth" 
          className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600 transition-colors"
          aria-label="Close credentials view"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </Link>

        <div className="my-auto">
          {!isSuccess ? (
            <>
              {/* Heading Section */}
              <div className="mb-6">
                <h2 className="text-3xl font-sans font-semibold tracking-tight text-zinc-900 mb-2">
                  Update password.
                </h2>
                <p className="text-sm text-zinc-500 leading-normal">
                  Provide a clean, robust set of security credentials below to reconfigure account validation permissions.
                </p>
              </div>

              {/* Form Controls */}
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                
                {/* New Password Field */}
                <div className="relative">
                  <input 
                    required 
                    type={showPassword ? "text" : "password"}
                    className="w-full bg-white border border-zinc-300 focus:border-zinc-900 px-4 py-3 text-sm transition-all outline-none placeholder:text-zinc-400"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>

                {/* Confirm Password Field */}
                <div className="relative">
                  <input 
                    required 
                    type={showConfirmPassword ? "text" : "password"}
                    className="w-full bg-white border border-zinc-300 focus:border-zinc-900 px-4 py-3 text-sm transition-all outline-none placeholder:text-zinc-400"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-900 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      {showConfirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>

                {/* Password Strength Indicator */}
                {password && (
                  <div className="px-1 py-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex-1 h-[2px] bg-zinc-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-300 ${
                            password.length < 4 ? 'w-1/4 bg-zinc-400' :
                            password.length < 8 ? 'w-2/4 bg-zinc-600' :
                            'w-full bg-zinc-900'
                          }`}
                        />
                      </div>
                      <span className="text-[8px] font-bold text-zinc-500 uppercase tracking-wide">
                        {password.length < 4 ? 'Weak' : password.length < 8 ? 'Medium' : 'Strong'}
                      </span>
                    </div>
                  </div>
                )}

                <button 
                  disabled={loading}
                  type="submit"
                  className="w-full bg-zinc-900 hover:bg-zinc-800 text-white py-3.5 text-xs font-semibold tracking-wider uppercase transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="material-symbols-outlined animate-spin text-[16px]">sync</span>
                      <span>Restoring...</span>
                    </>
                  ) : (
                    'Restore Access'
                  )}
                </button>
              </form>
            </>
          ) : (
            /* Success Response State */
            <div className="text-center py-4 animate-in fade-in zoom-in-95 duration-400">
              <div className="w-12 h-12 bg-zinc-100 text-zinc-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-xl">task_alt</span>
              </div>
              <h3 className="text-2xl font-sans font-semibold tracking-tight text-zinc-900 mb-2">
                Access Restored
              </h3>
              <p className="text-sm text-zinc-500 leading-normal mb-6">
                Your password parameters have been verified and applied successfully.
              </p>
              <Link 
                href="/auth" 
                className="block w-full bg-zinc-900 hover:bg-zinc-800 text-white py-3.5 text-xs font-semibold tracking-wider uppercase transition-colors text-center"
              >
                Return to Login
              </Link>
            </div>
          )}
        </div>

        {/* Card Footer Toggle Link */}
        <div className="mt-8 pt-5 border-t border-zinc-100 text-center">
          <Link 
            href="/auth" 
            className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-zinc-600 transition-colors"
          >
            <span className="material-symbols-outlined text-base">arrow_back</span>
            <span>Back to account registration</span>
          </Link>
        </div>

      </div>
    </div>
  );
}