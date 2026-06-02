'use client';

import { useEffect, useRef, useState } from 'react';
import { useChat } from 'ai/react';
import Sidebar from '@/app/layout-components/Sidebar';
import MainHeader from '@/app/layout-components/Header';
import { AIChatInput } from './AIChatInput';

export default function SpiritualWalker() {
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  
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
    <div className="flex min-h-screen bg-[#F4F7F5] selection:bg-[#4d6054]/10 text-[#161c22]">
      {/* Structural Layout Components */}
      <Sidebar />
      <MainHeader />

      {/* Main Container Frame */}
      <div className="flex-1 lg:ml-64 pt-20 h-screen flex overflow-hidden w-full relative">
        
        {/* Left Column: Core Chat Thread Frame */}
        <main className="flex-1 flex flex-col relative min-w-0 bg-white/40 backdrop-blur-md">
          
          {/* Background Ambient Textures (Added Sanctuary Sage and Light Orange Glows) */}
          <div className="absolute inset-0 pointer-events-none z-0 opacity-40">
            <div className="absolute top-[-10%] left-[-10%] w-[350px] md:w-[500px] h-[350px] md:h-[500px] bg-[#4d6054]/10 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[20%] right-[-10%] w-[300px] md:w-[450px] h-[300px] md:h-[450px] bg-[#f7ebd9] rounded-full blur-[100px]" style={{ animationDelay: '-3s' }}></div>
          </div>

          {/* Sub-Header Detail layer */}
          <div className="px-4 md:px-8 py-4 border-b border-[#4d6054]/10 flex items-center justify-between bg-white/70 backdrop-blur-md relative z-10">
            <div className="flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <p className="text-[10px] font-black text-[#434844]/60 uppercase tracking-[0.2em]">
                Sanctuary AI Session
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-[#4d6054]/10 text-[#4d6054] text-[9px] font-bold rounded-full uppercase tracking-widest hidden sm:inline-block">
                Streaming Active
              </span>
              {/* Mobile Right Panel Toggle button */}
              <button 
                type="button"
                onClick={() => setIsRightPanelOpen(!isRightPanelOpen)}
                className="xl:hidden p-2 rounded-full hover:bg-[#4d6054]/10 text-[#4d6054] transition-colors"
                title="Toggle Resources"
              >
                <span className="material-symbols-outlined text-xl">auto_awesome_mosaic</span>
              </button>
            </div>
          </div>

          {/* Messages Feed Viewport */}
          <section 
            ref={scrollRef}
            className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-6 relative z-10 bg-transparent scrollbar-thin scrollbar-thumb-[#4d6054]/20"
          >
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} animate-in fade-in slide-in-from-bottom-3 duration-500`}
              >
                <div 
                  className={`max-w-[90%] md:max-w-[78%] p-4 md:p-5 rounded-[2rem] text-[14px] md:text-[15px] leading-relaxed transition-all shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-[#4d6054] text-white rounded-tr-none font-sans font-medium shadow-[#4d6054]/10' 
                      : 'bg-white/80 border border-[#4d6054]/10 text-[#434844] rounded-tl-none font-serif italic backdrop-blur-md shadow-black/[0.01]'
                  }`}
                >
                  {msg.content}
                </div>
                
                <div className="mt-1.5 px-3 text-[9px] font-black uppercase tracking-widest text-[#434844]/40 flex items-center gap-2">
                  <span className={msg.role === 'user' ? 'text-[#4d6054]' : 'text-[#e0a96d]'}>
                    {msg.role === 'user' ? 'Seeker' : 'Walker'}
                  </span>
                  <span className="w-1 h-1 rounded-full bg-[#434844]/20"></span>
                  <span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>
            ))}

            {/* Dynamic Real-time Typing Indicator */}
            {isLoading && messages[messages.length - 1]?.role === 'user' && (
              <div className="flex flex-col items-start animate-in fade-in duration-200">
                <div className="bg-white/80 border border-[#4d6054]/10 p-4 rounded-[2rem] rounded-tl-none backdrop-blur-sm">
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#4d6054]/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 bg-[#4d6054]/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 bg-[#4d6054]/50 rounded-full animate-bounce"></span>
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Prompt Entry Input Dock */}
          <footer className="p-4 md:p-6 bg-white/70 backdrop-blur-lg border-t border-[#4d6054]/10 relative z-10">
            <AIChatInput 
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              isLoading={isLoading}
            />
            <p className="text-center text-[9px] text-[#434844]/40 uppercase tracking-[0.3em] font-black mt-4">
              Deep Wisdom • Pure Intuition
            </p>
          </footer>
        </main>

        {/* Right Column Panel: Mobile drawer + XL Desktop Sidebar Container */}
        <aside className={`
          fixed inset-y-0 right-0 z-40 w-80 bg-white/95 xl:bg-transparent backdrop-blur-xl xl:backdrop-blur-none p-6 space-y-6 flex flex-col border-l border-[#4d6054]/10 xl:border-none
          transform transition-transform duration-300 ease-in-out mt-20 xl:mt-0 xl:relative xl:transform-none xl:pointer-events-auto
          ${isRightPanelOpen ? 'translate-x-0' : 'translate-x-full xl:translate-x-0'}
        `}>
          {/* Mobile panel Header Row */}
          <div className="flex items-center justify-between xl:hidden border-b border-[#4d6054]/10 pb-4">
            <h3 className="text-[10px] font-black text-[#434844]/60 uppercase tracking-[0.2em]">
              Resources Drawer
            </h3>
            <button 
              type="button" 
              onClick={() => setIsRightPanelOpen(false)}
              className="text-xs font-black uppercase tracking-widest text-[#4d6054]"
            >
              Close
            </button>
          </div>

          <div className="hidden xl:block">
            <h3 className="text-[10px] font-black text-[#434844]/50 uppercase tracking-[0.2em] mb-2">
              Community & Resources
            </h3>
          </div>

          {/* Advertisement/Feature Slot Alpha (Polished With Light Amber Accents) */}
          <div className="bg-white border border-[#4d6054]/10 rounded-2xl p-5 shadow-sm group hover:border-[#4d6054]/30 hover:shadow-md transition-all duration-300 cursor-pointer relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#f7ebd9]/40 rounded-full blur-xl pointer-events-none"></div>
            <span className="px-2.5 py-0.5 bg-[#e0a96d]/10 text-[#c28340] text-[8px] font-black rounded uppercase tracking-wider inline-block mb-3 border border-[#e0a96d]/20">
              Partner Spotlight
            </span>
            <h4 className="font-serif font-bold text-sm text-[#434844] mb-2 group-hover:text-[#4d6054] transition-colors">
              The Legacy Print Journal
            </h4>
            <p className="text-xs text-[#5e5e5b] leading-relaxed mb-4">
              Transform your digital reflection archives into a premium, linen-bound physical legacy keepsake book.
            </p>
            <div className="text-[9px] font-black uppercase tracking-wider text-[#4d6054] flex items-center gap-1">
              <span>Explore Collection</span>
              <span className="material-symbols-outlined text-xs group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
            </div>
          </div>

          {/* Advertisement/Feature Slot Beta (Polished with Sage Accent) */}
          <div className="bg-white border border-[#4d6054]/10 rounded-2xl p-5 shadow-sm group hover:border-[#4d6054]/30 hover:shadow-md transition-all duration-300 cursor-pointer relative overflow-hidden">
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#4d6054]/5 rounded-full blur-xl pointer-events-none"></div>
            <span className="px-2.5 py-0.5 bg-[#4d6054]/10 text-[#4d6054] text-[8px] font-black rounded uppercase tracking-wider inline-block mb-3 border border-[#4d6054]/20">
              Ecosystem Update
            </span>
            <h4 className="font-serif font-bold text-sm text-[#434844] mb-2 group-hover:text-[#4d6054] transition-colors">
              Guided Meditation Retreats
            </h4>
            <p className="text-xs text-[#5e5e5b] leading-relaxed mb-4">
              Join live global audio sessions this weekend for coordinated communal prayer and structured quiet contemplation.
            </p>
            <div className="text-[9px] font-black uppercase tracking-wider text-[#4d6054] flex items-center gap-1">
              <span>Reserve Seat</span>
              <span className="material-symbols-outlined text-xs group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
            </div>
          </div>

          {/* Sticky Platform Footnote Notice */}
          <div className="pt-4 border-t border-[#4d6054]/10 mt-auto">
            <p className="text-[10px] text-[#4d6054]/70 italic leading-relaxed text-center font-serif px-2">
              "A word fitly spoken is like apples of gold in settings of silver."
            </p>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay Dimmer */}
        {isRightPanelOpen && (
          <div 
            onClick={() => setIsRightPanelOpen(false)}
            className="fixed inset-0 z-30 bg-black/10 backdrop-blur-sm xl:hidden mt-20"
          />
        )}

      </div>
    </div>
  );
}