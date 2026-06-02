'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/layout-components/Sidebar';

interface QuietSession {
  id: string;
  date: string; // ISO format: YYYY-MM-DD
  durationMinutes: number;
  bookRead?: string;
}

export default function QuietTimeSummaryPage() {
  const router = useRouter();
  const [sessions, setSessions] = useState<QuietSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load sessions from API or LocalStorage on mount
  useEffect(() => {
    const loadSessions = async () => {
      setIsLoading(true);
      try {
        const saved = localStorage.getItem('qt-session-history');
        if (saved) {
          setSessions(JSON.parse(saved));
        } else {
          // Fallback / Mock data tailored to current time paradigm
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

  // Dynamic Calculations (Memoized for performance)
  const stats = useMemo(() => {
    if (sessions.length === 0) return { total: 0, streak: 0, avg: 0, thisMonth: 0 };

    const total = sessions.length;
    
    // Average Duration
    const totalMinutes = sessions.reduce((acc, s) => acc + s.durationMinutes, 0);
    const avg = Math.round(totalMinutes / total);

    // This Month's count
    const currentMonth = new Date().getMonth();
    const thisMonth = sessions.filter(s => new Date(s.date).getMonth() === currentMonth).length;

    // Streak Logic (Checking consecutive days)
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
    { label: 'Total Sessions', value: stats.total.toString(), color: 'text-[#3C3830]' },
    { label: 'Current Streak', value: `${stats.streak} Days`, color: 'text-[#D4AF37]' },
    { label: 'Avg Duration', value: `${stats.avg} Min`, color: 'text-[#8B0000]' },
    { label: 'This Month', value: `${stats.thisMonth} Units`, color: 'text-[#7C7565]' },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F1EA] flex items-center justify-center font-serif">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[10px] font-sans font-black uppercase tracking-widest text-[#7C7565]">Consulting the Ledger...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F4F1EA] font-serif overflow-x-hidden selection:bg-[#D4AF37]/20 relative">
      <Sidebar />

      {/* Textured background overlay to match open book canvas */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.35] mix-blend-multiply z-0"
        style={{ backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")` }}
      />

      <main className="relative z-10 lg:ml-64 flex-1 px-6 md:px-12 py-12 max-w-5xl mx-auto pb-32">
        
        {/* --- PREMIUM BACK BUTTON & HEADER HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-[#D4CDBA]/40 pb-8">
          <div className="flex items-center gap-4">
            {/* Architectural Navigation Arrow */}
            <button 
              onClick={() => router.push('/quiet-time')}
              className="w-12 h-12 rounded-2xl border border-[#D4CDBA] bg-white/80 backdrop-blur-md flex items-center justify-center text-[#3C3830] hover:bg-[#3C3830] hover:text-white transition-all duration-300 shadow-sm group"
              title="Return to Lobby"
            >
              <span className="material-symbols-outlined text-xl group-hover:-translate-x-0.5 transition-transform">
                arrow_back
              </span>
            </button>
            
            <div>
              <span className="text-[9px] font-sans font-black uppercase tracking-[0.3em] text-[#D4AF37] mb-1 block">
                Spiritual Ledger
              </span>
              <h1 className="text-3xl font-bold text-[#3C3830] tracking-tight">
                Quiet Time Summary
              </h1>
            </div>
          </div>

          <div className="text-left md:text-right font-sans text-xs text-[#7C7565]">
            Metrics active for <span className="font-bold text-[#3C3830]">Lagos Sanctuary Node</span>
          </div>
        </div>

        {/* --- LUXURY STAT CARDS --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {displayStats.map((stat, idx) => (
            <div 
              key={idx} 
              className="bg-white/80 backdrop-blur-md border border-[#D4CDBA]/40 p-6 rounded-2xl shadow-[0_12px_40px_rgba(60,56,48,0.02)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(60,56,48,0.06)] relative overflow-hidden group"
            >
              <div className="absolute top-0 left-0 w-full h-[2px] bg-transparent group-hover:bg-[#D4AF37]/30 transition-colors" />
              <p className="text-[10px] font-sans font-black text-[#7C7565] uppercase tracking-widest mb-3">
                {stat.label}
              </p>
              <p className={`text-3xl font-black ${stat.color} tracking-tight`}>
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* --- RECENT ACTIVITY LEDGER SHEET --- */}
        <div className="bg-white/90 backdrop-blur-xl border border-[#D4CDBA]/50 p-8 md:p-12 rounded-[2.5rem] shadow-[0_30px_70px_rgba(60,56,48,0.03)] relative overflow-hidden">
          
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-[#D4CDBA]/30">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#D4AF37]">history_edu</span>
              <h3 className="text-xl font-bold text-[#3C3830]">Chronological Activity</h3>
            </div>
            <button className="text-[10px] font-sans font-black text-[#D4AF37] uppercase tracking-widest hover:text-[#AA8414] transition-colors">
              View Extended History
            </button>
          </div>

          <div className="space-y-4">
            {sessions.length > 0 ? (
              sessions.slice(0, 10).map((session) => (
                <div 
                  key={session.id} 
                  className="flex justify-between items-center p-5 bg-[#FDFBF7] rounded-xl border border-[#D4CDBA]/30 transition-all duration-300 hover:border-[#D4AF37]/40 hover:bg-white"
                >
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-bold text-[#3C3830]">
                      {new Date(session.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-[10px] font-sans uppercase font-black text-[#7C7565] tracking-widest">
                      {session.bookRead ? `Exegesis: ${session.bookRead}` : 'Integration Liturgy'}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span className="text-[#3C3830] font-bold text-sm">{session.durationMinutes} min</span>
                      <span className="text-[9px] font-sans font-black uppercase text-[#D4AF37] tracking-wider">Sync Complete</span>
                    </div>
                    <span className="material-symbols-outlined text-xs text-[#D4AF37]/60">verified</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-12 font-sans text-xs text-[#7C7565] italic bg-[#FDFBF7] rounded-2xl border border-dashed border-[#D4CDBA]/60">
                No recorded sessions inside the ledger. Begin your journey inside the modules.
              </p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}