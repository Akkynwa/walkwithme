'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useTheme } from '../../context/ThemeContext';
import Sidebar from '@/app/layout-components/Sidebar';

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

import bibleBookNames from '@/lib/bible-book-names.json';
import bibleData from '@/lib/bible-translations.json';

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
  const { isDark } = useTheme();

  const [availableLanguages, setAvailableLanguages] = useState<LanguageOption[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageOption | null>(null);
  const [selectedTranslation, setSelectedTranslation] = useState<Translation | null>(null);
  const [activeBook, setActiveBook] = useState<BibleBook>(BIBLE_STRUCTURE.oldTestament[0]);
  const [activeChapter, setActiveChapter] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [verses, setVerses] = useState<{ number: number; text: string }[]>([]);
  const [audioStreamUrl, setAudioStreamUrl] = useState<string>('');

  useEffect(() => {
    const translations = bibleData.translations as Translation[];
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
    
    const additionalLanguages = ['ibo', 'hau'];
    additionalLanguages.forEach(langCode => {
      if (!languagesMap.has(langCode) && bibleBookNames[langCode as keyof typeof bibleBookNames]) {
        languagesMap.set(langCode, {
          code: langCode,
          name: langCode === 'ibo' ? 'Igbo' : 'Hausa',
          nativeName: langCode === 'ibo' ? 'Igbo' : 'Hausa',
          flag: '🇳🇬',
          translations: []
        });
      }
    });
    
    const languages = Array.from(languagesMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    setAvailableLanguages(languages);
    
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
      const res = await fetch(`/api/bible/passage?bibleId=${transId}&passageId=${bookName}.${chapterNum}`);
      const data = await res.json();
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
    const englishNames = bibleBookNames['en'];
    return englishNames?.[name as keyof typeof englishNames] || name;
  };

  if (!selectedLanguage || !selectedTranslation) {
    return (
      <div className={`flex min-h-screen items-center justify-center transition-colors duration-200 ${
        isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-stone-50 text-stone-900'
      }`}>
        <div className="flex flex-col items-center justify-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <p className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-zinc-500' : 'text-gray-500'}`}>
            Loading translations...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen transition-colors duration-200 ${
      isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-stone-50 text-stone-900'
    }`}>
      
      <Sidebar />

      <main className="flex-1 lg:ml-56 pt-24 pb-16 px-6 md:px-10 flex flex-col items-center justify-start w-full transition-all">
        <div className="w-full max-w-5xl space-y-6">
          
          {/* SELECTOR BAR */}
          <section className={`flex flex-wrap items-center justify-between gap-4 px-6 py-4 rounded-xl border shadow-sm transition-colors ${
            isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-stone-200'
          }`}>
            <div className="flex flex-wrap items-center gap-6">
              {/* Language Selector */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1 mb-1">
                  <span className="material-symbols-outlined text-amber-500 text-xs">language</span>
                  <span className="text-[9px] font-black text-amber-600 uppercase tracking-wider">Language</span>
                </div>
                <div className="relative">
                  <select 
                    value={selectedLanguage.code} 
                    onChange={(e) => handleLanguageChange(e.target.value)} 
                    className={`bg-transparent font-bold text-xs outline-none cursor-pointer pr-6 appearance-none min-w-[180px] ${
                      isDark ? 'text-zinc-300 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {availableLanguages.map(l => (
                      <option key={l.code} value={l.code} className={isDark ? 'bg-zinc-900 text-zinc-100' : 'bg-white text-stone-900'}>
                        {l.flag} {l.name} ({l.nativeName})
                      </option>
                    ))}
                  </select>
                  <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">expand_more</span>
                </div>
              </div>
              
              <div className={`w-px h-6 hidden sm:block ${isDark ? 'bg-zinc-800' : 'bg-gray-200'}`} />
              
              {/* Translation Selector */}
              <div className="flex flex-col">
                <div className="flex items-center gap-1 mb-1">
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
                    className={`bg-transparent font-bold text-xs outline-none cursor-pointer pr-6 appearance-none max-w-[220px] truncate ${
                      isDark ? 'text-zinc-300 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {selectedLanguage.translations.length > 0 ? (
                      selectedLanguage.translations.map(t => (
                        <option key={t.id} value={t.id} className={isDark ? 'bg-zinc-900 text-zinc-100' : 'bg-white text-stone-900'}>
                          {t.abbreviation} - {t.name}
                        </option>
                      ))
                    ) : (
                      <option value="" className={isDark ? 'bg-zinc-900 text-zinc-100' : 'bg-white text-stone-900'}>No translations available</option>
                    )}
                  </select>
                  <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 text-xs pointer-events-none">expand_more</span>
                </div>
              </div>
            </div>
            
            <Link href="/bible/compare" className="text-xs font-bold text-amber-600 flex items-center gap-1 hover:text-amber-700 transition-colors">
              <span className="material-symbols-outlined text-sm">compare_arrows</span> Parallel Mode
            </Link>
          </section>

          {/* MAIN CONTENT SPLIT GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* BOOK INDEX */}
            <aside className={`lg:col-span-3 h-[40vh] lg:h-[75vh] overflow-y-auto rounded-xl p-4 shadow-sm border scrollbar-thin transition-colors ${
              isDark ? 'bg-zinc-900 border-zinc-800 scrollbar-thumb-zinc-700' : 'bg-white border-stone-200 scrollbar-thumb-stone-200'
            }`}>
              {[ 
                { label: 'Old Testament', data: BIBLE_STRUCTURE.oldTestament },
                { label: 'New Testament', data: BIBLE_STRUCTURE.newTestament }
              ].map((section) => (
                <div key={section.label} className="mb-5">
                  <p className="text-[10px] font-black text-amber-600 uppercase px-2 mb-2 tracking-wider">{section.label}</p>
                  <div className="space-y-0.5">
                    {section.data.map((book) => (
                      <button 
                        key={book.name} 
                        onClick={() => { setActiveBook(book); setActiveChapter(1); }} 
                        className={`w-full flex items-center justify-between p-2 px-3 rounded-lg text-xs transition-all ${
                          activeBook.name === book.name 
                            ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold shadow-sm' 
                            : isDark 
                              ? 'text-zinc-400 hover:bg-zinc-800 hover:text-amber-500' 
                              : 'text-gray-600 hover:bg-stone-50 hover:text-amber-600'
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

            {/* MAIN READER CONTAINER */}
            <div className="lg:col-span-9 flex flex-col gap-6">
              
              {/* HEADER INFO & CHAPTER GRID */}
              <div className={`rounded-xl p-6 shadow-sm border transition-colors ${
                isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-stone-200'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="material-symbols-outlined text-amber-500 text-lg">menu_book</span>
                      <h2 className={`text-2xl font-serif font-bold leading-none ${isDark ? 'text-zinc-100' : 'text-gray-800'}`}>
                        {getLocalizedName(activeBook.name)} <span className="text-amber-600 font-sans font-medium text-xl ml-1">{activeChapter}</span>
                      </h2>
                    </div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider pl-7">
                      {selectedTranslation.abbreviation} - {selectedTranslation.name}
                    </p>
                  </div>

                  {/* AUDIO CONTROLLER */}
                  {audioStreamUrl && !loading && (
                    <div className={`flex items-center gap-2 p-1.5 px-3 rounded-xl border shadow-sm self-start sm:self-center ${
                      isDark ? 'bg-zinc-800 border-zinc-700' : 'bg-stone-50 border-stone-200'
                    }`}>
                      <span className="material-symbols-outlined text-amber-600 text-sm animate-pulse">volume_up</span>
                      <audio 
                        src={audioStreamUrl} 
                        controls 
                        className="h-7 w-48 sm:w-56 text-xs accent-amber-600 outline-none"
                      />
                    </div>
                  )}
                </div>

                {/* Chapter Selection Matrix */}
                <div className={`flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto p-3 rounded-lg border scrollbar-none ${
                  isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-stone-50 border-stone-200'
                }`}>
                  {Array.from({ length: activeBook.chapters }, (_, i) => i + 1).map((num) => (
                    <button 
                      key={num} 
                      onClick={() => setActiveChapter(num)} 
                      className={`w-8 h-8 rounded-md flex items-center justify-center text-xs font-bold transition-all ${
                        activeChapter === num 
                          ? 'bg-amber-600 text-white shadow-sm scale-105' 
                          : isDark 
                            ? 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-amber-500' 
                            : 'bg-white text-gray-500 hover:bg-white hover:text-amber-600 hover:shadow-sm'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* TEXT CANVAS CONTAINER */}
              <div className={`rounded-xl shadow-sm border overflow-hidden min-h-[350px] flex flex-col transition-colors ${
                isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-stone-200'
              }`}>
                <div className={`px-6 py-4 flex justify-between items-center border-b ${
                  isDark ? 'bg-zinc-950/40 border-zinc-800' : 'bg-stone-50 border-stone-200'
                }`}>
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-amber-500 text-sm">self_improvement</span>
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-zinc-400' : 'text-gray-500'}`}>
                      Sanctuary Scripture Canvas
                    </span>
                  </div>
                  {loading && (
                    <span className="material-symbols-outlined text-amber-600 text-sm animate-spin">sync</span>
                  )}
                </div>

                <div className="p-8 md:p-12 flex-1 flex flex-col justify-start items-center">
                  <div className="max-w-3xl w-full">
                    {loading ? (
                      <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
                        <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                        <p className={`text-xs font-medium italic mt-2 ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                          Gathering translation verses...
                        </p>
                      </div>
                    ) : verses.length > 0 ? (
                      <div className={`text-sm md:text-base font-serif leading-relaxed tracking-wide space-y-4 selection:bg-amber-200/60 ${
                        isDark ? 'text-zinc-300 selection:text-zinc-900' : 'text-gray-700'
                      }`}>
                        {verses.map((v) => (
                          <span key={v.number} className="inline leading-relaxed mr-2">
                            <sup className={`text-[9px] font-sans font-extrabold mr-1 select-none px-1 rounded-sm ${
                              isDark ? 'text-amber-400 bg-zinc-800' : 'text-amber-600/80 bg-amber-100/60'
                            }`}>
                              {v.number}
                            </sup>
                            {v.text}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <div className={`text-center py-20 italic text-xs ${isDark ? 'text-zinc-500' : 'text-gray-400'}`}>
                        No matching textual scripture matrices found for this layout criteria.
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* DECORATIVE FOOTER SPACER */}
          <div className="mt-6 flex justify-center items-center gap-4 opacity-30">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-amber-400" />
            <span className="material-symbols-outlined text-amber-500 text-sm">menu_book</span>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-amber-400" />
          </div>
          
        </div>
      </main>
    </div>
  );
}