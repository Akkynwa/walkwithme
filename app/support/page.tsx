'use client';

import { useState } from 'react';
import SupportPopup from '@/components/SupportPopup';
import Sidebar from '@/app/layout-components/Sidebar';
import BackButton from '@/components/BackButton';

const FAQS = [
  {
    q: "Why isn't my daily audio devotional tracking toward my streak?",
    a: "Your streak data logs automatically once an audio chapter reaches 100% completion. If you manually skip or exit the sanctuary early, the journal ledger won't record the session data."
  },
  {
    q: "Can I retrieve study notes I wrote offline?",
    a: "Yes! The Journal Sync infrastructure caches your reflections locally in the browser. The moment your device re-establishes a stable network connection, it safely fires the transaction history directly back into your database."
  },
  {
    q: "How do I add multiple language versions like Yoruba or Igbo?",
    a: "You can toggle audio and scripture languages natively directly inside the dynamic top Selector Bar of the Quiet Time player. No additional account configuration is required."
  },
  {
    q: "My scripture audio won't stream or play, how do I fix it?",
    a: "This is usually caused by temporary network latency or CDN rate limits. Try switching translation versions (e.g., from NIV to KJV) to re-initialize your browser's audio streaming pipeline hooks."
  }
];

export default function SupportPage() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <div className="relative flex min-h-screen bg-gradient-to-b from-amber-50/20 via-white to-slate-50/40 text-slate-900 overflow-x-hidden">
      
      {/* Subtle Background Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-amber-200/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-amber-300/5 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '-3s' }} />
      </div>

      <Sidebar />

      <main className="relative z-10 lg:ml-56 flex-1 px-4 md:px-10 py-8 max-w-4xl mx-auto pb-20 w-full">
        
        {/* Dynamic Nav Row with your Right-Side BackButton layout */}
        <div className="flex items-center justify-between mb-12 border-b border-slate-200/60 pb-4">
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold tracking-widest text-amber-600">Help Desk</span>
            <h1 className="text-2xl font-serif font-black text-slate-900 mt-0.5">Support Center</h1>
          </div>
          <BackButton />
        </div>

        {/* Central Brand Identity Section */}
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 text-white p-4 shadow-md shadow-orange-500/10">
            <span className="material-symbols-outlined text-3xl font-light">live_help</span>
          </div>
          <h2 className="text-3xl font-serif font-bold text-gray-800">How can we support your walk today?</h2>
          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
            Find immediate insights regarding your audio sanctuary rooms, digital reflection ledgers, and community sharing configurations.
          </p>
        </div>

        {/* FAQ List Cards Section */}
        <div className="mb-16">
          <h3 className="mb-6 font-serif text-lg font-bold text-gray-800 flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-600 text-lg">quiz</span>
            Frequently Asked Questions
          </h3>
          
          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div 
                key={index} 
                className="rounded-xl border border-white/60 bg-white/40 backdrop-blur-md p-5 shadow-xs transition-all hover:bg-white/60 hover:border-amber-200/60 group"
              >
                <h4 className="font-sans font-semibold text-sm text-gray-800 group-hover:text-amber-800 transition-colors">
                  {faq.q}
                </h4>
                <p className="mt-2 text-xs text-gray-600 leading-relaxed font-sans">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Contact Action Banner Section */}
        <div className="rounded-2xl bg-gradient-to-br from-slate-900 via-gray-900 to-amber-950 p-8 md:p-10 text-center text-white shadow-xl relative overflow-hidden">
          {/* Subtle Decorative Background Graphic element */}
          <div className="absolute -right-10 -bottom-10 opacity-5 select-none pointer-events-none">
            <span className="material-symbols-outlined text-[12rem]">forum</span>
          </div>

          <div className="relative z-10 max-w-lg mx-auto">
            <h3 className="text-xl font-serif font-bold mb-2">Still facing technical roadblocks?</h3>
            <p className="mb-8 text-xs text-gray-400 leading-relaxed">
              If your sanctuary platform experiences runtime validation breaks or database connection faults, submit a dynamic query directly to our development desk.
            </p>
            
            <button
              onClick={() => setIsPopupOpen(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-3 text-[10px] font-sans font-black uppercase tracking-wider text-white transition-all shadow-md hover:shadow-lg hover:shadow-amber-500/20 hover:scale-[1.02]"
            >
              <span className="material-symbols-outlined text-sm">chat_bubble</span>
              Open Ticket
            </button>
          </div>
        </div>
      </main>

      <SupportPopup isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </div>
  );
}