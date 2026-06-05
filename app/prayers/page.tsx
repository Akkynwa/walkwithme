'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/layout-components/Sidebar';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

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
        <div className="relative z-10 text-center">
          <div className="w-8 h-8 border-2 border-amber-600/20 border-t-amber-600 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="font-serif italic text-gray-500 text-[10px] tracking-wider uppercase">Entering Prayer Altar...</p>
        </div>
      </div>
    );
  }

  const filteredPrayers = prayers.filter(p => p.status === filter);

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

      <main className="relative z-10 flex-1 lg:ml-56 pt-20 px-6 md:px-10 pb-16 max-w-6xl mx-auto w-full">
        
        {/* Header Section */}
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-5 animate-in fade-in duration-1000">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-px bg-amber-400/40" />
              <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-600">Prayer Altar</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-600 animate-pulse"></div>
              <h2 className="text-3xl md:text-4xl font-serif text-gray-800 tracking-tight">
                Requests & <span className="text-amber-600 font-serif italic">Testimonies</span>
              </h2>
            </div>
            <p className="text-sm text-gray-600 italic border-l-2 border-amber-400 pl-4 py-1 mt-1 max-w-xl">
              "Cast your anxieties on Him, for He cares for you." — 1 Peter 5:7
            </p>
          </div>
          
          {/* Action Button */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <button 
              onClick={() => router.push('/prayers/create')}
              className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-5 py-2.5 rounded-lg text-[9px] font-black uppercase tracking-wider shadow-md hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              <span className="material-symbols-outlined text-[14px]">add</span>
              <span>New Prayer Request</span>
            </button>
          </div>
        </header>

        {/* Layout Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Interactive State Controls */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            
            {/* Filter Navigation Box */}
            <div className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl p-5 shadow-sm">
              <div className="flex items-center gap-1.5 mb-4">
                <span className="material-symbols-outlined text-amber-500 text-[14px]">filter_list</span>
                <h3 className="text-[8px] font-black text-amber-600 uppercase tracking-wider">Journal Subsets</h3>
              </div>
              <div className="flex flex-col gap-1">
                {(['pending', 'answered', 'archived'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-xs ${
                      filter === s 
                        ? 'bg-amber-100 text-amber-700 font-bold' 
                        : 'text-gray-600 hover:bg-white/50'
                    }`}
                  >
                    <span className="capitalize tracking-wide text-[10px] font-semibold">
                      {s === 'pending' ? 'Active Requests' : s === 'answered' ? 'Answered Logs' : 'Archived Records'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[8px] font-black ${
                      filter === s ? 'bg-amber-200 text-amber-800' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {prayers.filter(p => p.status === s).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Micro-stillness Breathe Component */}
            <div className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl p-5 text-center relative overflow-hidden shadow-sm">
              <div className={`absolute inset-0 bg-amber-500/10 blur-xl transition-all duration-[4000ms] ${
                isBreathing ? 'scale-150 opacity-100' : 'scale-100 opacity-0'
              }`}></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-14 h-14 rounded-full bg-amber-100 border border-amber-200 flex items-center justify-center mb-3 transition-transform duration-[4000ms] ${
                  isBreathing ? 'scale-110' : 'scale-100'
                }`}>
                  <span className="material-symbols-outlined text-amber-600 text-[22px]">spa</span>
                </div>
                <h4 className="text-base font-serif text-gray-800 font-semibold mb-1">Align Your Spirit</h4>
                <p className="text-[10px] text-gray-500 leading-relaxed max-w-[200px] mx-auto">
                  Pause and step into presence before putting your requests into text.
                </p>
                <button 
                  onClick={toggleBreathe}
                  className="mt-4 w-full bg-white/50 border border-gray-200 py-2.5 rounded-lg text-[8px] font-black uppercase tracking-wider text-gray-700 hover:bg-amber-600 hover:text-white hover:border-amber-600 transition-all"
                >
                  {isBreathing ? 'Exhaling...' : 'Begin Breath'}
                </button>
              </div>
            </div>

            {/* Categories Quick Stats */}
            <div className="bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl p-4">
              <div className="flex items-center gap-1.5 mb-3">
                <span className="material-symbols-outlined text-amber-500 text-[14px]">analytics</span>
                <h3 className="text-[8px] font-black text-amber-600 uppercase tracking-wider">Quick Stats</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[9px]">
                  <span className="text-gray-600">Total Prayers</span>
                  <span className="font-bold text-gray-800">{prayers.length}</span>
                </div>
                <div className="flex justify-between items-center text-[9px]">
                  <span className="text-gray-600">Answered</span>
                  <span className="font-bold text-emerald-600">{prayers.filter(p => p.status === 'answered').length}</span>
                </div>
                <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden mt-1">
                  <div 
                    className="h-full bg-gradient-to-r from-amber-500 to-amber-600 rounded-full transition-all"
                    style={{ width: `${(prayers.filter(p => p.status === 'answered').length / prayers.length) * 100 || 0}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Prayer Feed Container */}
          <div className="lg:col-span-8 flex flex-col gap-4">
            {filteredPrayers.length > 0 ? (
              filteredPrayers.map((prayer) => (
                <div 
                  key={prayer.id} 
                  className="group bg-white/40 backdrop-blur-sm border border-white/60 rounded-xl p-5 hover:bg-white/60 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-500 text-[12px]">local_offer</span>
                      <span className="bg-amber-100 text-amber-700 text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {prayer.category || 'General'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-gray-400 text-[10px]">calendar_today</span>
                      <span className="text-[8px] text-gray-500 tracking-wider">
                        {new Date(prayer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                  
                  <h4 className="text-base font-serif font-semibold text-gray-800 mb-2 group-hover:text-amber-700 transition-colors">
                    {prayer.title}
                  </h4>
                  <p className="text-[11px] text-gray-600 leading-relaxed mb-4 whitespace-pre-wrap line-clamp-3">
                    {prayer.request}
                  </p>
                  
                  <div className="flex justify-end gap-2 pt-3 border-t border-gray-200/50">
                    <button 
                      onClick={() => router.push(`/prayers/${prayer.id}`)}
                      className="flex items-center gap-1 text-gray-500 hover:text-amber-600 text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg hover:bg-white/50 transition-all"
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
              <div className="text-center py-20 bg-white/30 backdrop-blur-sm border border-dashed border-amber-200 rounded-xl">
                <div className="w-14 h-14 rounded-xl bg-amber-100 flex items-center justify-center mx-auto mb-3">
                  <span className="material-symbols-outlined text-amber-400 text-2xl">menu_book</span>
                </div>
                <p className="font-serif italic text-gray-500 text-sm">
                  No {filter} prayers found.
                </p>
                <p className="text-[9px] text-gray-400 mt-1">
                  {filter === 'pending' ? 'Start a new prayer request above.' : 'Check back later for updates.'}
                </p>
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