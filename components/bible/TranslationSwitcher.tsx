'use client';

import { BIBLE_TRANSLATIONS } from '@/lib/constants';

interface TranslationSwitcherProps {
  currentTranslation: string;
  onTranslationChange: (translation: string) => void;
}

export function TranslationSwitcher({ currentTranslation, onTranslationChange }: TranslationSwitcherProps) {
  return (
    <div className="flex flex-col gap-1.5 group">
      {/* Label with a subtle polish */}
      <label className="text-[10px] font-black uppercase tracking-[0.15em] text-primary/50 ml-1">
        Bible Translation
      </label>

      <div className="relative flex items-center group">
        {/* Decorative Icon */}
        <div className="absolute left-4 z-10 pointer-events-none">
          <span className="material-symbols-outlined text-[18px] text-primary transition-transform group-hover:rotate-12">
            translate
          </span>
        </div>

        {/* Premium Styled Select */}
        <select
          value={currentTranslation}
          onChange={(e) => onTranslationChange(e.target.value)}
          className="w-full pl-11 pr-10 py-3 bg-white/60 backdrop-blur-md border border-white rounded-2xl shadow-sm 
                     text-[13px] font-bold text-secondary appearance-none cursor-pointer
                     focus:ring-2 focus:ring-primary/10 focus:border-primary/20 outline-none
                     hover:bg-white/80 transition-all duration-300"
        >
          {Object.entries(BIBLE_TRANSLATIONS).map(([key, value]) => (
            <option key={key} value={key} className="bg-white text-secondary font-sans">
              {value}
            </option>
          ))}
        </select>

        {/* Custom Arrow Icon */}
        <div className="absolute right-4 pointer-events-none">
          <span className="material-symbols-outlined text-gray-400 text-lg">
            unfold_more
          </span>
        </div>
      </div>
    </div>
  );
}