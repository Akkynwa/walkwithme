'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/app/context/ThemeContext';
import Sidebar from '@/app/layout-components/Sidebar';
import MainHeader from '@/app/layout-components/Header';
import { AIChatInput } from './AIChatInput';
import AIDevotionalCard from '../../components/ai/AIDevotionalCard';
import { DEVOTIONALS } from '../../app/data/devotionals';
import Image from 'next/image';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function SpiritualWalker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', content: "Welcome back, seeker. How does your heart feel today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isDark } = useTheme();

  const router = useRouter();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Helper to save chat history to the database
  const saveChatHistory = async (messagesToSave: ChatMessage[]) => {
    if (messagesToSave.length === 0) return;
    
    setIsSaving(true);
    try {
      const res = await fetch('/api/chat/history', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: messagesToSave }),
      });
      
      if (!res.ok) {
        console.error('Failed to save chat history');
      }
    } catch (e) {
      console.error('Error saving chat history:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { id: Date.now().toString(), role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let assistantMessage: ChatMessage = { id: Date.now().toString(), role: 'assistant', content: '' };

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          assistantMessage.content += decoder.decode(value);
          setMessages(prev => {
            const updated = [...prev];
            if (updated[updated.length - 1]?.role === 'assistant') {
              updated[updated.length - 1] = assistantMessage;
            } else {
              updated.push(assistantMessage);
            }
            return updated;
          });
        }

        await saveChatHistory([...newMessages, assistantMessage]);
      }
    } catch (e) {
      console.error('Error sending message:', e);
    } finally {
      setIsLoading(false);
    }
  };

  // Cycle through devotionals
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % DEVOTIONALS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Load persistent chat history from database on mount
  useEffect(() => {
    const loadHistory = async () => {
      try {
        const res = await fetch('/api/chat/history');
        if (res.ok) {
          const history = await res.json();
          if (history && history.length > 0) {
            setMessages(history);
          }
        }
      } catch (e) { 
        console.error("Could not load history", e); 
      }
    };
    loadHistory();
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const activeDevotional = DEVOTIONALS[currentIndex];

  return (
    <div className={`relative flex min-h-screen overflow-hidden antialiased font-sans transition-colors duration-300 ${
      isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-[#FAF9F5] text-stone-800'
    }`}>
      
      {/* Soft Background Atmosphere */}
      <div className="fixed inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4" 
          alt="" 
          fill 
          className={`object-cover pointer-events-none ${
            isDark ? 'opacity-[0.03] blur-2xl' : 'opacity-[0.06] blur-2xl'
          }`}
          priority 
        />
        <div className={`absolute inset-0 ${
          isDark 
            ? 'bg-gradient-to-tr from-zinc-950/90 via-transparent to-zinc-900/40'
            : 'bg-gradient-to-tr from-[#FAF9F5]/90 via-transparent to-white/40'
        }`} />
      </div>

      <Sidebar />
      <MainHeader />

      {/* Main Container splits cleanly into layout workspaces */}
      <div className="relative z-10 flex-1 lg:ml-56 pt-16 h-screen flex overflow-hidden w-full">
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 h-full overflow-hidden w-full">
          
          {/* LEFT PANEL: The Scripture / Devotional Sanctuary (7 Columns) */}
          <main className={`lg:col-span-7 flex flex-col h-full border-r overflow-y-auto p-6 lg:p-12 relative [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-md ${
            isDark 
              ? 'bg-zinc-950 border-zinc-800/60 [&::-webkit-scrollbar-thumb]:bg-zinc-700/40'
              : 'bg-[#FAF9F5] border-stone-200/50 [&::-webkit-scrollbar-thumb]:bg-stone-500/10'
          }`}>
            <div className="max-w-2xl mx-auto w-full flex flex-col justify-between h-full space-y-8">
              
              <div>
                {/* Header Navigation & Action Control */}
                <div className={`flex items-center justify-between pb-6 border-b mb-8 ${
                  isDark ? 'border-zinc-800/40' : 'border-stone-200/40'
                }`}>
                  <button 
                    onClick={() => router.back()}
                    className={`text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                      isDark ? 'text-zinc-400 hover:text-primary-400' : 'text-stone-500 hover:text-stone-950'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">arrow_back</span>
                    Back to Dashboard
                  </button>

                  {/* Devotional Timeline Dots */}
                  <div className="flex gap-1.5">
                    {DEVOTIONALS.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === currentIndex 
                            ? isDark ? 'w-6 bg-primary-500' : 'w-6 bg-amber-700'
                            : isDark ? 'w-1.5 bg-zinc-700 hover:bg-zinc-600' : 'w-1.5 bg-stone-300 hover:bg-stone-400'
                        }`}
                        aria-label={`Go to devotional ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Devotional Hero Content Area */}
                <article className="prose prose-stone max-w-none">
                  <span className={`text-[10px] font-bold tracking-widest uppercase ${
                    isDark ? 'text-primary-400' : 'text-amber-700'
                  }`}>
                    Featured Meditation
                  </span>
                  
                  {/* Interactive Card Link Wrapper */}
                  <div 
                    onClick={() => router.push(`/devotionals/${activeDevotional.id}`)}
                    className="cursor-pointer group mt-4 mb-6 block transition-transform duration-300 hover:scale-[1.005]"
                  >
                    <AIDevotionalCard item={activeDevotional as any} isMobile={false} />
                  </div>
                  
                  <h1 className={`font-serif text-3xl lg:text-4xl font-normal mt-2 mb-6 leading-tight ${
                    isDark ? 'text-zinc-100' : 'text-stone-900'
                  }`}>
                    {activeDevotional.title}
                  </h1>
                  
                  {/* Clean text layouts with beautiful spacious line-height */}
                  <div className={`font-serif text-[18px] leading-relaxed space-y-6 ${
                    isDark ? 'text-zinc-300' : 'text-stone-800'
                  }`}>
                    <p className="whitespace-pre-wrap">{activeDevotional.content}</p>
                  </div>
                </article>
              </div>

              {/* Bottom Visual Context Details */}
              <div className={`pt-6 border-t flex justify-between items-center text-xs ${
                isDark ? 'border-zinc-800/40 text-zinc-500' : 'border-stone-200/40 text-stone-400'
              }`}>
                <span>Reflect on this passage in the companion panel to your right.</span>
                <span className={isDark ? 'text-zinc-400 font-medium' : 'text-stone-500 font-medium'}>Session Active</span>
              </div>
            </div>
          </main>

          {/* RIGHT PANEL: The Active AI Companion & Guided Chat (5 Columns) */}
          <section className={`lg:col-span-5 flex flex-col h-full ${
            isDark ? 'bg-zinc-900 border-l border-zinc-800/60' : 'bg-white border-l border-stone-200/40'
          }`}>
            
            {/* Header Companion Information */}
            <div className={`px-6 py-4 border-b flex items-center justify-between ${
              isDark 
                ? 'bg-zinc-900 border-zinc-800/60'
                : 'bg-white border-stone-200/40'
            }`}>
              <div>
                <h3 className={`text-xs font-bold uppercase tracking-wider ${
                  isDark ? 'text-primary-400' : 'text-amber-800'
                }`}>Spiritual Companion</h3>
                <p className={`text-[10px] mt-0.5 ${
                  isDark ? 'text-zinc-500' : 'text-stone-400'
                }`}>Let's dissect today's words together.</p>
              </div>
              
              {isSaving && (
                <div className="flex items-center gap-1.5">
                  <span className={`material-symbols-outlined text-xs animate-spin ${
                    isDark ? 'text-primary-500' : 'text-amber-600'
                  }`}>sync</span>
                  <span className={`text-[9px] ${
                    isDark ? 'text-zinc-500' : 'text-stone-400'
                  }`}>Saving reflection</span>
                </div>
              )}
            </div>

            {/* Chat Conversation Thread */}
            <div 
              ref={chatContainerRef}
              className={`flex-1 overflow-y-auto px-6 py-6 space-y-4 [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-md ${
                isDark 
                  ? 'bg-zinc-950/60 [&::-webkit-scrollbar-thumb]:bg-zinc-700/40'
                  : 'bg-stone-50/30 [&::-webkit-scrollbar-thumb]:bg-stone-500/15'
              }`}
            >
              <AnimatePresence mode="popLayout">
                {messages.map((msg, idx) => (
                  <motion.div
                    key={msg.id || idx}
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.2, delay: Math.min(idx * 0.01, 0.15) }}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-[13px] shadow-sm leading-relaxed ${
                      msg.role === 'user' 
                        ? isDark
                          ? 'bg-primary-600 text-white rounded-br-none shadow-primary-900/20'
                          : 'bg-gradient-to-r from-amber-700 to-amber-800 text-white rounded-br-none shadow-amber-900/5'
                        : isDark
                          ? 'bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-bl-none'
                          : 'bg-white border border-stone-200/50 text-stone-800 rounded-bl-none'
                    }`}>
                      {msg.role === 'user' ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : (
                        <ReactMarkdown className="font-sans" components={{
                          p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                          strong: ({node, ...props}) => <strong className={`font-semibold ${
                            isDark ? 'text-primary-400' : 'text-amber-800'
                          }`} {...props} />,
                        }}>
                          {msg.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Active Loading State */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className={`rounded-2xl rounded-bl-none px-4 py-3 ${
                    isDark 
                      ? 'bg-zinc-800 border border-zinc-700'
                      : 'bg-white border border-stone-200/50'
                  }`}>
                    <div className="flex gap-1.5 items-center h-4">
                      <span className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.3s] ${
                        isDark ? 'bg-primary-500' : 'bg-amber-500'
                      }`} />
                      <span className={`w-1.5 h-1.5 rounded-full animate-bounce [animation-delay:-0.15s] ${
                        isDark ? 'bg-primary-500' : 'bg-amber-500'
                      }`} />
                      <span className={`w-1.5 h-1.5 rounded-full animate-bounce ${
                        isDark ? 'bg-primary-500' : 'bg-amber-500'
                      }`} />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Sticky Interaction Input Base */}
            <footer className={`p-4 border-t ${
              isDark 
                ? 'bg-zinc-900 border-zinc-800/60'
                : 'bg-white border-stone-200/40 shadow-[-10px_0_20px_rgba(0,0,0,0.01)]'
            }`}>
              <AIChatInput 
                input={input} 
                handleInputChange={handleInputChange} 
                handleSubmit={handleSubmit} 
                isLoading={isLoading} 
              />
            </footer>

          </section>

        </div>
      </div>
    </div>
  );
}