'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/layout-components/Sidebar';
import { useTheme } from '../../context/ThemeContext';

interface QuietSession {
  id: string;
  date: string; // Stored as YYYY-MM-DD
  durationMinutes: number;
  bookRead?: string;
}

const STORAGE_KEY = 'qt-session-history';

// Helper to format local date string (YYYY-MM-DD) avoiding UTC shifts
const getLocalDateKey = (d: Date = new Date()): string => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Helper to safely parse local YYYY-MM-DD to a formatted string
const formatSessionDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return dateStr;
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function QuietTimeSummaryPage() {
  const router = useRouter();
  const { isDark } = useTheme();
  const [sessions, setSessions] = useState<QuietSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Load actual sessions from localStorage
  const loadSessions = useCallback(() => {
    setIsLoading(true);
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: QuietSession[] = JSON.parse(saved);
        // Sort descending by date
        parsed.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setSessions(parsed);
      } else {
        setSessions([]);
      }
    } catch (error) {
      console.error('Failed to load spiritual ledger:', error);
      setSessions([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  // Handle clearing history
  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your entire quiet time history? This action cannot be undone.')) {
      localStorage.removeItem(STORAGE_KEY);
      setSessions([]);
      setIsHistoryModalOpen(false);
    }
  };

  // Metrics computation
  const stats = useMemo(() => {
    if (sessions.length === 0) return { total: 0, streak: 0, avg: 0, thisMonth: 0 };

    const total = sessions.length;
    const totalMinutes = sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0);
    const avg = Math.round(totalMinutes / total);

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    const thisMonth = sessions.filter((s) => {
      const [y, m] = s.date.split('-').map(Number);
      return y === currentYear && m - 1 === currentMonth;
    }).length;

    // Calculate active daily streak
    const uniqueDates = Array.from(new Set(sessions.map((s) => s.date))).sort().reverse();
    const todayStr = getLocalDateKey(now);
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const yesterdayStr = getLocalDateKey(yesterday);

    let streak = 0;
    let checkDate = new Date();

    // Streak is active if user recorded today or yesterday
    if (uniqueDates.includes(todayStr)) {
      checkDate = now;
    } else if (uniqueDates.includes(yesterdayStr)) {
      checkDate = yesterday;
    } else {
      return { total, streak: 0, avg, thisMonth };
    }

    while (true) {
      const dateKey = getLocalDateKey(checkDate);
      if (uniqueDates.includes(dateKey)) {
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
    { label: 'This Month', value: `${stats.thisMonth} Sessions`, icon: 'calendar_today' },
  ];

  if (isLoading) {
    return (
      <div
        className={`flex items-center justify-center min-h-screen antialiased ${
          isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'
        }`}
      >
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
    <div
      className={`flex min-h-screen antialiased selection:bg-orange-100 dark:selection:bg-orange-950/50 ${
        isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'
      }`}
    >
      <Sidebar />

      <div className="flex-1 lg:ml-64 relative">
        <main className="pt-24 px-4 md:px-8 pb-24 max-w-5xl mx-auto w-full">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12 pb-4 border-b border-zinc-100 dark:border-zinc-900">
            <div className="flex items-start gap-4">
              <button
                onClick={() => router.push('/quiet-time')}
                className="w-9 h-9 rounded-xl border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-500 dark:text-zinc-400 hover:text-orange-600 dark:hover:text-orange-500 hover:border-zinc-300 dark:hover:border-zinc-700 bg-transparent transition-colors group outline-none"
                title="Return to Quiet Time Lobby"
              >
                <span className="material-symbols-outlined text-[18px] group-hover:-translate-x-0.5 transition-transform">
                  arrow_back
                </span>
              </button>

              <div>
                <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-500 mb-1">
                  <span className="text-[10px] font-sans font-semibold uppercase tracking-wider">
                    Spiritual Ledger
                  </span>
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

          {/* Metric Scorecard Grid */}
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

          {/* Activity Document Sheet */}
          <div className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 bg-transparent">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-100 dark:border-zinc-900">
              <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200">
                <span className="material-symbols-outlined text-[18px] text-orange-600 dark:text-orange-500">
                  history_edu
                </span>
                <h3 className="text-base font-serif font-medium">Chronological Activity</h3>
              </div>
              
              {sessions.length > 0 && (
                <button
                  onClick={() => setIsHistoryModalOpen(true)}
                  className="text-left text-[10px] font-sans font-semibold text-orange-600 dark:text-orange-500 uppercase tracking-wider hover:text-orange-700 dark:hover:text-orange-400 transition-colors outline-none bg-transparent"
                >
                  View Extended History ({sessions.length})
                </button>
              )}
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
                        <span className="material-symbols-outlined text-[14px] text-zinc-400 dark:text-zinc-500">
                          calendar_today
                        </span>
                        <span className="text-sm font-sans font-normal">
                          {formatSessionDate(session.date)}
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
                          <span className="material-symbols-outlined text-[14px] text-zinc-400">
                            schedule
                          </span>
                          <span className="text-sm font-sans font-medium">
                            {session.durationMinutes} min
                          </span>
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

          <div className="mt-24 flex justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
          </div>
        </main>
      </div>

      {/* Extended History Drawer Modal */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className={`w-full max-w-2xl max-h-[80vh] flex flex-col rounded-2xl border shadow-2xl ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
            }`}
          >
            <div className="p-5 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-serif font-semibold">Extended History</h2>
                <p className="text-xs text-zinc-400 mt-0.5">Full chronological ledger record</p>
              </div>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="w-8 h-8 rounded-lg border border-zinc-200 dark:border-zinc-800 flex items-center justify-center text-zinc-400 hover:text-zinc-100"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-2">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-3.5 border border-zinc-100 dark:border-zinc-800/60 rounded-xl"
                >
                  <div className="flex flex-col">
                    <span className="text-xs font-semibold">{formatSessionDate(session.date)}</span>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-wider">
                      {session.bookRead ? `Study: ${session.bookRead}` : 'Integration Liturgy'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium">{session.durationMinutes} min</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between">
              <button
                onClick={handleClearHistory}
                className="text-xs text-red-500 hover:text-red-600 font-semibold uppercase tracking-wider transition-colors"
              >
                Clear History
              </button>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="px-4 py-2 bg-orange-600 hover:bg-orange-500 text-white rounded-lg text-xs font-semibold uppercase tracking-wider transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}