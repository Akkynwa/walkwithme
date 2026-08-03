/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

// Relative imports from our isolated components folder
import { AuthForm } from './_components/AuthForm';
import { WelcomeStep } from './_components/WelcomeStep';
import { MoodStep } from './_components/MoodStep';
import { MeditationStep } from './_components/MeditationStep';

export default function AuthPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [userName, setUserName] = useState<string>('');
  
  const [moodPayload, setMoodPayload] = useState({
    selectedMood: '',
    suggestScriptures: true,
    notes: ''
  });

  // Automatically pass the user forward if an active session is detected
  useEffect(() => {
    if (session?.user?.name && currentStep === 1) {
      setUserName(session.user.name);
      setCurrentStep(2);
    }
  }, [session, currentStep]);

  const handleAuthSuccess = (computedName: string) => {
    setUserName(computedName);
    setCurrentStep(2);
  };

  const handleMoodSuccess = (payload: typeof moodPayload) => {
    setMoodPayload(payload);
    setCurrentStep(4); // Advances straight to Meditation
  };

  const handleFinalizePipeline = async (_meditationData: { timeRange: number }) => {
    toast.success('');
    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(249,115,22,0.16),_transparent_35%),linear-gradient(135deg,_#fff7ed_0%,_#ffffff_45%,_#fef2f2_100%)] p-4 font-sans sm:p-6">
      
      {/* STATIC CANVAS CANVAS LAYER (Does not call database endpoints dynamically) */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none filter blur-sm flex flex-col p-8 justify-between">
        <div className="flex justify-between items-center w-full">
          <div className="w-8 h-8 bg-zinc-400 rounded-lg"></div>
          <div className="h-4 w-32 bg-zinc-300 rounded"></div>
        </div>
        <div className="grid grid-cols-3 gap-6 my-auto max-w-4xl w-full mx-auto">
          <div className="h-32 bg-zinc-300 rounded-xl"></div>
          <div className="h-32 bg-zinc-300 rounded-xl"></div>
          <div className="h-32 bg-zinc-300 rounded-xl"></div>
        </div>
      </div>

      <div className="absolute inset-0 z-10 bg-white/35 backdrop-blur-[2px]" />

      {/* FIXED DIALOG CONTAINER */}
      <div className="relative z-20 w-full max-w-[920px] overflow-hidden rounded-[32px] border border-orange-100 bg-white/90 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl md:flex min-h-[580px]">
        
        <Link 
          href="/"
          className="absolute right-6 top-6 z-30 rounded-full bg-orange-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-600 transition hover:bg-orange-100"
        >
          CLOSE
        </Link>

        {/* LEFT BRANDING PANEL */}
        <div className="w-full md:w-1/2 bg-orange-50/70 p-8 flex items-center justify-center border-r border-orange-100 select-none">
          <div className="relative w-full max-w-[360px] aspect-[4/5] md:aspect-[3/4] flex items-center justify-center">
            <Image
              src="https://images.unsplash.com/photo-1653569746987-8c1c63b2ffe2?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
              alt="WalkWithMe Asset Showcase"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-contain drop-shadow-2xl select-none pointer-events-none"
            />
          </div>
        </div>

        {/* RIGHT MULTI-STEP PIPELINE CONTROLLER */}
        <div className="w-full md:w-1/2 bg-white/90 p-8 sm:p-12 flex flex-col justify-center">
          <Suspense fallback={
            <div className="w-full flex flex-col items-center justify-center py-20">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-900 animate-pulse">INITIALIZING FLOW CORE...</p>
            </div>
          }>
            {currentStep === 1 && (
              <AuthForm onAuthSuccess={handleAuthSuccess} />
            )}

            {currentStep === 2 && (
              <WelcomeStep onNext={() => setCurrentStep(3)} userName={userName} />
            )}

            {currentStep === 3 && (
              <MoodStep onNext={handleMoodSuccess} onBack={() => setCurrentStep(2)} />
            )}

            {currentStep === 4 && (
              <MeditationStep moodContext={moodPayload} onBack={() => setCurrentStep(3)} onComplete={handleFinalizePipeline} />
            )}
          </Suspense>
        </div>

      </div>
    </div>
  );
}