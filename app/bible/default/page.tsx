'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Sidebar from '@/app/layout-components/Sidebar';
import Image from 'next/image';

const LANGUAGES = [
  { code: 'en', name: 'English', translations: [{ id: 'de4e12af7f29f59f-01', name: 'KJV' }, { id: '06125ad3d5662098-01', name: 'NIV' }] },
  { code: 'fr', name: 'Français', translations: [{ id: '01b17f8a70e2842c-01', name: 'LSG' }] },
  { code: 'es', name: 'Español', translations: [{ id: '592420522e16040d-01', name: 'RVR1960' }] },
  { code: 'de', name: 'Deutsch', translations: [{ id: 'b17e01658803510c-01', name: 'Luther' }] }
];

const BIBLE_NAMES: Record<string, Record<string, string>> = {
  en: { GEN: 'Genesis', EXO: 'Exodus', LEV: 'Leviticus', NUM: 'Numbers', DEU: 'Deuteronomy', JOS: 'Joshua', JDG: 'Judges', RUT: 'Ruth', '1SA': '1 Samuel', '2SA': '2 Samuel', '1KI': '1 Kings', '2KI': '2 Kings', '1CH': '1 Chronicles', '2CH': '2 Chronicles', EZR: 'Ezra', NEH: 'Nehemiah', EST: 'Esther', JOB: 'Job', PSA: 'Psalms', PRO: 'Proverbs', ECC: 'Ecclesiastes', SNG: 'Song of Solomon', ISA: 'Isaiah', JER: 'Jeremiah', LAM: 'Lamentations', EZK: 'Ezekiel', DAN: 'Daniel', HOS: 'Hosea', JOL: 'Joel', AMO: 'Amos', OBA: 'Obadiah', JON: 'Jonah', MIC: 'Micah', NAM: 'Nahum', HAB: 'Habakkuk', ZEP: 'Zephaniah', HAG: 'Haggai', ZEC: 'Zechariah', MAL: 'Malachi', MAT: 'Matthew', MRK: 'Mark', LUK: 'Luke', JHN: 'John', ACT: 'Acts', ROM: 'Romans', '1CO': '1 Corinthians', '2CO': '2 Corinthians', GAL: 'Galatians', EPH: 'Ephesians', PHP: 'Philippians', COL: 'Colossians', '1TH': '1 Thessalonians', '2TH': '2 Thessalonians', '1TI': '1 Timothy', '2TI': '2 Timothy', TIT: 'Titus', PHM: 'Philemon', HEB: 'Hebrews', JAS: 'James', '1PE': '1 Peter', '2PE': '2 Peter', '1JO': '1 John', '2JO': '2 John', '3JO': '3 John', JUD: 'Jude', REV: 'Revelation' },
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
  const [verses, setVerses] = useState<{ number: number; text: string }[]>([]);

  const handleOpenSanctuary = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/bible/passage?book=${activeBook.name}&chapter=${activeChapter}&lang=${selectedLanguage.code}&versionId=${selectedTranslation.id}`);
      const data = await res.json();
      setVerses(data.verses || []);
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleLanguageChange = (code: string) => {
    const targetLang = LANGUAGES.find(l => l.code === code);
    if (targetLang) {
      setSelectedLanguage(targetLang);
      if (targetLang.translations.length > 0) {
        setSelectedTranslation(targetLang.translations[0]);
      }
    }
  };

  const getLocalizedName = (name: string) => BIBLE_NAMES[selectedLanguage.code]?.[name] || name;

  return (
    <div className="relative flex min-h-screen">
      {/* Background Image */}
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
        <section className="mb-6 flex items-center justify-between bg-white/40 backdrop-blur-xl border border-white/60 px-4 py-2 rounded-xl shadow-lg">
          <div className="flex items-center gap-5">
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-amber-500 text-[10px]">language</span>
                <span className="text-[6px] font-black text-amber-600 uppercase tracking-wider">Lang</span>
              </div>
              <select 
                value={selectedLanguage.code} 
                onChange={(e) => handleLanguageChange(e.target.value)} 
                className="bg-transparent font-bold text-[10px] text-gray-700 outline-none cursor-pointer"
              >
                {LANGUAGES.map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
              </select>
            </div>
            <div className="w-px h-6 bg-gray-200" />
            <div className="flex flex-col">
              <div className="flex items-center gap-1">
                <span className="material-symbols-outlined text-amber-500 text-[10px]">translate</span>
                <span className="text-[6px] font-black text-amber-600 uppercase tracking-wider">Ver</span>
              </div>
              <select 
                value={selectedTranslation.id} 
                onChange={(e) => {
                  const translation = selectedLanguage.translations.find(t => t.id === e.target.value);
                  if (translation) setSelectedTranslation(translation);
                }} 
                className="bg-transparent font-bold text-[10px] text-gray-700 outline-none cursor-pointer"
              >
                {selectedLanguage.translations.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            </div>
          </div>
          <Link href="/bible/compare" className="text-[8px] font-bold text-amber-600 flex items-center gap-1 hover:text-amber-700 transition-opacity">
            <span className="material-symbols-outlined text-[12px]">compare_arrows</span> Parallel
          </Link>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          
          {/* BOOK INDEX - Glass Style */}
          <aside className="lg:col-span-3 h-[40vh] lg:h-[75vh] overflow-y-auto bg-white/40 backdrop-blur-sm rounded-xl p-2 shadow-lg border border-white/60 custom-scrollbar">
            {[ 
              { label: 'Old Testament', data: BIBLE_STRUCTURE.oldTestament },
              { label: 'New Testament', data: BIBLE_STRUCTURE.newTestament }
            ].map((section) => (
              <div key={section.label} className="mb-4">
                <p className="text-[7px] font-black text-amber-600 uppercase px-2 mb-2 tracking-wider">{section.label}</p>
                <div className="space-y-0.5">
                  {section.data.map((book) => (
                    <button 
                      key={book.name} 
                      onClick={() => { setActiveBook(book); setActiveChapter(1); setVerses([]); }} 
                      className={`w-full flex items-center justify-between p-1.5 px-2 rounded-lg text-[9px] transition-colors ${
                        activeBook.name === book.name ? 'bg-gradient-to-r from-amber-600 to-amber-700 text-white font-bold shadow-md' : 'text-gray-600 hover:bg-white/50 hover:text-amber-600'
                      }`}
                    >
                      <span>{getLocalizedName(book.name)}</span>
                      <span className="opacity-50 text-[7px]">{book.chapters}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </aside>

          {/* MAIN READER SECTION - Glass Style */}
          <div className="lg:col-span-9 flex flex-col gap-4">
            <div className="bg-white/40 backdrop-blur-sm rounded-xl p-5 shadow-lg border border-white/60">
              <div className="flex items-end justify-between mb-5">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="material-symbols-outlined text-amber-500 text-[12px]">menu_book</span>
                    <h2 className="text-xl font-serif font-bold text-gray-800 leading-none">
                      {getLocalizedName(activeBook.name)} <span className="text-amber-500 text-lg"> {activeChapter}</span>
                    </h2>
                  </div>
                  <p className="text-[7px] font-bold text-gray-400 uppercase mt-0.5 tracking-wider">{selectedTranslation.name}</p>
                </div>
              </div>

              {/* Ultra-compact Chapter Grid */}
              <div className="flex flex-wrap gap-1 mb-5 max-h-[80px] overflow-y-auto p-2 bg-white/30 rounded-lg border border-white/40">
                {Array.from({ length: activeBook.chapters }, (_, i) => i + 1).map((num) => (
                  <button 
                    key={num} 
                    onClick={() => { setActiveChapter(num); setVerses([]); }} 
                    className={`w-6 h-6 rounded-md flex items-center justify-center text-[8px] font-bold transition-all ${
                      activeChapter === num ? 'bg-amber-600 text-white shadow-sm' : 'bg-white/50 text-gray-500 hover:text-amber-600'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>

              <button 
                onClick={handleOpenSanctuary} 
                disabled={loading} 
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white py-2 rounded-lg text-[8px] font-black shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined text-[12px]">{loading ? 'sync' : 'auto_stories'}</span>
                {loading ? 'Entering Sanctuary...' : `Open Chapter ${activeChapter}`}
              </button>
            </div>

            {/* SCRIPTURE CANVAS */}
            {verses.length > 0 && (
              <div id="sanctuary-reader" className="bg-white/40 backdrop-blur-sm rounded-xl shadow-lg border border-white/60 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
                <div className="bg-white/30 px-5 py-2 flex justify-between items-center border-b border-white/40">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-amber-500 text-[10px]">auto_awesome</span>
                    <span className="text-[7px] font-bold text-gray-500 uppercase tracking-wider">Scripture Passage</span>
                  </div>
                  <span className="material-symbols-outlined text-amber-500/30 text-sm">menu_book</span>
                </div>
                <div className="p-5 md:p-8">
                  <div className="max-w-3xl mx-auto">
                    <div className="text-xs md:text-sm font-serif text-gray-700 leading-relaxed space-y-2">
                      {verses.map((v) => (
                        <span key={v.number} className="inline leading-relaxed">
                          <sup className="text-[7px] font-sans font-bold text-amber-500/70 mr-1 select-none">{v.number}</sup>
                          {v.text}{' '}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Decorative Footer */}
        <div className="mt-10 flex justify-center items-center gap-4 opacity-30">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400" />
          <span className="material-symbols-outlined text-amber-400 text-sm">menu_book</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400" />
        </div>
      </main>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(245, 158, 11, 0.3);
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}