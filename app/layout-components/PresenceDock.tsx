'use client';

import React, { useState, useEffect } from 'react';

type Mode = 'clock' | 'timer' | 'stopwatch';

export default function PresenceDock() {
  const [isOpen, setIsOpen] = useState(false); // Controls the pop-out state
  const [mode, setMode] = useState<Mode>('clock');
  const [time, setTime] = useState(new Date());
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (mode === 'clock') {
      interval = setInterval(() => setTime(new Date()), 1000);
    } else if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => (mode === 'stopwatch' ? prev + 1 : prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [mode, isActive]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    /* Container pinned to the right edge */
    <div 
      className={`fixed bottom-32 right-0 z-[70] transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        isOpen ? 'translate-x-0' : 'translate-x-[calc(100%-48px)]'
      }`}
    >
      <div className="flex items-center">
        
        {/* THE HANDLE: Always visible or triggers the slide */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-12 h-12 flex items-center justify-center rounded-l-2xl border-y border-l border-white/40 shadow-[-10px_0_20px_rgba(0,0,0,0.05)] transition-colors ${
            isOpen ? 'bg-primary text-white' : 'bg-white/80 backdrop-blur-xl text-primary hover:bg-white'
          }`}
        >
          <span className={`material-symbols-outlined transition-transform duration-500 ${isOpen ? 'rotate-180' : 'rotate-0'}`}>
            {isOpen ? 'chevron_right' : mode === 'clock' ? 'schedule' : mode === 'timer' ? 'hourglass_top' : 'timer'}
          </span>
        </button>

        {/* THE BODY: The actual dock content */}
        <div className="bg-white/80 backdrop-blur-2xl border border-white/40 shadow-2xl p-2 flex items-center gap-2 pr-6 rounded-r-none">
          
          {/* Mode Selectors */}
          <div className="flex bg-gray-100/50 rounded-full p-1">
            {[
              { id: 'clock', icon: 'schedule' },
              { id: 'timer', icon: 'hourglass_top' },
              { id: 'stopwatch', icon: 'timer' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => { setMode(m.id as Mode); setIsActive(false); setSeconds(0); }}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  mode === m.id ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-primary'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">{m.icon}</span>
              </button>
            ))}
          </div>

          {/* Display */}
          <div className="px-4 min-w-[80px] text-center border-l border-gray-100">
            <div className="flex flex-col">
              <span className="text-sm font-black text-[#3C3830] tabular-nums leading-none">
                {mode === 'clock' 
                  ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                  : formatTime(seconds)
                }
              </span>
              <span className="text-[8px] font-bold text-primary uppercase tracking-widest mt-1">
                {mode}
              </span>
            </div>
          </div>

          {/* Action Button */}
          {mode !== 'clock' && (
            <button
              onClick={() => setIsActive(!isActive)}
              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                isActive ? 'bg-rose-50 text-rose-500' : 'bg-primary text-white'
              }`}
            >
              <span className="material-symbols-outlined text-[20px]">
                {isActive ? 'pause' : 'play_arrow'}
              </span>
            </button>
          )}

          {/* Quick Timer Add */}
          {mode === 'timer' && !isActive && seconds === 0 && (
            <button 
              onClick={() => setSeconds(600)} 
              className="text-[10px] font-black text-primary px-2"
            >
              +10M
            </button>
          )}
        </div>
      </div>
    </div>
  );
}