'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/app/layout-components/Sidebar';
import Header from '@/app/layout-components/Header';
import { AudioPlayer } from '@/components/audio/AudioPlayer';
import Link from 'next/link';

const LANGUAGES = [
  { 
    code: 'en', 
    name: 'English', 
    translations: [{ id: 'de4e12af7f29f59f-01', name: 'KJV' }, { id: '06125ad3d5662098-01', name: 'NIV' }] 
  },
  { 
    code: 'fr', 
    name: 'Français', 
    translations: [{ id: '01b17f8a70e2842c-01', name: 'LSG' }] 
  },
  { 
    code: 'es', 
    name: 'Español', 
    translations: [{ id: '592420522e16040d-01', name: 'RVR1960' }] 
  },
  { 
    code: 'de', 
    name: 'Deutsch', 
    translations: [{ id: 'b17e01658803510c-01', name: 'Luther' }] 
  }
];

// Mapping for localized display names
const BIBLE_NAMES: Record<string, Record<string, string>> = {
  en: { GEN: 'Genesis', EXO: 'Exodus', LEV: 'Leviticus', NUM: 'Numbers', DEU: 'Deuteronomy', JOS: 'Joshua', JDG: 'Judges', RUT: 'Ruth', '1SA': '1 Samuel', '2SA': '2 Samuel', '1KI': '1 Kings', '2KI': '2 Kings', '1CH': '1 Chronicles', '2CH': '2 Chronicles', EZR: 'Ezra', NEH: 'Nehemiah', EST: 'Esther', JOB: 'Job', PSA: 'Psalms', PRO: 'Proverbs', ECC: 'Ecclesiastes', SNG: 'Song of Solomon', ISA: 'Isaiah', JER: 'Jeremiah', LAM: 'Lamentations', EZK: 'Ezekiel', DAN: 'Daniel', HOS: 'Hosea', JOL: 'Joel', AMO: 'Amos', OBA: 'Obadiah', JON: 'Jonah', MIC: 'Micah', NAM: 'Nahum', HAB: 'Habakkuk', ZEP: 'Zephaniah', HAG: 'Haggai', ZEC: 'Zechariah', MAL: 'Malachi', MAT: 'Matthew', MRK: 'Mark', LUK: 'Luke', JHN: 'John', ACT: 'Acts', ROM: 'Romans', '1CO': '1 Corinthians', '2CO': '2 Corinthians', GAL: 'Galatians', EPH: 'Ephesians', PHP: 'Philippians', COL: 'Colossians', '1TH': '1 Thessalonians', '2TH': '2 Thessalonians', '1TI': '1 Timothy', '2TI': '2 Timothy', TIT: 'Titus', PHM: 'Philemon', HEB: 'Hebrews', JAS: 'James', '1PE': '1 Peter', '2PE': '2 Peter', '1JO': '1 John', '2JO': '2 John', '3JO': '3 John', JUD: 'Jude', REV: 'Revelation' },
  fr: { GEN: 'Genèse', EXO: 'Exode', LEV: 'Lévitique', NUM: 'Nombres', DEU: 'Deutéronome', JOS: 'Josué', JDG: 'Juges', RUT: 'Ruth', '1SA': '1 Samuel', '2SA': '2 Samuel', '1KI': '1 Rois', '2KI': '2 Rois', '1CH': '1 Chroniques', '2CH': '2 Chroniques', EZR: 'Esdras', NEH: 'Néhémie', EST: 'Esther', JOB: 'Job', PSA: 'Psaumes', PRO: 'Proverbes', ECC: 'Ecclésiaste', SNG: 'Cantique des Cantiques', ISA: 'Ésaïe', JER: 'Jérémie', LAM: 'Lamentations', EZK: 'Ézéchiel', DAN: 'Daniel', HOS: 'Osée', JOL: 'Joël', AMO: 'Amos', OBA: 'Abdias', JON: 'Jonas', MIC: 'Michée', NAM: 'Nahum', HAB: 'Habacuc', ZEP: 'Sophonie', HAG: 'Aggée', ZEC: 'Zacharie', MAL: 'Malachie', MAT: 'Matthieu', MRK: 'Marc', LUK: 'Luc', JHN: 'Jean', ACT: 'Actes', ROM: 'Romains', '1CO': '1 Corinthiens', '2CO': '2 Corinthiens', GAL: 'Galates', EPH: 'Éphésiens', PHP: 'Philippiens', COL: 'Colossiens', '1TH': '1 Thessaloniciens', '2TH': '2 Thessaloniciens', '1TI': '1 Timothée', '2TI': '2 Timothée', TIT: 'Tite', PHM: 'Philémon', HEB: 'Hébreux', JAS: 'Jacques', '1PE': '1 Pierre', '2PE': '2 Pierre', '1JO': '1 Jean', '2JO': '2 Jean', '3JO': '3 Jean', JUD: 'Jude', REV: 'Apocalypse' },
  es: { GEN: 'Génesis', EXO: 'Éxodo', LEV: 'Levítico', NUM: 'Números', DEU: 'Deuteronomio', JOS: 'Josué', JDG: 'Jueces', RUT: 'Rut', '1SA': '1 Samuel', '2SA': '2 Samuel', '1KI': '1 Reyes', '2KI': '2 Reyes', '1CH': '1 Crónicas', '2CH': '2 Crónicas', EZR: 'Esdras', NEH: 'Nehemías', EST: 'Ester', JOB: 'Job', PSA: 'Salmos', PRO: 'Proverbios', ECC: 'Eclesiastés', SNG: 'Cantares', ISA: 'Isaías', JER: 'Jeremías', LAM: 'Lamentaciones', EZK: 'Ezequiel', DAN: 'Daniel', HOS: 'Oseas', JOL: 'Joel', AMO: 'Amos', OBA: 'Abdías', JON: 'Jonás', MIC: 'Miqueas', NAM: 'Nahúm', HAB: 'Habacuc', ZEP: 'Sofonías', HAG: 'Hageo', ZEC: 'Zacarías', MAL: 'Malaquías', MAT: 'Mateo', MRK: 'Marcos', LUK: 'Lucas', JHN: 'Juan', ACT: 'Hechos', ROM: 'Romanos', '1CO': '1 Corintios', '2CO': '2 Corintios', GAL: 'Gálatas', EPH: 'Efesios', PHP: 'Filipenses', COL: 'Colosenses', '1TH': '1 Tesalonicenses', '2TH': '2 Tesalonicenses', '1TI': '1 Timoteo', '2TI': '2 Timoteo', TIT: 'Tito', PHM: 'Filemón', HEB: 'Hebreos', JAS: 'Santiago', '1PE': '1 Pedro', '2PE': '2 Pedro', '1JO': '1 Juan', '2JO': '2 Juan', '3JO': '3 Juan', JUD: 'Judas', REV: 'Apocalipsis' },
  de: { GEN: '1. Mose', EXO: '2. Mose', LEV: '3. Mose', NUM: '4. Mose', DEU: '5. Mose', JOS: 'Josua', JDG: 'Richter', RUT: 'Rut', '1SA': '1. Samuel', '2SA': '2. Samuel', '1KI': '1. Könige', '2KI': '2. Könige', '1CH': '1. Chronik', '2CH': '2. Chronik', EZR: 'Esra', NEH: 'Nehemia', EST: 'Ester', JOB: 'Hiob', PSA: 'Psalmen', PRO: 'Sprüche', ECC: 'Prediger', SNG: 'Hohelied', ISA: 'Jesaja', JER: 'Jeremia', LAM: 'Klagelieder', EZK: 'Hesekiel', DAN: 'Daniel', HOS: 'Hosea', JOL: 'Joel', AMO: 'Amos', OBA: 'Obadja', JON: 'Jona', MIC: 'Micha', NAM: 'Nahum', HAB: 'Habakuk', ZEP: 'Zephanja', HAG: 'Haggai', ZEC: 'Sacharja', MAL: 'Maleachi', MAT: 'Matthäus', MRK: 'Markus', LUK: 'Lukas', JHN: 'Johannes', ACT: 'Apostelgeschichte', ROM: 'Römer', '1CO': '1. Korinther', '2CO': '2. Korinther', GAL: 'Galater', EPH: 'Epheser', PHP: 'Philipper', COL: 'Kolosser', '1TH': '1. Thessalonicher', '2TH': '2. Thessalonicher', '1TI': '1. Timotheus', '2TI': '2. Timotheus', TIT: 'Titus', PHM: 'Philemon', HEB: 'Hebräer', JAS: 'Jakobus', '1PE': '1. Petrus', '2PE': '2. Petrus', '1JO': '1. Johannes', '2JO': '2. Johannes', '3JO': '3. Johannes', JUD: 'Judas', REV: 'Offenbarung' }
};

