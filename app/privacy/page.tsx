// app/privacy/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | Quiet Time Sanctuary',
  description: 'How we protect your devotional data, journal logs, and account insights.',
};

export default function PrivacyPage() {
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
              <span className="material-symbols-outlined text-xl font-light">privacy_tip</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-600 block">Data Governance</span>
              <h1 className="text-3xl font-serif font-black text-slate-900 mt-0.5">Privacy Policy</h1>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-white/60 backdrop-blur-md border border-slate-200 px-3 py-1 rounded-full shadow-xs">
            Last updated: June 11, 2026
          </span>
        </div>

        {/* Legal Text Sheet Section */}
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-6 md:p-10 rounded-2xl shadow-xl space-y-8 font-sans text-sm text-slate-700 leading-relaxed">
          
          <p className="text-xs text-slate-500 italic">
            At Quiet Time Sanctuary, we hold the privacy of your personal study and devotions in the highest regard. This policy outlines how your platform analytics, reflection journals, and interaction streams are safely processed.
          </p>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Information We Collect
            </h2>
            <p>
              We collect information you transmit directly within our environment during authentication or session logging. This is mapped into the following properties:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li><strong>Profile Metadata:</strong> Your name, verified email address, and profile credentials.</li>
              <li><strong>Devotional Logs:</strong> Audio playback progress tracking, finished chapter histories, active streak counts, and platform benchmarks.</li>
              <li><strong>Journal Reflections:</strong> Text data inputs written inside your personal study panels. These are encrypted during transport and database rest cycles.</li>
              <li><strong>Secure Payments:</strong> Secure transaction parameters managed through premium third-party processors. No financial raw structures touch our primary databases.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              How We Use Your Information
            </h2>
            <p>Your workspace analytics and input variables are processed strictly to:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Maintain and serve audio streaming routes alongside responsive scripture texts.</li>
              <li>Render dynamic profile streak computations and verify devotional progression benchmarks.</li>
              <li>Dispatch structural pipeline updates, security patches, and system notice alerts.</li>
              <li>Sync your offline browser cache snapshots to our remote cloud nodes when data states reconnect.</li>
              <li>Anonymously evaluate interface performance errors to optimize streaming latency across servers.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Data Security Infrastructure
            </h2>
            <p>
              We implement transport layer encryption and modern system protocols to guard your reflection entries and credentials. While we enforce industry-approved parameters to prevent data leaks, no structural protocol over the open web is completely immune to risks, meaning we cannot claim absolute security guarantees.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Your Rights & Access Ownership
            </h2>
            <p>
              You maintain full personal ownership over your logged insights and journal logs. At any point, you hold the system right to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Query and download a structural text copy of your personal journal histories.</li>
              <li>Correct inaccurate details on your profile card.</li>
              <li>Purge or permanently drop your entire account instance and associated reflections from our active databases.</li>
            </ul>
          </section>

          {/* Contact Anchor Block */}
          <div className="mt-10 rounded-xl bg-gradient-to-r from-slate-900 to-amber-950 p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-amber-500 text-xl font-light">lock_open</span>
              <p className="text-xs text-gray-300">
                Have questions regarding your data privacy? Reach our desk directly:
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