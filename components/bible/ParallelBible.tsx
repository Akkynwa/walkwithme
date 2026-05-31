'use client';

import { VerseRenderer } from './VerseRenderer';

interface ParallelBibleProps {
  verses: any[];
  translations: string[];
}

export function ParallelBible({ verses, translations }: ParallelBibleProps) {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Informational Header Section */}
      <div className="bg-white/40 backdrop-blur-md border border-white/60 p-6 rounded-[2rem] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="font-display text-lg text-[#3C3830] font-black tracking-tight mb-1">Parallel Study</h3>
          <p className="text-xs font-medium text-primary/60 uppercase tracking-widest">
            Comparing {translations.length} Translations
          </p>
        </div>
        <div className="flex gap-2">
          {translations.map((t) => (
            <span key={t} className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-black rounded-full uppercase">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Parallel Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-gray-200/50 rounded-[2.5rem] overflow-hidden border border-gray-200/50 shadow-inner">
        {translations.map((translation, index) => (
          <div 
            key={translation} 
            className={`bg-[#FDFBF7]/80 backdrop-blur-sm p-6 md:p-8 ${index === 0 ? 'md:border-r border-gray-200/50' : ''}`}
          >
            {/* Sticky Translation Label */}
            <div className="sticky top-16 z-10 mb-6 py-2">
              <div className="inline-flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
                <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                <h4 className="font-display text-sm text-[#3C3830] font-black uppercase tracking-tighter">
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
    </div>
  );
}