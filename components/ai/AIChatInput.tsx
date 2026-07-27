'use client';

import React, { ChangeEvent, FormEvent, useState, useRef, useEffect } from 'react';
import { useTheme } from '@/app/context/ThemeContext';

interface AIChatInputProps {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export function AIChatInput({ 
  input, 
  handleInputChange, 
  handleSubmit, 
  isLoading 
}: AIChatInputProps) {
  const [isVoiceActive, setIsVoiceActive] = useState(false);
  const [activeMode, setActiveMode] = useState<'walk' | 'dream'>('walk');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const { isDark } = useTheme();

  // Auto-adjust textarea height as user types
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 140)}px`;
    }
  }, [input]);

  const toggleVoiceInput = () => {
    setIsVoiceActive((prev) => !prev);
  };

  const toggleMode = () => {
    setActiveMode((prev) => (prev === 'walk' ? 'dream' : 'walk'));
  };

  // Submit on Enter key (Shift + Enter allows multiline)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && !isLoading) {
        const form = e.currentTarget.form;
        if (form) form.requestSubmit();
      }
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="relative group">
        
        {/* Main Box Container */}
        <div className={`flex items-end gap-2 p-2 pl-3 rounded-xl transition-all duration-300 ${
          isDark 
            ? 'bg-zinc-900/60 text-zinc-100 focus-within:ring-1 focus-within:ring-amber-500/40' 
            : 'bg-white/80 text-stone-800 focus-within:ring-1 focus-within:ring-amber-500/30'
        }`}>
          
          {/* LEFT CONTENT: Mode Indicator & Auto-growing Textarea */}
          <div className="flex-1 flex items-end gap-2 min-w-0">
            <div className="flex items-center justify-center h-8 flex-shrink-0 opacity-70">
              <span className={`material-symbols-outlined text-[18px] transition-colors ${
                isLoading 
                  ? 'text-amber-500 animate-spin' 
                  : activeMode === 'dream' 
                    ? 'text-purple-400 drop-shadow-[0_0_6px_rgba(168,85,247,0.4)]' 
                    : 'text-amber-500'
              }`}>
                {isLoading ? 'sync' : activeMode === 'dream' ? 'bedtime' : 'self_improvement'}
              </span>
            </div>

            <textarea
              ref={textareaRef}
              rows={1}
              placeholder={activeMode === 'dream' ? "Describe your dream..." : "Share your heart..."}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className={`flex-1 bg-transparent border-none focus:ring-0 py-1.5 text-xs sm:text-sm font-medium outline-none resize-none min-w-0 max-h-[140px] leading-relaxed ${
                isDark 
                  ? 'text-zinc-100 placeholder:text-zinc-500' 
                  : 'text-stone-800 placeholder:text-stone-400'
              }`}
            />
          </div>

          {/* RIGHT CONTENT: Toolbar Controls */}
          <div className="flex items-center gap-1.5 flex-shrink-0 h-8">
            
            {/* Mode Switcher */}
            <button
              type="button"
              onClick={toggleMode}
              title={activeMode === 'dream' ? "Switch to Spiritual Companion" : "Switch to Dream Interpreter"}
              className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-300 ${
                activeMode === 'dream'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                  : isDark
                    ? 'bg-zinc-800 text-zinc-400 hover:text-amber-400 hover:bg-zinc-700/60'
                    : 'bg-stone-100 text-stone-500 hover:text-amber-600 hover:bg-stone-200/60'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">
                {activeMode === 'dream' ? 'auto_awesome' : 'wb_twilight'}
              </span>
            </button>

            {/* Voice Input */}
            <button
              type="button"
              onClick={toggleVoiceInput}
              title={isVoiceActive ? "Listening..." : "Speak via Voice"}
              className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-300 ${
                isVoiceActive
                  ? 'bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse'
                  : isDark
                    ? 'bg-zinc-800 text-zinc-400 hover:text-amber-400 hover:bg-zinc-700/60'
                    : 'bg-stone-100 text-stone-500 hover:text-amber-600 hover:bg-stone-200/60'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">
                {isVoiceActive ? 'mic_fixed' : 'mic'}
              </span>
            </button>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isLoading || !input.trim()}
              className={`
                relative w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-300
                ${isLoading 
                  ? 'bg-amber-500/20 text-amber-500' 
                  : activeMode === 'dream'
                    ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white hover:shadow-md hover:shadow-purple-500/20 active:scale-95'
                    : 'bg-gradient-to-br from-amber-500 to-amber-600 text-white hover:shadow-md hover:shadow-amber-500/20 active:scale-95'
                }
                disabled:opacity-20 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none
              `}
            >
              {isLoading ? (
                <div className="flex gap-0.5 items-center justify-center">
                  <span className="w-1 h-1 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-1 h-1 bg-amber-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-1 h-1 bg-amber-400 rounded-full animate-bounce"></span>
                </div>
              ) : (
                <span className="material-symbols-outlined text-[14px] font-bold">arrow_upward</span>
              )}
            </button>
          </div>

        </div>

        {/* Status Indicators below Input */}
        <div className="flex items-center justify-between px-1.5 mt-1.5 min-h-[12px]">
          <p className={`text-[9px] font-medium tracking-wide transition-opacity duration-300 ${
            input.trim().length > 0 ? 'opacity-100' : 'opacity-0'
          } ${isDark ? 'text-zinc-500' : 'text-stone-400'}`}>
            Press <span className="font-semibold">Enter</span> to send, <span className="font-semibold">Shift + Enter</span> for line break
          </p>
          {activeMode === 'dream' && (
            <p className="text-[9px] font-bold text-purple-400 tracking-wider uppercase flex items-center gap-1">
              <span>✨</span> Dream Interpreter
            </p>
          )}
        </div>

      </form>
    </div>
  );
}