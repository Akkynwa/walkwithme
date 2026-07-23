'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/layout-components/Sidebar';
import { toast } from 'react-hot-toast';
import { useTheme } from '../context/ThemeContext';

interface Prayer {
  id: string;
  title: string;
  request: string;
  status: 'pending' | 'answered' | 'archived';
  answered: boolean;
  answer?: string;
  category?: string;
  createdAt: string;
}

export default function PrayersPage() {
  const { status } = useSession();
  const router = useRouter();
  const { isDark } = useTheme();
  
  const [prayers, setPrayers] = useState<Prayer[]>([]);
  const [filter, setFilter] = useState<'pending' | 'answered' | 'archived'>('pending');
  const [loading, setLoading] = useState(true);
  const [isBreathing, setIsBreathing] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchPrayers();
    }
  }, [status, router]);

  const fetchPrayers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/prayers');
      const data = await response.json();
      if (data.success) setPrayers(data.prayers);
    } catch (error) {
      toast.error('Failed to load prayer requests');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAnswered = async (id: string) => {
    try {
      const response = await fetch(`/api/prayers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'answered', answered: true }),
      });

      if (response.ok) {
        const updated = await response.json();
        setPrayers(prayers.map(p => p.id === id ? updated.prayer : p));
        toast.success('Witnessing His faithfulness!');
      }
    } catch (error) {
      toast.error('Update failed');
    }
  };

  const toggleBreathe = () => {
    setIsBreathing(true);
    setTimeout(() => setIsBreathing(false), 8000);
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-screen ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mx-auto mb-3"></div>
          <p className={`text-sm ${isDark ? 'text-text-tertiary' : 'text-text-secondary'}`}>Entering Prayer Altar...</p>
        </div>
      </div>
    );
  }

  const filteredPrayers = prayers.filter(p => p.status === filter);

  return (
    <div className={`flex min-h-screen ${isDark ? 'bg-background-dark' : 'bg-background-light'}`}>
      <Sidebar />

      <main className="flex-1 lg:ml-56 pt-20 px-6 md:px-10 pb-16 max-w-6xl mx-auto w-full">
        
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-5 animate-in fade-in duration-1000">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-px bg-primary-500/40" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary-600">Prayer Altar</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary-500 animate-pulse"></div>
              <h2 className={`text-3xl md:text-4xl font-serif tracking-tight ${isDark ? 'text-text-primary' : 'text-text-primary'}`}>
                Requests & <span className="text-primary-600 font-serif italic">Testimonies</span>
              </h2>
            </div>
            <p className={`text-sm italic border-l-2 border-primary-400 pl-4 py-1 mt-1 max-w-xl ${isDark ? 'text-text-secondary' : 'text-text-secondary'}`}>
              "Cast your anxieties on Him, for He cares for you." — 1 Peter 5:7
            </p>
          </div>
          
          <div className="flex items-center gap-3 self-start md:self-end">
            <button 
              onClick={() => router.push('/prayers/create')}
              className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white px-5 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              <span>New Prayer Request</span>
            </button>
          </div>
        </header>

        {/* Layout Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            
            {/* Filter Navigation */}
            <div className={`backdrop-blur-sm border rounded-xl p-5 shadow-sm ${isDark ? 'bg-black/40 border-white/10' : 'bg-white/40 border-white/60'}`}>
              <div className="flex items-center gap-1.5 mb-4">
                <span className="material-symbols-outlined text-primary-500 text-[14px]">filter_list</span>
                <h3 className={`text-[8px] font-black text-primary-600 uppercase tracking-wider`}>Journal Subsets</h3>
              </div>
              <div className="flex flex-col gap-1">
                {(['pending', 'answered', 'archived'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-xs ${
                      filter === s 
                        ? isDark ? 'bg-primary-500/20 text-primary-400 font-bold' : 'bg-primary-50 text-primary-700 font-bold'
                        : isDark ? 'text-gray-400 hover:bg-white/10' : 'text-gray-600 hover:bg-white/50'
                    }`}
                  >
                    <span className="capitalize tracking-wide text-[10px] font-semibold">
                      {s === 'pending' ? 'Active Requests' : s === 'answered' ? 'Answered Logs' : 'Archived Records'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black ${
                      filter === s 
                        ? isDark ? 'bg-primary-500/30 text-primary-300' : 'bg-primary-100 text-primary-800'
                        : isDark ? 'bg-white/10 text-gray-500' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {prayers.filter(p => p.status === s).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Breathe Component */}
            <div className={`backdrop-blur-sm border rounded-xl p-5 text-center relative overflow-hidden shadow-sm ${isDark ? 'bg-black/40 border-white/10' : 'bg-white/40 border-white/60'}`}>
              <div className={`absolute inset-0 bg-primary-500/10 blur-xl transition-all duration-[4000ms] ${
                isBreathing ? 'scale-150 opacity-100' : 'scale-100 opacity-0'
              }`}></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-14 h-14 rounded-full border flex items-center justify-center mb-3 transition-transform duration-[4000ms] ${
                  isBreathing ? 'scale-110' : 'scale-100'
                } ${isDark ? 'bg-primary-500/20 border-primary-500/30' : 'bg-primary-50 border-primary-200'}`}>
                  <span className={`material-symbols-outlined text-[22px] ${isDark ? 'text-primary-400' : 'text-primary-600'}`}>spa</span>
                </div>
                <h4 className={`text-base font-serif font-semibold mb-1 ${isDark ? 'text-text-primary' : 'text-text-primary'}`}>Align Your Spirit</h4>
                <p className={`text-[10px] leading-relaxed max-w-[200px] mx-auto ${isDark ? 'text-text-secondary' : 'text-text-secondary'}`}>
                  Pause and step into presence before putting your requests into text.
                </p>
                <button 
                  onClick={toggleBreathe}
                  className={`mt-4 w-full border py-2.5 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all ${
                    isBreathing 
                      ? 'bg-primary-500 text-white border-primary-500' 
                      : isDark 
                        ? 'bg-white/10 border-white/20 text-gray-400 hover:bg-primary-500 hover:text-white hover:border-primary-500' 
                        : 'bg-white/50 border-gray-200 text-gray-700 hover:bg-primary-500 hover:text-white hover:border-primary-500'
                  }`}
                >
                  {isBreathing ? 'Exhaling...' : 'Begin Breath'}
                </button>
              </div>
            </div>

            {/* Quick Stats */}
            <div className={`backdrop-blur-sm border rounded-xl p-4 shadow-sm ${isDark ? 'bg-black/40 border-white/10' : 'bg-white/40 border-white/60'}`}>
              <div className="flex items-center gap-1.5 mb-3">
                <span className="material-symbols-outlined text-primary-500 text-[14px]">analytics</span>
                <h3 className={`text-[8px] font-black text-primary-600 uppercase tracking-wider`}>Quick Stats</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[9px]">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Total Prayers</span>
                  <span className={`font-bold ${isDark ? 'text-text-primary' : 'text-text-primary'}`}>{prayers.length}</span>
                </div>
                <div className="flex justify-between items-center text-[9px]">
                  <span className={isDark ? 'text-gray-400' : 'text-gray-600'}>Answered</span>
                  <span className="font-bold text-emerald-600">{prayers.filter(p => p.status === 'answered').length}</span>
                </div>
                <div className={`w-full h-1 rounded-full overflow-hidden mt-1 ${isDark ? 'bg-white/10' : 'bg-gray-200'}`}>
                  <div 
                    className="h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all"
                    style={{ width: `${(prayers.filter(p => p.status === 'answered').length / prayers.length) * 100 || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Prayer Feed */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {filteredPrayers.length > 0 ? (
              filteredPrayers.map((prayer) => (
                <div 
                  key={prayer.id} 
                  className={`backdrop-blur-sm border rounded-xl p-5 transition-all duration-300 ${
                    isDark ? 'bg-black/40 border-white/10 hover:bg-black/60' : 'bg-white/40 border-white/60 hover:bg-white/60 hover:shadow-lg'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary-500 text-[12px]">local_offer</span>
                      <span className={`text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        isDark ? 'bg-primary-500/20 text-primary-400' : 'bg-primary-50 text-primary-700'
                      }`}>
                        {prayer.category || 'General'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={`material-symbols-outlined text-[10px] ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>calendar_today</span>
                      <span className={`text-[8px] tracking-wider ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                        {new Date(prayer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  
                  <h4 className={`text-base font-serif font-semibold mb-2 transition-colors ${isDark ? 'text-text-primary group-hover:text-primary-400' : 'text-text-primary group-hover:text-primary-700'}`}>
                    {prayer.title}
                  </h4>
                  <p className={`text-[11px] leading-relaxed mb-4 whitespace-pre-wrap line-clamp-3 ${isDark ? 'text-text-secondary' : 'text-text-secondary'}`}>
                    {prayer.request}
                  </p>
                  
                  <div className={`flex justify-end gap-2 pt-3 border-t ${isDark ? 'border-white/10' : 'border-gray-200/50'}`}>
                    <button 
                      onClick={() => router.push(`/prayers/${prayer.id}`)}
                      className={`flex items-center gap-1 text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all ${
                        isDark 
                          ? 'text-gray-400 hover:text-primary-400 hover:bg-white/10' 
                          : 'text-gray-500 hover:text-primary-600 hover:bg-white/50'
                      }`}
                    >
                      <span className="material-symbols-outlined text-[12px]">edit</span> 
                      <span>Edit</span>
                    </button>
                    
                    {prayer.status === 'pending' && (
                      <button 
                        onClick={() => handleMarkAnswered(prayer.id)}
                        className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-wider hover:shadow-md transition-all"
                      >
                        Mark Answered
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className={`text-center py-20 backdrop-blur-sm border border-dashed rounded-xl ${
                isDark ? 'bg-black/30 border-primary-500/20' : 'bg-white/30 border-amber-200'
              }`}>
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 ${
                  isDark ? 'bg-primary-500/20' : 'bg-primary-50'
                }`}>
                  <span className={`material-symbols-outlined text-2xl ${isDark ? 'text-primary-400' : 'text-primary-400'}`}>menu_book</span>
                </div>
                <p className={`font-serif italic text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
                  No {filter} prayers found.
                </p>
                <p className={`text-[9px] mt-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                  {filter === 'pending' ? 'Start a new prayer request above.' : 'Check back later for updates.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Decorative Footer */}
        <div className="mt-10 flex justify-center items-center gap-4 opacity-30">
          <div className={`h-px w-16 bg-gradient-to-r from-transparent ${isDark ? 'to-primary-400' : 'to-primary-400'}`} />
          <span className={`material-symbols-outlined text-sm ${isDark ? 'text-primary-400' : 'text-primary-400'}`}>menu_book</span>
          <div className={`h-px w-16 bg-gradient-to-l from-transparent ${isDark ? 'to-primary-400' : 'to-primary-400'}`} />
        </div>
      </main>
    </div>
  );
}