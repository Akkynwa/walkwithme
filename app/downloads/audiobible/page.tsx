'use client';

import React, { useState } from 'react';
import Image from 'next/image';

// 1. Define the interface outside the component for better reusability
interface Book {
  name: string;
  duration: string;
  downloaded: boolean;
}

// 2. Initial data moved outside to prevent recreation on every render if static
const INITIAL_BOOKS: Book[] = [
  { name: 'Genesis', duration: '2:15:00', downloaded: false },
  { name: 'Exodus', duration: '1:58:00', downloaded: true },
  { name: 'Leviticus', duration: '1:45:00', downloaded: false },
  { name: 'Numbers', duration: '2:08:00', downloaded: false },
  { name: 'Deuteronomy', duration: '2:22:00', downloaded: false },
];

export default function AudioBiblePage() {
  // 3. Properly typed useState hook
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);

  const handleDownload = (bookName: string) => {
    setBooks((prev) =>
      prev.map((b) =>
        b.name === bookName ? { ...b, downloaded: true } : b
      )
    );
  };

  const handleDownloadAll = () => {
    setIsDownloadingAll(true);
    // Simulate download process
    setTimeout(() => {
      setBooks((prev) =>
        prev.map((b) => ({ ...b, downloaded: true }))
      );
      setIsDownloadingAll(false);
    }, 2000);
  };

  const downloadedCount = books.filter(b => b.downloaded).length;
  const totalBooks = books.length;

  return (
    <div className="relative min-h-screen">
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
        <div className="absolute top-20 right-20 w-96 h-96 bg-indigo-200/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-200/8 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '-3s' }} />
      </div>

      <main className="relative z-10 max-w-4xl mx-auto px-4 py-8 pt-24">
        <header className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-px bg-gray-400/40" />
            <span className="text-[9px] font-black text-indigo-600 uppercase tracking-[0.2em]">
              Listen to the Word
            </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-gray-800 mb-2 tracking-tight">
            Audio Bible
          </h1>
          <p className="text-sm text-gray-600 italic border-l-2 border-indigo-400 pl-4">
            Listen to Scripture anywhere, anytime, even offline.
          </p>
        </header>

        {/* Progress Summary */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-indigo-600 text-[20px]">headphones</span>
            </div>
            <div>
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Download Progress</p>
              <p className="text-xs font-semibold text-gray-700">
                {downloadedCount} of {totalBooks} books downloaded
              </p>
            </div>
          </div>
          <div className="w-32 h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500"
              style={{ width: `${(downloadedCount / totalBooks) * 100}%` }}
            />
          </div>
        </div>

        {/* Books List */}
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-3xl p-6 shadow-2xl mb-6">
          <div className="flex items-center gap-2 mb-5">
            <span className="material-symbols-outlined text-indigo-500 text-[18px]">library_books</span>
            <h3 className="text-[11px] font-black text-gray-700 uppercase tracking-wider">
              Available Downloads
            </h3>
          </div>
          
          <div className="grid gap-2">
            {books.map((book) => (
              <div 
                key={book.name} 
                className="flex justify-between items-center p-3 bg-white/50 rounded-xl border border-white/60 hover:border-indigo-200 transition-all group"
              >
                <div className="space-y-0.5">
                  <p className="font-serif font-semibold text-gray-800 text-sm group-hover:text-indigo-700 transition-colors">
                    {book.name}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-gray-400 text-[12px]">schedule</span>
                    <p className="text-[9px] font-medium text-gray-500 uppercase tracking-wider">
                      Duration: {book.duration}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => !book.downloaded && handleDownload(book.name)}
                  disabled={book.downloaded}
                  className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                    book.downloaded 
                      ? 'bg-green-100 text-green-700 cursor-default' 
                      : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-[1.02] shadow-md'
                  }`}
                >
                  {book.downloaded ? (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">check</span>
                      Downloaded
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">download</span>
                      Download
                    </span>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Download All Card */}
        <div className="bg-white/30 backdrop-blur-md border border-dashed border-indigo-300 rounded-3xl p-8 text-center shadow-lg">
          <div className="max-w-sm mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-indigo-100 flex items-center justify-center mx-auto mb-4">
              <span className="material-symbols-outlined text-indigo-600 text-2xl">download_for_offline</span>
            </div>
            <h3 className="text-lg font-serif font-semibold text-gray-800 mb-2">
              Download Complete Collection
            </h3>
            <p className="text-[11px] text-gray-500 leading-relaxed mb-5">
              Prepare for offline study by downloading the entire Bible collection in high-quality audio.
            </p>
            <button
              onClick={handleDownloadAll}
              disabled={isDownloadingAll || downloadedCount === totalBooks}
              className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isDownloadingAll ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-[14px]">sync</span>
                  Downloading...
                </span>
              ) : downloadedCount === totalBooks ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[14px]">check_circle</span>
                  All Books Downloaded
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[14px]">downloading</span>
                  Download Complete Bible
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Bottom Note */}
        <div className="text-center mt-8">
          <p className="text-[8px] text-gray-400 uppercase tracking-wider">
            High-quality audio • Offline access • Ad-free experience
          </p>
        </div>
      </main>
    </div>
  );
}