'use client';

import { useState, useEffect, useCallback } from 'react';
import { ParallelBible } from '@/components/bible/ParallelBible';

export default function ComparePage() {
  const [selectedTranslations, setSelectedTranslations] = useState(['KJV', 'NIV']);
  const [book, setBook] = useState('John');
  const [chapter, setChapter] = useState('3');
  const [verse, setVerse] = useState('16');
  const [versesData, setVersesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchComparison = useCallback(async () => {
    if (!book || !chapter || !verse) return;
    
    setLoading(true);
    try {
      // Using your existing API endpoint
      const response = await fetch(`/api/bible/compare`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book,
          chapter,
          verse,
          translations: selectedTranslations
        })
      });
      
      const data = await response.json();
      if (data.success) {
        // We pass the raw results directly to the ParallelBible component
        setVersesData(data.results); 
      }
    } catch (error) {
      console.error('Failed to fetch translations:', error);
    } finally {
      setLoading(false);
    }
  }, [book, chapter, verse, selectedTranslations]);

  useEffect(() => {
    fetchComparison();
  }, [book, chapter, verse, selectedTranslations, fetchComparison]);

  const toggleTranslation = (translation: string) => {
    setSelectedTranslations(prev =>
      prev.includes(translation) 
        ? prev.filter(t => t !== translation) 
        : [...prev, translation]
    );
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header Section */}
        <header className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <span className="w-8 h-[1px] bg-primary/30"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">Study Mode</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-serif text-[#3C3830] tracking-tighter">
            Compare <span className="italic text-primary">Translations</span>
          </h1>
        </header>

        {/* Controls Container */}
        <div className="bg-white border border-gray-100 rounded-[2.5rem] p-8 mb-12 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Book</label>
              <input
                value={book}
                onChange={e => setBook(e.target.value)}
                className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all"
                placeholder="John"
              />
            </div>
            {/* ... Chapter and Verse Inputs stay same ... */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Chapter</label>
              <input type="number" value={chapter} onChange={e => setChapter(e.target.value)} className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-4">Verse</label>
              <input type="number" value={verse} onChange={e => setVerse(e.target.value)} className="w-full bg-gray-50/50 border-none rounded-2xl px-6 py-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex flex-wrap gap-3">
              {['KJV', 'ESV', 'NIV', 'NASB', 'MSG', 'NLT'].map(t => (
                <button
                  key={t}
                  onClick={() => toggleTranslation(t)}
                  className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border ${
                    selectedTranslations.includes(t) 
                      ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
                      : 'bg-transparent border-gray-100 text-gray-400 hover:border-primary/20'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button 
              onClick={fetchComparison}
              disabled={loading}
              className="h-14 px-10 bg-[#3C3830] text-white rounded-2xl font-black text-xs tracking-[0.2em] hover:bg-black transition-all flex items-center gap-3 disabled:opacity-50"
            >
              {loading ? <span className="material-symbols-outlined animate-spin">sync</span> : <span className="material-symbols-outlined">auto_awesome_motion</span>}
              COMPARE NOW
            </button>
          </div>
        </div>

        {/* THE PARALLEL BIBLE COMPONENT 
            This is where the magic happens. We pass the data here.
        */}
        {versesData.length > 0 ? (
          <ParallelBible 
            verses={versesData} 
            translations={selectedTranslations} 
          />
        ) : !loading && (
          <div className="py-32 text-center bg-white/40 rounded-[3rem] border border-dashed border-gray-200">
            <span className="material-symbols-outlined text-primary/10 text-6xl mb-4">menu_book</span>
            <p className="text-sm font-serif italic text-primary/30">Select translations and click Compare to begin your study.</p>
          </div>
        )}
      </div>
    </main>
  );
}