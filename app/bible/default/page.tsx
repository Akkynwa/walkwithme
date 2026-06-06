'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Sidebar from '@/app/layout-components/Sidebar';
import Image from 'next/image';

interface Translation {
  id: string;
  dblId: string;
  name: string;
  nameLocal: string;
  abbreviation: string;
  abbreviationLocal: string;
  description: string;
  descriptionLocal: string;
  language: {
    id: string;
    name: string;
    nameLocal: string;
    script: string;
    scriptDirection: string;
  };
  countries: { id: string; name: string; nameLocal: string }[];
  type: string;
  updatedAt: string;
  audioBibles: { id: string; name: string; nameLocal: string; dblId: string }[];
}

interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  translations: Translation[];
}

interface BibleBook {
  name: string;
  chapters: number;
}

// Import Bible book names JSON
import bibleBookNames from '@/lib/bible-book-names.json';

const BIBLE_STRUCTURE = {
  oldTestament: [
    { name: 'GEN', chapters: 50 }, { name: 'EXO', chapters: 40 }, { name: 'LEV', chapters: 27 }, { name: 'NUM', chapters: 36 }, { name: 'DEU', chapters: 34 },
    { name: 'JOS', chapters: 24 }, { name: 'JDG', chapters: 21 }, { name: 'RUT', chapters: 4 }, { name: '1SA', chapters: 31 }, { name: '2SA', chapters: 24 },
    { name: '1KI', chapters: 22 }, { name: '2KI', chapters: 25 }, { name: '1CH', chapters: 29 }, { name: '2CH', chapters: 36 }, { name: 'EZR', chapters: 10 },
    { name: 'NEH', chapters: 13 }, { name: 'EST', chapters: 10 }, { name: 'JOB', chapters: 42 }, { name: 'PSA', chapters: 150 }, { name: 'PRO', chapters: 31 },
    { name: 'ECC', chapters: 12 }, { name: 'SNG', chapters: 8 }, { name: 'ISA', chapters: 66 }, { name: 'JER', chapters: 52 }, { name: 'LAM', chapters: 5 },
    { name: 'EZK', chapters: 48 }, { name: 'DAN', chapters: 12 }, { name: 'HOS', chapters: 14 }, { name: 'JOL', chapters: 3 }, { name: 'AMO', chapters: 9 },
    { name: 'OBA', chapters: 1 }, { name: 'JON', chapters: 4 }, { name: 'MIC', chapters: 7 }, { name: 'NAM', chapters: 3 }, { name: 'HAB', chapters: 3 },
    { name: 'ZEP', chapters: 3 }, { name: 'HAG', chapters: 2 }, { name: 'ZEC', chapters: 14 }, { name: 'MAL', chapters: 4 }
  ],
  newTestament: [
    { name: 'MAT', chapters: 28 }, { name: 'MRK', chapters: 16 }, { name: 'LUK', chapters: 24 }, { name: 'JHN', chapters: 21 }, { name: 'ACT', chapters: 28 },
    { name: 'ROM', chapters: 16 }, { name: '1CO', chapters: 16 }, { name: '2CO', chapters: 13 }, { name: 'GAL', chapters: 6 }, { name: 'EPH', chapters: 6 },
    { name: 'PHP', chapters: 4 }, { name: 'COL', chapters: 4 }, { name: '1TH', chapters: 5 }, { name: '2TH', chapters: 3 }, { name: '1TI', chapters: 6 },
    { name: '2TI', chapters: 4 }, { name: 'TIT', chapters: 3 }, { name: 'PHM', chapters: 1 }, { name: 'HEB', chapters: 13 }, { name: 'JAS', chapters: 5 },
    { name: '1PE', chapters: 5 }, { name: '2PE', chapters: 3 }, { name: '1JO', chapters: 5 }, { name: '2JO', chapters: 1 }, { name: '3JO', chapters: 1 },
    { name: 'JUD', chapters: 1 }, { name: 'REV', chapters: 22 }
  ]
};

// Import translations from JSO
import bibleData from '@/lib/bible-translations.json';

