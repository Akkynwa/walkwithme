'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

type Mode = 'clock' | 'timer' | 'stopwatch';

export default function PresenceDock() {
  const [mode, setMode] = useState<Mode>('clock');
  const [time, setTime] = useState(new Date());
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(0);
  
  const originOrange = '#fb923c';

  // --- TIMER ENGINE ---
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
              setIsActive(false);
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
    <motion.div 
      drag
      dragMomentum={false}
      initial={{ x: 80, y: 480 }}
      className="fixed z-[100] select-none"
    >
      <div className="flex items-center gap-1.5 p-1.5 rounded-3xl bg-white/20 backdrop-blur-xl border border-white/40 shadow-[0_24px_60px_-15px_rgba(0,0,0,0.08)] group hover:bg-white/30 hover:border-white/60 transition-all duration-300">
        
        {/* DRAG HANDLE: Premium Glass Grab Zone */}
        <div className="w-10 h-10 flex flex-col items-center justify-center rounded-2xl cursor-grab active:cursor-grabbing bg-white/40 border border-white/60 hover:bg-white/80 text-slate-500 hover:text-amber-600 transition-all shadow-xs relative">
          <span className="material-symbols-outlined text-[16px] font-light leading-none">
            {mode === 'clock' ? 'schedule' : mode === 'timer' ? 'hourglass_top' : 'timer'}
          </span>
          {/* Subtle dots layout to signal grab state */}
          <span className="material-symbols-outlined text-[10px] opacity-40 absolute bottom-0.5 font-black tracking-tight">
            drag_indicator
          </span>
        </div>

        {/* CONTROLS HUB */}
        <div className="flex items-center gap-2 px-1">
          
          {/* Mode Selector Strip */}
          <div className="flex bg-slate-900/5 backdrop-blur-xs rounded-xl p-0.5 border border-black/[0.03]">
            {[
              { id: 'clock', icon: 'schedule' },
              { id: 'timer', icon: 'hourglass_top' },
              { id: 'stopwatch', icon: 'timer' }
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => { setMode(m.id as Mode); setIsActive(false); setSeconds(0); }}
                className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-200 ${
                  mode === m.id 
                    ? 'bg-white shadow-xs text-slate-800 scale-100 font-bold' 
                    : 'text-slate-400 hover:text-amber-600 hover:scale-105'
                }`}
              >
                <span className="material-symbols-outlined text-[15px]">
                  {m.icon}
                </span>
              </button>
            ))}
          </div>

          {/* Core Numerical String Display */}
          <div className="px-1 min-w-[76px] text-center">
            <span className="text-[13px] font-mono font-bold text-slate-800 tracking-tight tabular-nums antialiased drop-shadow-xs">
              {mode === 'clock' 
                ? time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
                : formatTime(seconds)
              }
            </span>
          </div>

          {/* Action Blocks Container */}
          <div className="flex items-center gap-1">
            {mode !== 'clock' && (
              <button
                onClick={() => setIsActive(!isActive)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-all active:scale-95 text-white shadow-xs hover:brightness-105"
                style={{ backgroundColor: originOrange }}
              >
                <span className="material-symbols-outlined text-[15px] font-bold">
                  {isActive ? 'pause' : 'play_arrow'}
                </span>
              </button>
            )}

            {mode === 'timer' && !isActive && (
              <button 
                onClick={() => setSeconds(s => s + 300)} 
                className="w-7 h-7 rounded-lg bg-white/40 hover:bg-white/80 border border-white/60 text-slate-700 flex items-center justify-center shadow-2xs transition-all text-[9px] font-black tracking-tighter active:scale-95"
              >
                +5M
              </button>
            )}

            {/* Clear Status Trigger */}
            {(seconds > 0 && !isActive) && (
              <button 
                onClick={() => { setSeconds(0); setIsActive(false); }}
                className="w-7 h-7 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-600 flex items-center justify-center transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[14px] font-bold">restart_alt</span>
              </button>
            )}
          </div>

        </div>
      </div>
    </motion.div>
  );
}