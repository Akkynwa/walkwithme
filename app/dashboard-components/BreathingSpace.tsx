'use client';

import React, { useState, useEffect, useRef } from 'react';

export function BreathingSpace() {
  const [isActive, setIsActive] = useState(false);
  const [seconds, setSeconds] = useState(60);
  const [breathPhase, setBreathPhase] = useState<'inhale' | 'exhale' | 'hold'>('inhale');
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Gentle chime sound for transitions (optional)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      audioRef.current = new Audio('/sounds/gentle-chime.mp3'); // Add your sound file
    }
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    let breathInterval: NodeJS.Timeout;
    
    if (isActive && seconds > 0) {
      interval = setInterval(() => setSeconds(s => s - 1), 1000);
      
      // Breathing pattern: inhale 4s, hold 4s, exhale 4s
      let phaseIndex = 0;
      const phases: ('inhale' | 'hold' | 'exhale')[] = ['inhale', 'hold', 'exhale'];
      breathInterval = setInterval(() => {
        phaseIndex = (phaseIndex + 1) % phases.length;
        setBreathPhase(phases[phaseIndex]);
        
        // Play gentle sound on breath change (optional)
        if (audioRef.current && isActive) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(() => {});
        }
      }, 4000);
      
    } else if (seconds === 0) {
      setIsActive(false);
      setSeconds(60);
      setBreathPhase('inhale');
      // Play completion sound
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(() => {});
      }
    }
    
    return () => {
      clearInterval(interval);
      clearInterval(breathInterval);
    };
  }, [isActive, seconds]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    if (mins > 0) {
      return `${mins}:${remainingSecs.toString().padStart(2, '0')}`;
    }
    return `${remainingSecs}s`;
  };

  const getBreathInstruction = () => {
    switch (breathPhase) {
      case 'inhale': return 'Breathe in gently...';
      case 'hold': return 'Hold...';
      case 'exhale': return 'Breathe out slowly...';
      default: return 'Breathe...';
    }
  };

  const getCircleScale = () => {
    switch (breathPhase) {
      case 'inhale': return 'scale-110';
      case 'hold': return 'scale-110';
      case 'exhale': return 'scale-90';
      default: return 'scale-100';
    }
  };

  return (
    <div className="relative group overflow-hidden rounded-3xl shadow-2xl transition-all duration-500 bg-white/40 backdrop-blur-xl border border-white/60">
      {/* Animated Gradient Aura */}
      <div className={`absolute inset-0 bg-gradient-to-br from-amber-500/20 via-transparent to-emerald-500/10 transition-all duration-1000 ${
        isActive ? 'opacity-100' : 'opacity-0'
      }`} />
      
      {/* Animated breathing rings */}
      {isActive && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className={`absolute w-40 h-40 rounded-full border-2 border-amber-400/30 animate-ping transition-all duration-4000 ${getCircleScale()}`} />
          <div className="absolute w-32 h-32 rounded-full border border-amber-400/20 animate-pulse" />
        </div>
      )}

      <div className="relative z-10 p-6 md:p-8 text-center">
        {/* Main Visual Element */}
        <div className="relative w-24 h-24 mx-auto mb-6">
          <div className={`absolute inset-0 rounded-full border-2 border-amber-400/30 transition-all duration-1000 ${
            isActive ? 'opacity-100' : 'opacity-0'
          }`} />
          
          <div className={`w-full h-full rounded-full bg-gradient-to-br from-amber-500/20 to-amber-600/10 backdrop-blur-sm border border-white/40 flex items-center justify-center transition-all duration-1000 ${
            isActive ? `scale-110 shadow-2xl shadow-amber-500/30 ${getCircleScale()}` : 'scale-100'
          }`}>
            {isActive ? (
              <div className="text-center">
                <div className="text-2xl font-serif font-light text-white animate-pulse">
                  {formatTime(seconds)}
                </div>
                <div className="text-[8px] text-amber-300/80 uppercase tracking-wider mt-1">
                  {breathPhase}
                </div>
              </div>
            ) : (
              <span className="material-symbols-outlined text-3xl text-amber-600">spa</span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-serif text-gray-800 mb-2">
          {isActive ? getBreathInstruction() : 'Sacred Pause'}
        </h3>
        
        {/* Description */}
        <p className="text-[11px] text-gray-600/80 leading-relaxed max-w-[220px] mx-auto mb-6">
          {isActive 
            ? `Quiet your mind. Release the noise. ${Math.ceil(seconds / 4)} breaths remain.` 
            : 'A 60-second structural break to center your heart before the Word.'}
        </p>

        {/* Progress Bar */}
        {isActive && (
          <div className="w-full h-1 bg-white/20 rounded-full mb-6 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all duration-1000"
              style={{ width: `${(seconds / 60) * 100}%` }}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div className="space-y-2">
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`w-full py-3.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${
              isActive 
                ? 'bg-white/10 backdrop-blur-sm text-gray-700 border border-gray-300/50 hover:bg-white/20 hover:scale-[1.02]' 
                : 'bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg shadow-amber-500/25 hover:shadow-xl hover:scale-[1.02]'
            }`}
          >
            {isActive ? (
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[14px]">cancel</span>
                End Silence
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-[14px]">self_improvement</span>
                Begin Sacred Pause
              </span>
            )}
          </button>

          {/* Quick duration selector (optional) */}
          {!isActive && (
            <div className="flex gap-2 justify-center pt-2">
              {[30, 60, 90].map((dur) => (
                <button
                  key={dur}
                  onClick={() => setSeconds(dur)}
                  className={`text-[8px] px-3 py-1 rounded-full transition-all ${
                    seconds === dur
                      ? 'bg-amber-100 text-amber-700 font-bold'
                      : 'text-gray-400 hover:text-amber-600'
                  }`}
                >
                  {dur}s
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Inspirational Quote */}
        <div className="mt-6 pt-4 border-t border-gray-200/50">
          <p className="text-[8px] text-gray-400 italic">
            {isActive 
              ? "Be still, and know that I am God." 
              : "In the quiet, we find our center."}
          </p>
        </div>
      </div>
    </div>
  );
}