// Complete flag emoji mapping for all languages
const getFlagEmoji = (countryCode: string): string => {
  const flags: Record<string, string> = {
    eng: '🇬🇧', yor: '🇳🇬', luo: '🇰🇪', mal: '🇮🇳', mar: '🇮🇳',
    swh: '🇹🇿', sna: '🇿🇼', spa: '🇪🇸', tha: '🇹🇭', vie: '🇻🇳',
    urd: '🇵🇰', ukr: '🇺🇦', tel: '🇮🇳', tam: '🇮🇳', npi: '🇳🇵',
    pan: '🇮🇳', pes: '🇮🇷', run: '🇧🇮', lug: '🇺🇬', mdy: '🇪🇹',
    mgh: '🇹🇿', ndj: '🇹🇿', ngp: '🇹🇿', nnq: '🇹🇿', nya: '🇲🇼',
    nzi: '🇬🇭', poy: '🇹🇿', ruf: '🇹🇿', tsn: '🇧🇼', twi: '🇬🇭',
    xnj: '🇹🇿', yao: '🇹🇿', zaj: '🇹🇿', ziw: '🇹🇿', yom: '🇨🇩',
    nag: '🇮🇳', nit: '🇮🇳', nlx: '🇮🇳', ory: '🇮🇳', peg: '🇮🇳',
    pwr: '🇮🇳', rei: '🇮🇳', rki: '🇲🇲', san: '🇮🇳', sch: '🇮🇳',
    sle: '🇮🇳', tgj: '🇮🇳', tvn: '🇲🇲', tvt: '🇮🇳', unx: '🇮🇳',
    vgr: '🇮🇳', vid: '🇹🇿', ydd: '🇺🇸', rmc: '🇸🇰', rmn: '🇷🇸',
    rmy: '🇷🇸', rup: '🇦🇱', slk: '🇸🇰', srp: '🇷🇸', tur: '🇹🇷',
    nld: '🇳🇱', nob: '🇳🇴', pol: '🇵🇱', por: '🇧🇷', ton: '🇹🇴',
    nho: '🇵🇬', omb: '🇻🇺', pon: '🇫🇲', yap: '🇫🇲', tkr: '🇦🇿', quc: '🇬🇹',
    ibo: '🇳🇬', hau: '🇳🇬'
  };
  return flags[countryCode] || '🌐';
};

