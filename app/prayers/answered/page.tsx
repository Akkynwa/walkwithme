'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/layout-components/Sidebar';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

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

      <main className="relative z-10 flex-1 lg:ml-56 pt-20 px-6 md:px-10 pb-16 max-w-4xl mx-auto w-full">
        
        {/* Header */}
        <header className="mb-10 space-y-2 animate-in fade-in duration-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-px bg-amber-400/40" />
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-600">Altar Archive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-amber-600"></div>
            <h1 className="text-3xl md:text-4xl font-serif text-gray-800 tracking-tight flex items-center gap-2">
              Answered <span className="font-serif italic text-amber-600">Testimonies</span>
            </h1>
          </div>
          <p className="text-sm text-gray-600 italic border-l-2 border-amber-400 pl-4 mt-1">
            A preserved sanctuary capturing completed faith journeys.
          </p>
        </header>

        {/* Dynamic States Layout */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-3">
            <div className="w-8 h-8 border-2 border-amber-600/20 border-t-amber-600 rounded-full animate-spin"></div>
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-wider">Recalling Records...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {prayers.length > 0 ? (
              prayers.map((prayer) => (
                <div 
                  key={prayer.id} 
                  className="group bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl p-5 hover:bg-white/60 hover:shadow-lg transition-all relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  {/* Subtle Left Border Accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-amber-600 rounded-l-xl" />
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center flex-wrap gap-2">
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 rounded-full">
                        <span className="material-symbols-outlined text-amber-600 text-[10px]">local_offer</span>
                        <span className="text-[7px] font-black text-amber-700 uppercase tracking-wider">
                          {prayer.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-gray-400 text-[10px]">calendar_today</span>
                        <span className="text-[8px] text-gray-500">
                          {new Date(prayer.updatedAt).toLocaleDateString(undefined, { 
                            year: 'numeric', month: 'long', day: 'numeric' 
                          })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-base font-serif font-semibold text-gray-800 group-hover:text-amber-700 transition-colors">
                        {prayer.title}
                      </h3>
                      <p className="text-[11px] text-gray-600 leading-relaxed italic font-serif line-clamp-2">
                        "{prayer.request}"
                      </p>
                    </div>
                  </div>

                  <div className="w-full md:w-auto pt-3 md:pt-0 border-t border-gray-200/50 md:border-none flex justify-end">
                    <button 
                      onClick={() => router.push(`/prayers/${prayer.id}`)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-gray-200 text-gray-700 text-[9px] font-black uppercase tracking-wider bg-white/50 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all whitespace-nowrap"
                    >
                      <span className="material-symbols-outlined text-[12px]">menu_book</span>
                      Read Diary
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 bg-white/30 backdrop-blur-sm border border-dashed border-amber-200 rounded-2xl">
                <div className="w-16 h-16 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-amber-400 text-3xl">spa</span>
                </div>
                <p className="text-sm text-gray-700 font-serif font-semibold">No Testimonies Recorded Yet</p>
                <p className="text-[10px] text-gray-500 max-w-sm mx-auto mt-1">
                  When your prayers are answered, they will appear here as testimonies.
                </p>
                <button 
                  onClick={() => router.push('/prayers')}
                  className="inline-flex items-center gap-1.5 mt-4 px-4 py-2 bg-amber-600 text-white rounded-lg text-[9px] font-black uppercase tracking-wider hover:bg-amber-700 transition-all"
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
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400" />
            <span className="material-symbols-outlined text-amber-400 text-sm">auto_awesome</span>
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400" />
          </div>
        )}
      </main>
    </div>
  );
}