'use client';

import Link from 'next/link';
import Sidebar from '@/app/layout-components/Sidebar';
import Header from '@/app/layout-components/Header';
import Image from 'next/image';

const BIBLE_TOOLS = [
  {
    title: 'Sacred Search',
    description: 'Find specific verses, parables, or keywords across all translations.',
    href: '/bible/search',
    icon: 'search',
    color: 'bg-amber-50/80',
    iconColor: 'text-amber-600'
  },
  {
    title: 'Parallel Study',
    description: 'Compare multiple translations side-by-side for deeper understanding.',
    href: '/bible/compare',
    icon: 'compare_arrows',
    color: 'bg-amber-50/80',
    iconColor: 'text-amber-600'
  },
  {
    title: 'The Reading Room',
    description: 'Immerse yourself in the Word with a focused, distraction-free interface.',
    href: '/bible/default',
    icon: 'menu_book',
    color: 'bg-amber-50/80',
    iconColor: 'text-amber-600'
  }
];

export default function BibleHubPage() {
  return (
    <div className="relative flex min-h-screen">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=2070"
          alt="Peaceful sanctuary background"
          fill
          className="object-cover scale-110 blur-xl opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/30"></div>
      </div>

      {/* Subtle Animated Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-amber-200/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-amber-300/8 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '-3s' }} />
      </div>

      <Sidebar />
      <Header />

      <main className="relative z-10 flex-1 lg:ml-56 pt-20 pb-16 px-6 md:px-10 max-w-5xl mx-auto w-full">
        {/* Header */}
        <section className="mb-12 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
            <div className="w-8 h-px bg-amber-400/40" />
            <span className="text-[8px] font-black uppercase tracking-wider text-amber-600">Sacred Scriptures</span>
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif text-gray-800 tracking-tight mb-3">
            The Holy Bible
          </h1>
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <div className="w-10 h-0.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full" />
            <p className="text-sm text-gray-600 italic font-serif">
              "Your word is a lamp to my feet"
            </p>
          </div>
        </section>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BIBLE_TOOLS.map((tool) => (
            <Link 
              key={tool.title} 
              href={tool.href}
              className="group relative bg-white/40 backdrop-blur-xl border border-white/60 rounded-xl p-6 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-500"
            >
              {/* Icon */}
              <div className={`w-12 h-12 ${tool.color} rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-500`}>
                <span className={`material-symbols-outlined ${tool.iconColor} text-2xl`}>
                  {tool.icon}
                </span>
              </div>
              
              <h3 className="text-lg font-serif font-semibold text-gray-800 mb-2 group-hover:text-amber-700 transition-colors">
                {tool.title}
              </h3>
              
              <p className="text-[10px] text-gray-600 leading-relaxed mb-5">
                {tool.description}
              </p>

              {/* Hover Indicator */}
              <div className="flex items-center gap-1.5 text-[7px] font-black uppercase tracking-wider text-amber-600 opacity-0 group-hover:opacity-100 transition-all translate-x-[-4px] group-hover:translate-x-0 duration-300">
                <span>Enter Space</span>
                <span className="material-symbols-outlined text-[10px]">arrow_forward</span>
              </div>
              
              {/* Subtle Decorative Gold Corner */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-amber-500/10 to-transparent rounded-tr-xl -z-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Link>
          ))}
        </div>

        {/* Quick Access Section */}
        <section className="mt-10 p-6 bg-white/40 backdrop-blur-xl border border-white/60 rounded-xl shadow-lg relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-5">
            <div className="max-w-md text-center md:text-left">
              <div className="flex items-center gap-1.5 mb-2 justify-center md:justify-start">
                <span className="material-symbols-outlined text-amber-500 text-[12px]">history</span>
                <h4 className="text-[7px] font-black uppercase tracking-wider text-amber-600">Continue Journey</h4>
              </div>
              <h2 className="text-lg font-serif font-semibold text-gray-800">Last read: Genesis Chapter 1</h2>
              <p className="text-[9px] text-gray-500 mt-1">Pick up exactly where you left off in your last meditation session.</p>
            </div>
            
            <Link 
              href="/bible/en/kjv/genesis/1" 
              className="px-5 py-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg text-[8px] font-black uppercase tracking-wider hover:shadow-md hover:scale-[1.02] transition-all"
            >
              Resume Reading
            </Link>
          </div>
          
          {/* Faded background icon */}
          <span className="absolute -right-8 -bottom-8 material-symbols-outlined text-[120px] text-amber-500/5 pointer-events-none select-none">
            auto_stories
          </span>
        </section>

        {/* Decorative Footer */}
        <div className="mt-10 flex justify-center items-center gap-4 opacity-30">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400" />
          <span className="material-symbols-outlined text-amber-400 text-sm">menu_book</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400" />
        </div>
      </main>
    </div>
  );
}