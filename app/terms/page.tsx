// app/terms/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Quiet Time Sanctuary',
  description: 'Terms and conditions for using our audio scripture and devotional service.',
};

export default function TermsPage() {
  return (
    <div className="relative min-h-screen bg-gradient-to-b from-amber-50/20 via-white to-slate-50/40 text-slate-900 overflow-x-hidden">
      
      {/* Background Media & Ambient Glow Filters */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-10 right-10 w-96 h-96 bg-amber-200/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 left-10 w-80 h-80 bg-amber-300/5 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '-3s' }} />
      </div>

      <main className="relative z-10 container mx-auto max-w-3xl px-6 py-16 md:py-24">
        
        {/* Polished Header Section */}
        <div className="mb-12 border-b border-slate-200/80 pb-6 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-md shadow-orange-500/10">
              <span className="material-symbols-outlined text-xl font-light">gavel</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-widest text-amber-600 block">Legal Agreement</span>
              <h1 className="text-3xl font-serif font-black text-slate-900 mt-0.5">Terms of Service</h1>
            </div>
          </div>
          <span className="text-[10px] font-mono text-slate-400 bg-white/60 backdrop-blur-md border border-slate-200 px-3 py-1 rounded-full shadow-xs">
            Last updated: June 10, 2026
          </span>
        </div>

        {/* Content Sheet Section */}
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-6 md:p-10 rounded-2xl shadow-xl space-y-8 font-sans text-sm text-slate-700 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or logging into the Quiet Time Sanctuary framework, you agree to be bound by these Terms of Service, all applicable localized regulations, and platform compliance parameters. If you disagree with any portion of these metrics, your authentication credentials may be suspended, and you may not access the streaming audio or database pipelines.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              2. User Accounts & Spiritual Logs
            </h2>
            <p>
              When initializing an identity instance within our database ledger, you agree to provide verified data structures. You retain full system responsibility for:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Securing encryption integrity keys and account passwords.</li>
              <li>All database operations, journal notes, and session state executions logged under your profile wrapper.</li>
              <li>Notifying our deployment desk immediately upon discovering an external runtime intrusion.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              3. Sanctuary Acceptable Use
            </h2>
            <p>
              You agree to engage with our media channels and community tools strictly for personal devotion and communal fellowship. You shall not utilize our data routes to:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-slate-600">
              <li>Violate state or international communication laws.</li>
              <li>Scrape, redistribute, or pirate heavy stream components or scripture filesets without authorization.</li>
              <li>Inject malware, corrupt structural parameters, or spam client endpoints.</li>
              <li>Distribute abusive, toxic, or non-constructive posts into the automated Community Feed.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              4. Intellectual Property
            </h2>
            <p>
              The sanctuary application interface assets, styling codes, layout structures, and system logics are protected under corporate trademark parameters. Media assets provided via partners (such as external Scripture Bible APIs or the Bible Brain network) are subject to separate streaming copyright conditions. Users retain the rights to their personal journal insights.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              5. Profile Termination Rules
            </h2>
            <p>
              We maintain structural discretion to suspend or completely purge user access to our devotional sync channels immediately, without warning or liability, if your account execution logs trigger validation flags or demonstrate actions that compromise our platform stability.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-serif font-bold text-slate-900 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              6. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by law, Quiet Time Sanctuary and its engineering developers shall not be liable for any systemic data loss, accidental streak resets, or interruptions in audio stream channels resulting from your execution of this software.
            </p>
          </section>

          {/* Contact Node Anchor Box */}
          <div className="mt-10 rounded-xl bg-gradient-to-r from-slate-900 to-amber-950 p-5 text-white shadow-md flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-amber-500 text-xl font-light">gavel</span>
              <p className="text-xs text-gray-300">
                For complete legal processing reviews or inquiry requests:
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