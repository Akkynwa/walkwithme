'use client';

import { VerseRenderer } from './VerseRenderer';

interface ParallelBibleProps {
  verses: any[];
  translations: string[];
}

export function ParallelBible({ verses, translations }: ParallelBibleProps) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Informational Header Section */}
      <div className="bg-white/40 backdrop-blur-md border border-white/60 p-5 rounded-xl shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="material-symbols-outlined text-amber-500 text-[14px]">auto_stories</span>
            <h3 className="font-serif text-base text-gray-800 font-bold tracking-tight">Parallel Study</h3>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-amber-500 text-[10px]">compare_arrows</span>
            <p className="text-[8px] font-medium text-amber-600 uppercase tracking-wider">
              Comparing {translations.length} Translations
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {translations.map((t) => (
            <span key={t} className="px-2.5 py-0.5 bg-amber-100 text-amber-700 text-[7px] font-black rounded-full uppercase tracking-wider">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Parallel Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/30 rounded-xl overflow-hidden border border-white/60 shadow-lg">
        {translations.map((translation, index) => (
          <div 
            key={translation} 
            className={`bg-white/40 backdrop-blur-sm p-5 md:p-6 ${index === 0 ? 'md:border-r border-white/40' : ''}`}
          >
            {/* Sticky Translation Label */}
            <div className="sticky top-16 z-10 mb-5 py-1">
              <div className="inline-flex items-center gap-1.5 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm border border-white/60">
                <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                <h4 className="font-serif text-[9px] text-gray-800 font-black uppercase tracking-wider">
                  {translation}
                </h4>
              </div>
            </div>

            {/* Verse Content */}
            <div className="prose prose-stone max-w-none">
              <VerseRenderer 
                verses={verses} 
                translation={translation} 
              />
            </div>
          </div>
        ))}
      </div>

      {/* Decorative Footer Note */}
      <div className="text-center pt-2">
        <div className="inline-flex items-center gap-1.5">
          <span className="material-symbols-outlined text-amber-400 text-[10px]">info</span>
          <p className="text-[6px] text-gray-400 uppercase tracking-wider">
            Scroll to compare translations side by side
          </p>
        </div>
      </div>
    </div>
  );
}