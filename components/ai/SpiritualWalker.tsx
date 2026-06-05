'use client';

import { useEffect, useState } from 'react';
import { useChat } from 'ai/react';
import { AnimatePresence } from 'framer-motion';
import Sidebar from '@/app/layout-components/Sidebar';
import MainHeader from '@/app/layout-components/Header';
import { AIChatInput } from './AIChatInput';
import AIDevotionalCard from '../../components/ai/AIDevotionalCard';
import { DEVOTIONALS } from '../../app/data/devotionals';
import Image from 'next/image';

export default function SpiritualWalker() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Automatically cycle through devotionals every 8 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % DEVOTIONALS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/ai/chat',
    initialMessages: [
      { id: '1', role: 'assistant', content: "Welcome back, seeker. How does your heart feel today?" }
    ],
  });

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-slate-50">
      {/* GLOBAL BACKGROUND */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
          alt=""
          fill
          className="object-cover opacity-10 blur-3xl"
          priority
        />
      </div>

      <Sidebar />
      <MainHeader />

      <div className="relative z-10 flex-1 lg:pl-64 pt-16 h-screen flex overflow-hidden w-full">
        <main className="flex-1 flex flex-col relative min-w-0 bg-white/10 backdrop-blur-sm">
          
          {/* MOBILE SLIDER (Sliding Left to Right) */}
          <div className="xl:hidden w-full p-4 overflow-hidden">
            <AnimatePresence mode="wait">
              <AIDevotionalCard 
                key={`mob-${DEVOTIONALS[currentIndex].id}`} 
                item={DEVOTIONALS[currentIndex] as any} 
                isMobile={true} 
              />
            </AnimatePresence>
          </div>

          {/* CHAT SECTION */}
<section className="flex-1 overflow-y-auto px-6 py-5 space-y-6 custom-scrollbar bg-black/[0.07] backdrop-blur-md">
  {messages.map((msg) => (
    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[80%] p-4 rounded-3xl text-sm leading-relaxed ${
        msg.role === 'user' 
          ? 'bg-amber-600 text-white shadow-lg' 
          : 'bg-white/80 text-gray-800 font-serif border border-white/50 shadow-sm'
      }`}>
        {msg.content}
      </div>
    </div>
  ))}
</section>

          <footer className="p-6 bg-white/40 backdrop-blur-xl border-t border-white/20">
            <AIChatInput input={input} handleInputChange={handleInputChange} handleSubmit={handleSubmit} isLoading={isLoading} />
          </footer>
        </main>

        {/* DESKTOP SIDE PANEL (Fading In/Out One by One) */}
        <aside className="hidden xl:flex w-[400px] bg-white/30 backdrop-blur-2xl flex-col border-l border-white/20 p-8 justify-center items-center overflow-hidden">
          <div className="w-full relative">
             <div className="mb-6 text-center">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-amber-600/60">Featured Meditation</span>
             </div>
             
             <AnimatePresence mode="wait">
                  <AIDevotionalCard 
                    key={`desk-${DEVOTIONALS[currentIndex].id}`} 
                    item={DEVOTIONALS[currentIndex] as any} 
                  />
             </AnimatePresence>

             {/* Dot Indicators */}
             <div className="flex justify-center gap-2 mt-8">
                {DEVOTIONALS.map((_, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-1 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-8 bg-amber-500' : 'w-2 bg-amber-200'}`}
                  />
                ))}
             </div>
          </div>
        </aside>
      </div>
    </div>
  );
}