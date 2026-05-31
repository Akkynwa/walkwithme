'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import Sidebar from '@/app/layout-components/Sidebar';
import MainHeader from '@/app/layout-components/Header';
import { toast } from 'react-hot-toast';

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
      // Lazy load Paystack Inline JS to avoid SSR window errors
      const PaystackModule = await import('@paystack/inline-js');
      const PaystackPop = PaystackModule.default;
      const popup = new PaystackPop();

      popup.newTransaction({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
        email: userEmail,
        // Paystack expects amount in kobo (multiply Naira by 100)
        amount: numericalAmount * 100,
        currency: 'NGN',
        // Channels explicitly configured to allow Card, Bank Transfer, USSD, etc.
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
    <div className="flex min-h-screen bg-[#FDFDFF]">
      <Sidebar />
      <MainHeader />

      <div className="flex-1 lg:ml-64 pt-28 h-screen flex overflow-hidden">
        
        {/* LEFT COLUMN: Production Giving Form */}
        <main className="flex-1 overflow-y-auto px-6 md:px-12 pb-20 custom-scrollbar">
          <header className="mb-12">
            <h1 className="text-4xl font-serif text-[#3C3830] mb-3">Support the Vision</h1>
            <p className="text-[#7C7565] italic border-l-2 border-[#D4AF37] pl-4 max-w-xl">
              Your contribution keeps the Sanctuary sanctuary focused, running on high-speed infrastructure, and entirely ad-free.
            </p>
          </header>

          <form onSubmit={handlePaystackPayment} className="bg-white border border-gray-100 rounded-[32px] p-8 md:p-12 shadow-sm max-w-2xl">
            {/* Frequency Toggle */}
            <div className="flex bg-gray-50 p-1.5 rounded-2xl mb-10 w-fit">
              <button 
                type="button"
                onClick={() => setFrequency('once')}
                className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${frequency === 'once' ? 'bg-white text-[#3C3830] shadow-sm' : 'text-gray-400'}`}
              >
                One-Time
              </button>
              <button 
                type="button"
                onClick={() => setFrequency('monthly')}
                className={`px-8 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${frequency === 'monthly' ? 'bg-white text-[#3C3830] shadow-sm' : 'text-gray-400'}`}
              >
                Monthly Sowing
              </button>
            </div>

            {/* Quick Amount Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {DONATION_AMOUNTS.map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAmount(val)}
                  className={`py-6 rounded-2xl border-2 transition-all font-serif text-lg ${Number(amount) === val ? 'border-[#D4AF37] bg-[#D4AF37]/5 text-[#3C3830]' : 'border-gray-50 text-gray-400 hover:border-gray-200'}`}
                >
                  ₦{val.toLocaleString()}
                </button>
              ))}
            </div>

            {/* Input Amount Fields */}
            <div className="space-y-6 mb-10">
              <div>
                <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Contribution Amount (NGN)</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 text-xl font-serif text-gray-400">₦</span>
                  <input 
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="Enter custom amount"
                    required
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-5 pl-12 pr-6 text-xl font-serif focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/5 focus:bg-white transition-all"
                  />
                </div>
              </div>

              {/* Dynamic Email Field fallback if session isn't loaded */}
              {!session?.user?.email && (
                <div className="animate-in fade-in duration-300">
                  <label className="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Email Address for Secure Receipt</label>
                  <input 
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="you@example.com"
                    required={!session?.user?.email}
                    className="w-full bg-gray-50/50 border border-gray-100 rounded-2xl py-4 px-6 text-sm focus:outline-none focus:ring-4 focus:ring-[#D4AF37]/5 focus:bg-white transition-all"
                  />
                </div>
              )}
            </div>

            {/* Submit Action Block */}
            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-6 bg-gradient-to-r from-[#D4AF37] to-[#AA7C11] text-white rounded-full text-[11px] font-black tracking-[0.3em] uppercase hover:shadow-xl hover:shadow-[#D4AF37]/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Opening Secure Portal...</span>
                </>
              ) : (
                <>
                  <span>Proceed to Payment</span>
                  <span className="text-xs">➔</span>
                </>
              )}
            </button>
            
            <p className="text-center text-[10px] text-gray-400 uppercase tracking-widest mt-8 flex items-center justify-center gap-2">
              🔒 Cards, Transfers, USSD processed securely via Paystack
            </p>
          </form>
        </main>

        {/* RIGHT COLUMN: Value Assertions */}
        <aside className="w-96 hidden xl:flex flex-col bg-gray-50/50 p-8 space-y-8 overflow-y-auto border-l border-gray-100">
          <h3 className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em]">Where it goes</h3>
          
          <div className="space-y-6">
            <ImpactCard 
              emoji="🗄️" 
              title="Secure, Private Compute" 
              desc="Fuels the isolated database structures protecting your private journals and streaming configurations."
            />
            <ImpactCard 
              emoji="✨" 
              title="Advanced Spiritual LLMs" 
              desc="Powers fine-tuning loops for context-accurate cross-referencing and contextual wisdom outputs."
            />
          </div>

          <div className="mt-auto p-6 bg-[#3C3830] rounded-[24px] text-white">
            <p className="text-sm italic font-serif leading-relaxed opacity-80 mb-4">
              "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion."
            </p>
            <p className="text-[10px] font-black tracking-widest uppercase text-[#D4AF37]">
              — 2 Corinthians 9:7
            </p>
          </div>
        </aside>

      </div>
    </div>
  );
}

function ImpactCard({ emoji, title, desc }: { emoji: string, title: string, desc: string }) {
  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <span className="text-lg">{emoji}</span>
        <h4 className="font-serif font-bold text-[#3C3830]">{title}</h4>
      </div>
      <p className="text-xs text-[#7C7565] leading-relaxed pl-8 border-l border-gray-200 ml-2">
        {desc}
      </p>
    </div>
  );
}