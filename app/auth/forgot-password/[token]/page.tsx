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
    <div className="bg-[#FDFDFF] text-[#3C3830] min-h-screen w-screen flex flex-col font-sans selection:bg-[#D4AF37]/10">
      <header className="w-full py-6 md:px-20 max-w-7xl mx-auto flex justify-center md:justify-start">
        <h1 className="font-serif text-2xl font-bold text-[#D4AF37] tracking-[0.05em]">WalkWithMe</h1>
      </header>

      <main className="flex-grow flex items-center justify-center relative px-6 py-12">
        {/* Background Accents */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#D4AF37]/5 blur-[100px]"></div>
        </div>

        <section className="relative z-10 w-full max-w-[480px] animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <div className="bg-white border border-gray-100 rounded-[32px] p-8 md:p-12 shadow-xl shadow-[#D4AF37]/5">
            
            {!isSuccess ? (
              <>
                <div className="text-center mb-10">
                  <div className="w-16 h-16 bg-[#D4AF37]/5 text-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="material-symbols-rounded !text-3xl" style={{ fontVariationSettings: "'wght' 300" }}>verified_user</span>
                  </div>
                  <h2 className="font-serif text-3xl font-medium text-[#3C3830] mb-3 tracking-tight">Secure Your Account</h2>
                  <p className="text-sm text-[#7C7565] leading-relaxed font-serif italic">
                    Choose a strong, memorable password to re-enter your sanctuary.
                  </p>
                </div>

                <form onSubmit={handleUpdatePassword} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] ml-1">New Password</label>
                      <input 
                        required 
                        type="password"
                        className="w-full bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/5 px-5 py-4 rounded-2xl text-sm transition-all outline-none"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] ml-1">Confirm New Password</label>
                      <input 
                        required 
                        type="password"
                        className="w-full bg-gray-50/50 border border-gray-100 focus:bg-white focus:ring-4 focus:ring-[#D4AF37]/5 px-5 py-4 rounded-2xl text-sm transition-all outline-none"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  <button 
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#D4AF37] to-[#C19A28] text-white py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:shadow-xl hover:shadow-[#D4AF37]/20 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                  >
                    {loading ? 'Updating Credentials...' : 'Restore Access'}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-4 animate-in fade-in zoom-in-95 duration-500">
                <div className="w-16 h-16 bg-[#D4AF37]/5 text-[#D4AF37] rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="material-symbols-rounded !text-3xl" style={{ fontVariationSettings: "'wght' 300" }}>task_alt</span>
                </div>
                <h2 className="font-serif text-3xl font-medium text-[#3C3830] mb-3 tracking-tight">Access Restored</h2>
                <p className="text-sm text-[#7C7565] leading-relaxed mb-8 font-serif italic">
                  Your password has been successfully updated. You may now return to the login gate.
                </p>
                <Link 
                  href="/auth" 
                  className="inline-block w-full bg-[#3C3830] text-white py-4 rounded-full text-xs font-black uppercase tracking-[0.2em] hover:bg-black transition-all text-center"
                >
                  Return to Login
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}