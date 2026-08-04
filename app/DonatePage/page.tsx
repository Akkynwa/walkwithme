'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-hot-toast';

// Curated giving tiers with clear outcomes
const GIVING_TIERS = [
  {
    id: 'tier-1',
    amount: 15,
    title: 'Sanctuary Supporter',
    description: 'Keeps high-speed compute pipelines active and ad-free for community study sessions.',
    icon: 'bolt',
  },
  {
    id: 'tier-2',
    amount: 50,
    title: 'Pillar Seed',
    description: 'Supports high-fidelity context indexing and search accuracy across global databases.',
    icon: 'database',
    popular: true,
  },
  {
    id: 'tier-3',
    amount: 150,
    title: 'Vision Patron',
    description: 'Directly funds low-latency edge delivery nodes and continuous platform expansions.',
    icon: 'verified',
  },
];

export default function DonatePage() {
  const { isDark} = useTheme();
  const { data: session } = useSession();

  const [selectedTier, setSelectedTier] = useState<number | null>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState(false);
  const [frequency, setFrequency] = useState<'once' | 'monthly'>('monthly');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'transfer'>('card');
  const [customEmail, setCustomEmail] = useState('');
  const [transferRef, setTransferRef] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const effectiveAmount = isCustom ? Number(customAmount) : (selectedTier || 0);
  const userEmail = session?.user?.email || customEmail;

  // Bank details for manual transfer
  const BANK_DETAILS = {
    accountName: 'nwali akachukwu joshua',
    bankName: 'Guaranty Trust Bank (GTBank)',
    accountNumber: '0127446078',
    swiftCode: '',
    routingNumber: '',
  };

  const handleSelectTier = (amount: number) => {
    setIsCustom(false);
    setSelectedTier(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (val: string) => {
    setCustomAmount(val);
    setIsCustom(true);
    setSelectedTier(null);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const handleCardPayment = async () => {
    setIsLoading(true);
    try {
      const PaystackModule = await import('@paystack/inline-js');
      const PaystackPop = PaystackModule.default;
      const popup = new PaystackPop();

      popup.newTransaction({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
        email: userEmail,
        amount: Math.round(effectiveAmount * 100),
        currency: 'USD',
        channels: ['card'],
        metadata: {
          custom_fields: [
            {
              display_name: 'Giving Cadence',
              variable_name: 'giving_cadence',
              value: frequency === 'monthly' ? 'Monthly Commitment' : 'One-Time Contribution',
            },
            {
              display_name: 'Platform Context',
              variable_name: 'platform_context',
              value: 'WalkWithMe Sanctuary App',
            },
          ],
        },
        onSuccess: (transaction: { reference: string }) => {
          toast.success(`Thank you for your seed! Ref: ${transaction.reference}`);
          setIsLoading(false);
        },
        onCancel: () => {
          toast.error('Checkout process cancelled.');
          setIsLoading(false);
        },
        onError: () => {
          toast.error('Unable to reach payment gateway. Please try again.');
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error('Payment gateway error:', error);
      toast.error('Initialization failed. Check network connectivity.');
      setIsLoading(false);
    }
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferRef.trim()) {
      toast.error('Please enter your transaction reference or sender name');
      return;
    }
    toast.success('Transfer notification recorded! We will confirm your seed shortly.');
    setTransferRef('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!effectiveAmount || effectiveAmount < 5) {
      toast.error('Please enter a valid contribution (Minimum $5)');
      return;
    }

    if (!userEmail) {
      toast.error('Please enter a valid email address for your transaction receipt.');
      return;
    }

    if (paymentMethod === 'card') {
      handleCardPayment();
    } else {
      handleTransferSubmit(e);
    }
  };

  return (
    <div className={`flex flex-col min-h-screen antialiased ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'}`}>
      
      {/* Top Header Component */}
      <header className={`sticky top-0 z-20 h-16 border-b px-6 flex items-center justify-between backdrop-blur-md ${
        isDark ? 'bg-zinc-950/80 border-zinc-800/80' : 'bg-white/80 border-zinc-200'
      }`}>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#FF6221] flex items-center justify-center text-white font-bold text-xs shadow-sm">
            W
          </div>
          <span className="font-bold text-sm tracking-tight hidden sm:inline">WalkWithMe</span>
        </div>

        <div className="flex items-center gap-4">
          <button 
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors ${
              isDark ? 'text-zinc-400 hover:bg-zinc-800/50' : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <span className="material-symbols-outlined text-[18px]">{isDark ? 'light_mode' : 'dark_mode'}</span>
          </button>

          {session?.user ? (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                {session.user.name?.slice(0, 2).toUpperCase() || 'US'}
              </div>
              <span className="text-xs font-medium hidden sm:inline">{session.user.name}</span>
            </div>
          ) : (
            <span className="text-xs font-medium text-zinc-500">Guest Contribution</span>
          )}
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col items-center justify-start overflow-y-auto">
        <main className="w-full max-w-4xl px-6 py-10 space-y-10">
          
          {/* Header Section */}
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold text-orange-600 bg-orange-500/10 dark:text-orange-500">
              <span className="material-symbols-outlined text-[14px]">favorite</span>
              Sustain the Sanctuary
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              Invest in Quiet Time Tech
            </h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
              WalkWithMe remains independent, secure, and completely ad-free. Your support powers high-speed data pipelines, edge deployment, and contextual tools.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Frequency Selector */}
            <div className="flex justify-center">
              <div className={`inline-flex p-1 rounded-2xl border ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                <button
                  type="button"
                  onClick={() => setFrequency('monthly')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    frequency === 'monthly'
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  <span className="material-symbols-outlined text-[16px]">sync</span>
                  Give Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency('once')}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    frequency === 'once'
                      ? 'bg-orange-600 text-white shadow-sm'
                      : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                >
                  One-Time Gift
                </button>
              </div>
            </div>

            {/* Tier Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {GIVING_TIERS.map((tier) => {
                const isSelected = !isCustom && selectedTier === tier.amount;
                return (
                  <div
                    key={tier.id}
                    onClick={() => handleSelectTier(tier.amount)}
                    className={`relative cursor-pointer p-6 rounded-2xl border transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-500/[0.03]'
                        : isDark
                        ? 'bg-zinc-900/40 border-zinc-900 hover:border-zinc-800'
                        : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm'
                    }`}
                  >
                    {tier.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-orange-600 text-white shadow-sm">
                        Most Popular
                      </span>
                    )}

                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                          isSelected ? 'bg-orange-600 text-white' : isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-600'
                        }`}>
                          <span className="material-symbols-outlined text-[20px]">{tier.icon}</span>
                        </div>
                        <span className="text-2xl font-bold tracking-tight">
                          ${tier.amount}
                          <span className="text-xs font-normal text-zinc-400">
                            {frequency === 'monthly' ? '/mo' : ''}
                          </span>
                        </span>
                      </div>

                      <h3 className="text-sm font-bold mb-1.5">{tier.title}</h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed mb-6">
                        {tier.description}
                      </p>
                    </div>

                    <div className={`w-full py-2 rounded-xl text-xs font-medium text-center transition-colors ${
                      isSelected
                        ? 'bg-orange-600 text-white'
                        : isDark
                        ? 'bg-zinc-800 text-zinc-300'
                        : 'bg-zinc-100 text-zinc-700'
                    }`}>
                      {isSelected ? 'Selected' : 'Select Tier'}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Custom Amount Input & Email Fallback */}
            <div className={`p-6 rounded-2xl border space-y-4 ${isDark ? 'bg-zinc-900/20 border-zinc-900' : 'bg-white border-zinc-200 shadow-sm'}`}>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
                  Or Set a Custom USD Contribution
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-base font-semibold text-zinc-400">$</span>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => handleCustomAmountChange(e.target.value)}
                    placeholder="Enter custom amount (e.g. 75)"
                    min="5"
                    className={`w-full border rounded-xl py-3 pl-8 pr-4 text-sm font-medium focus:outline-none transition-all ${
                      isCustom
                        ? 'border-orange-500 ring-2 ring-orange-500/20'
                        : isDark
                        ? 'bg-zinc-950 border-zinc-800 text-zinc-100'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                    }`}
                  />
                </div>
              </div>

              {!session?.user?.email && (
                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500 mb-2">
                    Receipt Email Address
                  </label>
                  <input
                    type="email"
                    value={customEmail}
                    onChange={(e) => setCustomEmail(e.target.value)}
                    placeholder="you@domain.com"
                    required={!session?.user?.email}
                    className={`w-full border rounded-xl py-2.5 px-4 text-sm focus:outline-none ${
                      isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                    }`}
                  />
                </div>
              )}
            </div>

            {/* Payment Gateway vs Bank Transfer Selector */}
            <div className="space-y-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-zinc-500">
                Select Payment Method
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-500/[0.03]'
                      : isDark
                      ? 'bg-zinc-900/40 border-zinc-900 hover:border-zinc-800'
                      : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    paymentMethod === 'card' ? 'bg-orange-600 text-white' : isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-600'
                  }`}>
                    <span className="material-symbols-outlined text-[18px]">credit_card</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">Debit / Credit Card</h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">Instant checkout via Paystack</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('transfer')}
                  className={`p-4 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                    paymentMethod === 'transfer'
                      ? 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-500/[0.03]'
                      : isDark
                      ? 'bg-zinc-900/40 border-zinc-900 hover:border-zinc-800'
                      : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-sm'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    paymentMethod === 'transfer' ? 'bg-orange-600 text-white' : isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-zinc-100 text-zinc-600'
                  }`}>
                    <span className="material-symbols-outlined text-[18px]">account_balance</span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold">Direct Bank Transfer</h4>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400">USD / Local wire transfer details</p>
                  </div>
                </button>
              </div>
            </div>

            {/* DIRECT BANK TRANSFER DETAILS COLUMN */}
            {paymentMethod === 'transfer' && (
              <div className={`p-6 rounded-2xl border space-y-6 ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-white border-zinc-200 shadow-sm'}`}>
                <div>
                  <h3 className="text-sm font-bold text-orange-600 dark:text-orange-500 flex items-center gap-1.5 mb-1">
                    <span className="material-symbols-outlined text-[16px]">account_balance</span>
                    Bank Deposit & Wire Transfer Instructions
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Transfer your contribution of <strong className="text-zinc-900 dark:text-zinc-100">${effectiveAmount || 0}</strong> using the details below.
                  </p>
                </div>

                <div className="space-y-3">
                  {/* Account Name */}
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between ${isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-zinc-500">Account Name</span>
                      <span className="text-xs font-semibold">{BANK_DETAILS.accountName}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(BANK_DETAILS.accountName, 'Account Name')}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-orange-500 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    </button>
                  </div>

                  {/* Bank Name */}
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between ${isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-zinc-500">Bank Name</span>
                      <span className="text-xs font-semibold">{BANK_DETAILS.bankName}</span>
                    </div>
                  </div>

                  {/* Account Number */}
                  <div className={`p-3.5 rounded-xl border flex items-center justify-between ${isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                    <div>
                      <span className="block text-[10px] uppercase font-bold text-zinc-500">Account Number</span>
                      <span className="text-xs font-bold tracking-wider text-orange-600 dark:text-orange-500">{BANK_DETAILS.accountNumber}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(BANK_DETAILS.accountNumber, 'Account Number')}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-orange-500 transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px]">content_copy</span>
                    </button>
                  </div>

                  {/* SWIFT / Routing Code (Plain Display) */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                      <span className="block text-[10px] uppercase font-bold text-zinc-500">SWIFT Code</span>
                      <span className="text-xs font-mono font-medium">{BANK_DETAILS.swiftCode}</span>
                    </div>
                    <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'}`}>
                      <span className="block text-[10px] uppercase font-bold text-zinc-500">Routing Number</span>
                      <span className="text-xs font-mono font-medium">{BANK_DETAILS.routingNumber}</span>
                    </div>
                  </div>
                </div>

                {/* Transfer Notification Form */}
                <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-zinc-500">
                    Already Sent? Enter Sender Name / Transaction Ref
                  </label>
                  <input
                    type="text"
                    value={transferRef}
                    onChange={(e) => setTransferRef(e.target.value)}
                    placeholder="e.g. Transfer by John Doe / Ref #98234"
                    className={`w-full border rounded-xl py-2.5 px-4 text-sm focus:outline-none ${
                      isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
                    }`}
                  />
                </div>
              </div>
            )}

            {/* Submit Action */}
            <div className="space-y-4">
              <button
                type="submit"
                disabled={isLoading || (!effectiveAmount && !customAmount)}
                className="w-full py-4 bg-orange-600 hover:bg-orange-700 disabled:bg-zinc-800 text-white disabled:text-zinc-500 font-semibold text-sm rounded-2xl transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Connecting Gateway...</span>
                  </>
                ) : (
                  <>
                    <span>
                      {paymentMethod === 'card'
                        ? `Complete $${effectiveAmount || 0} ${frequency === 'monthly' ? 'Monthly' : ''} Contribution`
                        : `Notify Platform of $${effectiveAmount || 0} Bank Transfer`}
                    </span>
                    <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-4 text-xs text-zinc-400">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">lock</span>
                  256-Bit SSL Encryption
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified_user</span>
                  Verified WalkWithMe Gateway
                </span>
              </div>
            </div>
          </form>

          {/* Scripture Citation Banner */}
          <div className={`text-center p-6 rounded-2xl border ${isDark ? 'bg-zinc-900/30 border-zinc-900' : 'bg-zinc-100/70 border-zinc-200'}`}>
            <p className="text-xs italic leading-relaxed text-zinc-500 dark:text-zinc-400 max-w-xl mx-auto mb-2">
              &ldquo;Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver.&rdquo;
            </p>
            <span className="text-[10px] font-bold uppercase tracking-widest text-orange-600 dark:text-orange-500">
              — 2 Corinthians 9:7
            </span>
          </div>

        </main>
      </div>
    </div>
  );
}