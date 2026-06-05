'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/app/layout-components/Sidebar';
import MainHeader from '@/app/layout-components/Header';
import Image from 'next/image';

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
    <div className="relative flex min-h-screen">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=2070"
          alt="Peaceful sanctuary background"
          fill
          className="object-cover scale-110 blur-xl opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/30"></div>
      </div>

      {/* Subtle Animated Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-indigo-200/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-200/8 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '-3s' }} />
      </div>

      <Sidebar />
      <MainHeader />

      <main className="relative z-10 flex-1 lg:ml-56 pt-20 pb-16 px-6 md:px-10 max-w-5xl mx-auto w-full">
        
        {/* Header */}
        <section className="mb-12">
          <Link href="/journal" className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors mb-5 group">
            <span className="material-symbols-outlined text-sm group-hover:-translate-x-1 transition-transform">arrow_back</span>
            <span className="text-[9px] font-black tracking-wider uppercase">Journal</span>
          </Link>
          
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-px bg-gray-400/40" />
            <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em]">Data Export</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-gray-800 tracking-tight">Export Your Journey</h1>
          <p className="text-sm text-gray-600 italic border-l-2 border-indigo-400 pl-4 mt-2">
            Preserve your reflections outside the digital sanctuary.
          </p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Format Selection (Left) */}
          <div className="lg:col-span-2 space-y-5">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-indigo-500 text-[14px]">format_list_bulleted</span>
              <h3 className="text-[8px] font-black text-indigo-600 uppercase tracking-wider">Select Archive Format</h3>
            </div>
            <div className="space-y-3">
              {EXPORT_FORMATS.map((option) => (
                <div
                  key={option.id}
                  onClick={() => setExportFormat(option.id)}
                  className={`group relative p-5 rounded-xl border transition-all cursor-pointer flex items-center gap-5 ${
                    exportFormat === option.id
                      ? 'border-indigo-500 bg-indigo-500/5 ring-2 ring-indigo-500/20'
                      : 'border-white/60 bg-white/30 backdrop-blur-sm hover:border-indigo-300'
                  }`}
                >
                  <div className={`p-2.5 rounded-lg transition-colors ${
                    exportFormat === option.id ? 'bg-indigo-600 text-white' : 'bg-white/50 text-gray-500 group-hover:text-indigo-600'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">{option.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-serif font-semibold text-gray-800 text-sm">{option.label}</h4>
                    <p className="text-[10px] text-gray-500 mt-0.5">{option.desc}</p>
                  </div>
                  {exportFormat === option.id && (
                    <span className="material-symbols-outlined text-indigo-600 text-[20px] animate-in fade-in zoom-in">check_circle</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Options & Action (Right) */}
          <div className="space-y-6">
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-2xl p-6 shadow-lg">
              <div className="flex items-center gap-2 mb-5">
                <span className="material-symbols-outlined text-indigo-500 text-[14px]">tune</span>
                <h3 className="text-[8px] font-black text-indigo-600 uppercase tracking-wider">Refinement Options</h3>
              </div>
              
              <div className="space-y-4">
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
                        className="peer h-4 w-4 appearance-none rounded border border-gray-300 checked:bg-indigo-600 checked:border-indigo-600 transition-all cursor-pointer" 
                      />
                      <span className="absolute text-white opacity-0 peer-checked:opacity-100 material-symbols-outlined text-[10px] left-[3px] top-[2px] pointer-events-none">check</span>
                    </div>
                    <span className="text-[9px] font-bold text-gray-600 uppercase tracking-wider group-hover:text-indigo-600 transition-colors">
                      {check.label}
                    </span>
                  </label>
                ))}
              </div>

              <button
                onClick={handleExport}
                disabled={loading}
                className="w-full mt-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl text-[9px] font-black tracking-wider uppercase hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Generating Archive...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[14px]">archive</span>
                    <span>Begin Archiving</span>
                  </>
                )}
              </button>
            </div>

            {/* Scripture Card */}
            <div className="p-5 bg-indigo-50/30 backdrop-blur-sm border border-indigo-100 rounded-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-indigo-400 text-[14px]">menu_book</span>
                <span className="text-[7px] font-black text-indigo-500 uppercase tracking-wider">Scripture Memory</span>
              </div>
              <p className="text-[10px] font-serif italic text-gray-600 leading-relaxed">
                "Write this for a memorial in a book..."
                <br/>— Exodus 17:14
              </p>
            </div>

            {/* Storage Info */}
            <div className="flex items-center gap-2 text-[8px] text-gray-400 justify-center">
              <span className="material-symbols-outlined text-[12px]">cloud_done</span>
              <span>All exports are encrypted and secure</span>
            </div>
          </div>
        </div>

        {/* Decorative Footer */}
        <div className="mt-16 flex justify-center items-center gap-4 opacity-30">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-indigo-400" />
          <span className="material-symbols-outlined text-indigo-400 text-sm">archive</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-indigo-400" />
        </div>
      </main>
    </div>
  );
}