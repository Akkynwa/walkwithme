// app/about/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Our Mission | Quiet Time Sanctuary',
  description: 'Learn more about the vision, spiritual principles, and engineering behind our devotional audio sanctuary.',
};

export default function AboutPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-amber-50/20 via-white to-slate-50/40 text-slate-900 overflow-x-hidden">
      
      {/* Background Ambient Glow Elements */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-96 h-96 bg-amber-200/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-amber-300/5 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '-3s' }} />
      </div>

      <main className="relative z-10 container mx-auto max-w-3xl px-6 py-16 md:py-24">
        
        {/* Polished Navigation Header Section */}
        <div className="mb-12 border-b border-slate-200/80 pb-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-500/10">
              <span className="material-symbols-outlined text-xl font-light">auto_stories</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-600 block">Our Roots</span>
              <h1 className="text-3xl font-serif font-black text-slate-900 mt-0.5">About Our Mission</h1>
            </div>
          </div>
        </div>

        {/* Content Sheet Section */}
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-6 md:p-10 rounded-2xl shadow-xl space-y-10 font-sans text-sm text-slate-700 leading-relaxed">
          
          <p className="text-base md:text-lg font-serif italic text-amber-900 leading-relaxed">
            "We are on a strict mission to strip away digital noise and cultivate intentional, beautiful spaces for deep scriptural engagement, audio reflection, and continuous spiritual alignment."
          </p>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              The Vision Story
            </h2>
            <p>
              Founded in 2024, Quiet Time Sanctuary began as a simple internal project built to solve a personal challenge: finding a distraction-free digital closet for daily scripture meditation. What started as a basic tool has blossomed into an elegant sanctuary platform designed to support thousands of daily devotional walks worldwide. 
            </p>
            <p>
              By fusing immersive, high-fidelity audio streams with dynamic line-by-line scriptural tracking, we enable users to engage deeply with the Word—whether listening in English (KJV/NIV) or connecting with ancestral heritages via native Nigerian translations like Yoruba and Igbo.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Our Guiding Principles
            </h2>
            <div className="grid grid-cols-1 gap-4 mt-2">
              <div className="p-4 rounded-xl bg-white/50 border border-slate-100 shadow-xs">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wider text-amber-700 mb-1">
                  <span className="material-symbols-outlined text-sm">spa</span> Reverence in Design
                </h3>
                <p className="text-xs text-slate-600">
                  Every blur filter, custom speed multiplier, and backdrop gradient is built intentionally to foster a calm, sacred pacing for your personal devotionals.
                </p>
              </div>
              
              <div className="p-4 rounded-xl bg-white/50 border border-slate-100 shadow-xs">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wider text-amber-700 mb-1">
                  <span className="material-symbols-outlined text-sm">history_edu</span> Absolute Reflection Privacy
                </h3>
                <p className="text-xs text-slate-600">
                  Your structural study notes, internal journal revelations, and personal notes belong to you. We emphasize robust local storage caches and encrypted transfers.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-white/50 border border-slate-100 shadow-xs">
                <h3 className="font-semibold text-slate-900 flex items-center gap-2 text-xs uppercase tracking-wider text-amber-700 mb-1">
                  <span className="material-symbols-outlined text-sm">diversity_1</span> Cultural Inclusivity
                </h3>
                <p className="text-xs text-slate-600">
                  Scripture resonates best when spoken in the dialect of the heart. We commit heavily to preserving and displaying rich multi-lingual translations.
                </p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              The Craft
            </h2>
            <p>
              We are a unified, focused circle of engineers, UI designers, and creators who are deeply passionate about leveraging modern architecture—like Next.js React patterns and fluid client state models—to create tech tools that honor eternal scripts.
            </p>
          </section>

          {/* Contact Anchor Block */}
          <div className="mt-10 rounded-xl bg-gradient-to-r from-slate-900 to-amber-950 p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-amber-500 text-xl font-light">mail</span>
              <p className="text-xs text-gray-300">
                Have feedback, ideas, or simply want to share your testimony?
              </p>
            </div>
            <a 
              href="mailto:akachukwunwali@gmail.com" 
              className="text-xs font-mono font-bold bg-white/10 hover:bg-white/20 text-amber-400 border border-white/10 px-4 py-2 rounded-lg transition-colors"
            >
              akachukwunwali@gmail.com
            </a>
          </div>

        </div>
      </main>
    </div>
  );
}