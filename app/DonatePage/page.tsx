'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Sidebar from '@/app/layout-components/Sidebar';
import MainHeader from '@/app/layout-components/Header';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

// Constants
const DONATION_AMOUNTS = [2000, 5000, 10000, 25000];

export default function DonatePage() {
  const { data: session } = useSession();
  const [amount, setAmount] = useState<number | string>(5000);
  const [frequency, setFrequency] = useState<'once' | 'monthly'>('once');
  const [customEmail, setCustomEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Derive the target email for the receipt payload
  const userEmail = session?.user?.email || customEmail;

  const handlePaystackPayment = async (e: React.FormEvent) => {
    e.preventDefault();

    const numericalAmount = Number(amount);
    if (!numericalAmount || numericalAmount < 100) {
      toast.error('Please enter a valid amount (Minimum ₦100)');
      return;
    }

    if (!userEmail) {
      toast.error('Please provide a valid email address for your payment receipt.');
      return;
    }

    setIsLoading(true);

    try {
      const PaystackModule = await import('@paystack/inline-js');
      const PaystackPop = PaystackModule.default;
      const popup = new PaystackPop();

      popup.newTransaction({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
        email: userEmail,
        amount: numericalAmount * 100,
        currency: 'NGN',
        channels: ['card', 'bank_transfer', 'ussd', 'qr'],
        metadata: {
          custom_fields: [
            {
              display_name: "Giving Type",
              variable_name: "giving_type",
              value: frequency === 'monthly' ? "Monthly Sowing" : "One-Time Seed"
            },
            {
              display_name: "Platform Context",
              variable_name: "platform_context",
              value: "WalkWithMe Sanctuary App"
            }
          ]
        },
        onSuccess: (transaction: { reference: string }) => {
          toast.success(`Thank you! Seed verified. Ref: ${transaction.reference}`);
          setIsLoading(false);
        },
        onCancel: () => {
          toast.error('Payment framework dismissed.');
          setIsLoading(false);
        },
        onError: () => {
          toast.error('An error occurred opening the payment portal.');
          setIsLoading(false);
        }
      });

    } catch (error) {
      console.error('Paystack initialization failure:', error);
      toast.error('Could not initialize the secure payment system.');
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen bg-gradient-to-br from-blue-50/30 via-white/40 to-indigo-50/30">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1446329813274-7c9036bd9a1f?auto=format&fit=crop&q=80&w=2070"
          alt="Peaceful sanctuary background"
          fill
          className="object-cover scale-110 blur-xl opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/30"></div>
      </div>

      <Sidebar />
      <MainHeader />

      <div className="relative z-10 flex-1 lg:ml-56 pt-20 h-screen flex overflow-hidden">
        
        {/* LEFT COLUMN: Production Giving Form */}
        <main className="flex-1 overflow-y-auto px-6 md:px-10 pb-20 custom-scrollbar">
          <header className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-px bg-gray-400/40" />
              <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em]">Support the Vision</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-serif text-gray-800 mb-3">Contribute to the Sanctuary</h1>
            <p className="text-sm text-gray-600 italic border-l-2 border-indigo-400 pl-4 max-w-xl">
              Your contribution keeps the Sanctuary focused, running on high-speed infrastructure, and entirely ad-free.
            </p>
          </header>

          <form onSubmit={handlePaystackPayment} className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-6 md:p-8 shadow-2xl max-w-2xl">
            {/* Frequency Toggle */}
            <div className="flex bg-white/30 p-1 rounded-xl mb-8 w-fit">
              <button 
                type="button"
                onClick={() => setFrequency('once')}
                className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                  frequency === 'once' 
                    ? 'bg-white text-gray-800 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                One-Time
              </button>
              <button 
                type="button"
                onClick={() => setFrequency('monthly')}
                className={`px-6 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                  frequency === 'monthly' 
                    ? 'bg-white text-gray-800 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Monthly Sowing
              </button>
            </div>

            {/* Quick Amount Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
              {DONATION_AMOUNTS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`py-5 rounded-xl border-2 transition-all font-serif text-base ${
                    Number(amount) === val 
                      ? 'border-indigo-500 bg-indigo-500/10 text-gray-800' 
                      : 'border-gray-200 text-gray-400 hover:border-gray-300 hover:text-gray-600'
                  }`}
                >
                  ₦{val.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Input Amount Fields */}
            <div className="space-y-5 mb-8">
              <div>
                <label className="block text-[9px] font-black uppercase tracking-wider text-gray-500 mb-2">
                  Contribution Amount (NGN)
                </label>
                <div className="relative">
                  <span className="absolute left-5 top-1/2 -translate-y-1/2 text-lg font-serif text-gray-400">₦</span>
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter custom amount"
                    required
                    className="w-full bg-white/50 border border-gray-200 rounded-xl py-4 pl-12 pr-5 text-base font-serif focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Dynamic Email Field fallback if session isn't loaded */}
              {!session?.user?.email && (
                <div className="animate-in fade-in duration-300">
                  <label className="block text-[9px] font-black uppercase tracking-wider text-gray-500 mb-2">
                    Email Address for Receipt
                  </label>
                  <input 
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="you@example.com"
                    required={!session?.user?.email}
                    className="w-full bg-white/50 border border-gray-200 rounded-xl py-3 px-5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:bg-white transition-all"
                  />
                </div>
              )}
            </div>

            {/* Submit Action Block */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl text-[10px] font-black tracking-[0.2em] uppercase hover:shadow-xl hover:shadow-indigo-500/25 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Opening Secure Portal...</span>
                </>
              ) : (
                <>
                  <span>Proceed to Payment</span>
                  <span className="material-symbols-outlined text-sm">arrow_forward</span>
                </>
              )}
            </button>
            
            <p className="text-center text-[8px] text-gray-400 uppercase tracking-wider mt-6 flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[12px]">lock</span>
              Cards, Transfers, USSD processed securely via Paystack
            </p>
          </form>
        </main>

        {/* RIGHT COLUMN: Value Assertions */}
        <aside className="w-96 hidden xl:flex flex-col bg-white/30 backdrop-blur-sm p-6 space-y-6 overflow-y-auto border-l border-white/40">
          <div className="flex items-center gap-2">
            <div className="w-6 h-px bg-gray-400/40" />
            <h3 className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em]">Where it goes</h3>
          </div>
          
          <div className="space-y-6">
            <div className="group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <span className="material-symbols-outlined text-indigo-600 text-[16px]">database</span>
                </div>
                <h4 className="font-serif font-semibold text-gray-800 text-sm">Secure, Private Compute</h4>
              </div>
              <p className="text-[10px] text-gray-600 leading-relaxed pl-11">
                Fuels the isolated database structures protecting your private journals and streaming configurations.
              </p>
            </div>

            <div className="group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <span className="material-symbols-outlined text-indigo-600 text-[16px]">psychology</span>
                </div>
                <h4 className="font-serif font-semibold text-gray-800 text-sm">Advanced Spiritual AI</h4>
              </div>
              <p className="text-[10px] text-gray-600 leading-relaxed pl-11">
                Powers fine-tuning loops for context-accurate cross-referencing and contextual wisdom outputs.
              </p>
            </div>

            <div className="group">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                  <span className="material-symbols-outlined text-indigo-600 text-[16px]">cloud</span>
                </div>
                <h4 className="font-serif font-semibold text-gray-800 text-sm">Global Infrastructure</h4>
              </div>
              <p className="text-[10px] text-gray-600 leading-relaxed pl-11">
                Ensures fast, reliable access to the Sanctuary from anywhere in the world.
              </p>
            </div>
          </div>

          <div className="mt-auto p-5 bg-gradient-to-br from-indigo-900 to-indigo-800 rounded-2xl text-white">
            <p className="text-xs italic font-serif leading-relaxed text-white/80 mb-3">
              "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion."
            </p>
            <p className="text-[8px] font-black tracking-wider uppercase text-indigo-300">
              — 2 Corinthians 9:7
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}