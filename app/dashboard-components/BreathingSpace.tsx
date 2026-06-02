'use client';

import React, { useState, useEffect } from 'react';

export function BreathingSpace() {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(60);

  useEffect(() => {
    let interval: any;
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds(s => s - 1), 1000);
    } else if (seconds === 0) {
      setIsActive(false);
      setSeconds(60);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds]);

  return (
    <div className="relative group overflow-hidden bg-[#4d6054] rounded-[32px] p-8 text-center shadow-xl shadow-[#4d6054]/20 transition-all duration-500">
      {/* Animated Background Aura */}
      <div className={`absolute inset-0 bg-gradient-to-br from-[#e0a96d]/20 to-transparent transition-opacity duration-1000 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
      
      <div className="relative z-10">
        <div className={`w-20 h-20 mx-auto rounded-full border-2 border-white/20 flex items-center justify-center mb-6 transition-all duration-1000 ${isActive ? 'scale-125 border-white/50' : 'scale-100'}`}>
          {isActive ? (
            <span className="text-2xl font-serif text-white animate-pulse">{seconds}s</span>
          ) : (
            <span className="material-symbols-outlined text-white text-3xl">air</span>
          )}
        </div>

        <h3 className="text-xl font-serif text-white mb-2">
          {isActive ? 'Breathe in... and out' : 'Breathe & Transition'}
        </h3>
        <p className="text-xs text-white/60 mb-8 leading-relaxed max-w-[200px] mx-auto">
          {isActive 
            ? 'Quiet your mind. Release the noise of the world.' 
            : 'Take a 60-second structural break before entering the Word.'}
        </p>

        <button 
          onClick={() => setIsActive(!isActive)}
          className={`w-full py-4 rounded-full text-[10px] font-black tracking-[0.2em] uppercase transition-all ${
            isActive 
            ? 'bg-white/10 text-white border border-white/20' 
            : 'bg-white text-[#4d6054] hover:bg-[#f7ebd9]'
          }`}
        >
          {isActive ? 'End Silence' : 'Begin 60s Silence'}
        </button>
      </div>
    </div>
  );
}