const BIBLE_STRUCTURE = {
  oldTestament: [
    { name: 'GEN', chapters: 50 }, { name: 'EXO', chapters: 40 }, { name: 'LEV', chapters: 27 }, { name: 'NUM', chapters: 36 }, { name: 'DEU', chapters: 34 }, { name: 'JOS', chapters: 24 }, { name: 'JDG', chapters: 21 }, { name: 'RUT', chapters: 4 }, { name: '1SA', chapters: 31 }, { name: '2SA', chapters: 24 }, { name: '1KI', chapters: 22 }, { name: '2KI', chapters: 25 }, { name: '1CH', chapters: 29 }, { name: '2CH', chapters: 36 }, { name: 'EZR', chapters: 10 }, { name: 'NEH', chapters: 13 }, { name: 'EST', chapters: 10 }, { name: 'JOB', chapters: 42 }, { name: 'PSA', chapters: 150 }, { name: 'PRO', chapters: 31 }, { name: 'ECC', chapters: 12 }, { name: 'SNG', chapters: 8 }, { name: 'ISA', chapters: 66 }, { name: 'JER', chapters: 52 }, { name: 'LAM', chapters: 5 }, { name: 'EZK', chapters: 48 }, { name: 'DAN', chapters: 12 }, { name: 'HOS', chapters: 14 }, { name: 'JOL', chapters: 3 }, { name: 'AMO', chapters: 9 }, { name: 'OBA', chapters: 1 }, { name: 'JON', chapters: 4 }, { name: 'MIC', chapters: 7 }, { name: 'NAM', chapters: 3 }, { name: 'HAB', chapters: 3 }, { name: 'ZEP', chapters: 3 }, { name: 'HAG', chapters: 2 }, { name: 'ZEC', chapters: 14 }, { name: 'MAL', chapters: 4 }
  ],
  newTestament: [
    { name: 'MAT', chapters: 28 }, { name: 'MRK', chapters: 16 }, { name: 'LUK', chapters: 24 }, { name: 'JHN', chapters: 21 }, { name: 'ACT', chapters: 28 }, { name: 'ROM', chapters: 16 }, { name: '1CO', chapters: 16 }, { name: '2CO', chapters: 13 }, { name: 'GAL', chapters: 6 }, { name: 'EPH', chapters: 6 }, { name: 'PHP', chapters: 4 }, { name: 'COL', chapters: 4 }, { name: '1TH', chapters: 5 }, { name: '2TH', chapters: 3 }, { name: '1TI', chapters: 6 }, { name: '2TI', chapters: 4 }, { name: 'TIT', chapters: 3 }, { name: 'PHM', chapters: 1 }, { name: 'HEB', chapters: 13 }, { name: 'JAS', chapters: 5 }, { name: '1PE', chapters: 5 }, { name: '2PE', chapters: 3 }, { name: '1JO', chapters: 5 }, { name: '2JO', chapters: 1 }, { name: '3JO', chapters: 1 }, { name: 'JUD', chapters: 1 }, { name: 'REV', chapters: 22 }
  ]
};

