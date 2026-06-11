'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Sidebar from './layout-components/Sidebar';
import Header from './layout-components/Header';

// Existing Sub-components
import { MorningGreeting } from './dashboard-components/MorningGreeting';
import { AnchorVerse } from './dashboard-components/AnchorVerse';
import { WorkspaceGrid } from './dashboard-components/WorkspaceGrid';
import { TestimonyScroll } from './dashboard-components/TestimonyScroll';
import { BreathingSpace } from './dashboard-components/BreathingSpace';

// NEWLY INTEGRATED COMPONENTS FOR STREAKS & PROGRESS TRACKING
import ProgressTracker from '@/components/ProgressTracker';
import { MotivationFeed } from '@/components/MotivationFeed';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      setLoading(false);
    }
  }, [status, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="relative flex items-center justify-center min-h-screen overflow-hidden bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-br from-amber-600 to-amber-700 rounded-2xl flex items-center justify-center shadow-2xl shadow-amber-500/20 mb-6 animate-pulse">
            <span className="material-symbols-outlined text-white text-3xl animate-spin">sync</span>
          </div>
          <p className="font-serif italic text-gray-600 text-sm">Preparing your Sanctuary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen font-sans bg-gradient-to-br from-amber-50/30 via-white/40 to-orange-50/30">
      {/* Blurred, Faded Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=2070"
          alt="Peaceful sanctuary background"
          fill
          className="object-cover scale-110 blur-xl opacity-30"
          priority
        />
        {/* Additional fade overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/30"></div>
      </div>

      {/* Subtle Animated Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-amber-200/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-amber-300/8 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '-3s' }} />
      </div>

      <Sidebar />
      
      <div className="flex-1 lg:ml-56 relative z-10">
        <Header />
        
        <main className="pt-20 pb-12 px-4 md:px-8 max-w-[1600px] mx-auto">
          {/* 1. Alluring Entry Ambience */}
          <MorningGreeting name={session?.user?.name || 'Friend'} />

          {/* NEW: Dynamic Metrics Tracker Section */}
          <div className="mt-6">
            <ProgressTracker />
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 lg:gap-8 mt-8">
            {/* Left Column: Core Focus */}
            <div className="xl:col-span-8 space-y-6 lg:space-y-8">
              <AnchorVerse />
              <WorkspaceGrid />
            </div>

            {/* Right Column: Community Support & Mutual Motivation */}
            <aside className="xl:col-span-4 space-y-6 lg:space-y-8">
              <BreathingSpace />
              
              {/* NEW: Mutual Motivation Loop Feed */}
              <div className="bg-white/40 backdrop-blur-md border border-white/60 p-5 rounded-2xl shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <span className="material-symbols-outlined text-amber-600 text-xl">groups</span>
                  <h3 className="font-serif italic text-sm text-slate-800 font-bold">Encourage the Body</h3>
                </div>
                <MotivationFeed />
              </div>

              <TestimonyScroll />
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}