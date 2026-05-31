'use client';

import { useEffect, useRef } from 'react';
import { useChat } from 'ai/react';
import Sidebar from '@/app/layout-components/Sidebar';
import MainHeader from '@/app/layout-components/Header';
import { AIChatInput } from './AIChatInput';

export default function SpiritualWalker() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: '/api/ai/chat',
    initialMessages: [
      {
        id: '1',
        role: 'assistant',
        content: "Welcome back, seeker. How does your heart feel as you walk into this new day? I am here to reflect with you on the Word or simply listen to your thoughts.",
      }
    ],
  });

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  return (
    <div className="flex min-h-screen bg-[#FDFDFF]">
      {/* Structural Layout Components */}
      <Sidebar />
      <MainHeader />

      {/* Main Container Frame */}
      <div className="flex-1 lg:ml-64 pt-24 h-[calc(100vh-2px)] flex overflow-hidden w-full">
        
        {/* Left Column: Core Chat Thread Frame */}
        <main className="flex-1 flex flex-col relative min-w-0 bg-white border-r border-gray-100">
          {/* Background Ambient Textures */}
          <div className="absolute inset-0 pointer-events-none z-0 opacity-30">
            <div className="absolute top-[-10%] left-[-10%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]"></div>
          </div>

          {/* Sub-Header Detail layer */}
          <div className="px-8 py-4 border-b border-gray-50 flex items-center justify-between bg-white/80 backdrop-blur-md relative z-10">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
                Sanctuary AI Session
              </p>
            </div>
            <span className="px-4 py-1 bg-gray-50 text-gray-400 text-[9px] font-black rounded-full uppercase tracking-widest">
              Streaming Active
            </span>
          </div>

          {/* Messages Feed Viewport */}
          <section 
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-6 py-8 space-y-8 relative z-10 custom-scrollbar bg-transparent"
          >
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}
              >
                <div 
                  className={`max-w-[85%] md:max-w-[75%] p-5 rounded-[2rem] text-sm leading-relaxed transition-all ${
                    msg.role === 'user' 
                      ? 'bg-[#3C3830] text-white rounded-tr-none font-sans font-medium shadow-md shadow-black/5' 
                      : 'bg-gray-50/70 text-[#3C3830] border border-gray-100 rounded-tl-none font-serif italic'
                  }`}
                >
                  {msg.content}
                </div>
                
                <div className="mt-2 px-2 text-[9px] font-black uppercase tracking-widest text-gray-300 flex items-center gap-2">
                  <span>{msg.role === 'user' ? 'Seeker' : 'Walker'}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-200"></span>
                  <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}

            {/* Dynamic Real-time Typing Indicator */}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex flex-col items-start animate-in fade-in duration-200">
                <div className="bg-gray-50/70 border border-gray-100 p-4 rounded-[2rem] rounded-tl-none">
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-primary/40 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Prompt Entry Input Dock */}
          <footer className="p-6 bg-white border-t border-gray-50 relative z-10">
            <AIChatInput 
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
            <p className="text-center text-[9px] text-gray-300 uppercase tracking-[0.3em] font-black mt-4">
              Deep Wisdom • Pure Intuition
            </p>
          </footer>
        </main>

        {/* Right Column: Sponsored Content & Ecosystem Ads Panel */}
        <aside className="w-80 hidden xl:flex flex-col bg-gray-50/50 p-6 space-y-6 overflow-y-auto">
          <div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
              Community & Resources
            </h3>
          </div>

          {/* Advertisement Slot Alpha */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm group hover:border-primary/20 transition-all cursor-pointer">
            <span className="px-2.5 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37] text-[8px] font-black rounded uppercase tracking-wider inline-block mb-3">
              Partner Spotlight
            </span>
            <h4 className="font-serif font-bold text-sm text-[#3C3830] mb-2 group-hover:text-primary transition-colors">
              The Legacy Print Journal
            </h4>
            <p className="text-xs text-[#7C7565] leading-relaxed mb-4">
              Transform your digital reflection archives into a premium, linen-bound physical legacy keepsake book.
            </p>
            <div className="text-[9px] font-black uppercase tracking-wider text-primary flex items-center gap-1">
              <span>Explore Collection</span>
              <span className="material-symbols-outlined text-xs group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
            </div>
          </div>

          {/* Advertisement Slot Beta */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm group hover:border-primary/20 transition-all cursor-pointer">
            <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[8px] font-black rounded uppercase tracking-wider inline-block mb-3">
              Ecosystem Update
            </span>
            <h4 className="font-serif font-bold text-sm text-[#3C3830] mb-2 group-hover:text-primary transition-colors">
              Guided Meditation Retreats
            </h4>
            <p className="text-xs text-[#7C7565] leading-relaxed mb-4">
              Join live global audio sessions this weekend for coordinated communal prayer and structured quiet contemplation.
            </p>
            <div className="text-[9px] font-black uppercase tracking-wider text-primary flex items-center gap-1">
              <span>Reserve Seat</span>
              <span className="material-symbols-outlined text-xs group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
            </div>
          </div>

          {/* Sticky Platform Footnote Notice */}
          <div className="pt-4 border-t border-gray-200/50 mt-auto">
            <p className="text-[10px] text-gray-400 italic leading-relaxed text-center font-serif">
              "A word fitly spoken is like apples of gold in settings of silver."
            </p>
          </div>
        </aside>

      </div>
    </div>
  );
}