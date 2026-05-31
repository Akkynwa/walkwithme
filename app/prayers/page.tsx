'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/app/layout-components/Sidebar';
import { toast } from 'react-hot-toast';

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
  
  // Interface States
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
      <div className="flex items-center justify-center min-h-screen bg-[#FDFDFF]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary/20 border-b-primary mx-auto mb-4"></div>
          <p className="font-serif italic text-gray-400 text-xs tracking-widest uppercase">Entering Prayer Altar...</p>
        </div>
      </div>
    );
  }

  const filteredPrayers = prayers.filter(p => p.status === filter);

  return (
    <div className="flex min-h-screen bg-[#FDFDFF] relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[20%] left-[10%] w-[350px] h-[350px] rounded-full bg-primary/5 blur-[100px]"></div>
        <div className="absolute bottom-[20%] right-[10%] w-[400px] h-[400px] rounded-full bg-[#D4AF37]/5 blur-[120px]"></div>
      </div>

      <Sidebar />

      <main className="flex-1 lg:ml-64 pt-24 px-6 md:px-10 pb-32 max-w-[1200px] mx-auto w-full z-10 relative">
        
        {/* Header Section */}
        <header className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-in fade-in duration-1000">
          <div className="space-y-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">Prayer Altar</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-serif text-[#3C3830] tracking-tight">
              Requests & <span className="text-primary font-serif italic">Testimonies</span>
            </h2>
            <p className="text-sm text-[#7C7565] font-serif italic border-l-2 border-primary/20 pl-4 py-1 mt-2 max-w-xl">
                "Cast your anxieties on Him, for He cares for you." — 1 Peter 5:7
            </p>
          </div>
          
          {/* Action Button Group */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <button 
              onClick={() => router.push('/prayers/create')}
              className="flex items-center justify-center gap-2 bg-primary text-white px-6 py-3.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-sm hover:scale-[1.02] transition-all"
            >
              <span className="material-symbols-outlined text-sm">add</span>
              <span>New Prayer Request</span>
            </button>
          </div>
        </header>

        {/* Layout Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Interactive State Controls */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Filter Navigation Box */}
            <div className="bg-white border border-gray-100 rounded-[24px] p-5 shadow-sm">
              <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Journal Subsets</h3>
              <div className="flex flex-col gap-1.5">
                {(['pending', 'answered', 'archived'] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setFilter(s)}
                    className={`flex items-center justify-between px-4 py-3.5 rounded-xl transition-all text-xs ${
                      filter === s 
                        ? 'bg-primary/5 text-primary font-bold' 
                        : 'text-[#7C7565] hover:bg-gray-50/70'
                    }`}
                  >
                    <span className="capitalize tracking-wide">
                      {s === 'pending' ? 'Active Requests' : s === 'answered' ? 'Answered Logs' : 'Archived Records'}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                      filter === s ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-gray-400'
                    }`}>
                      {prayers.filter(p => p.status === s).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Micro-stillness Breathe Component */}
            <div className="bg-white border border-gray-100 rounded-[24px] p-6 text-center relative overflow-hidden shadow-sm">
              <div className={`absolute inset-0 bg-primary/5 blur-xl transition-all duration-[4000ms] ${
                isBreathing ? 'scale-150 opacity-100' : 'scale-100 opacity-0'
              }`}></div>
              
              <div className="relative z-10 flex flex-col items-center">
                <div className={`w-14 h-14 rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center mb-4 transition-transform duration-[4000ms] ${
                  isBreathing ? 'scale-110' : 'scale-100'
                }`}>
                  <span className="material-symbols-outlined text-primary text-xl">air</span>
                </div>
                <h4 className="text-base font-serif text-[#3C3830] font-bold mb-1">Align Your Spirit</h4>
                <p className="text-[11px] text-[#7C7565] leading-relaxed max-w-[200px] mx-auto">
                  Pause and step into presence before putting your requests into text.
                </p>
                <button 
                  onClick={toggleBreathe}
                  className="mt-4 w-full bg-gray-50 border border-gray-100 py-3 rounded-full text-[10px] font-black uppercase tracking-widest text-[#3C3830] hover:bg-primary hover:text-white hover:border-primary transition-all"
                >
                  {isBreathing ? 'Exhaling...' : 'Begin Breath'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Dynamic Prayer Feed Container */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {filteredPrayers.map((prayer) => (
              <div 
                key={prayer.id} 
                className="group bg-white p-6 md:p-8 rounded-[28px] border border-gray-100 shadow-sm hover:border-primary/10 transition-all duration-300"
              >
                <div className="flex items-center justify-between gap-4 mb-4">
                  <span className="bg-primary/5 text-primary text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                    {prayer.category || 'General'}
                  </span>
                  <span className="text-gray-300 text-[10px] tracking-wider uppercase font-mono">
                    {new Date(prayer.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
                
                <h4 className="text-xl font-serif text-[#3C3830] font-bold mb-2 group-hover:text-primary transition-colors">
                  {prayer.title}
                </h4>
                <p className="text-sm text-[#7C7565] leading-relaxed mb-6 whitespace-pre-wrap">
                  {prayer.request}
                </p>
                
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-50">
                  <button 
                    onClick={() => router.push(`/prayers/${prayer.id}`)}
                    className="text-gray-400 hover:text-primary flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-all"
                  >
                    <span className="material-symbols-outlined text-base">edit</span> 
                    <span>Edit</span>
                  </button>
                  
                  {prayer.status === 'pending' && (
                    <button 
                      onClick={() => handleMarkAnswered(prayer.id)}
                      className="bg-primary text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-[#D4AF37] shadow-sm transition-all"
                    >
                      Mark Answered
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {filteredPrayers.length === 0 && (
              <div className="text-center py-24 bg-white/40 border border-dashed border-gray-200 rounded-[28px] p-8">
                <span className="material-symbols-outlined text-gray-300 text-4xl mb-3">auto_stories</span>
                <p className="font-serif italic text-gray-400 text-sm">
                  No records found inside your structural journal logs.
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}