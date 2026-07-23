'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import toast from 'react-hot-toast';

// Existing Context Layer Wrappers
import { ThemeProvider } from './context/ThemeContext';
import { AppSettingsProvider } from './context/AppSettingsContext';
import { Providers } from './providers';

// Isolated Multi-Step Component Imports
import { AuthForm } from './auth/_components/AuthForm';
import { WelcomeStep } from './auth/_components/WelcomeStep';
import { MoodStep } from './auth/_components/MoodStep';
import { MeditationStep } from './auth/_components/MeditationStep';

function OnboardingWizardFlow() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Sequence Status: 1 = Sign In/Register, 2 = Welcome Brief, 3 = Mood Matrix, 4 = Focus Interval
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [userName, setUserName] = useState<string>('');
  
  const [moodPayload, setMoodPayload] = useState({
    selectedMood: '',
    suggestScriptures: true,
    notes: ''
  });

  // Advance the layout automatically if active session cookies are detected on load
  useEffect(() => {
    if (status === 'authenticated' && session?.user && currentStep === 1) {
      const extractedName = session.user.name || session.user.email?.split('@')[0] || 'Seeker';
      setUserName(extractedName);
      setCurrentStep(2);
    }
  }, [session, status, currentStep]);

  const handleAuthSuccess = (computedName: string) => {
    setUserName(computedName);
    setCurrentStep(2);
  };

  const handleMoodSuccess = (payload: typeof moodPayload) => {
    setMoodPayload(payload);
    setCurrentStep(4);
  };

  const handleFinalizePipeline = async () => {
    toast.success('successfull');
    // Move user straight to the interior private layout routing
    router.push('/dashboard');
    router.refresh();
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-zinc-100 font-sans">
      
     {/* BACKGROUND CONTENT LAYER (Simulates the parent dashboard engine sitting behind the modal view) */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none filter blur-sm flex flex-col p-8 justify-between">
        <div className="flex justify-between items-center w-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-zinc-400 rounded-lg"></div>
            <div className="h-4 w-24 bg-zinc-300 rounded"></div>
          </div>
          <div className="h-4 w-32 bg-zinc-300 rounded"></div>
        </div>
        <div className="grid grid-cols-3 gap-6 my-auto max-w-4xl w-full mx-auto">
          <div className="h-32 bg-zinc-300 rounded-xl"></div>
          <div className="h-32 bg-zinc-300 rounded-xl"></div>
          <div className="h-32 bg-zinc-300 rounded-xl"></div>
        </div>
      </div>

      {/* SEMI-TRANSPARENT MODAL OVERLAY BACKDROP */}
      <div className="absolute inset-0 bg-white/35 z-10 backdrop-blur-[2px]" />

      {/* FLOATING DIALOG CARD */}
      <div className="relative z-20 w-full max-w-[920px] overflow-hidden rounded-[32px] border border-orange-100 bg-white/90 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl md:flex min-h-[560px]">
        
        {/* ESCAPE / CLOSE CONTROL CROSS */}
        <Link 
          href="/"
          className="absolute right-4 top-4 z-30 rounded-full bg-orange-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-600 transition hover:bg-orange-100"
          aria-label="Close form view"
        >
          <span className="material-symbols-outlined text-xl">close</span>
        </Link>

       {/* LEFT COMPONENT COLUMN: Book Mockup Showcase Container */}
<div className="w-full md:w-1/2 bg-orange-50/70 p-8 flex items-center justify-center border-r border-orange-100 select-none">
  <Image
  src="https://images.unsplash.com/photo-1653569746987-8c1c63b2ffe2?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
  alt="The Names of God Ebook Guide on Tablet"
  width={800}
  height={600}
  priority
  className="w-full h-auto max-w-lg object-contain drop-shadow-xl select-none pointer-events-none mx-auto"
/>
</div>


        {/* RIGHT ACTIVE CONTROL CARD */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center bg-white">
          <Suspense fallback={
            <div className="w-full flex flex-col items-center justify-center py-20">
              <p className="text-xs font-bold uppercase tracking-widest text-zinc-900 animate-pulse">MOUNTING ENGINE COMPONENTS...</p>
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

export default function DashboardPage() {
  return (
    <ThemeProvider>
      <AppSettingsProvider>
        <Providers>
          <OnboardingWizardFlow />
        </Providers>
      </AppSettingsProvider>
    </ThemeProvider>
  );
}