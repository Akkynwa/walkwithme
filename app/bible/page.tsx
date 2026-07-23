'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useTheme } from '../context/ThemeContext';

interface BibleTool {
  title: string;
  description: string;
  href: string;
  icon: string;
  span: string;
  themeStyles: {
    light: { bg: string; icon: string; border: string };
    dark: { bg: string; icon: string; border: string };
  };
}

const BIBLE_TOOLS: readonly BibleTool[] = [
  {
    title: 'Sacred Search',
    description: 'Instantly uncover passages, parables, and concepts across all canonical translations with advanced semantic searching.',
    href: '/bible/search',
    icon: 'search',
    span: 'md:col-span-2',
    themeStyles: {
      light: { bg: 'bg-amber-50/60', icon: 'text-amber-700', border: 'border-amber-200/40 group-hover:border-amber-300' },
      dark: { bg: 'bg-zinc-900/50', icon: 'text-amber-400', border: 'border-zinc-800/80 group-hover:border-zinc-700' }
    }
  },
  {
    title: 'Parallel Study',
    description: 'Compare multi-version translations side-by-side to deconstruct original contexts.',
    href: '/bible/compare',
    icon: 'compare_arrows',
    span: 'md:col-span-1',
    themeStyles: {
      light: { bg: 'bg-stone-50/60', icon: 'text-stone-700', border: 'border-stone-200/40 group-hover:border-stone-300' },
      dark: { bg: 'bg-zinc-900/30', icon: 'text-zinc-400', border: 'border-zinc-800/60 group-hover:border-zinc-700' }
    }
  },
  {
    title: 'The Reading Room',
    description: 'Immerse your spirit in a distraction-free, beautifully tracked editorial viewing workspace designed for focused scripture meditation.',
    href: '/bible/default',
    icon: 'menu_book',
    span: 'md:col-span-3',
    themeStyles: {
      light: { bg: 'bg-amber-50/60', icon: 'text-amber-700', border: 'border-amber-200/40 group-hover:border-amber-300' },
      dark: { bg: 'bg-zinc-900/50', icon: 'text-amber-400', border: 'border-zinc-800/80 group-hover:border-zinc-700' }
    }
  }
] as const;