export default function BiblePage() {
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES[0]);
  const [selectedTranslation, setSelectedTranslation] = useState(LANGUAGES[0].translations[0]);
  const [activeBook, setActiveBook] = useState(BIBLE_STRUCTURE.oldTestament[0]);
  const [activeChapter, setActiveChapter] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showAudio, setShowAudio] = useState(false);
  const [passageData, setPassageData] = useState<{ verses?: { number: number; text: string }[]; audio: string; passage: string; } | null>(null);

  useEffect(() => {
    setSelectedTranslation(selectedLanguage.translations[0]);
    setPassageData(null);
    setShowAudio(false);
  }, [selectedLanguage]);

 const handleOpenSanctuary = async () => {
  setLoading(true);
  
  try {
    // 1. Determine the endpoint based on language or translation ID
    // If it's a custom ID like 'yor-bm-id', route to a local DB controller
    const isCustomTranslation = selectedTranslation.id.includes('custom') || selectedLanguage.code === 'yo';
    
    const endpoint = isCustomTranslation 
      ? `/api/bible/local-passage` 
      : `/api/bible/passage`;

    // 2. Execute the fetch with the dynamic endpoint
    const res = await fetch(
      `${endpoint}?book=${activeBook.name}&chapter=${activeChapter}&lang=${selectedLanguage.code}&versionId=${selectedTranslation.id}`
    );

    if (!res.ok) throw new Error("Could not retrieve scripture from the sanctuary.");

    const data = await res.json();
    
    // 3. Update State and UI
    setPassageData(data);
    
    // Smooth scroll to the reader
    setTimeout(() => {
      document.getElementById('sanctuary-reader')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
      });
    }, 150);

  } catch (err) {
    console.error("Sanctuary Error:", err);
    // You could add a toast notification here
  } finally {
    setLoading(false);
  }
};

  const getLocalizedName = (bookName: string) => BIBLE_NAMES[selectedLanguage.code]?.[bookName] || bookName;

  return (
    <div className="flex min-h-screen bg-[#f7f9ff]">
      <Sidebar />
      <Header />

      <main className="flex-1 lg:ml-64 pt-24 pb-32 px-6 md:px-12 max-w-7xl mx-auto w-full">
        
       {/* TOP SELECTOR BAR */}
<section className="mb-12 flex flex-wrap items-center justify-between gap-6 bg-white/60 backdrop-blur-xl border border-white p-4 rounded-[2rem] shadow-sm">
  <div className="flex items-center gap-4 px-4">
    <div className="flex flex-col">
      <span className="text-[9px] font-black uppercase tracking-widest text-primary/50 mb-1">Language</span>
      <select value={selectedLanguage.code} onChange={(e) => setSelectedLanguage(LANGUAGES.find(l => l.code === e.target.value)!)} className="bg-transparent font-bold text-primary border-none outline-none cursor-pointer">
        {LANGUAGES.map(lang => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
      </select>
    </div>
    <div className="h-8 w-[1px] bg-outline-variant/30 mx-4"></div>
    <div className="flex flex-col">
      <span className="text-[9px] font-black uppercase tracking-widest text-primary/50 mb-1">Version</span>
      <select value={selectedTranslation.id} onChange={(e) => setSelectedTranslation(selectedLanguage.translations.find(t => t.id === e.target.value)!)} className="bg-transparent font-bold text-primary border-none outline-none cursor-pointer">
        {selectedLanguage.translations.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
      </select>
    </div>

    {/* ADDED: COMPARE LINK */}
    <div className="h-8 w-[1px] bg-outline-variant/30 mx-4"></div>
    <Link href="/bible/compare" className="flex flex-col group">
      <span className="text-[9px] font-black uppercase tracking-widest text-primary/50 mb-1 group-hover:text-primary transition-colors">Parallel</span>
      <div className="flex items-center gap-1 font-bold text-primary">
        <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
        <span className="text-sm">Compare</span>
      </div>
    </Link>
  </div>
</section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* BOOK INDEX */}
          <aside className="lg:col-span-4 h-[75vh] overflow-y-auto custom-scrollbar pr-4 space-y-8">
            {Object.entries(BIBLE_STRUCTURE).map(([testament, books]) => (
              <div key={testament}>
                <h3 className="text-[11px] font-black uppercase tracking-[0.3em] text-secondary/60 mb-6 sticky top-0 bg-[#f7f9ff] py-2 z-10">
                  {testament === 'oldTestament' ? 'Old Testament' : 'New Testament'}
                </h3>
                <div className="grid gap-2">
                  {books.map((book) => (
                    <button key={book.name} onClick={() => { setActiveBook(book); setActiveChapter(1); setPassageData(null); }} className={`flex items-center justify-between p-5 rounded-2xl transition-all duration-300 ${activeBook.name === book.name ? 'bg-primary text-white shadow-xl scale-[1.02]' : 'bg-white hover:bg-primary/5 border border-outline-variant/10'}`}>
                      <span className="font-serif text-lg">{getLocalizedName(book.name)}</span>
                      <span className={`text-[10px] font-bold ${activeBook.name === book.name ? 'text-white/60' : 'text-primary/30'}`}>{book.chapters} CH</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </aside>

          {/* READER SECTION */}
          <div className="lg:col-span-8 flex flex-col gap-10">
            <div className="bg-white rounded-[3rem] border border-outline-variant/20 p-8 md:p-12 shadow-sm">
              <div className="mb-10">
                <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-2">{selectedTranslation.name}</span>
                <h2 className="text-5xl font-serif text-primary">{getLocalizedName(activeBook.name)} <span className="text-primary/20">{activeChapter}</span></h2>
              </div>
              <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 mb-12">
                {Array.from({ length: activeBook.chapters }, (_, i) => i + 1).map((num) => (
                  <button key={num} onClick={() => { setActiveChapter(num); setPassageData(null); }} className={`aspect-square rounded-xl flex items-center justify-center text-sm font-bold transition-all ${activeChapter === num ? 'bg-primary text-white shadow-lg' : 'bg-surface-container-low text-primary/40'}`}>
                    {num}
                  </button>
                ))}
              </div>
              <button onClick={handleOpenSanctuary} disabled={loading} className="w-full group bg-primary text-white p-6 rounded-[2.5rem] flex items-center justify-between hover:shadow-2xl transition-all disabled:opacity-50">
                <div className="flex items-center gap-4">
                   <span className="material-symbols-outlined text-2xl">{loading ? 'sync' : 'auto_stories'}</span>
<span className="text-xl font-serif">
      Open {getLocalizedName(activeBook.name)} {activeChapter}
    </span>                </div>
                <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
              </button>
            </div>

            {passageData && (
              <div id="sanctuary-reader" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex justify-between items-center bg-white p-4 px-8 rounded-full border border-outline-variant/10 shadow-sm">
                   <h3 className="text-lg font-serif text-primary">{passageData.passage}</h3>
                   <button onClick={() => setShowAudio(!showAudio)} className={`flex items-center gap-2 px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all ${showAudio ? 'bg-primary text-white' : 'bg-primary/5 text-primary'}`}>
                     <span className="material-symbols-outlined text-sm">{showAudio ? 'close' : 'volume_up'}</span>
                     {showAudio ? 'Hide Audio' : 'Play Audio'}
                   </button>
                </div>

                {showAudio && (
                  <div className="bg-white rounded-[2rem] shadow-xl border border-white p-2 animate-in zoom-in-95 duration-300">
                    <AudioPlayer src={passageData.audio} title={passageData.passage} book={getLocalizedName(activeBook.name)} chapter={activeChapter} />
                  </div>
                )}

                {/* READER SECTION - ALIGNED TO PAGE MAIN */}
<div className="w-full bg-[#FDFBF7] min-h-screen">
  
  {/* The Content Area - Matches your Page Main constraints */}
  <div className="w-full max-w-5xl mx-auto py-12 px-6 md:px-10 lg:px-16">
    
    <div className="space-y-10">
      {Array.isArray(passageData.verses) ? (
        passageData.verses.map((verse: any) => (
          <div 
            key={verse.number} 
            className="group flex items-start gap-4 md:gap-8 transition-all duration-300"
          >
            {/* Verse Number - Small and high-contrast against the soft bg */}
            <span className="w-6 md:w-10 shrink-0 text-right font-serif text-primary/40 pt-1.5 select-none tabular-nums text-xs md:text-sm font-bold">
              {verse.number}
            </span>

            {/* Verse Text - Moderate, standard reading size */}
            {/* 1.125rem is roughly 18px - the gold standard for web reading */}
            <p className="text-[1.05rem] md:text-[1.125rem] font-serif text-[#3C3830] leading-[1.85] tracking-normal opacity-90 group-hover:opacity-100 transition-opacity">
              {verse.text}
            </p>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="w-8 h-8 rounded-full border-2 border-primary/10 border-t-primary animate-spin"></div>
          <p className="text-[10px] font-black text-primary/30 uppercase tracking-[0.4em]">Preparing Passage</p>
        </div>
      )}
    </div>

    {/* Simple Divider */}
    <div className="mt-20 pt-10 border-t border-gray-100 flex justify-center">
       <span className="material-symbols-outlined text-primary/10 text-3xl">auto_awesome</span>
    </div>
  </div>
</div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}