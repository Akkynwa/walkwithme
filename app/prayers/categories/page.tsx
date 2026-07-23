'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/layout-components/Sidebar';
import { PRAYER_CATEGORIES } from '@/lib/constants';
import { useTheme } from '../../context/ThemeContext';

interface CategoryStats {
  category: string;
  total: number;
  answered: number;
}

export default function PrayerCategoriesPage() {
  const { status } = useSession();
  const router = useRouter();
  const { isDark } = useTheme();
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
    <div className={`flex min-h-screen ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
      <Sidebar />

      <main className="relative z-10 flex-1 lg:ml-56 pt-20 px-6 md:px-10 pb-16 max-w-6xl mx-auto w-full">
        
        {/* Header */}
        <header className="mb-10 space-y-2 animate-in fade-in duration-700">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-px ${isDark ? 'bg-primary-400/40' : 'bg-amber-400/40'}`} />
            <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-primary-400' : 'text-amber-600'}`}>Classifications</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-primary-400' : 'bg-amber-600'}`}></div>
            <h1 className={`text-3xl md:text-4xl font-serif tracking-tight ${isDark ? 'text-text-primary' : 'text-gray-800'}`}>
              Structural <span className={`font-serif italic ${isDark ? 'text-primary-400' : 'text-amber-600'}`}>Dimensions</span>
            </h1>
          </div>
          <p className={`text-sm italic border-l-2 ${isDark ? 'border-primary-400/40 text-text-secondary' : 'border-amber-400 text-gray-600'} pl-4 mt-1`}>
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
                className={`group backdrop-blur-sm border rounded-xl p-5 transition-all duration-300 flex flex-col justify-between ${
                  isDark 
                    ? 'bg-black/40 border-white/10 hover:bg-black/60 hover:shadow-xl hover:-translate-y-0.5' 
                    : 'bg-white/40 border-white/60 hover:bg-white/60 hover:shadow-xl hover:-translate-y-0.5'
                }`}
              >
                <div>
                  {/* Icon and Label */}
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-2.5 rounded-lg ${isDark ? 'bg-primary-500/20 text-primary-400' : 'bg-amber-100 text-amber-600'}`}>
                      <span className="material-symbols-outlined text-[20px]">folder_open</span>
                    </div>
                    <span className={`text-[7px] font-black uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                      Breakdown
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className={`text-lg font-serif font-semibold mb-4 capitalize transition-colors ${
                    isDark ? 'text-text-primary group-hover:text-primary-400' : 'text-gray-800 group-hover:text-amber-700'
                  }`}>
                    {cat.category}
                  </h3>

                  {/* Stats */}
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Total Petitions</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${
                        isDark 
                          ? 'text-text-primary bg-black/30 border-white/10' 
                          : 'text-gray-800 bg-white/50 border-gray-200'
                      }`}>
                        {cat.total}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className={`text-[10px] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>Answered Testimonies</span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                        isDark ? 'bg-primary-500/20 text-primary-400' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {cat.answered}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="relative pt-2">
                      <div className={`overflow-hidden h-1 rounded-full ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                        <div
                          style={{ width: `${completionPercentage}%` }}
                          className="h-full rounded-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-1000 ease-out"
                        />
                      </div>
                      <p className={`text-[7px] mt-1.5 text-right font-black uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {completionPercentage}% Witnessed
                      </p>
                    </div>
                  </div>
                </div>

                {/* Action Button */}
                <button 
                  onClick={() => router.push(`/prayers?category=${cat.category}`)}
                  className={`w-full py-2.5 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                    isDark 
                      ? 'border-white/10 text-gray-400 bg-black/30 hover:bg-primary-500 hover:text-white hover:border-primary-500' 
                      : 'border-gray-200 text-gray-700 bg-white/50 hover:bg-amber-600 hover:text-white hover:border-amber-600'
                  } border`}
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
          <div className={`h-px w-16 bg-gradient-to-r from-transparent ${isDark ? 'to-primary-400' : 'to-amber-400'}`} />
          <span className={`material-symbols-outlined text-sm ${isDark ? 'text-primary-400' : 'text-amber-400'}`}>folder_open</span>
          <div className={`h-px w-16 bg-gradient-to-l from-transparent ${isDark ? 'to-primary-400' : 'to-amber-400'}`} />
        </div>
      </main>
    </div>
  );
}