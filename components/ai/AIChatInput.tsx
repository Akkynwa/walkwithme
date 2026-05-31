'use client';

import React, { ChangeEvent, FormEvent } from 'react';
import { ChatRequestOptions } from 'ai';

// 1. Define the interface to match the props passed from the parent
interface AIChatInputProps {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions) => void;
  isLoading: boolean;
  setMessages?: any; // Matches your error message signature
}

export function AIChatInput({ 
  input, 
  handleInputChange, 
  handleSubmit, 
  isLoading 
}: AIChatInputProps) {
  
  return (
    <div className="max-w-[800px] mx-auto w-full">
      <form onSubmit={handleSubmit} className="relative group">
        <div className="flex items-center gap-3 bg-white/60 backdrop-blur-xl p-2 pl-6 rounded-[2rem] shadow-sm border border-white focus-within:ring-4 ring-[#D4AF37]/5 transition-all duration-500">
          
          {/* Spiritual Icon - Using simple text fallback to avoid icon font errors */}
          <span className={`text-xl transition-colors duration-500 ${isLoading ? 'text-[#D4AF37] animate-pulse' : 'text-[#D4AF37]/30'}`}>
            {isLoading ? '✦' : '✎'}
          </span>

          <input
            type="text"
            placeholder="Share your heart..."
            value={input}
            onChange={handleInputChange}
            disabled={isLoading}
            className="flex-1 bg-transparent border-none focus:ring-0 text-[#3C3830] py-4 text-[15px] font-medium placeholder:text-[#7C7565]/30"
          />

          {/* Premium Submit Button */}
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`
              relative w-12 h-12 flex items-center justify-center rounded-2xl transition-all duration-300
              ${isLoading 
                ? 'bg-[#D4AF37]/10 text-[#D4AF37]' 
                : 'bg-[#3C3830] text-white hover:bg-black shadow-lg shadow-black/5 active:scale-90'
              }
              disabled:opacity-20 disabled:grayscale
            `}
          >
            {isLoading ? (
              <div className="flex gap-0.5">
                <span className="w-1 h-1 bg-[#D4AF37] rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1 h-1 bg-[#D4AF37] rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1 h-1 bg-[#D4AF37] rounded-full animate-bounce"></span>
              </div>
            ) : (
              <span className="text-lg">↗</span>
            )}
          </button>
        </div>

        {/* Floating Hint */}
        <p className={`text-center mt-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#7C7565]/30 transition-opacity duration-700 ${input.length > 0 ? 'opacity-100' : 'opacity-0'}`}>
          Press Enter to speak
        </p>
      </form>
    </div>
  );
}