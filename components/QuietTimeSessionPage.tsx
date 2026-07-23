'use client';

import { useState } from 'react';
import { WelcomeStep } from '../app/auth/_components/WelcomeStep';
import { MoodStep } from '../app/auth/_components/MoodStep';
import { MeditationStep } from '../app/auth/_components/MeditationStep';

export default function QuietTimeSessionPage() {
  const [step, setStep] = useState(1);
  const [sessionData, setSessionData] = useState({
    selectedMood: '',
    notes: '',
    suggestScriptures: true,
    timeRange: 10
  });

  const updateSession = (data: Partial<typeof sessionData>) => {
    setSessionData(prev => ({ ...prev, ...data }));
    setStep(prev => prev + 1);
  };

  const handleFinalize = (finalData: { timeRange: number }) => {
    const combinedData = { ...sessionData, ...finalData };
    console.log("Onboarding verification payload:", combinedData);
    // Push data package to database context endpoints / launch interactive tracker...
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-zinc-100 font-sans overflow-hidden">
      
      {/* 1. BACKGROUND DASHBOARD PREVIEW LAYER (Provides the "vibe" context sitting behind the panel) */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none filter blur-[3px] flex flex-col p-8 justify-between">
        <div className="flex justify-between items-center w-full">
          <div className="h-6 w-32 bg-zinc-400 rounded"></div>
          <div className="h-6 w-24 bg-zinc-400 rounded"></div>
        </div>
        <div className="grid grid-cols-4 gap-4 max-w-5xl w-full mx-auto my-auto">
          <div className="h-40 bg-zinc-300 rounded"></div>
          <div className="h-40 bg-zinc-300 rounded"></div>
          <div className="h-40 bg-zinc-300 rounded"></div>
          <div className="h-40 bg-zinc-300 rounded"></div>
        </div>
      </div>

      {/* 2. MODAL LAYER BACKDROP OVERLAY */}
      <div className="absolute inset-0 bg-black/15 z-10 backdrop-blur-[1px]" />

      {/* 3. CONDITIONAL FLOATING CONTENT CORE ROUTER */}
      <div className="relative z-20 w-full flex justify-center items-center">
        {step === 1 && (
          <WelcomeStep onNext={() => setStep(2)} userName="Akachukwu" />
        )}
        
        {step === 2 && (
          <MoodStep 
            onNext={(data) => updateSession(data)} 
            onBack={() => setStep(1)} 
          />
        )}
        
        {step === 3 && (
          <MeditationStep 
            moodContext={sessionData} 
            onBack={() => setStep(2)} 
            onComplete={handleFinalize} 
          />
        )}
      </div>

    </div>
  );
}