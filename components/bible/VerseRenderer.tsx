'use client';

interface Verse {
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

interface VerseRendererProps {
  verses: Verse[];
  translation: string;
}

export function VerseRenderer({ verses, translation }: VerseRendererProps) {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-700">
      {verses.map((verse, index) => (
        <div key={index} className="group relative flex gap-4 md:gap-6 items-start">
          
          {/* VERSE NUMBER GUTTER */}
          <div className="flex flex-col items-center pt-1 min-w-[28px]">
            <span className="text-[9px] font-black text-amber-500/50 group-hover:text-amber-600 transition-colors">
              {verse.verse}
            </span>
            <div className="w-px h-full bg-gradient-to-b from-amber-500/20 via-transparent to-transparent mt-2 hidden md:block"></div>
          </div>

          {/* SCRIPTURE CONTENT */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-[7px] font-black uppercase tracking-wider text-amber-600">
                {verse.book} {verse.chapter}:{verse.verse}
              </span>
              <div className="h-px flex-1 bg-amber-500/10"></div>
              <span className="text-[7px] font-black uppercase tracking-wider text-gray-400">
                {translation}
              </span>
            </div>

            <p className="font-serif text-[15px] md:text-[17px] leading-relaxed text-gray-700 opacity-90 group-hover:opacity-100 transition-opacity">
              {verse.text}
            </p>

            {/* ACTION MINI-BAR */}
            <div className="flex gap-3 mt-3 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0">
              <button className="flex items-center gap-1 text-[7px] font-black uppercase tracking-wider text-gray-400 hover:text-amber-600 transition-colors">
                <span className="material-symbols-outlined text-[12px]">content_copy</span>
                Copy
              </button>
              <button className="flex items-center gap-1 text-[7px] font-black uppercase tracking-wider text-gray-400 hover:text-amber-600 transition-colors">
                <span className="material-symbols-outlined text-[12px]">share</span>
                Share
              </button>
              <button className="flex items-center gap-1 text-[7px] font-black uppercase tracking-wider text-gray-400 hover:text-amber-600 transition-colors">
                <span className="material-symbols-outlined text-[12px]">bookmark_border</span>
                Save
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* FOOTER DECORATION */}
      <div className="flex items-center justify-center py-8">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-amber-500/20"></div>
        <span className="material-symbols-outlined text-amber-500/30 text-sm mx-3">auto_awesome</span>
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-amber-500/20"></div>
      </div>
    </div>
  );
}