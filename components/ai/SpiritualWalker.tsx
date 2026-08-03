'use client';

import { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
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
        <div className="flex-1 flex flex-col w-full max-w-3xl mx-auto px-4 sm:px-6 h-full overflow-hidden">
          
          {/* Top Status Header */}
          <div className="py-2 flex items-center justify-end shrink-0 h-8">
            {isSaving && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center gap-1.5"
              >
                <span className={`material-symbols-outlined text-xs animate-spin ${
                  isDark ? 'text-amber-400' : 'text-amber-600'
                }`}>sync</span>
                <span className={`text-[11px] font-medium ${isDark ? 'text-zinc-500' : 'text-stone-400'}`}>
                  Saving ledger...
                </span>
              </motion.div>
            )}
          </div>

          {/* Chat Messages List */}
          <div 
            ref={chatContainerRef}
            className={`flex-1 overflow-y-auto py-4 space-y-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full ${
              isDark 
                ? '[&::-webkit-scrollbar-thumb]:bg-zinc-800'
                : '[&::-webkit-scrollbar-thumb]:bg-stone-300'
            }`}
          >
            <AnimatePresence mode="popLayout">
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id || idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm md:text-base leading-relaxed tracking-normal ${
                    msg.role === 'user' 
                      ? isDark
                        ? 'bg-amber-600/90 text-white rounded-br-xs border border-amber-500/30'
                        : 'bg-stone-900 text-stone-50 rounded-br-xs'
                      : isDark
                        ? 'bg-zinc-900/80 border border-zinc-800/80 text-zinc-200 rounded-bl-xs backdrop-blur-md'
                        : 'bg-white border border-stone-200/90 text-stone-800 rounded-bl-xs backdrop-blur-md shadow-xs'
                  }`}>
                    {msg.role === 'user' ? (
                      <p className="whitespace-pre-wrap font-normal text-sm md:text-base">{msg.content}</p>
                    ) : (
                      <ReactMarkdown 
                        className="space-y-3 font-normal text-sm md:text-base" 
                        components={{
                          p: ({node, ...props}) => <p className="leading-relaxed text-sm md:text-base mb-2 last:mb-0" {...props} />,
                          strong: ({node, ...props}) => (
                            <strong className={`font-semibold ${isDark ? 'text-amber-400' : 'text-amber-700'}`} {...props} />
                          ),
                          em: ({node, ...props}) => <em className="font-serif italic" {...props} />,
                          ul: ({node, ...props}) => <ul className="list-disc pl-5 space-y-1 my-2" {...props} />,
                          ol: ({node, ...props}) => <ol className="list-decimal pl-5 space-y-1 my-2" {...props} />,
                          li: ({node, ...props}) => <li className="leading-relaxed" {...props} />,
                        }}
                      >
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
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex justify-start"
              >
                <div className={`rounded-2xl rounded-bl-xs px-4 py-3 ${
                  isDark ? 'bg-zinc-900/80 border border-zinc-800' : 'bg-white border border-stone-200 shadow-xs'
                }`}>
                  <div className="flex gap-1.5 items-center h-4">
                    <motion.span 
                      animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0 }}
                      className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-amber-400' : 'bg-amber-600'}`} 
                    />
                    <motion.span 
                      animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0.2 }}
                      className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-amber-400' : 'bg-amber-600'}`} 
                    />
                    <motion.span 
                      animate={{ scale: [1, 1.3, 1], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: 0.4 }}
                      className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-amber-400' : 'bg-amber-600'}`} 
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Input Area */}
          <div className="pb-6 pt-2 shrink-0">
            <div className="relative group p-[1px] rounded-2xl transition-all duration-500">
              <div className={`absolute -inset-0.5 rounded-2xl blur-md opacity-30 group-hover:opacity-80 transition duration-500 ${
                isDark
                  ? 'bg-gradient-to-r from-amber-500/40 via-purple-500/30 to-blue-500/40'
                  : 'bg-gradient-to-r from-amber-300/60 via-rose-200/50 to-sky-300/60'
              }`} />
              
              <div className={`relative rounded-2xl p-2 sm:p-3 shadow-xl transition-colors ${
                isDark 
                  ? 'bg-zinc-900/90 border border-zinc-800' 
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
            <p className={`text-[11px] font-medium text-center mt-2.5 ${isDark ? 'text-zinc-500' : 'text-stone-400'}`}>
              AI responses can vary. Please verify key insights.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}