export default function BiblePage() {
  const [availableLanguages, setAvailableLanguages] = useState<LanguageOption[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption | null>(null);
  const [selectedTranslation, setSelectedTranslation] = useState<Translation | null>(null);
  const [activeBook, setActiveBook] = useState<BibleBook>(BIBLE_STRUCTURE.oldTestament[0]);
  const [activeChapter, setActiveChapter] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [verses, setVerses] = useState<{ number: number; text: string }[]>([]);
  const [audioStreamUrl, setAudioStreamUrl] = useState<string>('');

  // Load translations from JSON on mount
  useEffect(() => {
    const translations = bibleData.translations as Translation[];
    
    // Group translations by language
    const languagesMap = new Map<string, LanguageOption>();
    
    translations.forEach(trans => {
      const langId = trans.language.id;
      if (!languagesMap.has(langId)) {
        languagesMap.set(langId, {
          code: langId,
          name: trans.language.name,
          nativeName: trans.language.nameLocal,
          flag: getFlagEmoji(langId),
          translations: []
        });
      }
      languagesMap.get(langId)!.translations.push(trans);
    });
    
    // Add additional languages that have book names but no translations yet
    const additionalLanguages = ['ibo', 'hau'];
    additionalLanguages.forEach(langCode => {
      if (!languagesMap.has(langCode) && bibleBookNames[langCode as keyof typeof bibleBookNames]) {
        languagesMap.set(langCode, {
          code: langCode,
          name: langCode === 'ibo' ? 'Igbo' : 'Hausa',
          nativeName: langCode === 'ibo' ? 'Igbo' : 'Hausa',
          flag: langCode === 'ibo' ? '🇳🇬' : '🇳🇬',
          translations: []
        });
      }
    });
    
    // Sort languages alphabetically by name
    const languages = Array.from(languagesMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    setAvailableLanguages(languages);
    
    // Set default selections - prefer English if available
    const englishLang = languages.find(l => l.code === 'eng');
    if (englishLang) {
      setSelectedLanguage(englishLang);
      if (englishLang.translations.length > 0) {
        setSelectedTranslation(englishLang.translations[0]);
      }
    } else if (languages.length > 0) {
      setSelectedLanguage(languages[0]);
      if (languages[0].translations.length > 0) {
        setSelectedTranslation(languages[0].translations[0]);
      }
    }
  }, []);

  const syncSanctuaryPassage = useCallback(async (bookName: string, chapterNum: number, _langCode: string, transId: string) => {
  setLoading(true);
  try {
    // FIX: Match the query params your backend expects
    const res = await fetch(`/api/bible/passage?bibleId=${transId}&passageId=${bookName}.${chapterNum}`);
    const data = await res.json();
    
    // Now this will work because the backend is normalizing the format!
    if (data.success) {
      setVerses(data.verses);
      setAudioStreamUrl(data.audio);
    }
  } catch (e) {
    console.error("Transmission error:", e);
  } finally {
    setLoading(false);
  }
}, []);

  useEffect(() => {
    if (selectedLanguage && selectedTranslation) {
      syncSanctuaryPassage(activeBook.name, activeChapter, selectedLanguage.code, selectedTranslation.id);
    }
  }, [activeBook.name, activeChapter, selectedLanguage, selectedTranslation, syncSanctuaryPassage]);

  const handleLanguageChange = (code: string) => {
    const targetLang = availableLanguages.find(l => l.code === code);
    if (targetLang) {
      setSelectedLanguage(targetLang);
      if (targetLang.translations.length > 0) {
        setSelectedTranslation(targetLang.translations[0]);
      }
    }
  };

  const getLocalizedName = (name: string) => {
    const langCode = selectedLanguage?.code || 'en';
    const bookNames = bibleBookNames[langCode as keyof typeof bibleBookNames];
    if (bookNames && bookNames[name as keyof typeof bookNames]) {
      return bookNames[name as keyof typeof bookNames];
    }
    // Fallback to English
    const englishNames = bibleBookNames['en'];
    return englishNames?.[name as keyof typeof englishNames] || name;
  };

  if (!selectedLanguage || !selectedTranslation) {
    return (
      <div className="relative flex min-h-screen items-center justify-center">
        <div className="fixed inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=2070"
            alt="Peaceful sanctuary background"
            fill
            className="object-cover scale-110 blur-xl opacity-30"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/30"></div>
        </div>
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-black uppercase tracking-wider text-gray-500">Loading translations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen">
      {/* Background Image Layers */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=2070"
          alt="Peaceful sanctuary background"
          fill
          className="object-cover scale-110 blur-xl opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/30"></div>
      </div>

      {/* Subtle Animated Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-amber-200/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-amber-300/8 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '-3s' }} />
      </div>

      <Sidebar />

      <main className="relative z-10 flex-1 lg:ml-56 pt-20 pb-16 px-4 md:px-6 max-w-7xl mx-auto w-full transition-all">
        
        {/* SELECTOR BAR - Glass Style */}
        <section className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-white/40 backdrop-blur-xl border border-white/60 px-4 py-3 rounded-xl shadow-lg">
          <div className="flex flex-wrap items-center gap-4">
            {/* Language Selector */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1 mb-0.5">
                <span className="material-symbols-outlined text-amber-500 text-xs">language</span>
                <span className="text-[9px] font-black text-amber-600 uppercase tracking-wider">Language</span>
              </div>
              <div className="relative">
                <select 
                  value={selectedLanguage.code} 
                  onChange={(e) => handleLanguageChange(e.target.value)} 
                  className="bg-transparent font-bold text-xs text-gray-700 outline-none cursor-pointer pr-6 appearance-none min-w-[180px]"
                >
                  {availableLanguages.map(l => (
                    <option key={l.code} value={l.code}>
                      {l.flag} {l.name} ({l.nativeName})
                    </option>
                  ))}
                </select>
                <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">expand_more</span>
              </div>
            </div>
            
            <div className="w-px h-6 bg-gray-200/60 hidden sm:block" />
            
            {/* Translation Selector */}
            <div className="flex flex-col">
              <div className="flex items-center gap-1 mb-0.5">
                <span className="material-symbols-outlined text-amber-500 text-xs">translate</span>
                <span className="text-[9px] font-black text-amber-600 uppercase tracking-wider">Version</span>
              </div>
              <div className="relative">
                <select 
                  value={selectedTranslation.id} 
                  onChange={(e) => {
                    const translation = selectedLanguage.translations.find(t => t.id === e.target.value);
                    if (translation) setSelectedTranslation(translation);
                  }} 
                  className="bg-transparent font-bold text-xs text-gray-700 outline-none cursor-pointer pr-6 appearance-none max-w-[220px] truncate"
                >
                  {selectedLanguage.translations.length > 0 ? (
                    selectedLanguage.translations.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.abbreviation} - {t.name}
                      </option>
                    ))
                  ) : (
                    <option value="">No translations available</option>
                  )}
                </select>
                <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">expand_more</span>
              </div>
            </div>
          </div>
          
          <Link href="/bible/compare" className="text-xs font-bold text-amber-600 flex items-center gap-1 hover:text-amber-700 transition-opacity">
            <span className="material-symbols-outlined text-sm">compare_arrows</span> Parallel Mode
          </Link>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* BOOK INDEX - Glass Style */}
          <aside className="lg:col-span-3 h-[35vh] lg:h-[75vh] overflow-y-auto bg-white/40 backdrop-blur-sm rounded-xl p-3 shadow-lg border border-white/60 custom-scrollbar">
            {[ 
              { label: 'Old Testament', data: BIBLE_STRUCTURE.oldTestament },
              { label: 'New Testament', data: BIBLE_STRUCTURE.newTestament }
            ].map((section) => (
              <div key={section.label} className="mb-4">
                <p className="text-[10px] font-black text-amber-600 uppercase px-2 mb-2 tracking-wider">{section.label}</p>
                <div className="space-y-0.5">
                  {section.data.map((book) => (
                    <button 
                      key={book.name} 
                      onClick={() => { setActiveBook(book); setActiveChapter(1); }} 
                      className={`w-full flex items-center justify-between p-2 px-3 rounded-lg text-xs transition-all ${
                        activeBook.name === book.name 
                          ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold shadow-md' 
                          : 'text-gray-600 hover:bg-white/50 hover:text-amber-600'
                      }`}
                    >
                      <span>{getLocalizedName(book.name)}</span>
                      <span className={`text-[10px] ${activeBook.name === book.name ? 'text-amber-100' : 'opacity-40'}`}>{book.chapters}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </aside>

          {/* MAIN READER CONTAINER - Glass Style */}
          <div className="lg:col-span-9 flex flex-col gap-5">
            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-white/60">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="material-symbols-outlined text-amber-500 text-lg">menu_book</span>
                    <h2 className="text-2xl font-serif font-bold text-gray-800 leading-none">
                      {getLocalizedName(activeBook.name)} <span className="text-amber-600 font-sans font-medium text-xl ml-1">{activeChapter}</span>
                    </h2>
                  </div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-7">
                    {selectedTranslation.abbreviation} - {selectedTranslation.name}
                  </p>
                </div>

                {/* AUDIO CONTROLLER INJECTOR */}
                {audioStreamUrl && !loading && (
                  <div className="flex items-center gap-2 bg-white/60 backdrop-blur-md p-1.5 px-3 rounded-xl border border-white shadow-sm self-start sm:self-center">
                    <span className="material-symbols-outlined text-amber-600 text-sm animate-pulse">volume_up</span>
                    <audio 
                      src={audioStreamUrl} 
                      controls 
                      className="h-7 w-48 sm:w-56 text-xs accent-amber-600 outline-none"
                    />
                  </div>
                )}
              </div>

              {/* Responsive Chapter Grid Selection Matrices */}
              <div className="flex flex-wrap gap-1 max-h-[96px] overflow-y-auto p-2 bg-white/30 rounded-lg border border-white/40 custom-scrollbar">
                {Array.from({ length: activeBook.chapters }, (_, i) => i + 1).map((num) => (
                  <button 
                    key={num} 
                    onClick={() => setActiveChapter(num)} 
                    className={`w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold transition-all ${
                      activeChapter === num 
                        ? 'bg-amber-600 text-white shadow-sm scale-105' 
                        : 'bg-white/50 text-gray-500 hover:bg-white hover:text-amber-600'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* SCRIPTURE CANVAS CONTAINER */}
            <div className="bg-white/40 backdrop-blur-sm rounded-xl shadow-lg border border-white/60 overflow-hidden min-h-[300px] flex flex-col">
              <div className="bg-white/30 px-5 py-3 flex justify-between items-center border-b border-white/40">
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-amber-500 text-sm">self_improvement</span>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Sanctuary Scripture Canvas</span>
                </div>
                {loading && (
                  <span className="material-symbols-outlined text-amber-600 text-sm animate-spin">sync</span>
                )}
              </div>

              <div className="p-6 md:p-10 flex-1 flex flex-col justify-start">
                <div className="max-w-3xl mx-auto w-full">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
                      <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                      <p className="text-xs font-medium italic mt-2">Gathering translation verses...</p>
                    </div>
                  ) : verses.length > 0 ? (
                    <div className="text-sm md:text-base font-serif text-gray-700 leading-relaxed tracking-wide space-y-3 selection:bg-amber-200">
                      {verses.map((v) => (
                        <span key={v.number} className="inline leading-relaxed mr-1.5">
                          <sup className="text-[9px] font-sans font-extrabold text-amber-600/80 mr-1 select-none bg-amber-100/60 px-1 rounded">
                            {v.number}
                          </sup>
                          {v.text}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 text-gray-400 italic text-xs">
                      No matching textual scripture matrices found for this layout criteria.
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Decorative Footer Spacer */}
        <div className="mt-10 flex justify-center items-center gap-4 opacity-30">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400" />
          <span className="material-symbols-outlined text-amber-400 text-sm">menu_book</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400" />
        </div>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.02);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(245, 158, 11, 0.25);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(245, 158, 11, 0.4);
        }
      `}</style>
    </div>
  );
}