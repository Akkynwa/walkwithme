'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/layout-components/Sidebar';
import Header from '@/app/layout-components/Header';
import { useTheme } from '../../context/ThemeContext';

interface QuietSession {
  id: string;
  date: string;
  durationMinutes: number;
  bookRead?: string;
}

export default function QuietTimeSummaryPage() {
  const router = useRouter();
  const { isDark } = useTheme();
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
      <div className={`flex items-center justify-center min-h-screen antialiased ${
        isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'
      }`}>
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-orange-600 dark:border-orange-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-[10px] font-sans font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Consulting the Ledger...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex min-h-screen antialiased selection:bg-orange-100 dark:selection:bg-orange-950/50 ${
      isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'
    }`}>
      <Sidebar />

      <div className="flex-1 lg:ml-64 relative">
          

        {/* Main Column Framework Content Area */}
        <main className="pt-24 px-4 md:px-8 pb-24 max-w-5xl mx-auto w-full">
          
          {/* Editorial Substack Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 pb-4 border-b border-zinc-100 dark:border-zinc-900">
            <div className="flex items-start gap-4">
              <button 
                onClick={() => router.push('/quiet-time')}
                className="w-9 h-9 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-500 hover:border-zinc-300 dark:hover:border-zinc-700 bg-transparent transition-colors group outline-none"
                title="Return to Lobby"
              >
                <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">
                  arrow_back
                </span>
              </button>
              
              <div>
                <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-500 mb-1">
                  <span className="text-[10px] font-sans font-semibold uppercase tracking-wider">Spiritual Ledger</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-serif font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                  Quiet Time Summary
                </h1>
              </div>
            </div>

            <div className="text-left sm:text-right font-sans text-[11px] text-zinc-400 dark:text-zinc-500">
              Metrics active for <span className="font-medium text-zinc-600 dark:text-zinc-300">Sanctuary Node</span>
            </div>
          </div>

          {/* Minimal Metric Scorecard Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {displayStats.map((stat, idx) => (
              <div 
                key={idx} 
                className="border border-zinc-200 dark:border-zinc-800 p-5 rounded-xl bg-transparent flex flex-col justify-between"
              >
                <div className="flex items-center gap-1.5 mb-3 text-zinc-400 dark:text-zinc-500">
                  <span className="material-symbols-outlined text-[16px]">{stat.icon}</span>
                  <span className="text-[10px] font-sans font-semibold uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
                <p className="text-2xl md:text-3xl font-sans font-normal tracking-tight text-zinc-900 dark:text-zinc-50">
                  {stat.value}
                </p>
              </div>
            ))}
          </div>

          {/* Recent Chronological Activity Document Sheet */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-transparent">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-900">
              <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                <span className="material-symbols-outlined text-[18px] text-orange-600 dark:text-orange-500">history_edu</span>
                <h3 className="text-base font-serif font-medium">Chronological Activity</h3>
              </div>
              <button className="text-left text-[10px] font-sans font-semibold text-orange-600 dark:text-orange-500 uppercase tracking-wider hover:text-orange-700 dark:hover:text-orange-400 transition-colors outline-none bg-transparent">
                View Extended History
              </button>
            </div>

            <div className="space-y-2">
              {sessions.length > 0 ? (
                sessions.slice(0, 10).map((session) => (
                  <div 
                    key={session.id} 
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-zinc-100 dark:border-zinc-900 rounded-xl bg-transparent gap-4"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-zinc-800 dark:text-zinc-200">
                        <span className="material-symbols-outlined text-[14px] text-zinc-400 dark:text-zinc-500">calendar_today</span>
                        <span className="text-sm font-sans font-normal">
                          {new Date(session.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500">
                        <span className="text-[10px] font-sans font-semibold uppercase tracking-wider">
                          {session.bookRead ? `Study: ${session.bookRead}` : 'Integration Liturgy'}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between sm:justify-end gap-6 border-t sm:border-0 border-zinc-100 dark:border-zinc-900 pt-3 sm:pt-0">
                      <div className="flex flex-col items-start sm:items-end gap-0.5">
                        <div className="flex items-center gap-1 text-zinc-700 dark:text-zinc-300">
                          <span className="material-symbols-outlined text-[14px] text-zinc-400">schedule</span>
                          <span className="text-sm font-sans font-medium">{session.durationMinutes} min</span>
                        </div>
                        <span className="text-[9px] font-sans font-semibold uppercase text-orange-600 dark:text-orange-500 tracking-wider">
                          Sync Complete
                        </span>
                      </div>
                      <span className="material-symbols-outlined text-[18px] text-orange-600 dark:text-orange-500 select-none">
                        check_circle
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-16 border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl">
                  <div className="w-10 h-10 rounded-full border border-zinc-100 dark:border-zinc-900 flex items-center justify-center mx-auto mb-3 text-zinc-400 dark:text-zinc-500">
                    <span className="material-symbols-outlined text-[18px]">history_edu</span>
                  </div>
                  <p className="text-sm font-serif italic text-zinc-400 dark:text-zinc-500">
                    No recorded sessions in the ledger.
                  </p>
                  <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1 font-sans">
                    Begin your journey inside the framework modules.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* System Central Anchor Divider Dot */}
          <div className="mt-24 flex justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </main>
      </div>
    </div>
  );
}