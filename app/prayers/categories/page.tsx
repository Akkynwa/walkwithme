'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/layout-components/Sidebar';
import { PRAYER_CATEGORIES } from '@/lib/constants';
import Image from 'next/image';

interface CategoryStats {
  category: string;
  total: number;
  answered: number;
}

export default function PrayerCategoriesPage() {
  const { status } = useSession();
  const router = useRouter();
  const [categories, setCategories] = useState<CategoryStats[]>([]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else {
      // Logic to simulate or fetch stats
      const mockCategories = PRAYER_CATEGORIES.map((cat) => {
        const total = Math.floor(Math.random() * 20) + 1;
        const answered = Math.floor(Math.random() * (total + 1));
        return { category: cat, total, answered };
      });
      setCategories(mockCategories);
    }
  }, [status, router]);

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

      <main className="relative z-10 flex-1 lg:ml-56 pt-20 px-6 md:px-10 pb-16 max-w-6xl mx-auto w-full">
        
        {/* Header */}
        <header className="mb-10 space-y-2 animate-in fade-in duration-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-px bg-amber-400/40" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-600">Classifications</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-600"></div>
            <h1 className="text-3xl md:text-4xl font-serif text-gray-800 tracking-tight">
              Structural <span className="font-serif italic text-amber-600">Dimensions</span>
            </h1>
          </div>
          <p className="text-sm text-gray-600 italic border-l-2 border-amber-400 pl-4 mt-1">
            Browse your prayer metrics grouped by active focus areas.
          </p>
        </header>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {categories.map((cat) => {
            const completionPercentage = cat.total > 0 ? Math.round((cat.answered / cat.total) * 100) : 0;
            
            return (
              <div 
                key={cat.category} 
                className="group bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl p-5 hover:bg-white/60 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Icon and Label */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-amber-100 p-2.5 rounded-lg text-amber-600">
                      <span className="material-symbols-outlined text-[20px]">folder_open</span>
                    </div>
                    <span className="text-[7px] font-black text-gray-400 uppercase tracking-wider">
                      Breakdown
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-serif font-semibold text-gray-800 mb-4 capitalize group-hover:text-amber-700 transition-colors">
                    {cat.category}
                  </h3>

                  {/* Stats */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gray-600">Total Petitions</span>
                      <span className="text-[11px] font-bold text-gray-800 bg-white/50 px-2 py-0.5 rounded-md border border-gray-200">
                        {cat.total}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-gray-600">Answered Testimonies</span>
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md">
                        {cat.answered}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative pt-2">
                      <div className="overflow-hidden h-1 rounded-full bg-gray-200">
                        <div
                          style={{ width: `${completionPercentage}%` }}
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-1000 ease-out"
                        />
                      </div>
                      <p className="text-[7px] mt-1.5 text-right text-gray-400 font-black uppercase tracking-wider">
                        {completionPercentage}% Witnessed
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button 
                  onClick={() => router.push(`/prayers?category=${cat.category}`)}
                  className="w-full py-2.5 rounded-lg border border-gray-200 text-gray-700 text-[8px] font-black uppercase tracking-wider bg-white/50 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Open Folder</span>
                  <span className="material-symbols-outlined text-[12px]">arrow_forward</span>
                </button>
              </div>
            );
          })}
        </div>

        {/* Decorative Footer */}
        <div className="mt-12 flex justify-center items-center gap-4 opacity-30">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400" />
          <span className="material-symbols-outlined text-amber-400 text-sm">folder_open</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400" />
        </div>
      </main>
    </div>
  );
}