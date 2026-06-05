'use client';

import { BIBLE_TRANSLATIONS } from '@/lib/constants';

interface TranslationSwitcherProps {
  currentTranslation: string;
  onTranslationChange: (translation: string) => void;
}

export function TranslationSwitcher({ currentTranslation, onTranslationChange }: TranslationSwitcherProps) {
  return (
    <div className="flex flex-col gap-1 group">
      {/* Label with icon */}
      <div className="flex items-center gap-1 ml-1">
        <span className="material-symbols-outlined text-amber-500 text-[10px]">translate</span>
        <label className="text-[6px] font-black uppercase tracking-wider text-amber-600">
          Bible Translation
        </label>
      </div>

      <div className="relative flex items-center group">
        {/* Decorative Icon */}
        <div className="absolute left-3 z-10 pointer-events-none">
          <span className="material-symbols-outlined text-[14px] text-amber-500 transition-transform group-hover:rotate-12">
            translate
          </span>
        </div>

        {/* Premium Styled Select */}
        <select
          value={currentTranslation}
          onChange={(e) => onTranslationChange(e.target.value)}
          className="w-full pl-9 pr-8 py-2 bg-white/50 backdrop-blur-sm border border-white/60 rounded-lg shadow-sm 
                     text-[9px] font-semibold text-gray-700 appearance-none cursor-pointer
                     focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 outline-none
                     hover:bg-white/80 hover:border-amber-300 transition-all duration-300"
        >
          {Object.entries(BIBLE_TRANSLATIONS).map(([key, value]) => (
            <option key={key} value={key} className="bg-white text-gray-700 font-sans text-[9px]">
              {value}
            </option>
          ))}
        </select>

        {/* Custom Arrow Icon */}
        <div className="absolute right-2 pointer-events-none">
          <span className="material-symbols-outlined text-gray-400 text-[14px]">
            expand_more
          </span>
        </div>
      </div>
    </div>
  );
}