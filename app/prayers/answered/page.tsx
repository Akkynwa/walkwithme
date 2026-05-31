'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/layout-components/Sidebar';
import { toast } from 'react-hot-toast';

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
    <div className="flex min-h-screen bg-[#FDFDFF] relative overflow-hidden">
      {/* Ambient background styling */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[20%] left-[10%] w-[360px] h-[360px] rounded-full bg-primary/5 blur-[110px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[420px] h-[420px] rounded-full bg-[#D4AF37]/5 blur-[130px]"></div>
      </div>

      <Sidebar />

      <main className="flex-1 lg:ml-64 pt-24 px-6 md:px-10 pb-32 max-w-5xl mx-auto w-full z-10 relative">
        
        {/* Header */}
        <header className="mb-12 space-y-1 animate-in fade-in duration-700">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Altar Archive</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif text-[#3C3830] tracking-tight flex items-center gap-3">
            <span className="material-symbols-outlined text-2xl text-primary">auto_awesome_hierarchy</span>
            <span>Answered <span className="font-serif italic text-primary">Testimonies</span></span>
          </h1>
          <p className="text-sm text-[#7C7565] font-serif italic mt-1">
            A preserved sanctuary capturing structural milestones of completed faith journeys.
          </p>
        </header>

        {/* Dynamic States Layout */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-3 opacity-60">
            <div className="w-6 h-6 border-2 border-primary/20 border-b-primary rounded-full animate-spin"></div>
            <p className="text-[11px] font-black text-[#7C7565] uppercase tracking-widest">Recalling Records...</p>
          </div>
        ) : (
          <div className="space-y-4">
            {prayers.length > 0 ? (
              prayers.map((prayer) => (
                <div 
                  key={prayer.id} 
                  className="bg-white border border-gray-100 p-6 md:p-8 rounded-[24px] shadow-sm hover:shadow-md transition-all group relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
                >
                  {/* Subtle Left Border Accent */}
                  <div className="absolute left-0 top-0 bottom-0 w-[4px] bg-primary/40" />
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center flex-wrap gap-3">
                      <span className="bg-primary/5 text-primary text-[9px] font-black px-2.5 py-1 rounded-md uppercase tracking-wider">
                        {prayer.category}
                      </span>
                      <span className="text-gray-400 text-[11px] flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-xs">calendar_today</span>
                        {new Date(prayer.updatedAt).toLocaleDateString(undefined, { 
                          year: 'numeric', month: 'long', day: 'numeric' 
                        })}
                      </span>
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-lg font-serif text-[#3C3830] font-bold group-hover:text-primary transition-colors">
                        {prayer.title}
                      </h3>
                      <p className="text-sm text-[#7C7565] leading-relaxed italic font-serif">
                        "{prayer.request}"
                      </p>
                    </div>
                  </div>

                  <div className="w-full md:w-auto pt-4 md:pt-0 border-t border-gray-50 md:border-none flex justify-end">
                    <button 
                      onClick={() => router.push(`/prayers/${prayer.id}`)}
                      className="w-full md:w-auto px-5 py-2.5 rounded-full border border-gray-100 text-[#3C3830] text-[10px] font-black uppercase tracking-widest bg-gray-50/50 hover:bg-primary hover:text-white hover:border-primary transition-all whitespace-nowrap"
                    >
                      Read Diary
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-24 bg-white rounded-[32px] border border-dashed border-gray-200 p-8">
                <span className="material-symbols-outlined text-4xl text-gray-300 mb-3 block">spa</span>
                <p className="text-sm text-[#3C3830] font-serif font-bold">No Records Logged Yet</p>
                <p className="text-xs text-[#7C7565] max-w-sm mx-auto mt-1">
                  Active petitions can be transitioned into this space inside your personal cards layout view.
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}