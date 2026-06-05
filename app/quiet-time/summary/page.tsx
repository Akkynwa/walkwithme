'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/layout-components/Sidebar';
import Image from 'next/image';

interface QuietSession {
  id: string;
  date: string;
  durationMinutes: number;
  bookRead?: string;
}

export default function QuietTimeSummaryPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<QuietSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSessions = async () => {
      setIsLoading(true);
      try {
        const saved = localStorage.getItem('qt-session-history');
        if (saved) {
          setSessions(JSON.parse(saved));
        } else {
          const mockData: QuietSession[] = [
            { id: '1', date: '2026-06-02', durationMinutes: 25, bookRead: 'John' },
            { id: '2', date: '2026-06-01', durationMinutes: 20, bookRead: 'John' },
            { id: '3', date: '2026-05-31', durationMinutes: 30, bookRead: 'Exodus' },
          ];
          setSessions(mockData);
        }
      } catch (error) {
        console.error("Failed to load spiritual ledger:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSessions();
  }, []);

  const stats = useMemo(() => {
    if (sessions.length === 0) return { total: 0, streak: 0, avg: 0, thisMonth: 0 };

    const total = sessions.length;
    const totalMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    const avg = Math.round(totalMinutes / total);
    const currentMonth = new Date().getMonth();
    const thisMonth = sessions.filter(s => new Date(s.date).getMonth() === currentMonth).length;

    let streak = 0;
    const sortedDates = [...new Set(sessions.map(s => s.date))].sort().reverse();
    const today = new Date().toISOString().split('T')[0];
    let checkDate = new Date(today);
    
    for (let i = 0; i < sortedDates.length; i++) {
      const sessionDate = sortedDates[i];
      if (sessionDate === checkDate.toISOString().split('T')[0]) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return { total, streak, avg, thisMonth };
  }, [sessions]);

  const displayStats = [
    { label: 'Total Sessions', value: stats.total.toString(), icon: 'menu_book' },
    { label: 'Current Streak', value: `${stats.streak} Days`, icon: 'local_fire_department' },
    { label: 'Avg Duration', value: `${stats.avg} Min`, icon: 'schedule' },
    { label: 'This Month', value: `${stats.thisMonth} Units`, icon: 'calendar_today' },
  ];

  if (isLoading) {
    return (
      <div className="relative flex items-center justify-center min-h-screen">
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
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[9px] font-sans font-black uppercase tracking-wider text-gray-500">Consulting the Ledger...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen overflow-x-hidden">
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

      <main className="relative z-10 lg:ml-56 flex-1 px-6 md:px-10 py-8 max-w-5xl mx-auto pb-20">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-10 pb-6 border-b border-gray-200/50">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.push('/quiet-time')}
              className="w-10 h-10 rounded-xl border border-gray-200 bg-white/40 backdrop-blur-sm flex items-center justify-center text-gray-600 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all duration-300 shadow-sm group"
              title="Return to Lobby"
            >
              <span className="material-symbols-outlined text-lg group-hover:-translate-x-0.5 transition-transform">
                arrow_back
              </span>
            </button>
            
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-6 h-px bg-amber-400/40" />
                <span className="text-[8px] font-sans font-black uppercase tracking-wider text-amber-600">
                  Spiritual Ledger
                </span>
              </div>
              <h1 className="text-2xl md:text-3xl font-serif font-bold text-gray-800 tracking-tight">
                Quiet Time Summary
              </h1>
            </div>
          </div>

          <div className="text-left md:text-right font-sans text-[9px] text-gray-500">
            Metrics active for <span className="font-bold text-amber-700">Sanctuary Node</span>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {displayStats.map((stat, idx) => (
            <div 
              key={idx} 
              className="bg-white/40 backdrop-blur-sm border border-white/60 p-5 rounded-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-amber-400 to-amber-600 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-amber-500 text-[16px]">{stat.icon}</span>
                <p className="text-[7px] font-sans font-black text-gray-500 uppercase tracking-wider">
                  {stat.label}
                </p>
              </div>
              <p className={`text-2xl md:text-3xl font-black text-gray-800 tracking-tight`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Recent Activity Ledger Sheet */}
        <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-xl p-6 md:p-8 shadow-lg relative overflow-hidden">
          
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200/50">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-600 text-[20px]">history_edu</span>
              <h3 className="text-base md:text-lg font-serif font-semibold text-gray-800">Chronological Activity</h3>
            </div>
            <button className="text-[7px] font-sans font-black text-amber-600 uppercase tracking-wider hover:text-amber-700 transition-colors">
              View Extended History
            </button>
          </div>

          <div className="space-y-3">
            {sessions.length > 0 ? (
              sessions.slice(0, 10).map((session) => (
                <div 
                  key={session.id} 
                  className="flex justify-between items-center p-4 bg-white/50 rounded-lg border border-white/60 transition-all duration-300 hover:border-amber-200 hover:bg-white/70"
                >
                  <div className="flex flex-col gap-0.5">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-500 text-[12px]">calendar_today</span>
                      <span className="text-xs font-semibold text-gray-800">
                        {new Date(session.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-gray-400 text-[10px]">menu_book</span>
                      <span className="text-[8px] font-sans uppercase font-bold text-gray-500 tracking-wider">
                        {session.bookRead ? `Study: ${session.bookRead}` : 'Integration Liturgy'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-amber-500 text-[10px]">schedule</span>
                        <span className="text-gray-700 font-bold text-xs">{session.durationMinutes} min</span>
                      </div>
                      <span className="text-[7px] font-sans font-black uppercase text-amber-600 tracking-wider">Sync Complete</span>
                    </div>
                    <span className="material-symbols-outlined text-xs text-amber-500">check_circle</span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-16 bg-white/30 rounded-xl border border-dashed border-amber-200">
                <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-amber-400 text-xl">history_edu</span>
                </div>
                <p className="text-[10px] font-sans text-gray-500 italic">
                  No recorded sessions in the ledger.
                </p>
                <p className="text-[8px] text-gray-400 mt-1">Begin your journey in the modules.</p>
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
    </div>
  );
}