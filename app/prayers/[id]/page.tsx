'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '@/app/layout-components/Sidebar';
import { toast } from 'react-hot-toast';

interface Prayer {
  id: string;
  title: string;
  description: string; // Changed from 'request' to match your Prisma schema
  status: 'pending' | 'answered' | 'archived';
  answered: boolean;
  answer?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
}

export default function PrayerDetailPage() {
  const { status } = useSession();
  const router = useRouter();
  const params = useParams();
  const prayerId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [prayer, setPrayer] = useState<Prayer | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '', // Synced with DB field name
    status: 'pending' as 'pending' | 'answered' | 'archived',
    answer: '',
  });

  const fetchPrayer = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/prayers/${prayerId}`);
      const data = await response.json();

      if (response.ok) {
        // Handle the case where the API might return the object directly or wrapped
        const prayerData = data.prayer || data; 
        
        setPrayer(prayerData);
        setFormData({
          title: prayerData.title || '',
          description: prayerData.description || '', // Mapping from DB 'description'
          status: prayerData.status || 'pending',
          answer: prayerData.answer || '',
        });
      } else {
        toast.error(data.error || 'Record not found');
        router.push('/prayers');
      }
    } catch (error) {
      toast.error('Failed to load prayer record');
    } finally {
      setLoading(false);
    }
  }, [prayerId, router]);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated') {
      fetchPrayer();
    }
  }, [status, router, prayerId, fetchPrayer]);

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch(`/api/prayers/${prayerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          // If status is answered, we ensure the backend knows
          answered: formData.status === 'answered'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const updatedPrayer = data.prayer || data;
        setPrayer(updatedPrayer);
        setIsEditing(false);
        toast.success('Your journal has been updated.');
      } else {
        toast.error(data.error || 'Failed to update');
      }
    } catch (error) {
      toast.error('An error occurred while saving.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || !prayer) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FDFDFF] space-y-3 opacity-60">
        <div className="w-6 h-6 border-2 border-primary/20 border-b-primary rounded-full animate-spin"></div>
        <p className="text-[11px] font-black text-[#7C7565] uppercase tracking-widest">Entering Prayer Altar...</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#FDFDFF] relative overflow-hidden">
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[15%] right-[10%] w-[450px] h-[450px] rounded-full bg-primary/5 blur-[130px]"></div>
        <div className="absolute bottom-[20%] left-[20%] w-[380px] h-[380px] rounded-full bg-[#D4AF37]/5 blur-[110px]"></div>
      </div>

      <Sidebar />

      <main className="flex-1 lg:ml-64 pt-24 px-6 md:px-10 pb-32 max-w-7xl mx-auto w-full z-10 relative">
        <header className="mb-12 flex flex-col sm:flex-row sm:items-center justify-between gap-6 animate-in fade-in duration-500">
          <div className="flex items-center gap-5">
            <Link 
              href="/prayers" 
              className="p-3 bg-white border border-gray-100 rounded-full text-[#3C3830] hover:bg-primary hover:text-white hover:border-primary transition-all duration-200 shadow-sm flex items-center justify-center group"
            >
              <span className="material-symbols-outlined text-sm transition-transform group-hover:-translate-x-0.5">arrow_back</span>
            </Link>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]"></span>
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D4AF37]">{prayer.category || 'General'}</span>
              </div>
              <h1 className="text-2xl md:text-3xl font-serif text-[#3C3830] tracking-tight">
                Prayer <span className="font-serif italic text-primary">Inspection</span>
              </h1>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(!isEditing)}
            className={`px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all shadow-sm border flex items-center gap-2 ${
              isEditing 
                ? 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100' 
                : 'bg-white text-[#3C3830] border-gray-100 hover:bg-gray-50'
            }`}
          >
            <span className="material-symbols-outlined text-xs">{isEditing ? 'close' : 'edit'}</span>
            <span>{isEditing ? 'Cancel Edit' : 'Modify Record'}</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="bg-white border border-gray-100 p-6 md:p-10 rounded-[32px] shadow-sm transition-all">
              
              {!isEditing ? (
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-wider ${
                      prayer.status === 'answered' 
                        ? 'bg-primary/5 text-primary' 
                        : prayer.status === 'archived'
                        ? 'bg-gray-100 text-gray-500'
                        : 'bg-amber-50 text-amber-700'
                    }`}>
                      {prayer.status}
                    </span>
                    <span className="text-gray-400 text-[11px]">
                      Created {new Date(prayer.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h2 className="text-2xl font-serif text-[#3C3830] font-bold leading-tight tracking-tight">
                      {prayer.title}
                    </h2>
                  </div>
                  
                  <div className="bg-gray-50/50 p-6 md:p-8 rounded-[24px] border border-gray-100/50">
                    <h3 className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4">Core Focus Statement</h3>
                    <p className="text-base text-[#3C3830] leading-relaxed whitespace-pre-wrap font-serif italic">
                      "{prayer.description}"
                    </p>
                  </div>

                  {prayer.answer && (
                    <div className="bg-primary/[0.02] border border-primary/10 p-6 md:p-8 rounded-[24px] relative overflow-hidden animate-in fade-in duration-500">
                      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                        <span className="material-symbols-outlined text-7xl text-primary">auto_awesome</span>
                      </div>
                      <h3 className="text-[9px] font-black text-primary uppercase tracking-[0.2em] mb-4">Fulfilled Manifestation</h3>
                      <p className="text-base text-[#3C3830] leading-relaxed whitespace-pre-wrap">
                        {prayer.answer}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in duration-300">
                  <div className="space-y-2">
                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">Entry Identifier (Title)</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-3.5 text-sm text-[#3C3830] focus:ring-1 focus:ring-primary/20 focus:border-primary outline-none transition-all font-sans"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">Petition Focus (Request)</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={6}
                      className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-3.5 text-sm text-[#3C3830] focus:ring-1 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none font-serif italic"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-[9px] font-black text-gray-400 uppercase tracking-widest">State Placement</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full bg-gray-50/50 border border-gray-100 rounded-xl px-5 py-3.5 text-sm text-[#3C3830] outline-none focus:border-primary transition-all appearance-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="answered">Answered</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>
                  </div>

                  {formData.status === 'answered' && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                      <label className="block text-[9px] font-black text-primary uppercase tracking-widest">The Manifestation Log (Testimony)</label>
                      <textarea
                        value={formData.answer}
                        onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                        placeholder="Detail how this journey found structural completion..."
                        rows={5}
                        className="w-full bg-primary/[0.01] border border-primary/20 rounded-xl px-5 py-3.5 text-sm text-[#3C3830] focus:ring-1 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none"
                      />
                    </div>
                  )}

                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full bg-primary text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {saving && <div className="w-3 h-3 border-2 border-white/20 border-b-white rounded-full animate-spin"></div>}
                    <span>{saving ? 'Syncing...' : 'Commit Changes'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-white p-6 md:p-8 rounded-[28px] border border-gray-100 shadow-sm space-y-6">
              <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Audit Timeline</h3>
              <div className="space-y-5">
                <TimelineItem icon="calendar_today" label="Created" date={prayer.createdAt} />
                <TimelineItem icon="history" label="Last Mutation" date={prayer.updatedAt} />
              </div>
            </div>

            <div className="bg-primary/[0.02] border border-primary/5 p-6 md:p-8 rounded-[28px] text-center relative overflow-hidden group">
              <span className="material-symbols-outlined text-primary text-3xl mb-3 block opacity-80">spa</span>
              <p className="text-[10px] font-black text-primary uppercase tracking-widest">Sovereign Silence</p>
              <p className="text-[11px] text-[#7C7565] mt-1 italic font-serif">
                Allow metrics and focus fields to settle naturally into architectural order.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function TimelineItem({ icon, label, date }: { icon: string; label: string; date: string }) {
  return (
    <div className="flex gap-4 items-start">
      <div className="p-2 bg-gray-50 rounded-lg text-gray-400 flex items-center justify-center">
        <span className="material-symbols-outlined text-base">{icon}</span>
      </div>
      <div className="space-y-0.5">
        <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider">{label}</p>
        <p className="text-xs text-[#3C3830] font-sans font-medium">
          {new Date(date).toLocaleString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            year: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true 
          })}
        </p>
      </div>
    </div>
  );
}