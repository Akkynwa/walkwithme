'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';

export default function SignUpPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    termsAccepted: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error('Please enter your full name');
      return;
    }

    if (!formData.email.trim()) {
      toast.error('Please enter your email');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    if (!formData.termsAccepted) {
      toast.error('Please accept the terms and privacy policy');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
          name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to create account');
      } else {
        toast.success('Account created successfully!');
        router.push('/auth/signin');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-on-background flex items-center justify-center py-lg px-margin-mobile md:px-lg overflow-x-hidden relative select-none">
      
      {/* Atmospheric Background Blurs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div 
          className="absolute -top-[15%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary-fixed-dim/15 blur-[140px]" 
          style={{ animation: 'breathe 12s ease-in-out infinite' }}
        />
        <div 
          className="absolute -bottom-[15%] -right-[10%] w-[60%] h-[60%] rounded-full bg-tertiary-fixed/20 blur-[160px]" 
          style={{ animation: 'breathe 12s ease-in-out infinite -4s' }}
        />
      </div>

      {/* Content Layout Shell */}
      <div className="relative z-10 w-full max-w-[460px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Brand App Header Identity */}
        <div className="mb-8 text-center group">
          <div className="flex items-center justify-center gap-base mb-xs">
            <span className="material-symbols-outlined text-primary text-[42px] transition-transform duration-700 group-hover:rotate-180 ease-out fill-0">
              self_improvement
            </span>
            <h1 className="font-display-lg text-display-lg-mobile text-primary tracking-tight font-serif font-bold">
              WalkWithMe
            </h1>
          </div>
        </div>

        {/* Modular Authentication Card Context */}
        <div className="bg-surface-container-lowest rounded-2xl p-6 md:p-8 border border-outline-variant/30 shadow-2xl shadow-on-background/[0.015] backdrop-blur-md">
          <div className="mb-8">
            <h2 className="font-headline-md text-headline-md text-on-surface tracking-tight font-serif font-bold mb-1.5">
              Create Your Sanctuary
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant/80 font-medium">
              Join our spiritual community today
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 mb-6">
            
            {/* Split row matching initial form setup state updates */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="firstName" className="font-label-md text-xs font-black uppercase tracking-widest text-on-surface-variant/80 ml-0.5 block">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="John"
                  disabled={loading}
                  required
                  className="w-full bg-surface-container-low border border-outline-variant/10 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 px-4 py-3.5 rounded-xl font-label-md text-sm text-on-surface placeholder:text-outline/40 transition-all duration-300 font-medium outline-none"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="lastName" className="font-label-md text-xs font-black uppercase tracking-widest text-on-surface-variant/80 ml-0.5 block">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Doe"
                  disabled={loading}
                  required
                  className="w-full bg-surface-container-low border border-outline-variant/10 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 px-4 py-3.5 rounded-xl font-label-md text-sm text-on-surface placeholder:text-outline/40 transition-all duration-300 font-medium outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="email" className="font-label-md text-xs font-black uppercase tracking-widest text-on-surface-variant/80 ml-0.5 block">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@example.com"
                disabled={loading}
                required
                className="w-full bg-surface-container-low border border-outline-variant/10 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 px-4 py-3.5 rounded-xl font-label-md text-sm text-on-surface placeholder:text-outline/40 transition-all duration-300 font-medium outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="font-label-md text-xs font-black uppercase tracking-widest text-on-surface-variant/80 ml-0.5 block">
                Create Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Min. 8 characters"
                  disabled={loading}
                  required
                  className="w-full bg-surface-container-low border border-outline-variant/10 focus:border-primary/40 focus:ring-4 focus:ring-primary/5 pl-4 pr-12 py-3.5 rounded-xl font-label-md text-sm text-on-surface placeholder:text-outline/40 transition-all duration-300 font-medium outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/60 hover:text-on-surface transition-colors p-1 flex items-center justify-center rounded-lg"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            {/* Checkbox wrapper structure */}
            <div className="flex items-start gap-3 py-1 select-none">
              <div className="relative flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  checked={formData.termsAccepted}
                  onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                  className="w-4 h-4 rounded border-outline-variant/60 text-primary focus:ring-primary/30 transition-all cursor-pointer bg-surface-container-low"
                />
              </div>
              <label htmlFor="terms" className="font-label-sm text-xs font-medium text-secondary leading-normal cursor-pointer">
                I agree to the{' '}
                <Link href="#" className="text-primary font-semibold hover:underline transition-colors decoration-primary/30 underline-offset-2">
                  Terms of Service
                </Link>
                {' '}and{' '}
                <Link href="#" className="text-primary font-semibold hover:underline transition-colors decoration-primary/30 underline-offset-2">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-enter w-full bg-primary text-on-primary py-4 px-6 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/10 hover:opacity-95 active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none mt-2"
            >
              {loading ? 'Creating Sanctuary...' : 'Create Your Sanctuary'}
            </button>
          </form>

          {/* Card Structural Footer Divider Split */}
          <div className="pt-5 border-t border-outline-variant/30 text-center">
            <p className="font-label-sm text-xs font-medium text-secondary">
              Already have an account?{' '}
              <Link href="/auth/signin" className="text-primary font-bold hover:underline transition-colors decoration-primary/30 underline-offset-2 ml-1">
                Log in
              </Link>
            </p>
          </div>
        </div>

        {/* Polished Bottom Testimonial */}
        <div className="mt-6 px-4 text-center opacity-60 hover:opacity-85 transition-opacity duration-500 max-w-[400px] mx-auto">
          <p className="font-label-sm text-xs text-secondary italic leading-relaxed">
            {`"A beautiful tool for keeping my spiritual life consistent and grounded. The interface itself feels like a prayer."`}
          </p>
          <p className="font-label-sm text-[11px] font-black uppercase tracking-widest text-on-surface-variant/80 mt-2">
            — Sarah K., User since 2023
          </p>
        </div>
      </div>
    </main>
  );
}