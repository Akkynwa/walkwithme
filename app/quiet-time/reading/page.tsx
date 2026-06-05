'use client';

import React, { useState, useEffect } from 'react';
import { ReadingCanvas } from '@/components/reading/ReadingCanvas';
import { SacredRibbon } from '@/components/reading/SacredRibbon';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

type WorkspaceTab = 'scripture' | 'community';
type CommunitySection = 'revelations' | 'intercession' | 'cohort';

interface RevelationPost {
  id: string;
  book: string;
  chapter: number;
  content: string;
  user: { name: string; isAnonymous: boolean };
  createdAt: string;
  amenCount: number;
  hasAmened: boolean;
}

interface PrayerRequest {
  id: string;
  content: string;
  user: { name: string; isAnonymous: boolean };
  createdAt: string;
  intercessorCount: number;
  hasInterceded: boolean;
  status: 'ACTIVE' | 'ANSWERED';
}

interface CohortMessage {
  id: string;
  user: { name: string; initials: string };
  text: string;
  timestamp: string;
}

interface CohortProgress {
  groupName: string;
  totalMembers: number;
  completedCount: number;
  activeBook: string;
  activeChapter: number;
}

export default function QuietTimeReadingPage() {
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<WorkspaceTab>('scripture');
  const [activeSection, setActiveSection] = useState<CommunitySection>('revelations');
  
  const [revelations, setRevelations] = useState<RevelationPost[]>([]);
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [fetchingData, setFetchingData] = useState(false);

  const [cohortProgress, setCohortProgress] = useState<CohortProgress | null>(null);
  const [cohortMessages, setCohortMessages] = useState<CohortMessage[]>([]);
  const [newGroupMessage, setNewGroupMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);

  const [isJournalOpen, setIsJournalOpen] = useState(false);
  const [isAnonymousShare, setIsAnonymousShare] = useState(false);
  const [activeBook, setActiveBook] = useState({ name: 'John', chapters: 21 });
  const [activeChapter, setActiveChapter] = useState(15);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [newPrayer, setNewPrayer] = useState('');
  const [submittingPrayer, setSubmittingPrayer] = useState(false);

  useEffect(() => {
    const savedNote = localStorage.getItem('sanctuary_pending_note');
    if (savedNote) setNote(savedNote);
  }, []);

  useEffect(() => {
    if (activeTab !== 'community') return;

    const fetchCommunityData = async () => {
      setFetchingData(true);
      try {
        if (activeSection === 'revelations') {
          const res = await fetch('/api/community/revelations');
          if (res.ok) {
            const data = await res.json();
            setRevelations(data);
          }
        } else if (activeSection === 'intercession') {
          const res = await fetch('/api/intercede');
          if (res.ok) {
            const data = await res.json();
            setPrayers(data);
          }
        } else if (activeSection === 'cohort') {
          const res = await fetch('/api/cohort');
          if (res.ok) {
            const data = await res.json();
            setCohortProgress(data.progress);
            setCohortMessages(data.messages);
          }
        }
      } catch (err) {
        console.error("Error pulling sanctuary updates:", err);
      } finally {
        setFetchingData(false);
      }
    };

    fetchCommunityData();
  }, [activeTab, activeSection]);

  const handleTextChange = (val: string) => {
    setNote(val);
    localStorage.setItem('sanctuary_pending_note', val);
  };

  const handleArchiveAndPublish = async () => {
    const cleanNote = note.trim();
    if (!cleanNote) return;

    setLoading(true);
    try {
      const response = await fetch('/api/community/revelations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book: activeBook.name,
          chapter: activeChapter,
          content: cleanNote,
          note: cleanNote,
          reflection: cleanNote,
          isPublic: true, 
          isAnonymous: isAnonymousShare
        }),
      });

      if (!response.ok) throw new Error('Failed to synchronize note');

      setShowToast(true);
      setNote('');
      localStorage.removeItem('sanctuary_pending_note');
      
      setTimeout(() => {
        setShowToast(false);
        setIsJournalOpen(false);
      }, 2000);
    } catch (err) {
      console.error(err);
      alert('Could not sync directly. Kept locally for security.');
    } finally {
      setLoading(false);
    }
  };

  const handleAmenPulse = async (id: string) => {
    setRevelations(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          amenCount: item.hasAmened ? item.amenCount - 1 : item.amenCount + 1,
          hasAmened: !item.hasAmened
        };
      }
      return item;
    }));

    try {
      await fetch(`/api/community/revelations/amen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: id })
      });
    } catch (err) {
      console.error("Amen pulse sync failure:", err);
    }
  };

  const handleIntercedePulse = async (id: string) => {
    setPrayers(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          intercessorCount: item.hasInterceded ? item.intercessorCount - 1 : item.intercessorCount + 1,
          hasInterceded: !item.hasInterceded
        };
      }
      return item;
    }));

    try {
      await fetch(`/api/intercede/pulse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prayerId: id })
      });
    } catch (err) {
      console.error("Intercession pulse sync failure:", err);
    }
  };

  const handleCreatePrayer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrayer.trim()) return;

    setSubmittingPrayer(true);
    try {
      const res = await fetch('/api/intercede', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newPrayer.trim(), isAnonymous: false })
      });
      if (res.ok) {
        const freshPrayer = await res.json();
        setPrayers(prev => [freshPrayer, ...prev]);
        setNewPrayer('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmittingPrayer(false);
    }
  };

  const handleSendCohortMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGroupMessage.trim()) return;

    setSendingMessage(true);
    try {
      const res = await fetch('/api/cohort/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newGroupMessage.trim() })
      });
      if (res.ok) {
        const incomingMsg = await res.json();
        setCohortMessages(prev => [...prev, incomingMsg]);
        setNewGroupMessage('');
      }
    } catch (err) {
      console.error("Failed sending message to cohort:", err);
    } finally {
      setSendingMessage(false);
    }
  };

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

      <SacredRibbon className="fixed top-0 left-24 z-10 opacity-20" color1="#D4AF37" color2="#AA8A2E" />

      {/* Fixed Navigation Control Panel Bar */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-white/40 backdrop-blur-xl border-b border-white/60 z-40 px-4 md:px-8 flex items-center justify-between">
        <button onClick={() => router.back()} className="text-[9px] font-black tracking-wider text-gray-500 uppercase flex items-center gap-1.5 hover:text-amber-600 transition-colors group">
          <span className="material-symbols-outlined text-sm group-hover:-translate-x-0.5 transition-transform">arrow_back</span> 
          Lobby
        </button>

        <div className="flex bg-white/50 p-0.5 rounded-lg border border-white/60">
          <button onClick={() => setActiveTab('scripture')} className={`px-4 py-1.5 rounded-md text-[8px] font-black tracking-wider uppercase transition-all ${activeTab === 'scripture' ? 'bg-amber-600 text-white shadow-sm' : 'text-gray-500 hover:text-amber-600'}`}>
            Scripture Canvas
          </button>
          <button onClick={() => setActiveTab('community')} className={`px-4 py-1.5 rounded-md text-[8px] font-black tracking-wider uppercase transition-all ${activeTab === 'community' ? 'bg-amber-600 text-white shadow-sm' : 'text-gray-500 hover:text-amber-600'}`}>
            Community Hub
          </button>
        </div>

        <div className="hidden md:block text-right">
          <span className="text-[8px] font-black uppercase tracking-wider text-gray-400 block">Stage 02</span>
          <span className="text-[9px] font-bold text-amber-700">{activeTab === 'scripture' ? 'Holy Scripture' : 'Sanctuary Fellowship'}</span>
        </div>
      </div>

      {/* Core Viewport Content Container */}
      <div className="relative z-10 flex-1 pt-20 pb-20 px-4 md:px-8 max-w-6xl mx-auto w-full transition-all duration-500">
        
        {/* View 1: Scripture Workspace */}
        {activeTab === 'scripture' && (
          <div className="animate-fadeIn">
            <ReadingCanvas book={activeBook} chapter={activeChapter} onChapterChange={setActiveChapter} />
            <div className="mt-6 flex justify-end">
              <button onClick={() => router.push('/quiet-time/reflection')} className="flex items-center gap-2 bg-gradient-to-r from-amber-600 to-amber-700 text-white px-6 py-2.5 rounded-lg text-[9px] font-black tracking-wider hover:shadow-lg hover:shadow-amber-500/25 transition-all">
                PROCEED TO REFLECTION <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        )}

        {/* View 2: Dedicated Community Dashboard */}
        {activeTab === 'community' && (
          <div className="max-w-3xl mx-auto animate-fadeIn">
            
            {/* Sub-tab Subsection Filter Bar */}
            <div className="flex gap-6 border-b border-gray-200/50 mb-8 pb-2">
              {[
                { id: 'revelations', label: 'Shared Revelations', icon: 'menu_book' },
                { id: 'intercession', label: 'Guarded Intercession', icon: 'brightness_7' },
                { id: 'cohort', label: 'Study Cohorts', icon: 'groups' }
              ].map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id as CommunitySection)}
                  className={`flex items-center gap-1.5 pb-2 relative text-[9px] font-black uppercase tracking-wider transition-colors ${activeSection === sec.id ? 'text-amber-700' : 'text-gray-400 hover:text-amber-600'}`}
                >
                  <span className="material-symbols-outlined text-sm">{sec.icon}</span>
                  {sec.label}
                  {activeSection === sec.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-600 rounded-full" />
                  )}
                </button>
              ))}
            </div>

            {/* Inner Module View Renderer */}
            <div className="min-h-[50vh]">
              {fetchingData ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-gray-400 text-xs">
                  <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Gathering Sanctuary Stream...</span>
                </div>
              ) : (
                <>
                  {/* Section A: Shared Revelations Editorial Feed */}
                  {activeSection === 'revelations' && (
                    <div className="space-y-5">
                      {revelations.length === 0 ? (
                        <div className="p-10 border border-white/60 rounded-xl bg-white/30 text-center text-gray-500 text-[10px] tracking-wider">
                          The fellowship feed is quiet. Be the first to publish a reflection from your journal drawer.
                        </div>
                      ) : (
                        revelations.map((post) => (
                          <div key={post.id} className="p-5 border border-white/60 rounded-xl bg-white/40 backdrop-blur-sm hover:bg-white/60 transition-all duration-300 relative group">
                            <div className="flex justify-between items-center mb-4">
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-amber-500 text-[12px]">menu_book</span>
                                <span className="text-[8px] font-black uppercase text-amber-700 tracking-wider bg-amber-100 px-2 py-0.5 rounded-full">
                                  {post.book} {post.chapter}
                                </span>
                              </div>
                              <span className="text-[8px] font-bold text-gray-500 uppercase">
                                {post.user.isAnonymous ? 'A Seeking Soul' : post.user.name}
                              </span>
                            </div>
                            <p className="text-gray-700 text-sm leading-relaxed font-serif tracking-wide whitespace-pre-wrap mb-5">
                              "{post.content}"
                            </p>
                            <div className="flex justify-between items-center pt-3 border-t border-gray-200/50">
                              <span className="text-[8px] text-gray-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                              <button 
                                onClick={() => handleAmenPulse(post.id)}
                                className={`flex items-center gap-1.5 text-[8px] font-black tracking-wider px-3 py-1.5 rounded-lg transition-all ${post.hasAmened ? 'bg-amber-600 text-white shadow-sm' : 'bg-white/50 text-gray-500 hover:bg-amber-100'}`}
                              >
                                <span className="material-symbols-outlined text-[12px]">self_improvement</span>
                                AMEN {post.amenCount > 0 && `(${post.amenCount})`}
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Section B: Guarded Intercession Room */}
                  {activeSection === 'intercession' && (
                    <div className="space-y-6">
                      <form onSubmit={handleCreatePrayer} className="p-5 border border-amber-200/50 rounded-xl bg-amber-50/20 backdrop-blur-sm mb-8">
                        <textarea
                          value={newPrayer}
                          onChange={(e) => setNewPrayer(e.target.value)}
                          placeholder="Drop a request or praise report into the intercession circle..."
                          className="w-full bg-transparent border-none focus:ring-0 text-sm font-serif text-gray-700 placeholder:text-gray-400 resize-none h-16"
                        />
                        <div className="flex justify-end pt-2 border-t border-amber-100">
                          <button 
                            type="submit" 
                            disabled={submittingPrayer || !newPrayer.trim()}
                            className="bg-gradient-to-r from-amber-600 to-amber-700 text-white text-[8px] font-black tracking-wider uppercase px-5 py-2 rounded-lg hover:shadow-md disabled:opacity-40 transition-all"
                          >
                            {submittingPrayer ? 'Broadcasting...' : 'Request Prayer'}
                          </button>
                        </div>
                      </form>

                      {prayers.length === 0 ? (
                        <div className="p-10 border border-white/60 rounded-xl bg-white/30 text-center text-gray-500 text-[10px] tracking-wider">
                          No active requests in the loop. Stand in the gap for someone today.
                        </div>
                      ) : (
                        prayers.map((prayer) => (
                          <div key={prayer.id} className="p-5 border border-white/60 rounded-xl bg-white/40 backdrop-blur-sm relative overflow-hidden transition-all duration-300">
                            <div className="flex justify-between items-center mb-3">
                              <div className="flex items-center gap-2">
                                <div className={`w-1.5 h-1.5 rounded-full ${prayer.status === 'ANSWERED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                                <span className="text-[7px] font-black tracking-wider text-gray-500 uppercase">{prayer.status}</span>
                              </div>
                              <span className="text-[8px] font-bold text-gray-500 uppercase">{prayer.user.isAnonymous ? 'Anonymous' : prayer.user.name}</span>
                            </div>
                            <p className="text-gray-700 text-xs leading-relaxed mb-4">
                              {prayer.content}
                            </p>
                            <div className="flex justify-between items-center pt-3 border-t border-gray-200/50">
                              <span className="text-[8px] text-gray-400">{new Date(prayer.createdAt).toLocaleDateString()}</span>
                              <button 
                                onClick={() => handleIntercedePulse(prayer.id)}
                                className={`flex items-center gap-1.5 text-[8px] font-black tracking-wider px-3 py-1.5 rounded-lg transition-all ${prayer.hasInterceded ? 'bg-amber-600 text-white shadow-md' : 'bg-white/50 text-gray-500 hover:bg-amber-100'}`}
                              >
                                <span className="material-symbols-outlined text-[10px]">brightness_5</span>
                                {prayer.hasInterceded ? 'Interceding' : 'Stand in Gap'} {prayer.intercessorCount > 0 && `(${prayer.intercessorCount})`}
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Section C: Synchronized Study Cohorts */}
                  {activeSection === 'cohort' && (
                    <div className="space-y-6 animate-fadeIn">
                      {cohortProgress && (
                        <div className="p-5 border border-white/60 rounded-xl bg-white/40 backdrop-blur-sm">
                          <div className="flex justify-between items-center mb-3">
                            <div>
                              <h5 className="text-[10px] font-black text-gray-800 uppercase tracking-wider">{cohortProgress.groupName}</h5>
                              <span className="text-[8px] text-amber-700 font-bold uppercase tracking-wider">
                                Assigned: {cohortProgress.activeBook} {cohortProgress.activeChapter}
                              </span>
                            </div>
                            <span className="text-[10px] font-black text-gray-700">
                              {Math.round((cohortProgress.completedCount / cohortProgress.totalMembers) * 100)}% Done
                            </span>
                          </div>
                          
                          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-amber-500 to-amber-600 transition-all duration-1000 ease-out"
                              style={{ width: `${(cohortProgress.completedCount / cohortProgress.totalMembers) * 100}%` }}
                            />
                          </div>
                          <span className="text-[8px] text-gray-400 block mt-2 text-right">
                            {cohortProgress.completedCount} of {cohortProgress.totalMembers} members finished
                          </span>
                        </div>
                      )}

                      <div className="border border-white/60 rounded-xl bg-white/40 backdrop-blur-sm flex flex-col h-[380px] overflow-hidden">
                        <div className="p-3 border-b border-gray-200/50 bg-white/30 flex items-center justify-between">
                          <span className="text-[8px] font-black text-gray-700 uppercase tracking-wider">Fellowship Circle Stream</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        </div>

                        <div className="flex-1 p-4 overflow-y-auto space-y-3 text-sm">
                          {cohortMessages.length === 0 ? (
                            <div className="h-full flex items-center justify-center text-[9px] text-gray-400 tracking-wide">
                              No insights shared yet. Start the conversation below.
                            </div>
                          ) : (
                            cohortMessages.map((msg) => (
                              <div key={msg.id} className="flex gap-2 items-start animate-fadeIn">
                                <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 text-[8px] font-black flex items-center justify-center shrink-0">
                                  {msg.user.initials}
                                </div>
                                <div className="flex flex-col bg-white/50 p-2.5 rounded-lg max-w-[85%]">
                                  <span className="text-[8px] font-bold text-gray-600 mb-0.5">{msg.user.name}</span>
                                  <p className="text-[10px] text-gray-700 leading-relaxed">{msg.text}</p>
                                  <span className="text-[7px] text-gray-400 mt-1 text-right">{msg.timestamp}</span>
                                </div>
                              </div>
                            ))
                          )}
                        </div>

                        <form onSubmit={handleSendCohortMessage} className="p-3 border-t border-gray-200/50 bg-white/30 flex gap-2">
                          <input 
                            type="text"
                            value={newGroupMessage}
                            onChange={(e) => setNewGroupMessage(e.target.value)}
                            placeholder="Share a thought with your circle..."
                            className="flex-1 bg-white/50 border-none rounded-lg px-3 py-2 text-[10px] font-sans focus:ring-1 focus:ring-amber-500/20 text-gray-700"
                          />
                          <button 
                            type="submit"
                            disabled={sendingMessage || !newGroupMessage.trim()}
                            className="w-8 bg-amber-600 hover:bg-amber-700 text-white rounded-lg flex items-center justify-center transition-colors disabled:opacity-40"
                          >
                            <span className="material-symbols-outlined text-[14px]">send</span>
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Floating Action Workspace Button */}
      <button onClick={() => setIsJournalOpen(true)} className="fixed right-5 md:right-8 bottom-5 md:bottom-8 z-50 group flex items-center">
        <div className="relative flex items-center gap-3 bg-white/60 backdrop-blur-2xl border border-white/60 px-4 md:px-5 py-3 rounded-2xl shadow-xl hover:-translate-y-0.5 transition-all duration-300">
          <div className="w-8 h-8 bg-gradient-to-r from-amber-600 to-amber-700 rounded-lg flex items-center justify-center shadow-md group-hover:rotate-6 transition-transform">
            <span className="material-symbols-outlined text-white text-[18px]">edit_note</span>
          </div>
          <div className="flex flex-col items-start">
            <span className="text-[8px] font-black uppercase tracking-wider text-gray-700">Reflect</span>
            <span className="text-[7px] font-bold text-amber-600/60 uppercase tracking-wider leading-none">Soul Journal</span>
          </div>
        </div>
      </button>

      {/* Drawer Background Overlay */}
      <div onClick={() => setIsJournalOpen(false)} className={`fixed inset-0 bg-black/20 backdrop-blur-sm z-[90] transition-opacity duration-500 ${isJournalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} />

      {/* Soul Journal Drawer */}
      <div className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-white/95 backdrop-blur-xl z-[100] shadow-2xl transform transition-transform duration-500 ease-out ${isJournalOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className={`absolute top-20 left-6 right-6 z-[110] flex items-center gap-2 bg-amber-600 text-white px-4 py-3 rounded-lg shadow-xl transition-all duration-500 ${showToast ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
          <span className="material-symbols-outlined text-amber-200 text-[16px]">check_circle</span>
          <span className="text-[8px] font-black uppercase tracking-wider">Archived & Synchronized Safely</span>
        </div>

        <div className="h-full flex flex-col px-6 py-8 relative">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h4 className="text-[8px] font-black text-amber-600 uppercase tracking-wider mb-1">Sanctuary Notes</h4>
              <span className="text-[7px] font-bold text-gray-500 uppercase tracking-wider">Auto-Save Engaged</span>
            </div>
            <button onClick={() => setIsJournalOpen(false)} className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition-colors">
              <span className="material-symbols-outlined text-gray-500 text-[14px]">close</span>
            </button>
          </div>

          <div className="flex-1 relative mt-2">
            <div className="absolute top-0 left-0 z-20 flex items-center gap-1.5 bg-white/80 border border-gray-200 px-2 py-1 rounded-lg shadow-sm">
              <span className="text-[8px] font-black text-gray-700 uppercase">{activeBook.name} {activeChapter}</span>
            </div>
            <textarea 
              value={note}
              onChange={(e) => handleTextChange(e.target.value)}
              disabled={loading}
              className="w-full h-full bg-transparent border-none focus:ring-0 text-base md:text-lg font-serif leading-relaxed text-gray-700 placeholder:text-gray-300 resize-none pt-12 disabled:opacity-50" 
              placeholder="What is the Spirit speaking to you through this scripture?..." 
            />
          </div>

          <div className="p-3 bg-gray-50 rounded-lg mb-4 flex items-center justify-between border border-gray-200">
            <div className="flex flex-col">
              <span className="text-[8px] font-black text-gray-700 uppercase tracking-wider">Share Anonymously</span>
              <span className="text-[7px] text-gray-400">Hides name on the Shared Revelations board.</span>
            </div>
            <input 
              type="checkbox" 
              checked={isAnonymousShare} 
              onChange={(e) => setIsAnonymousShare(e.target.checked)}
              className="rounded text-amber-600 focus:ring-amber-500 w-3.5 h-3.5 cursor-pointer"
            />
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button 
              onClick={handleArchiveAndPublish}
              disabled={loading || !note.trim()}
              className="w-full py-3 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-black text-[9px] tracking-wider flex items-center justify-center gap-2 hover:shadow-lg transition-all disabled:opacity-40"
            >
              <span className="material-symbols-outlined text-sm">self_improvement</span>
              {loading ? 'Publishing to Stream...' : 'Archive & Share'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}