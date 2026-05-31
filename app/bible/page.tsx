'use client';

import Link from 'next/link';
import Sidebar from '@/app/layout-components/Sidebar';
import Header from '@/app/layout-components/Header';

const BIBLE_TOOLS = [
  {
    title: 'Sacred Search',
    description: 'Find specific verses, parables, or keywords across all translations.',
    href: '/bible/search',
    icon: 'search_spark',
    color: 'bg-amber-50'
  },
  {
    title: 'Parallel Study',
    description: 'Compare multiple translations side-by-side for deeper understanding.',
    href: '/bible/compare',
    icon: 'import_contacts',
    color: 'bg-stone-50'
  },
  {
    title: 'The Reading Room',
    description: 'Immerse yourself in the Word with a focused, distraction-free interface.',
    href: '/bible/en/kjv/genesis/1', // Default entry point
    icon: 'menu_book',
    color: 'bg-orange-50/30'
  }
];

export default function BibleHubPage() {
  return (
    <div className="flex min-h-screen bg-[#FDFDFF]">
      <Sidebar />
      <Header />

      <main className="flex-1 lg:ml-64 pt-28 pb-20 px-6 md:px-12 max-w-[1200px] mx-auto w-full">
        {/* --- HEADER --- */}
        <section className="mb-16 text-center md:text-left">
          <h1 className="text-5xl font-serif text-[#3C3830] tracking-tight mb-4">The Holy Bible</h1>
          <p className="text-[#7C7565] italic font-serif text-lg max-w-2xl border-l-2 border-[#D4AF37] pl-6 py-2">
            &quot;Your word is a lamp to my feet and a light to my path.&quot; — Psalm 119:105
          </p>
        </section>

        {/* --- NAVIGATION GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BIBLE_TOOLS.map((tool) => (
            <Link 
              key={tool.title} 
              href={tool.href}
              className="group relative bg-white border border-gray-100 p-8 rounded-[32px] shadow-sm hover:shadow-xl hover:shadow-[#D4AF37]/5 transition-all duration-500 hover:-translate-y-2"
            >
              <div className={`w-14 h-14 ${tool.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                <span className="material-symbols-rounded text-[#D4AF37] text-3xl" style={{ fontVariationSettings: "'wght' 300" }}>
                  {tool.icon}
                </span>
              </div>
              
              <h3 className="text-xl font-serif font-medium text-[#3C3830] mb-3 group-hover:text-[#D4AF37] transition-colors">
                {tool.title}
              </h3>
              
              <p className="text-sm text-[#7C7565] leading-relaxed mb-8">
                {tool.description}
              </p>

              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] opacity-0 group-hover:opacity-100 transition-all">
                <span>Enter Space</span>
                <span className="material-symbols-rounded text-xs">arrow_forward</span>
              </div>
              
              {/* Subtle Decorative Gold Corner */}
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#D4AF37]/5 to-transparent rounded-tr-[32px] -z-10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            </Link>
          ))}
        </div>

        {/* --- QUICK ACCESS SECTION --- */}
        <section className="mt-20 p-10 bg-white border border-gray-100 rounded-[40px] relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-md">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-4">Continue Journey</h4>
              <h2 className="text-2xl font-serif text-[#3C3830]">Last read: Genesis Chapter 1</h2>
              <p className="text-sm text-[#7C7565] mt-2">Pick up exactly where you left off in your last meditation session.</p>
            </div>
            
            <Link 
              href="/bible/en/kjv/genesis/1" 
              className="px-10 py-4 bg-[#3C3830] text-white rounded-full text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#D4AF37] transition-all shadow-lg"
            >
              Resume Reading
            </Link>
          </div>
          
          {/* Faded background icon */}
          <span className="absolute -right-10 -bottom-10 material-symbols-rounded text-[200px] text-[#D4AF37]/5 pointer-events-none" style={{ fontVariationSettings: "'wght' 100" }}>
            auto_stories
          </span>
        </section>
      </main>
    </div>
  );
}