'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/layout-components/Sidebar';
import MainHeader from '@/app/layout-components/Header';
import { AIChatInput } from './AIChatInput';
import AIDevotionalCard from '../../components/ai/AIDevotionalCard';
import { DEVOTIONALS } from '../../app/data/devotionals';
import Image from 'next/image';

export default function SpiritualWalker() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Helper to save chat history to the database
  const saveChatHistory = async (messagesToSave: any[]) => {
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

  // Initialize chat state management
  const [messages, setMessages] = useState<Array<{id: string; role: 'user' | 'assistant'; content: string}>>([
    { id: '1', role: 'assistant', content: "Welcome back, seeker. How does your heart feel today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = { id: Date.now().toString(), role: 'user' as const, content: input };
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
        let assistantMessage = { id: Date.now().toString(), role: 'assistant' as const, content: '' };

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

  return (
    <div className="relative flex min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-amber-50/20">
      {/* Background Decor */}
      <div className="fixed inset-0 z-0">
        <Image 
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4" 
          alt="" 
          fill 
          className="object-cover opacity-20 blur-2xl" 
          priority 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-transparent" />
      </div>

      <Sidebar />
      <MainHeader />

      <div className="relative z-10 flex-1 lg:ml-56 pt-16 h-screen flex overflow-hidden w-full">
        <main className="flex-1 flex flex-col relative min-w-0 bg-white/30 backdrop-blur-sm">
          
          {/* Header Section */}
          <div className="px-4 py-2 flex items-center justify-between border-b border-white/40 bg-white/40 backdrop-blur-md">
            <button 
              onClick={() => router.back()}
              className="text-[10px] text-amber-700 hover:text-amber-900 font-medium transition-colors flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">arrow_back</span>
              Back
            </button>
            {isSaving && (
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-amber-500 text-[10px] animate-spin">sync</span>
                <span className="text-[7px] text-gray-400">Saving Changes</span>
              </div>
            )}
          </div>

          {/* Mobile Devotional View (Scaled Down Layout) */}
          <div className="xl:hidden w-full p-2 max-w-md mx-auto">
            <AIDevotionalCard item={DEVOTIONALS[currentIndex] as any} isMobile={true} />
          </div>

          {/* Chat Stream Panel */}
          <section 
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto px-3 py-3 space-y-2 custom-scrollbar"
          >
            <AnimatePresence mode="popLayout">
              {messages.map((msg: any, idx: number) => (
                <motion.div
                  key={msg.id || idx}
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25, delay: Math.min(idx * 0.02, 0.2) }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] px-3 py-2 rounded-xl text-[11px] shadow-sm ${
                    msg.role === 'user' 
                      ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-br-sm' 
                      : 'bg-white/80 backdrop-blur-sm text-gray-700 border border-white/60 rounded-bl-sm'
                  }`}>
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    ) : (
                      <ReactMarkdown className="font-sans text-[11px] leading-relaxed" components={{
                        p: ({node, ...props}) => <p className="mb-1 last:mb-0" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-semibold text-amber-800" {...props} />,
                      }}>
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Loading / Typing State */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className="bg-white/80 backdrop-blur-sm border border-white/60 rounded-xl rounded-bl-sm px-3 py-2">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-bounce" />
                  </div>
                </div>
              </motion.div>
            )}
          </section>

          {/* Form Input Sticky Footer */}
          <footer className="p-2 bg-white/40 backdrop-blur-xl border-t border-white/40">
            <AIChatInput 
              input={input} 
              handleInputChange={handleInputChange} 
              handleSubmit={handleSubmit} 
              isLoading={isLoading} 
              />
          </footer>
        </main>

        {/* Desktop Side Panel with Mini Card Size adjustments */}
        <aside className="hidden xl:flex w-72 bg-white/30 backdrop-blur-xl border-l border-white/40 flex-col p-4 items-center justify-start overflow-y-auto">
          <div className="w-full max-w-[240px]">
            <div className="mb-2 text-center">
              <span className="text-[7px] font-bold uppercase tracking-wider text-amber-600/60">Featured Meditation</span>
            </div>
            {/* Added isMobile layout styling internally to compress card footprint */}
            <AIDevotionalCard item={DEVOTIONALS[currentIndex] as any} isMobile={true} />
            
            {/* Pagination Controls */}
            <div className="flex justify-center gap-1 mt-3">
              {DEVOTIONALS.map((_, idx) => (
                <button 
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-4 bg-amber-500' : 'w-1 bg-amber-300'}`}
                />
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* Styled JSX Custom Scrollbars */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(245, 158, 11, 0.2);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}