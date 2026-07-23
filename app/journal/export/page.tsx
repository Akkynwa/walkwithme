'use client';

import { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/app/layout-components/Sidebar';
import { useTheme } from '../../context/ThemeContext';

const EXPORT_FORMATS = [
  { id: 'pdf', label: 'Spiritual Legacy (PDF)', desc: 'Beautifully formatted for reading and printing.', icon: 'picture_as_pdf' },
  { id: 'json', label: 'Raw Archive (JSON)', desc: 'Complete data backup for portability.', icon: 'database' },
  { id: 'csv', label: 'Reflection Sheet (CSV)', desc: 'Best for analyzing trends and dates.', icon: 'table_view' },
];

export default function ExportJournalPage() {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [loading, setLoading] = useState(false);
  const { isDark } = useTheme();

  const handleExport = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div className={`flex min-h-screen ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
      <Sidebar />

      <main className="flex-1 lg:ml-56 pt-20 px-4 md:px-8 pb-16 max-w-3xl mx-auto w-full">
        
        {/* Navigation Header */}
        <div className={`flex items-center justify-between mb-10 pb-4 border-b ${isDark ? 'border-white/10' : 'border-gray-200/50'}`}>
          <Link href="/journal" className={`flex items-center gap-2 transition-colors text-[12px] font-medium ${
            isDark ? 'text-gray-400 hover:text-primary-400' : 'text-gray-500 hover:text-primary-600'
          }`}>
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            <span>Back to Journal</span>
          </Link>
          <span className={`text-[11px] font-medium tracking-wider uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            Settings
          </span>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          
          {/* Header Section */}
          <section className="mb-8">
            <div className={`flex items-center gap-1.5 mb-2 ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
              <span className="material-symbols-outlined text-[14px]">archive</span>
              <span className="text-[10px] font-sans font-semibold uppercase tracking-wider">Data Export</span>
            </div>
            <h1 className={`text-3xl md:text-4xl font-serif font-semibold tracking-tight ${isDark ? 'text-text-primary' : 'text-gray-800'}`}>
              Export Your Journey
            </h1>
            <p className={`text-sm font-sans mt-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              Preserve your reflections outside the digital sanctuary.
            </p>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 items-start">
            
            {/* Format Selection */}
            <div className="md:col-span-3 space-y-4">
              <label className={`block text-[11px] font-sans font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                Select Archive Format
              </label>
              
              <div className="space-y-2">
                {EXPORT_FORMATS.map((option) => (
                  <div
                    key={option.id}
                    onClick={() => setExportFormat(option.id)}
                    className={`group p-4 rounded-xl border transition-colors cursor-pointer flex items-center gap-4 ${
                      exportFormat === option.id
                        ? isDark ? 'border-primary-500 bg-black/40' : 'border-primary-500 bg-primary-50'
                        : isDark ? 'border-white/10 bg-transparent hover:border-white/30' : 'border-gray-200 bg-transparent hover:border-gray-400'
                    }`}
                  >
                    <div className={`p-2 rounded-lg transition-colors ${
                      exportFormat === option.id 
                        ? 'bg-primary-500 text-white' 
                        : isDark ? 'bg-white/10 text-gray-400 group-hover:text-gray-200' : 'bg-gray-100 text-gray-400 group-hover:text-gray-600'
                    }`}>
                      <span className="material-symbols-outlined text-[18px] block">{option.icon}</span>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-sans font-medium text-[14px] ${isDark ? 'text-text-primary' : 'text-gray-800'}`}>
                        {option.label}
                      </h4>
                      <p className={`text-[11px] truncate mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {option.desc}
                      </p>
                    </div>

                    {exportFormat === option.id && (
                      <span className={`material-symbols-outlined text-[18px] ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>
                        check_circle
                      </span>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Options Panel */}
            <div className="md:col-span-2 space-y-6">
              <div className="space-y-4">
                <label className={`block text-[11px] font-sans font-semibold uppercase tracking-wider mb-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  Refinement Options
                </label>
                
                <div className="space-y-3.5">
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
                          className={`peer h-4 w-4 appearance-none rounded border transition-all cursor-pointer bg-transparent ${
                            isDark 
                              ? 'border-white/20 checked:bg-primary-500 checked:border-primary-500' 
                              : 'border-gray-300 checked:bg-primary-500 checked:border-primary-500'
                          }`}
                        />
                        <span className="absolute text-white opacity-0 peer-checked:opacity-100 material-symbols-outlined text-[11px] left-[2.5px] top-[2.5px] pointer-events-none font-bold">
                          check
                        </span>
                      </div>
                      <span className={`text-[12px] font-sans transition-colors ${
                        isDark 
                          ? 'text-gray-400 group-hover:text-gray-200' 
                          : 'text-gray-600 group-hover:text-gray-800'
                      }`}>
                        {check.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Download Button */}
              <div className="pt-2">
                <button
                  onClick={handleExport}
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-medium text-[13px] py-2.5 rounded-full transition-all shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
                      <span>Generating Archive...</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[15px]">download</span>
                      <span>Begin Archiving</span>
                    </>
                  )}
                </button>
              </div>

              {/* Bottom Context Info */}
              <div className={`space-y-3 pt-6 border-t ${isDark ? 'border-white/10' : 'border-gray-200'}`}>
                <p className={`text-[12px] font-serif italic leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  "Write this for a memorial in a book..." 
                  <span className={`block font-sans text-[10px] not-italic mt-0.5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>— Exodus 17:14</span>
                </p>
                
                <div className={`flex items-center gap-1.5 text-[10px] font-sans ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  <span className="material-symbols-outlined text-[12px]">lock</span>
                  <span>Exports are locally compiled & encrypted</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Footer Rule */}
        <div className="mt-16 pt-8 border-t flex justify-center">
          <div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-300'}`} />
        </div>
      </main>
    </div>
  );
}