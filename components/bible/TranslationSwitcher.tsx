'use client';

import { BIBLE_TRANSLATIONS } from '@/lib/constants';

interface TranslationSwitcherProps {
  currentTranslation: string;
  onTranslationChange: (translation: string) => void;
  isDark?: boolean;
}

export function TranslationSwitcher({ 
  currentTranslation, 
  onTranslationChange,
  isDark = false 
}: TranslationSwitcherProps) {
  return (
    <div className="flex flex-col gap-1.5 group">
      {/* Label with icon */}
      <div className="flex items-center gap-1.5 ml-1">
        <span className={`material-symbols-outlined text-sm ${
          isDark ? 'text-zinc-400' : 'text-zinc-500'
        }`}>
          translate
        </span>
        <label className={`text-xs font-semibold uppercase tracking-wider ${
          isDark ? 'text-zinc-400' : 'text-zinc-500'
        }`}>
          Bible Translation
        </label>
      </div>

      <div className="relative flex items-center group">
        {/* Decorative Icon */}
        <div className="absolute left-3 z-10 pointer-events-none">
          <span className={`material-symbols-outlined text-sm transition-transform group-hover:rotate-12 ${
            isDark ? 'text-zinc-400' : 'text-zinc-500'
          }`}>
            translate
          </span>
        </div>

        {/* Clean Styled Select */}
        <select
          value={currentTranslation}
          onChange={(e) => onTranslationChange(e.target.value)}
          className={`w-full pl-9 pr-8 py-2 rounded-md border text-sm font-medium appearance-none cursor-pointer outline-none transition-all duration-300 ${
            isDark 
              ? 'bg-zinc-900 border-zinc-800 text-zinc-100 hover:bg-zinc-800/80 focus:border-zinc-700 focus:ring-1 focus:ring-zinc-800' 
              : 'bg-white border-zinc-200 text-zinc-900 hover:bg-zinc-50 focus:border-zinc-300 focus:ring-1 focus:ring-zinc-200'
          }`}
        >
          {Object.entries(BIBLE_TRANSLATIONS).map(([key, value]) => (
            <option 
              key={key} 
              value={key} 
              className={`font-sans text-sm ${isDark ? 'bg-zinc-900 text-zinc-100' : 'bg-white text-zinc-900'}`}
            >
              {value}
            </option>
          ))}
        </select>

        {/* Custom Arrow Icon */}
        <div className="absolute right-3 pointer-events-none">
          <span className={`material-symbols-outlined text-sm ${
            isDark ? 'text-zinc-500' : 'text-zinc-400'
          }`}>
            expand_more
          </span>
        </div>
      </div>
    </div>
  );
}