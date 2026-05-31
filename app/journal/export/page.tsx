'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/app/layout-components/Sidebar';
import MainHeader from '@/app/layout-components/Header';

const EXPORT_FORMATS = [
  { id: 'pdf', label: 'Spiritual Legacy (PDF)', desc: 'Beautifully formatted for reading and printing.', icon: 'picture_as_pdf' },
  { id: 'json', label: 'Raw Archive (JSON)', desc: 'Complete data backup for portability.', icon: 'database' },
  { id: 'csv', label: 'Reflection Sheet (CSV)', desc: 'Best for analyzing trends and dates.', icon: 'table_view' },
];

export default function ExportJournalPage() {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [loading, setLoading] = useState(false);

  const handleExport = () => {
    setLoading(true);
    // Logic for generating the archive
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className="flex min-h-screen bg-[#FDFDFF]">
      <Sidebar />
      <MainHeader />

      <main className="flex-1 lg:ml-64 pt-28 pb-20 px-6 md:px-12 max-w-[1000px] mx-auto w-full">
        
        {/* --- HEADER --- */}
        <section className="mb-16">
          <Link href="/journal" className="flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-6 group">
            <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="text-[10px] font-black tracking-widest uppercase">Journal</span>
          </Link>
          <h1 className="text-4xl font-serif text-[#3C3830] tracking-tight">Export Your Journey</h1>
          <p className="text-[#7C7565] italic font-serif mt-2 border-l-2 border-[#D4AF37] pl-4">
            Preserve your reflections outside the digital sanctuary.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* --- FORMAT SELECTION (LEFT) --- */}
          <div className="lg:col-span-2 space-y-6">
            <h3 className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em] mb-4">Select Archive Format</h3>
            <div className="space-y-4">
              {EXPORT_FORMATS.map((option) => (
                <div
                  key={option.id}
                  onClick={() => setExportFormat(option.id)}
                  className={`group relative p-6 rounded-2xl border transition-all cursor-pointer flex items-center gap-6 ${
                    exportFormat === option.id
                      ? 'border-primary bg-primary/5 ring-4 ring-primary/5'
                      : 'border-gray-100 bg-white hover:border-primary/30'
                  }`}
                >
                  <div className={`p-3 rounded-xl transition-colors ${
                    exportFormat === option.id ? 'bg-primary text-white' : 'bg-gray-50 text-gray-400 group-hover:text-primary'
                  }`}>
                    <span className="material-symbols-outlined">{option.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-serif font-bold text-[#3C3830]">{option.label}</h4>
                    <p className="text-xs text-[#7C7565] mt-1">{option.desc}</p>
                  </div>
                  {exportFormat === option.id && (
                    <span className="material-symbols-outlined text-primary animate-in zoom-in">check_circle</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* --- OPTIONS & ACTION (RIGHT) --- */}
          <div className="space-y-8">
            <div className="bg-white border border-gray-100 rounded-2xl p-8">
              <h3 className="text-[10px] font-black text-[#D4AF37] uppercase tracking-[0.2em] mb-6">Refinement</h3>
              <div className="space-y-5">
                {[
                  { label: 'All Journal Entries', id: 'all' },
                  { label: 'Include Spiritual Tags', id: 'tags' },
                  { label: 'Include Heart States', id: 'mood' },
                  { label: 'Include Scripture Links', id: 'scripture' },
                ].map((check) => (
                  <label key={check.id} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center">
                      <input 
                        type="checkbox" 
                        defaultChecked 
                        className="peer h-5 w-5 appearance-none rounded border border-gray-200 checked:bg-primary checked:border-primary transition-all cursor-pointer" 
                      />
                      <span className="absolute text-white opacity-0 peer-checked:opacity-100 material-symbols-outlined text-sm left-[3px] pointer-events-none">check</span>
                    </div>
                    <span className="text-[11px] font-bold text-[#7C7565] uppercase tracking-wider group-hover:text-primary transition-colors">
                      {check.label}
                    </span>
                  </label>
                ))}
              </div>

              <button
                onClick={handleExport}
                disabled={loading}
                className="w-full mt-10 py-4 bg-primary text-white rounded-full text-[11px] font-black tracking-[0.2em] uppercase hover:shadow-2xl hover:shadow-primary/30 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <span className="material-symbols-outlined text-sm">auto_awesome</span>
                )}
                {loading ? 'Generating...' : 'Begin Archiving'}
              </button>
            </div>

            <div className="p-6 bg-[#D4AF37]/5 border border-[#D4AF37]/10 rounded-2xl">
              <p className="text-[10px] font-serif italic text-[#7C7565] leading-relaxed">
                "Write this for a memorial in a book..." 
                <br/>— Exodus 17:14
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}