export default function BibleHubPage() {
  const { isDark } = useTheme();

  return (
    <div className={`relative flex min-h-screen overflow-hidden transition-colors duration-300 antialiased font-sans ${
      isDark ? 'bg-zinc-950 text-zinc-50' : 'bg-[#FAF9F5] text-stone-800'
    }`}>
      
      {/* Immersive Deep Blur Background Art */}
      <div className="fixed inset-0 z-0 pointer-events-none select-none" aria-hidden="true">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=2070"
          alt=""
          fill
          className="object-cover scale-105 blur-2xl opacity-[0.06]"
          priority
        />
        <div className={`absolute inset-0 bg-gradient-to-tr transition-colors duration-300 ${
          isDark 
            ? 'from-zinc-950/98 via-zinc-950/65 to-slate-900/40' 
            : 'from-[#FAF9F5]/98 via-[#FAF9F5]/60 to-white/40'
        }`} />
      </div>

      {/* Ambient Pulsing Glow Fields */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
        <div className={`absolute top-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[150px] animate-pulse duration-[10000ms] transition-colors ${
          isDark ? 'bg-zinc-800/20' : 'bg-amber-200/20'
        }`} />
        <div className={`absolute bottom-[-15%] left-[-10%] w-[550px] h-[550px] rounded-full blur-[170px] animate-pulse duration-[12000ms] transition-colors ${
          isDark ? 'bg-zinc-700/10' : 'bg-amber-600/5'
        }`} style={{ animationDelay: '-5s' }} />
      </div>

      {/* Main Container Viewport Surface */}
      <div className="relative z-10 flex-1 lg:ml-56 pt-24 pb-20 overflow-y-auto h-screen w-full [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-stone-500/10 dark:[&::-webkit-scrollbar-thumb]:bg-zinc-500/10 [&::-webkit-scrollbar-thumb]:rounded-full">
        <main className="max-w-4xl mx-auto px-6 md:px-12 w-full space-y-12">
          
          {/* Typographic Header Section */}
          <header className="text-center md:text-left space-y-4">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <span className={`text-[11px] font-bold uppercase tracking-[0.25em] transition-colors ${
                isDark ? 'text-zinc-400' : 'text-amber-800'
              }`}>
                Sacred Scriptures
              </span>
              <div className={`w-14 h-px transition-colors ${
                isDark ? 'bg-zinc-800' : 'bg-amber-900/20'
              }`} />
            </div>
            
            <div className="space-y-3">
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-serif font-normal tracking-tight leading-none transition-colors ${
                isDark ? 'text-zinc-100' : 'text-stone-900'
              }`}>
                The Holy Bible
              </h1>
              <p className={`text-sm md:text-base font-sans leading-relaxed max-w-md transition-colors ${
                isDark ? 'text-zinc-400' : 'text-stone-500'
              }`}>
                Interact with historically deep translations, comparative analysis software, and adaptive spiritual spaces.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-3 justify-center md:justify-start">
              <div className={`w-8 h-[1.5px] rounded-full transition-colors ${
                isDark ? 'bg-zinc-700' : 'bg-amber-700/60'
              }`} />
              <p className={`text-xs md:text-sm italic font-serif transition-colors ${
                isDark ? 'text-zinc-500' : 'text-stone-400'
              }`}>
                "Your word is a lamp to my feet and a light to my path."
              </p>
            </div>
          </header>

          {/* Asymmetrical Bento Grid Workspace Layout */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-5" aria-label="Bible Application Modules">
            {BIBLE_TOOLS.map((tool) => {
              const activeStyle = isDark ? tool.themeStyles.dark : tool.themeStyles.light;

              return (
                <Link 
                  key={tool.title} 
                  href={tool.href}
                  className={`${tool.span} group relative backdrop-blur-xl border rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-500 flex flex-col justify-between overflow-hidden focus-visible:outline-none focus-visible:ring-2 ${
                    isDark
                      ? 'bg-zinc-900/40 border-zinc-800/80 hover:border-zinc-700/80 focus-visible:ring-zinc-500'
                      : 'bg-white/60 border-stone-200/60 hover:border-stone-300 focus-visible:ring-amber-600'
                  }`}
                >
                  <article>
                    {/* Background Micro Hover Fluid Accent */}
                    <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none ${
                      isDark
                        ? 'bg-gradient-to-bl from-zinc-800/10 via-transparent to-transparent'
                        : 'bg-gradient-to-bl from-amber-500/[0.02] via-transparent to-transparent'
                    }`} />
                    
                    {/* Icon Block Container */}
                    <div className={`w-10 h-10 border rounded-xl flex items-center justify-center mb-6 group-hover:scale-105 transition-all duration-500 ${activeStyle.bg} ${activeStyle.border}`}>
                      <span className={`material-symbols-outlined text-xl transition-transform duration-500 group-hover:rotate-2 ${activeStyle.icon}`}>
                        {tool.icon}
                      </span>
                    </div>
                    
                    <h3 className={`text-lg md:text-xl font-serif font-medium mb-2 transition-colors ${
                      isDark ? 'text-zinc-200 group-hover:text-zinc-100' : 'text-stone-900 group-hover:text-amber-900'
                    }`}>
                      {tool.title}
                    </h3>
                    
                    <p className={`text-xs md:text-sm leading-relaxed font-sans transition-colors ${
                      isDark ? 'text-zinc-400' : 'text-stone-500'
                    }`}>
                      {tool.description}
                    </p>
                  </article>

                  {/* Micro Interaction Link Trigger */}
                  <div className={`mt-8 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider opacity-60 group-hover:opacity-100 transition-all translate-x-[-2px] group-hover:translate-x-0 duration-300 ${
                    isDark ? 'text-zinc-400' : 'text-amber-800'
                  }`}>
                    <span>Open Module</span>
                    <span className="material-symbols-outlined text-[13px] font-bold transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true">
                      chevron_right
                    </span>
                  </div>
                </Link>
              );
            })}
          </section>

          {/* Quick Access Sanctuary Session Banner Component */}
          <section className={`group relative backdrop-blur-xl border rounded-2xl p-6 md:p-8 overflow-hidden transition-all duration-300 ${
            isDark
              ? 'bg-zinc-900/20 border-zinc-800/80 hover:border-zinc-700/80'
              : 'bg-gradient-to-br from-white/80 to-stone-50/60 border-stone-200/60 hover:border-stone-300/80'
          }`} aria-label="Persistent Session State">
            <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-lg">
                <div className="flex items-center gap-2">
                  <span className={`material-symbols-outlined text-sm animate-pulse ${
                    isDark ? 'text-zinc-400' : 'text-amber-700'
                  }`} aria-hidden="true">
                    history
                  </span>
                  <h4 className={`text-[10px] font-bold uppercase tracking-widest ${
                    isDark ? 'text-zinc-400' : 'text-amber-800'
                  }`}>
                    Continue Reading Journey
                  </h4>
                </div>
                <div className="space-y-1">
                  <h2 className={`text-xl md:text-2xl font-serif font-normal transition-colors ${
                    isDark ? 'text-zinc-200' : 'text-stone-900'
                  }`}>
                    Genesis Chapter 1
                  </h2>
                  <p className={`text-xs md:text-sm font-sans leading-relaxed transition-colors ${
                    isDark ? 'text-zinc-400' : 'text-stone-400'
                  }`}>
                    Pick up right where you left your thoughts during your previous sanctuary meditation window.
                  </p>
                </div>
              </div>
              
              <Link 
                href="/bible/en/kjv/genesis/1" 
                className={`inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-[11px] font-bold uppercase tracking-wider shadow-sm hover:shadow-md transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 ${
                  isDark
                    ? 'bg-zinc-100 text-zinc-950 hover:bg-zinc-200 focus-visible:ring-zinc-400'
                    : 'bg-stone-900 text-white hover:bg-amber-950 focus-visible:ring-stone-600'
                }`}
              >
                Resume Session
              </Link>
            </div>
            
            {/* Embedded Abstract Decorative Backdrop Watermark Mask */}
            <span className={`absolute -right-6 -bottom-10 material-symbols-outlined text-[140px] pointer-events-none select-none transition-transform duration-700 group-hover:scale-105 ${
              isDark ? 'text-zinc-800/10' : 'text-stone-900/[0.02]'
            }`} aria-hidden="true">
              auto_stories
            </span>
          </section>

          {/* Minimal Layout Divider Decorative Accent */}
          <footer className="pt-4 flex justify-center items-center gap-6 opacity-30 select-none pointer-events-none" aria-hidden="true">
            <div className={`h-[1px] w-20 ${
              isDark ? 'bg-gradient-to-r from-transparent to-zinc-700' : 'bg-gradient-to-r from-transparent to-stone-300'
            }`} />
            <span className={`material-symbols-outlined text-base ${
              isDark ? 'text-zinc-600' : 'text-stone-400'
            }`}>
              spa
            </span>
            <div className={`h-[1px] w-20 ${
              isDark ? 'bg-gradient-to-l from-transparent to-zinc-700' : 'bg-gradient-to-l from-transparent to-stone-300'
            }`} />
          </footer>

        </main>
      </div>
    </div>
  );
}