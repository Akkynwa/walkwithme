'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from './layout-components/Sidebar';
import Header from './layout-components/Header';
import Link from 'next/link';
import Image from 'next/image';

interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  reference: string;
}

// Curated list of high-quality, meditative nature images from Unsplash
const SANCTUARY_IMAGES = [
  "https://images.unsplash.com/photo-1470770841072-f978cf4d019e", // Misty Mountains
  "https://images.unsplash.com/photo-1501854140801-50d01698950b", // Valley
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e", // Forest sunlight
  "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b", // Peak view
  "https://images.unsplash.com/photo-1500627761005-74a8fd8a2af3", // Green landscape
  "https://images.unsplash.com/photo-1447752875215-b2761acb3c5d", // Woodland path
  "https://images.unsplash.com/photo-1433086966358-54859d0ed716", // Waterfall
];

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [userName, setUserName] = useState<string>('Friend');
  const [verse, setVerse] = useState<Verse | null>(null);
  const [loading, setLoading] = useState(true);
  const [dailyImage, setDailyImage] = useState(SANCTUARY_IMAGES[0]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (session?.user?.name) {
      const firstName = session.user.name.split(' ')[0];
      setUserName(firstName);
    }

    // Calculate "Day of the Year" to pick a consistent daily image
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayIndex = Math.floor(diff / oneDay);
    setDailyImage(SANCTUARY_IMAGES[dayIndex % SANCTUARY_IMAGES.length]);

    const fetchVerse = async () => {
      try {
        const response = await fetch('/api/bible/verse');
        const data = await response.json();
        if (data.success) {
          setVerse(data.verse);
        }
      } catch (error) {
        console.error('Failed to fetch verse:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVerse();
  }, [session, status, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#FDFDFF]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="font-serif italic text-gray-400 text-sm">Entering...</p>
        </div>
      </div>
    );
  }

  const quickActions = [
    { 
      icon: 'auto_awesome', 
      title: 'Spiritual Walker AI', 
      subtitle: 'Reflect deeply on the Word', 
      href: '/ai/chat',
      img: 'https://images.unsplash.com/photo-1519817650390-64a93db51149',
      color: 'from-primary/70 to-black/40'
    },
    { 
      icon: 'history_edu', 
      title: 'Daily Reflection', 
      subtitle: 'Preserve today\'s shifts', 
      href: '/reflect',
      img: 'https://images.unsplash.com/photo-1444492417251-9c84a5fa1c10',
      color: 'from-primary/70 to-black/40'
    },
    { 
      icon: 'volunteer_activism', 
      title: 'Support the Vision', 
      subtitle: 'Sow a seed into the ecosystem', 
      href: '/DonatePage',
      img: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad',
      color: 'from-primary/70 to-black/40'
    },
  ];

  return (
    <div className="flex min-h-screen bg-[#FDFDFF] relative overflow-hidden">
      {/* Background Decor Atmospheric Blur */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[15%] right-[5%] w-[500px] h-[500px] rounded-full bg-[#D4AF37]/5 blur-[150px] animate-pulse"></div>
      </div>

      <Sidebar />
      
      <div className="fixed top-0 left-0 lg:left-64 right-0 z-30">
        <Header />
      </div>
      
      <div className="flex-1 lg:ml-64 pt-24 min-h-screen flex flex-col xl:flex-row w-full z-10 relative">
        
        {/* LEFT COMPONENT */}
        <main className="flex-1 px-6 md:px-10 py-10 max-w-[900px] mx-auto xl:mx-0 w-full xl:border-r xl:border-gray-100">
          
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-in fade-in duration-1000">
            <div className="space-y-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37] animate-pulse"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-serif text-[#3C3830] tracking-tight">
                Grace and peace, <span className="text-primary font-serif italic">{userName}</span>
              </h2>
              <p className="text-sm text-[#7C7565] leading-relaxed max-w-xl">
                Welcome to your quiet digital sanctuary—a meditative space designed to anchor your day in the Word.
              </p>
            </div>

            <div className="group relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-[#D4AF37] to-amber-400 rounded-full blur opacity-10 group-hover:opacity-30 transition duration-700"></div>
              <div className="relative flex items-center gap-4 bg-white border border-gray-100 px-5 py-2.5 rounded-full shadow-sm hover:scale-105 transition-all duration-300">
                <div className="bg-orange-500 p-1.5 rounded-full text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Consecutive Sanctuary Days</span>
                  <span className="text-sm font-black text-[#3C3830] leading-tight">7 Days Aligned</span>
                </div>
              </div>
            </div>
          </section>

          {/* Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {verse && (
              <Link 
                href={`/bible/kjv/bible/${verse.book.replace(/ /g, '-').toLowerCase()}`}
                className="md:col-span-8 group relative overflow-hidden rounded-[32px] border border-gray-100 shadow-sm block h-[400px]"
              >
                <Image
                  src={`${dailyImage}?auto=format&fit=crop&q=80&w=1200`} 
                  alt="Daily Sanctuary Background"
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="object-cover group-hover:scale-105 transition-transform duration-[4s] ease-out" 
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
                
                <div className="absolute inset-x-8 bottom-8 z-10 flex flex-col md:flex-row md:items-end justify-between gap-4 text-white">
                  <div className="max-w-md">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D4AF37] mb-2 block">Today's Anchor Passage</span>
                    <h3 className="text-3xl font-serif mb-2">{verse.reference}</h3>
                    <p className="text-white/80 italic font-serif text-sm leading-relaxed line-clamp-3">
                      {`"${verse.text}"`}
                    </p>
                  </div>
                  <span className="whitespace-nowrap bg-white text-[#3C3830] px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center gap-2 group-hover:translate-x-1">
                    Open Text <span className="material-symbols-outlined text-xs">east</span>
                  </span>
                </div>
              </Link>
            )}

            <div className="md:col-span-4 flex flex-col items-center justify-center bg-white border border-gray-100 rounded-[32px] p-8 text-center shadow-sm">
              <div className="mb-6 relative">
                <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center relative z-10 animate-pulse">
                  <span className="material-symbols-outlined text-primary text-3xl">air</span>
                </div>
              </div>
              <h3 className="text-xl font-serif text-[#3C3830] mb-2">Breathe & Transition</h3>
              <p className="text-xs text-[#7C7565] mb-6 leading-relaxed">
                Take a 60-second structural break to transition cleanly into the Word.
              </p>
              <button className="w-full bg-gray-50 border border-gray-100 text-[#3C3830] text-[10px] font-black tracking-widest uppercase py-4 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all">
                Begin Silence
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <section className="mt-12">
            <div className="flex items-center gap-3 mb-6">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Workspace Entryways</h3>
              <div className="h-px flex-grow bg-gray-100"></div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {quickActions.map((action, idx) => (
                <Link
                  key={idx}
                  href={action.href}
                  className="bg-white border border-gray-100 rounded-[24px] p-4 hover:shadow-xl hover:shadow-primary/5 transition-all duration-500 group"
                >
                  <div className="relative h-[140px] rounded-[18px] overflow-hidden mb-4">
                    <Image 
                      src={`${action.img}?auto=format&fit=crop&q=80&w=600`} 
                      fill
                      sizes="300px"
                      className="object-cover group-hover:scale-110 transition-transform duration-[3s]" 
                      alt={action.title} 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 flex items-center justify-center w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/20 text-white">
                      <span className="material-symbols-outlined text-sm">{action.icon}</span>
                    </div>
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#3C3830] mb-1 group-hover:text-primary transition-colors">{action.title}</h4>
                  <p className="text-xs text-[#7C7565] line-clamp-1">{action.subtitle}</p>
                </Link>
              ))}
            </div>
          </section>
        </main>

        {/* RIGHT ASIDE */}
        <aside className="w-full xl:w-80 bg-gray-50/40 p-6 md:p-8 space-y-8 overflow-y-auto">
          <div>
            <h3 className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em] mb-4">
              Voices of the Sanctuary
            </h3>
            <div className="space-y-4">
              <TestimonialCard 
                author="Oluwaseun A."
                location="Lagos"
                quote="The structured reflections let me process morning scripture properly without jumping into emails immediately."
              />
              <TestimonialCard 
                author="Miracle O."
                location="Abuja"
                quote="Having an intentional quiet space has brought true daily alignment into my framework."
              />
            </div>
          </div>

          <div>
            <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">
              Ecosystem Spotlights
            </h3>
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm group hover:border-primary/20 transition-all cursor-pointer">
              <span className="px-2 py-0.5 bg-[#D4AF37]/10 text-[#D4AF37] text-[8px] font-black rounded uppercase tracking-wider inline-block mb-3">
                Premium Sowing Project
              </span>
              <h4 className="font-serif font-bold text-sm text-[#3C3830] mb-2 group-hover:text-primary transition-colors">
                Print Your Journey Volumes
              </h4>
              <p className="text-xs text-[#7C7565] leading-relaxed mb-4">
                Export your saved digital workspace reflections into a linen-bound physical legacy volume automatically.
              </p>
              <Link href="/give" className="text-[9px] font-black uppercase tracking-wider text-primary flex items-center gap-1">
                <span>See Ecosystem Mission</span>
                <span className="material-symbols-outlined text-xs group-hover:translate-x-0.5 transition-transform">arrow_forward</span>
              </Link>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}

function TestimonialCard({ author, location, quote }: { author: string, location: string, quote: string }) {
  return (
    <div className="bg-white border border-gray-100/70 rounded-2xl p-4 shadow-sm">
      <p className="text-xs font-serif italic text-[#7C7565] leading-relaxed mb-3">
        "{quote}"
      </p>
      <div className="flex items-center justify-between border-t border-gray-50 pt-2">
        <span className="text-[10px] font-bold text-[#3C3830]">{author}</span>
        <span className="text-[9px] text-gray-300 uppercase font-black tracking-widest">{location}</span>
      </div>
    </div>
  );
}