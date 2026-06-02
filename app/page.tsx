'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from './layout-components/Sidebar';
import Header from './layout-components/Header';

// Sub-components
import { MorningGreeting } from './dashboard-components/MorningGreeting';
import { AnchorVerse } from './dashboard-components/AnchorVerse';
import { WorkspaceGrid } from './dashboard-components/WorkspaceGrid';
import { TestimonyScroll } from './dashboard-components/TestimonyScroll';
import { BreathingSpace } from './dashboard-components/BreathingSpace';

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
      <div className="flex items-center justify-center min-h-screen bg-[#FDFDFF]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 bg-primary/20 rounded-full mb-4"></div>
          <p className="font-serif italic text-[#4d6054]">Preparing your Sanctuary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F4F7F5] selection:bg-[#4d6054]/10">
      <Sidebar />
      
      {/* Absolute Layer: Dynamic Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-bl from-[#f7ebd9]/30 to-transparent blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-tr from-[#4d6054]/5 to-transparent blur-[120px]" />
      </div>

      <div className="flex-1 lg:ml-64 relative z-10">
        <Header />
        
        <main className="pt-24 pb-12 px-4 md:px-10 max-w-[1600px] mx-auto">
          {/* 1. Alluring Entry Ambience */}
          <MorningGreeting name={session?.user?.name || 'Friend'} />

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 mt-10">
            {/* Left Column: Core Focus */}
            <div className="xl:col-span-8 space-y-10">
              <AnchorVerse />
              <WorkspaceGrid />
            </div>

            {/* Right Column: Community & Support */}
            <aside className="xl:col-span-4 space-y-8">
              <BreathingSpace />
              <TestimonyScroll />
            </aside>
          </div>
        </main>
      </div>
    </div>
  );
}