'use client';

import React, { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

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
];

export default function AudioBiblePage() {
  // 3. Properly typed useState hook
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);

  const handleDownload = (bookName: string) => {
    // Implement download logic here
    setBooks((prev) =>
      prev.map((b) =>
        b.name === bookName ? { ...b, downloaded: true } : b
      )
    );
  };

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-zinc-900 py-8 transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4">
        <header className="mb-10">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 tracking-tight">
            🎧 Audio Bible
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400 mt-2">
            Listen to the Word anywhere, anytime.
          </p>
        </header>

        <Card className="mb-8 p-6 backdrop-blur-sm bg-white/80 dark:bg-zinc-800/80 border-zinc-200 dark:border-zinc-700">
          <h3 className="text-lg font-bold text-zinc-800 dark:text-zinc-100 mb-5">
            Available Downloads
          </h3>
          <div className="grid gap-3">
            {books.map((book) => (
              <div 
                key={book.name} 
                className="flex justify-between items-center p-4 bg-zinc-100/50 dark:bg-zinc-900/50 rounded-xl border border-transparent hover:border-zinc-200 dark:hover:border-zinc-700 transition-all"
              >
                <div className="space-y-1">
                  <p className="font-bold text-zinc-900 dark:text-zinc-50">{book.name}</p>
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                    Duration: {book.duration}
                  </p>
                </div>
                <Button
                  size="sm"
                  variant={book.downloaded ? 'outline' : 'primary'}
                  onClick={() => !book.downloaded && handleDownload(book.name)}
                  className={book.downloaded ? 'opacity-80' : 'shadow-sm'}
                >
                  {book.downloaded ? '✓ Downloaded' : 'Download'}
                </Button>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-8 text-center border-dashed border-2 bg-transparent border-zinc-200 dark:border-zinc-700">
          <div className="max-w-sm mx-auto">
            <h3 className="text-xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
              Download All
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6 leading-relaxed">
              Prepare for offline study by downloading the entire Bible collection in high-quality audio.
            </p>
            <Button className="w-full sm:w-auto px-8 py-6 rounded-2xl font-bold">
              Download Complete Bible
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}