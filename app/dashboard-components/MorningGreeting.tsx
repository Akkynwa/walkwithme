'use client';

import React from 'react';
import Link from 'next/link';
import { useTheme } from '../context/ThemeContext';

export function MorningGreeting({ name }: { name: string }) {
  const { isDark } = useTheme();
  const firstName = name.split(' ')[0];
  const hour = new Date().getHours();
  
  const getPeriod = () => {
    if (hour < 12) return { 
      label: 'Morning', 
      sub: 'The light is new, and so is His mercy.', 
      gradient: 'from-blue-400/20 to-cyan-400/20',
      accent: 'text-blue-600',
      darkAccent: 'text-blue-400',
      icon: 'wb_sunny',
      streakColor: 'from-blue-500 to-cyan-500'
    };
    if (hour < 17) return { 
      label: 'Afternoon', 
      sub: 'Stay anchored in the stillness.', 
      gradient: 'from-teal-400/20 to-emerald-400/20',
      accent: 'text-teal-600',
      darkAccent: 'text-teal-400',
      icon: 'sunny',
      streakColor: 'from-teal-500 to-emerald-500'
    };
    return { 
      label: 'Evening', 
      sub: 'Reflect on the journey of today.', 
      gradient: 'from-indigo-400/20 to-purple-400/20',
      accent: 'text-indigo-600',
      darkAccent: 'text-indigo-400',
      icon: 'nights_stay',
      streakColor: 'from-indigo-500 to-purple-500'
    };
  };

  const period = getPeriod();

  return (
    <section className={`relative overflow-hidden rounded-3xl backdrop-blur-xl border shadow-2xl animate-in fade-in slide-in-from-top-4 duration-1000 group ${
      isDark 
        ? 'bg-black/40 border-white/10' 
        : 'bg-white/40 border-white/60'
    }`}>
      {/* Animated gradient background */}
      <div className={`absolute inset-0 bg-gradient-to-br ${period.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />
      
      {/* Decorative top line */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-${period.accent.split('-')[1]}-400/50 to-transparent`} />
      
      {/* Content Container */}
      <div className="relative z-10 p-6 md:p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6">
          
          {/* Left Column - Greeting */}
          <div className="space-y-3 flex-1">
            {/* Date Badge */}
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 backdrop-blur-sm rounded-full border ${
              isDark 
                ? 'bg-black/30 border-white/10' 
                : 'bg-white/50 border-white/60'
            }`}>
              <span className={`material-symbols-outlined text-[14px] ${isDark ? period.darkAccent : period.accent}`}>calendar_today</span>
              <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </span>
            </div>
            
            {/* Greeting Title */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-3xl ${isDark ? period.darkAccent : period.accent}`}>
                  {period.icon}
                </span>
                <h1 className={`text-3xl md:text-4xl lg:text-5xl font-serif tracking-tight ${isDark ? 'text-gray-100' : 'text-gray-800'}`}>
                  Good {period.label},
                </h1>
              </div>
              <h2 className={`text-4xl md:text-5xl lg:text-6xl font-serif font-bold italic ${isDark ? period.darkAccent : period.accent}`}>
                {firstName}
              </h2>
            </div>
            
            {/* Inspirational Message */}
            <div className="flex items-center gap-2 pt-2">
              <div className={`w-8 h-px bg-gradient-to-r from-${period.accent.split('-')[1]}-400 to-transparent`} />
              <p className={`text-sm font-serif italic ${isDark ? 'text-gray-400' : 'text-gray-600/80'}`}>
                {period.sub}
              </p>
            </div>
          </div>
          
          {/* Right Column - Streak Card */}
          <Link 
            href="/streak" 
            className={`group/streak block backdrop-blur-md border rounded-2xl p-5 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 cursor-pointer min-w-[180px] ${
              isDark 
                ? 'bg-black/50 border-white/10 hover:bg-black/70' 
                : 'bg-white/50 border-white/60 hover:bg-white/70'
            }`}
          >
            {/* Streak Label */}
            <div className="flex items-center gap-2 mb-3">
              <span className={`material-symbols-outlined text-[14px] ${isDark ? period.darkAccent : period.accent}`}>local_fire_department</span>
              <p className={`text-[8px] font-black uppercase tracking-[0.2em] transition-colors ${
                isDark 
                  ? 'text-gray-500 group-hover/streak:text-gray-300' 
                  : 'text-gray-500 group-hover/streak:text-gray-700'
              }`}>
                Consecutive Alignment
              </p>
            </div>
            
            {/* Streak Value */}
            <div className="flex items-center gap-3">
              {/* Animated Visual Element */}
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${period.gradient} animate-pulse`} />
                <div className={`absolute inset-1 rounded-full backdrop-blur-sm ${isDark ? 'bg-black/40' : 'bg-white/40'}`} />
                <div className="relative flex items-center justify-center">
                  <span className={`material-symbols-outlined text-2xl ${isDark ? period.darkAccent : period.accent}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                    whatshot
                  </span>
                </div>
              </div>
              
              {/* Streak Numbers */}
              <div className="flex flex-col">
                <div className="flex items-baseline gap-1">
                  <span className={`text-3xl font-black leading-none ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>12</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Days</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span className={`text-[8px] font-medium transition-colors flex items-center gap-1 ${
                    isDark 
                      ? 'text-gray-500 group-hover/streak:text-gray-400' 
                      : 'text-gray-400 group-hover/streak:text-gray-600'
                  }`}>
                    View Journey
                    <span className="text-[10px] transition-transform group-hover/streak:translate-x-1">→</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Progress Indicator */}
            <div className={`mt-4 pt-3 border-t ${isDark ? 'border-white/10' : 'border-gray-200/50'}`}>
              <div className={`flex items-center justify-between text-[7px] mb-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                <span>Monthly Goal</span>
                <span>12/30 days</span>
              </div>
              <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDark ? 'bg-white/10' : 'bg-gray-200/50'}`}>
                <div 
                  className={`h-full bg-gradient-to-r ${period.streakColor} rounded-full transition-all duration-500`}
                  style={{ width: '40%' }}
                />
              </div>
            </div>

            {/* Mini encouragement */}
            <div className={`mt-3 text-[7px] text-center ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
              {12 >= 7 ? "Keep the momentum going!" : "Start your journey today"}
            </div>
          </Link>
        </div>
      </div>

      {/* Bottom decorative gradient line */}
      <div className={`absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-${period.accent.split('-')[1]}-400/30 to-transparent`} />
    </section>
  );
}