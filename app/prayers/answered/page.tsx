'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/layout-components/Sidebar';
import { toast } from 'react-hot-toast';
import { useTheme } from '../../context/ThemeContext';

interface Prayer {
  id: string;
  title: string;
  request: string;
  category: string;
  status: string;
  updatedAt: string;
}

export default function AnsweredPrayersPage() {
  const { status } = useSession();
  const router = useRouter();
  const { isDark } = useTheme();
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAnsweredPrayers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/prayers?status=answered');
      
      if (response.status === 401) {
        toast.error('Session expired. Please sign in again.');
        router.push('/auth/signin');
        return;
      }

      const data = await response.json();
      if (data.success) {
        setPrayers(data.prayers);
      }
    } catch (error) {
      console.error('Error fetching prayers:', error);
      toast.error('Could not load your testimonies.');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchAnsweredPrayers();
    }
  }, [status, router, fetchAnsweredPrayers]);

  return (
    <div className={`flex min-h-screen ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
      <Sidebar />

      <main className="relative z-10 flex-1 lg:ml-56 pt-20 px-6 md:px-10 pb-16 max-w-4xl mx-auto w-full">
        
        {/* Header */}
        <header className="mb-10 space-y-2 animate-in fade-in duration-700">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-px ${isDark ? 'bg-primary-400/40' : 'bg-amber-400/40'}`} />
            <span className={`text-[9px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-primary-400' : 'text-amber-600'}`}>Altar Archive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-1.5 h-1.5 rounded-full ${isDark ? 'bg-primary-400' : 'bg-amber-600'}`}></div>
            <h1 className={`text-3xl md:text-4xl font-serif tracking-tight flex items-center gap-2 ${isDark ? 'text-text-primary' : 'text-gray-800'}`}>
              Answered <span className={`font-serif italic ${isDark ? 'text-primary-400' : 'text-amber-600'}`}>Testimonies</span>
            </h1>
          </div>
          <p className={`text-sm italic border-l-2 ${isDark ? 'border-primary-400/40 text-text-secondary' : 'border-amber-400 text-gray-600'} pl-4 mt-1`}>
            A preserved sanctuary capturing completed faith journeys.
          </p>
        </header>

        {/* Dynamic States Layout */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-3">
            <div className={`w-8 h-8 border-2 ${isDark ? 'border-primary-400/20 border-t-primary-400' : 'border-amber-600/20 border-t-amber-600'} rounded-full animate-spin`}></div>
            <p className={`text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>Recalling Records...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {prayers.length > 0 ? (
              prayers.map((prayer) => (
                <div 
                  key={prayer.id} 
                  className={`group backdrop-blur-sm border rounded-xl p-5 transition-all relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
                    isDark 
                      ? 'bg-black/40 border-white/10 hover:bg-black/60 hover:shadow-lg' 
                      : 'bg-white/40 border-white/60 hover:bg-white/60 hover:shadow-lg'
                  }`}
                >
                  {/* Subtle Left Border Accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary-400 to-primary-600 rounded-l-xl" />
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center flex-wrap gap-2">
                      <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${
                        isDark ? 'bg-primary-500/20' : 'bg-amber-100'
                      }`}>
                        <span className={`material-symbols-outlined text-[10px] ${isDark ? 'text-primary-400' : 'text-amber-600'}`}>local_offer</span>
                        <span className={`text-[7px] font-black uppercase tracking-wider ${isDark ? 'text-primary-400' : 'text-amber-700'}`}>
                          {prayer.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className={`material-symbols-outlined text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>calendar_today</span>
                        <span className={`text-[8px] ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                          {new Date(prayer.updatedAt).toLocaleDateString(undefined, { 
                            year: 'numeric', month: 'long', day: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className={`text-base font-serif font-semibold transition-colors ${
                        isDark ? 'text-text-primary group-hover:text-primary-400' : 'text-gray-800 group-hover:text-amber-700'
                      }`}>
                        {prayer.title}
                      </h3>
                      <p className={`text-[11px] leading-relaxed italic font-serif line-clamp-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                        "{prayer.request}"
                      </p>
                    </div>
                  </div>

                  <div className={`w-full md:w-auto pt-3 md:pt-0 border-t ${isDark ? 'border-white/10' : 'border-gray-200/50'} md:border-none flex justify-end`}>
                    <button 
                      onClick={() => router.push(`/prayers/${prayer.id}`)}
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border text-[9px] font-black uppercase tracking-wider transition-all whitespace-nowrap ${
                        isDark 
                          ? 'border-white/10 text-gray-400 bg-black/30 hover:bg-primary-500 hover:text-white hover:border-primary-500' 
                          : 'border-gray-200 text-gray-700 bg-white/50 hover:bg-amber-600 hover:text-white hover:border-amber-600'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[12px]">menu_book</span>
                      Read Diary
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className={`text-center py-20 backdrop-blur-sm border border-dashed rounded-2xl ${
                isDark 
                  ? 'bg-black/30 border-primary-500/20' 
                  : 'bg-white/30 border-amber-200'
              }`}>
                <div className={`w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                  isDark ? 'bg-primary-500/20' : 'bg-amber-100'
                }`}>
                  <span className={`material-symbols-outlined text-3xl ${isDark ? 'text-primary-400' : 'text-amber-400'}`}>spa</span>
                </div>
                <p className={`text-sm font-serif font-semibold ${isDark ? 'text-text-primary' : 'text-gray-700'}`}>No Testimonies Recorded Yet</p>
                <p className={`text-[10px] max-w-sm mx-auto mt-1 ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
                  When your prayers are answered, they will appear here as testimonies.
                </p>
                <button 
                  onClick={() => router.push('/prayers')}
                  className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider hover:shadow-lg transition-all"
                >
                  <span className="material-symbols-outlined text-[12px]">menu_book</span>
                  View Active Prayers
                </button>
              </div>
            )}
          </div>
        )}

        {/* Decorative Footer */}
        {prayers.length > 0 && (
          <div className="mt-12 flex justify-center items-center gap-4 opacity-30">
            <div className={`h-px w-16 bg-gradient-to-r from-transparent ${isDark ? 'to-primary-400' : 'to-amber-400'}`} />
            <span className={`material-symbols-outlined text-sm ${isDark ? 'text-primary-400' : 'text-amber-400'}`}>self_improvement</span>
            <div className={`h-px w-16 bg-gradient-to-l from-transparent ${isDark ? 'to-primary-400' : 'to-amber-400'}`} />
          </div>
        )}
      </main>
    </div>
  );
}