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
    <div className="max-w-3xl mx-auto w-full">
      <form onSubmit={handleSubmit} className="relative group">
        {/* Input Container with Glass Effect */}
        <div className="flex items-center gap-2 bg-white/50 backdrop-blur-xl p-1.5 pl-4 rounded-xl shadow-lg border border-white/60 focus-within:ring-2 focus-within:ring-amber-500/30 transition-all duration-500">
          
          {/* Spiritual Icon */}
          <div className={`transition-all duration-500 ${isLoading ? 'opacity-100' : 'opacity-60'}`}>
            <span className={`material-symbols-outlined text-[18px] transition-colors duration-500 ${isLoading ? 'text-amber-600 animate-pulse' : 'text-amber-500'}`}>
              {isLoading ? 'sync' : 'auto_awesome'}
            </span>
          </div>

          <input
            type="text"
            placeholder="Share your heart..."
            value={input}
            onChange={handleInputChange}
            disabled={isLoading}
            className="flex-1 bg-transparent border-none focus:ring-0 text-gray-800 py-3 text-sm font-medium placeholder:text-gray-400 outline-none"
          />

          {/* Premium Submit Button */}
          <button 
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`
              relative w-9 h-9 flex items-center justify-center rounded-lg transition-all duration-300
              ${isLoading 
                ? 'bg-amber-100 text-amber-500' 
                : 'bg-gradient-to-r from-amber-600 to-amber-700 text-white hover:shadow-lg hover:shadow-amber-500/25 active:scale-95'
              }
              disabled:opacity-30 disabled:cursor-not-allowed
            `}
          >
            {isLoading ? (
              <div className="flex gap-0.5 items-center justify-center">
                <span className="w-1 h-1 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1 h-1 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1 h-1 bg-amber-500 rounded-full animate-bounce"></span>
              </div>
            ) : (
              <span className="material-symbols-outlined text-[16px]">arrow_upward</span>
            )}
          </button>
        </div>

        {/* Floating Hint */}
        <p className={`text-center mt-2 text-[7px] font-black uppercase tracking-wider text-gray-400 transition-opacity duration-700 ${input.length > 0 ? 'opacity-100' : 'opacity-0'}`}>
          Press Enter to speak
        </p>
      </form>
    </div>
  );
}