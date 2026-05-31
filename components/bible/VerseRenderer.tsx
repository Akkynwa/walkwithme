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
    <div className="flex flex-col gap-8 animate-in fade-in duration-700">
      {verses.map((verse, index) => (
        <div key={index} className="group relative flex gap-6 md:gap-8 items-start">
          
          {/* VERSE NUMBER GUTTER */}
          <div className="flex flex-col items-center pt-1.5 min-w-[32px]">
            <span className="text-[11px] font-black text-primary/40 group-hover:text-primary transition-colors">
              {verse.verse}
            </span>
            <div className="w-[1px] h-full bg-gradient-to-b from-primary/20 via-transparent to-transparent mt-2 hidden md:block"></div>
          </div>

          {/* SCRIPTURE CONTENT */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">
                {verse.book} {verse.chapter}:{verse.verse}
              </span>
              <div className="h-[1px] flex-1 bg-primary/5"></div>
              <span className="text-[9px] font-black uppercase tracking-widest text-secondary/40">
                {translation}
              </span>
            </div>

            <p className="font-serif text-[17px] md:text-[19px] leading-[1.8] text-[#3C3830] opacity-90 group-hover:opacity-100 transition-opacity">
              {/* Drop-cap effect for the first verse if you want extra flair */}
              {verse.text}
            </p>

            {/* ACTION MINI-BAR */}
            <div className="flex gap-4 mt-4 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
              <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter text-secondary/40 hover:text-primary">
                <span className="material-symbols-outlined text-sm">content_copy</span>
                Copy
              </button>
              <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter text-secondary/40 hover:text-primary">
                <span className="material-symbols-outlined text-sm">share</span>
                Share
              </button>
              <button className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter text-secondary/40 hover:text-primary">
                <span className="material-symbols-outlined text-sm">bookmark</span>
                Save
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* FOOTER DECORATION */}
      <div className="flex items-center justify-center py-12">
        <div className="h-px w-12 bg-primary/10"></div>
        <span className="material-symbols-outlined text-primary/20 mx-4">auto_awesome</span>
        <div className="h-px w-12 bg-primary/10"></div>
      </div>
    </div>
  );
}