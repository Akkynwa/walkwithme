'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/app/context/ThemeContext';
import Sidebar from '@/app/layout-components/Sidebar';
import MainHeader from '@/app/layout-components/Header';
import { AIChatInput } from './AIChatInput';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function SpiritualWalker() {
  const [isSaving, setIsSaving] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', role: 'assistant', content: "Welcome back. How can I assist your journey today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { isDark } = useTheme();

  const router = useRouter();
  const chatContainerRef = useRef<HTMLDivElement>(null);

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
        
        const assistantId = (Date.now() + 1).toString();
        let assistantContent = '';

        setMessages(prev => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          assistantContent += chunk;

          setMessages(prev => {
            const updated = [...prev];
            const lastMsgIndex = updated.length - 1;
            if (lastMsgIndex >= 0 && updated[lastMsgIndex].role === 'assistant') {
              updated[lastMsgIndex] = {
                ...updated[lastMsgIndex],
                content: assistantContent
              };
            }
            return updated;
          });
        }

        const finalAssistantMsg: ChatMessage = { id: assistantId, role: 'assistant', content: assistantContent };
        await saveChatHistory([...newMessages, finalAssistantMsg]);
      }
    } catch (e) {
      console.error('Error sending message:', e);
    } finally {
      setIsLoading(false);
    }
  };

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

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  return (
    <div className={`relative flex min-h-screen overflow-hidden antialiased font-sans transition-colors duration-500 ${
      isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-[#FAF9F5] text-stone-800'
    }`}>
      
      {/* Background Atmosphere Glows */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className={`absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[350px] rounded-full blur-[140px] opacity-30 ${
          isDark 
            ? 'bg-gradient-to-r from-amber-500/30 via-purple-500/20 to-blue-500/30' 
            : 'bg-gradient-to-r from-amber-300/40 via-rose-200/30 to-sky-300/40'
        }`} />
      </div>

      <Sidebar />
      <MainHeader />

      {/* Main Viewport Wrapper with Sidebar Offset */}
      <main className="relative z-10 flex-1 lg:pl-56 pt-16 h-screen flex flex-col w-full">
        
        {/* Centered Chat Workspace Container */}
        <div className="flex-1 flex flex-col w-full max-w-4xl mx-auto px-4 sm:px-6 h-full overflow-hidden">
          
          {/* Top Navigation */}
          <div className="py-4 flex items-center justify-between border-b border-transparent shrink-0">
            <button 
              onClick={() => router.back()}
              className={`flex items-center gap-2 text-xs sm:text-sm font-medium transition-all hover:scale-105 ${
                isDark ? 'text-zinc-400 hover:text-amber-400' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <span className="material-symbols-outlined text-base">arrow_back</span>
              <span>Return</span>
            </button>

            {isSaving && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1.5"
              >
                <span className={`material-symbols-outlined text-xs animate-spin ${
                  isDark ? 'text-amber-400' : 'text-amber-600'
                }`}>sync</span>
                <span className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-stone-400'}`}>
                  Saving...
                </span>
              </motion.div>
            )}
          </div>

          {/* Chat Messages List */}
          <div 
            ref={chatContainerRef}
            className={`flex-1 overflow-y-auto py-6 space-y-6 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full ${
              isDark 
                ? '[&::-webkit-scrollbar-thumb]:bg-zinc-800'
                : '[&::-webkit-scrollbar-thumb]:bg-stone-300'
            }`}
          >
            <AnimatePresence mode="popLayout">
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id || idx}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-3 sm:gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Assistant Avatar */}
                  {msg.role === 'assistant' && (
                    <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 shadow-md ${
                      isDark 
                        ? 'bg-gradient-to-tr from-amber-500/20 to-purple-500/20 border border-amber-500/30 text-amber-400'
                        : 'bg-amber-100 border border-amber-300/60 text-amber-800'
                    }`}>
                      <span className="material-symbols-outlined text-sm sm:text-base">auto_awesome</span>
                    </div>
                  )}

                  <div className={`max-w-[88%] sm:max-w-[80%] px-4 sm:px-6 py-3.5 sm:py-4 rounded-2xl text-sm sm:text-base leading-relaxed ${
                    msg.role === 'user' 
                      ? isDark
                        ? 'bg-zinc-800 text-zinc-100 rounded-tr-none border border-zinc-700/60'
                        : 'bg-stone-900 text-white rounded-tr-none'
                      : isDark
                        ? 'bg-zinc-900/60 border border-zinc-800/80 text-zinc-100 rounded-tl-none backdrop-blur-md'
                        : 'bg-white/90 border border-stone-200/80 text-stone-800 rounded-tl-none backdrop-blur-md shadow-sm'
                  }`}>
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap font-normal">{msg.content}</p>
                    ) : (
                      <ReactMarkdown className="space-y-2 font-normal" components={{
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                        strong: ({node, ...props}) => <strong className={`font-semibold ${
                          isDark ? 'text-amber-400' : 'text-amber-700'
                        }`} {...props} />,
                        em: ({node, ...props}) => <em className="font-serif italic" {...props} />,
                      }}>
                        {msg.content}
                      </ReactMarkdown>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {/* Typing Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 sm:gap-4 items-center"
              >
                <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center shrink-0 ${
                  isDark 
                    ? 'bg-gradient-to-tr from-amber-500/20 to-purple-500/20 border border-amber-500/30 text-amber-400'
                    : 'bg-amber-100 border border-amber-300/60 text-amber-800'
                }`}>
                  <span className="material-symbols-outlined text-sm sm:text-base animate-pulse">auto_awesome</span>
                </div>
                <div className={`rounded-2xl rounded-tl-none px-4 py-3 ${
                  isDark ? 'bg-zinc-900/60 border border-zinc-800' : 'bg-white border border-stone-200'
                }`}>
                  <div className="flex gap-1.5 items-center h-4">
                    <motion.span 
                      animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                      className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-amber-400' : 'bg-amber-600'}`} 
                    />
                    <motion.span 
                      animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                      className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-amber-400' : 'bg-amber-600'}`} 
                    />
                    <motion.span 
                      animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                      className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-amber-400' : 'bg-amber-600'}`} 
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Gemini-Style Input Bar Wrapper */}
          <div className="pb-6 pt-2 shrink-0">
            <div className="relative group p-[1px] rounded-2xl transition-all duration-500">
              <div className={`absolute -inset-0.5 rounded-2xl blur-md opacity-40 group-hover:opacity-100 transition duration-500 ${
                isDark
                  ? 'bg-gradient-to-r from-amber-500 via-purple-500 to-blue-500'
                  : 'bg-gradient-to-r from-amber-400 via-rose-300 to-sky-400'
              }`} />
              
              <div className={`relative rounded-2xl p-2 sm:p-3 shadow-2xl transition-colors ${
                isDark 
                  ? 'bg-zinc-900/90 border border-zinc-700/60' 
                  : 'bg-white/95 border border-stone-200'
              }`}>
                <AIChatInput 
                  input={input} 
                  handleInputChange={handleInputChange} 
                  handleSubmit={handleSubmit} 
                  isLoading={isLoading} 
                />
              </div>
            </div>
            <p className={`text-[11px] text-center mt-2 ${isDark ? 'text-zinc-500' : 'text-stone-400'}`}>
              AI may display inaccurate info. Always verify responses.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}