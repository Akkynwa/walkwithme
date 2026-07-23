'use client';

import { useState } from 'react';
// Import your sub-components here as needed
import { AuthStep } from '../../components/AuthStep';
import { WelcomeStep } from '../auth/_components/WelcomeStep';
import { MoodStep } from '../auth/_components/MoodStep';
import { MeditationStep } from '../auth/_components/MeditationStep';

export default function UnifiedSessionPage() {
  const [step, setStep] = useState(1);
  
  // Master data state package to accumulate across the journey
  const [sessionData, setSessionData] = useState({
    userCredentials: null, // Populated at Step 1
    selectedMood: '',      // Populated at Step 3
    notes: '',             // Populated at Step 3
    suggestScriptures: true,
    timeRange: 10,         // Populated at Step 4
  });

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const handleAuthComplete = (credentials: any) => {
    setSessionData((prev) => ({ ...prev, userCredentials: credentials }));
    nextStep();
  };

  const handleMoodComplete = (moodPayload: { selectedMood: string; notes: string; suggestScriptures: boolean }) => {
    setSessionData((prev) => ({ ...prev, ...moodPayload }));
    nextStep();
  };

  const handleMeditationComplete = (meditationPayload: { timeRange: number }) => {
    setSessionData((prev) => ({ ...prev, ...meditationPayload }));
    nextStep(); // Moves directly to your upcoming additional pages
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-zinc-100 font-sans overflow-hidden">
      
      {/* BACKGROUND INTERFACE CANVAS (Blurred layout representation) */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none filter blur-[4px] flex flex-col p-8 justify-between">
        <div className="flex justify-between items-center w-full">
          <div className="h-5 w-28 bg-zinc-400 rounded"></div>
          <div className="h-5 w-20 bg-zinc-400 rounded"></div>
        </div>
        <div className="grid grid-cols-3 gap-6 max-w-4xl w-full mx-auto my-auto">
          <div className="h-36 bg-zinc-300 rounded"></div>
          <div className="h-36 bg-zinc-300 rounded"></div>
          <div className="h-36 bg-zinc-300 rounded"></div>
        </div>
      </div>

      {/* FIXED GLASS BACKDROP OVERLAY */}
      <div className="absolute inset-0 bg-black/10 z-10 backdrop-blur-[1.5px]" />

      {/* DYNAMIC DIALOG COMPONENT MOUNT POINT */}
      <div className="relative z-20 w-full flex justify-center items-center">
        
        {/* STEP 1: AUTHENTICATION (GATEWAY) */}
        {step === 1 && (
          <AuthStep onComplete={handleAuthComplete} />
        )}
        
        {/* STEP 2: WELCOME & PLATFORM FEATURE TOUR */}
        {step === 2 && (
          <WelcomeStep onNext={nextStep} userName="Akachukwu" />
        )}
        
        {/* STEP 3: MOOD QUANTIFICATION */}
        {step === 3 && (
          <MoodStep onNext={handleMoodComplete} onBack={prevStep} />
        )}
        
        {/* STEP 4: MOMENT OF SILENCE & MEDITATION */}
        {step === 4 && (
          <MeditationStep 
            moodContext={sessionData} 
            onBack={prevStep} 
            onComplete={handleMeditationComplete} 
          />
        )}

        {/* STEP 5: PLACEHOLDER FOR YOUR NEXT ADDITIONAL PAGES */}
        {step === 5 && (
          <div className="w-full max-w-[460px] bg-white border border-zinc-200 shadow-2xl p-8 sm:p-10 flex flex-col justify-between min-h-[500px]">
            <div>
              <h3 className="text-2xl font-sans font-semibold tracking-tight text-zinc-900 mb-2">
                Next Segment Entry
              </h3>
              <p className="text-sm text-zinc-500">
                Ready to configure the next pipeline interfaces before the main dashboard workspace compiles.
              </p>
            </div>
            <div className="flex gap-4 mt-8">
              <button onClick={prevStep} className="px-4 py-3 border border-zinc-200 text-xs font-semibold uppercase tracking-wider text-zinc-600 hover:text-zinc-900">
                Back
              </button>
              <button onClick={nextStep} className="flex-1 bg-zinc-900 hover:bg-zinc-800 text-white py-3 text-xs font-semibold tracking-wider uppercase">
                Continue Flow
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}