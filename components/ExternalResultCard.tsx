import React from 'react';

interface ExternalCardProps {
  title: string;
  snippet: string;
  link: string;
  isDark: boolean;
}

export function ExternalResultCard({ title, snippet, link, isDark }: ExternalCardProps) {
  // Extract a clean display domain safely from the raw hyperlink url
  const displayDomain = React.useMemo(() => {
    try {
      return new URL(link).hostname.replace('www.', '');
    } catch {
      return 'External Resource';
    }
  }, [link]);

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`block p-4 rounded-xl border transition-all duration-200 group relative overflow-hidden focus:outline-none focus:ring-2 ${
        isDark 
          ? 'border-zinc-900 bg-zinc-900/20 hover:bg-zinc-900/60 hover:border-zinc-800 focus:ring-zinc-700' 
          : 'border-stone-200/50 bg-white/30 hover:bg-white/80 hover:border-stone-300 focus:ring-amber-500'
      }`}
    >
      <div className="flex flex-col gap-1.5">
        
        {/* Top Meta Line Header */}
        <div className="flex items-center justify-between gap-4 w-full">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="material-symbols-outlined text-[14px] text-blue-500 dark:text-blue-400 flex-shrink-0" aria-hidden="true">
              language
            </span>
            <span className={`text-[10px] font-bold tracking-wider uppercase truncate ${
              isDark ? 'text-zinc-500 group-hover:text-zinc-400' : 'text-stone-400 group-hover:text-stone-500'
            }`}>
              {displayDomain}
            </span>
          </div>
          
          <div className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 border rounded-md font-sans flex-shrink-0 shadow-sm ${
            isDark 
              ? 'text-blue-400 border-blue-900/50 bg-blue-950/30' 
              : 'text-blue-600 border-blue-100 bg-blue-50/60'
          }`}>
            Web Reference
          </div>
        </div>

        {/* Content Section Title */}
        <h3 className={`text-sm font-sans font-semibold tracking-tight leading-snug line-clamp-1 transition-colors ${
          isDark ? 'text-zinc-200 group-hover:text-blue-400' : 'text-stone-800 group-hover:text-blue-700'
        }`}>
          {title}
        </h3>

        {/* Informational Snippet Area */}
        <p className={`text-xs font-sans leading-relaxed line-clamp-2 transition-colors ${
          isDark ? 'text-zinc-400' : 'text-stone-600'
        }`}>
          {snippet}
        </p>

        {/* Tiny Action Label Indicator footer */}
        <div className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-500 dark:text-blue-400 pt-0.5 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200">
          <span>Read Document</span>
          <span className="material-symbols-outlined text-[11px]">north_east</span>
        </div>
      </div>
    </a>
  );
}