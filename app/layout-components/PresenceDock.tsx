'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type Mode = 'clock' | 'timer' | 'stopwatch';

export default function PresenceDock() {
  const [mode, setMode] = useState<Mode>('clock');
  const [time, setTime] = useState(new Date());
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  
  // Custom Origin Color
  const originOrange = '#fb923c';

  // --- FIXED TIMER LOGIC ---
  useEffect(() => {
    let interval: any = null;

    if (mode === 'clock') {
      interval = setInterval(() => setTime(new Date()), 1000);
    } else if (isActive) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (mode === 'stopwatch') return prev + 1;
          if (mode === 'timer') {
            if (prev <= 1) {
              setIsActive(false); // Stop when hits zero
              return 0;
            }
            return prev - 1;
          }
          return prev;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [mode, isActive]);

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    /* DRAGGABLE CONTAINER 
       drag: allows movement
       dragMomentum: false makes it feel "snappy" and grounded
    */
    <motion.div 
      drag
      dragMomentum={false}
      initial={{ x: 100, y: 500 }} // Starting position
      className="fixed z-[100] cursor-grab active:cursor-grabbing"
    >
      <div className="flex items-center group">
        
        {/* DRAG HANDLE / ICON */}
        <div 
          className="w-12 h-12 flex items-center justify-center rounded-2xl border border-white/40 shadow-2xl backdrop-blur-2xl transition-all"
          style={{ backgroundColor: `${originOrange}20`, borderColor: `${originOrange}40` }}
        >
          <span className="material-symbols-outlined" style={{ color: originOrange }}>
            {mode === 'clock' ? 'schedule' : mode === 'timer' ? 'hourglass_top' : 'timer'}
          </span>
        </div>

        {/* MAIN INTERFACE CARD */}
        <div className="ml-2 bg-white/80 backdrop-blur-3xl border border-white/40 shadow-2xl p-2 flex items-center gap-3 rounded-3xl">
          
          {/* Mode Switcher */}
          <div className="flex bg-gray-100/50 rounded-2xl p-1">
            {[
              { id: 'clock', icon: 'schedule' },
              { id: 'timer', icon: 'hourglass_top' },
              { id: 'stopwatch', icon: 'timer' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => { setMode(m.id as Mode); setIsActive(false); setSeconds(0); }}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                  mode === m.id ? 'bg-white shadow-md' : 'text-gray-400 hover:text-orange-400'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]" style={mode === m.id ? { color: originOrange } : {}}>
                  {m.icon}
                </span>
              </button>
            ))}
          </div>

          {/* Time Display */}
          <div className="px-2 min-w-[70px] text-center">
            <div className="flex flex-col">
              <span className="text-base font-black text-[#3C3830] tabular-nums tracking-tight">
                {mode === 'clock' 
                  ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
                  : formatTime(seconds)
                }
              </span>
            </div>
          </div>

          {/* Action Area */}
          <div className="flex items-center gap-1">
            {mode !== 'clock' && (
              <button
                onClick={() => setIsActive(!isActive)}
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-all shadow-lg active:scale-90"
                style={{ backgroundColor: originOrange, color: 'white' }}
              >
                <span className="material-symbols-outlined text-[20px]">
                  {isActive ? 'pause' : 'play_arrow'}
                </span>
              </button>
            )}

            {mode === 'timer' && !isActive && (
              <button 
                onClick={() => setSeconds(s => s + 300)} 
                className="w-9 h-9 rounded-xl bg-gray-100 text-[#3C3830] flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <span className="text-[10px] font-black">+5m</span>
              </button>
            )}

            {/* Reset Button (only shows when paused/timer active) */}
            {(seconds > 0 && !isActive) && (
                <button 
                onClick={() => {setSeconds(0); setIsActive(false);}}
                className="w-9 h-9 rounded-xl bg-rose-50 text-rose-500 flex items-center justify-center"
                >
                <span className="material-symbols-outlined text-[18px]">restart_alt</span>
                </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}