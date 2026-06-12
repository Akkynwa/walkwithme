'use client';

import React, { ChangeEvent, FormEvent, useState, useRef, useEffect } from 'react';

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

  // Auto-adjust textarea height as user types
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      // Adjust height based on content up to a max height
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  }, [input]);

  const toggleVoiceInput = () => {
    setIsVoiceActive((prev) => !prev);
  };

  const toggleMode = () => {
    setActiveMode((prev) => (prev === 'walk' ? 'dream' : 'walk'));
  };

  // Submit on Enter key (but allow Shift + Enter for true new lines)
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
    <div className="max-w-xl mx-auto w-full px-2">
      <form onSubmit={handleSubmit} className="relative group">
        
        {/* Main Box Container */}
        <div className="flex items-end gap-2 bg-white/75 backdrop-blur-2xl p-2 pl-3 rounded-xl shadow-md border border-white/90 focus-within:ring-2 focus-within:ring-amber-500/20 transition-all duration-300">
          
          {/* LEFT CONTENT: Icon and Auto-growing Textarea */}
          <div className="flex-1 flex items-end gap-2 min-w-0">
            {/* Center icon relative to the first line of text */}
            <div className="flex items-center justify-center h-7 flex-shrink-0 opacity-60">
              <span className={`material-symbols-outlined text-[16px] ${
                isLoading 
                  ? 'text-amber-600 animate-spin' 
                  : activeMode === 'dream' 
                    ? 'text-purple-500 drop-shadow-[0_0_4px_rgba(168,85,247,0.3)]' 
                    : 'text-amber-500'
              }`}>
                {isLoading ? 'sync' : activeMode === 'dream' ? 'bedtime' : 'self_improvement'}
              </span>
            </div>

            {/* Changed from <input> to <textarea> for seamless multi-line text stacking */}
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder={activeMode === 'dream' ? "Describe your dream..." : "Share your heart..."}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
              className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 py-1.5 text-xs font-medium placeholder:text-gray-400 outline-none resize-none min-w-0 max-h-[120px] custom-scrollbar leading-relaxed"
            />
          </div>

          {/* RIGHT CONTENT: Action Toolbar aligned perfectly at the bottom */}
          <div className="flex items-center gap-1 flex-shrink-0 h-7">
            
            {/* Mode Switcher */}
            <button
              type="button"
              onClick={toggleMode}
              title={activeMode === 'dream' ? "Switch to Spiritual Companion" : "Switch to Dream Interpreter"}
              className={`w-7 h-7 flex items-center justify-center rounded-lg transition-all duration-300 ${
                activeMode === 'dream'
                  ? 'bg-purple-50 text-purple-600 border border-purple-200/40'
                  : 'bg-slate-50 text-slate-400 hover:text-amber-600 hover:bg-amber-50/50'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
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
                  ? 'bg-red-50 text-red-500 border border-red-200/60 animate-pulse'
                  : 'bg-slate-50 text-slate-400 hover:text-amber-600 hover:bg-amber-50/50'
              }`}
            >
              <span className="material-symbols-outlined text-[14px]">
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
                  ? 'bg-amber-100 text-amber-500' 
                  : activeMode === 'dream'
                    ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white hover:shadow-sm hover:shadow-purple-500/15 active:scale-95'
                    : 'bg-gradient-to-br from-amber-500 to-amber-600 text-white hover:shadow-sm hover:shadow-amber-500/15 active:scale-95'
                }
                disabled:opacity-20 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none
              `}
            >
              {isLoading ? (
                <div className="flex gap-0.5 items-center justify-center">
                  <span className="w-0.5 h-0.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                  <span className="w-0.5 h-0.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                  <span className="w-0.5 h-0.5 bg-amber-500 rounded-full animate-bounce"></span>
                </div>
              ) : (
                <span className="material-symbols-outlined text-[12px] font-bold">arrow_upward</span>
              )}
            </button>
          </div>

        </div>

        {/* Labels below */}
        <div className="flex items-center justify-between px-2 mt-1 min-h-[10px]">
          <p className={`text-[7px] font-bold uppercase tracking-widest text-gray-400 transition-opacity duration-300 ${input.length > 0 ? 'opacity-100' : 'opacity-0'}`}>
            Press Enter to send, Shift+Enter for new line
          </p>
          {activeMode === 'dream' && (
            <p className="text-[7px] font-bold text-purple-500 uppercase tracking-widest">
              ✨ Dream Mode
            </p>
          )}
        </div>

      </form>
    </div>
  );
}