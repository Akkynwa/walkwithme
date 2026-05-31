'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/layout-components/Sidebar';
import { PRAYER_CATEGORIES } from '@/lib/constants';

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
    <div className="flex min-h-screen bg-[#FDFDFF] relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[30%] right-[5%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px]"></div>
        <div className="absolute bottom-[15%] left-[15%] w-[350px] h-[350px] rounded-full bg-[#D4AF37]/5 blur-[100px]"></div>
      </div>

      <Sidebar />

      <main className="flex-1 lg:ml-64 pt-24 px-6 md:px-10 pb-32 max-w-7xl mx-auto w-full z-10 relative">
        
        {/* Header */}
        <header className="mb-12 space-y-1 animate-in fade-in duration-700">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Classifications</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-[#3C3830] tracking-tight">
            Structural <span className="font-serif italic text-primary">Dimensions</span>
          </h1>
          <p className="text-sm text-[#7C7565] font-serif italic mt-1">
            Browse your private journal metrics grouped by active focus areas.
          </p>
        </header>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const completionPercentage = cat.total > 0 ? Math.round((cat.answered / cat.total) * 100) : 0;
            
            return (
              <div 
                key={cat.category} 
                className="bg-white border border-gray-100 p-6 md:p-8 rounded-[28px] shadow-sm hover:border-primary/10 hover:shadow-md transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between mb-6">
                    <div className="bg-primary/5 p-3 rounded-xl text-primary">
                      <span className="material-symbols-outlined text-lg">folder_open</span>
                    </div>
                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">
                      Breakdown
                    </span>
                  </div>

                  <h3 className="text-xl font-serif text-[#3C3830] font-bold mb-4 capitalize group-hover:text-primary transition-colors">
                    {cat.category}
                  </h3>

                  <div className="space-y-3.5 mb-8">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#7C7565]">Total Petitions</span>
                      <span className="font-bold text-[#3C3830] bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100/50">{cat.total}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-[#7C7565]">Answered Testimonies</span>
                      <span className="font-bold text-primary bg-primary/5 px-2.5 py-1 rounded-md">{cat.answered}</span>
                    </div>

                    {/* Progress Bar Container */}
                    <div className="relative pt-2">
                      <div className="overflow-hidden h-1 rounded-full bg-gray-100">
                        <div
                          style={{ width: `${completionPercentage}%` }}
                          className="h-full rounded-full bg-primary transition-all duration-1000 ease-out"
                        />
                      </div>
                      <p className="text-[9px] mt-2 text-right text-gray-400 font-black uppercase tracking-widest">
                        {completionPercentage}% Witnessed
                      </p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => router.push(`/prayers?category=${cat.category}`)}
                  className="w-full py-3 rounded-full border border-gray-100 text-[#3C3830] text-[10px] font-black uppercase tracking-widest bg-gray-50/30 hover:bg-primary hover:text-white hover:border-primary transition-all flex items-center justify-center gap-2"
                >
                  <span>Open Folders</span>
                  <span className="material-symbols-outlined text-xs">arrow_forward</span>
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}