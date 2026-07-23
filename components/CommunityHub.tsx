'use client';

import React, { useEffect, useState } from 'react';

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

interface CommunityStreamProps {
  status: string;
}

export function CommunityFellowshipStream({ status }: CommunityStreamProps) {
  const [revelations, setRevelations] = useState<RevelationPost[]>([]);
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [fetchingFeeds, setFetchingFeeds] = useState(true);

  // Fetch Community Revelations and Prayers concurrently
  useEffect(() => {
    if (status !== 'authenticated') return;

    const pullSanctuaryFeeds = async () => {
      setFetchingFeeds(true);
      try {
        const [revelationsRes, prayersRes] = await Promise.all([
          fetch('/api/community/revelations'),
          fetch('/api/intercede')
        ]);

        if (revelationsRes.ok) {
          const revelationsData = await revelationsRes.json();
          setRevelations(revelationsData);
        }
        if (prayersRes.ok) {
          const prayersData = await prayersRes.json();
          setPrayers(prayersData);
        }
      } catch (err) {
        console.error("Failed synchronization with sanctuary streams:", err);
      } finally {
        setFetchingFeeds(false);
      }
    };

    pullSanctuaryFeeds();
  }, [status]);

  // Amen counter dynamic sync trigger
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

  // Stand-in-gap counter dynamic sync trigger
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

  return (
    <div className="pt-4 space-y-6">
      <div className="flex items-center gap-2">
        <span className="material-symbols-outlined text-amber-600 text-xl">workspace_premium</span>
        <h2 className="font-serif italic text-base text-slate-800 font-bold">Sanctuary Fellowship Stream</h2>
      </div>

      {fetchingFeeds ? (
        <div className="flex flex-col items-center justify-center py-12 gap-2 text-slate-400 text-xs bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl shadow-sm">
          <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <span className="font-serif italic">Gathering Fellowship Stream...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          
          {/* Community Shared Reflections / Revelations Block */}
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-amber-800/80 bg-amber-100/60 backdrop-blur-sm px-3 py-1 rounded-md w-fit border border-amber-200/40">
              Latest Reflections
            </p>
            
            {revelations.length === 0 ? (
              <div className="p-8 border border-white/60 rounded-2xl bg-white/40 backdrop-blur-md text-center text-slate-500 text-[11px] tracking-wide italic">
                No recent community reflections found.
              </div>
            ) : (
              revelations.slice(0, 3).map((post) => (
                <div key={post.id} className="p-5 border border-white/60 rounded-2xl bg-white/40 backdrop-blur-md hover:bg-white/60 transition-all duration-300 relative group shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-amber-600 text-sm">menu_book</span>
                      <span className="text-[9px] font-bold uppercase text-amber-800 tracking-wider bg-amber-100/80 border border-amber-200/40 px-2 py-0.5 rounded-full">
                        {post.book} {post.chapter}
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      {post.user.isAnonymous ? 'A Seeking Soul' : post.user.name}
                    </span>
                  </div>
                  <p className="text-slate-700 text-sm leading-relaxed font-serif tracking-wide whitespace-pre-wrap mb-4">
                    "{post.content}"
                  </p>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-200/40">
                    <span className="text-[9px] font-medium text-slate-400">{new Date(post.createdAt).toLocaleDateString()}</span>
                    <button 
                      onClick={() => handleAmenPulse(post.id)}
                      className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg transition-all ${
                        post.hasAmened 
                          ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-md shadow-amber-600/10' 
                          : 'bg-white/60 border border-slate-200/60 text-slate-500 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200/60'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">favorite</span>
                      <span>AMEN {post.amenCount > 0 && `(${post.amenCount})`}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Community Prayer Targets Block */}
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-orange-800/80 bg-orange-100/60 backdrop-blur-sm px-3 py-1 rounded-md w-fit border border-orange-200/40">
              Intercession Loop Requests
            </p>

            {prayers.length === 0 ? (
              <div className="p-8 border border-white/60 rounded-2xl bg-white/40 backdrop-blur-md text-center text-slate-500 text-[11px] tracking-wide italic">
                No active prayer requests shared in the circle.
              </div>
            ) : (
              prayers.slice(0, 3).map((prayer) => (
                <div key={prayer.id} className="p-5 border border-white/60 rounded-2xl bg-white/40 backdrop-blur-md hover:bg-white/60 transition-all duration-300 relative shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full ${prayer.status === 'ANSWERED' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500 animate-pulse'}`} />
                      <span className="text-[8px] font-bold tracking-wider text-slate-400 uppercase">{prayer.status}</span>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      {prayer.user.isAnonymous ? 'Anonymous' : prayer.user.name}
                    </span>
                  </div>
                  <p className="text-slate-700 text-sm font-serif leading-relaxed tracking-wide mb-4">
                    {prayer.content}
                  </p>
                  <div className="flex justify-between items-center pt-3 border-t border-slate-200/40">
                    <span className="text-[9px] font-medium text-slate-400">{new Date(prayer.createdAt).toLocaleDateString()}</span>
                    <button 
                      onClick={() => handleIntercedePulse(prayer.id)}
                      className={`flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg transition-all ${
                        prayer.hasInterceded 
                          ? 'bg-gradient-to-br from-amber-600 to-amber-700 text-white shadow-md shadow-amber-600/10' 
                          : 'bg-white/60 border border-slate-200/60 text-slate-500 hover:bg-amber-50 hover:text-amber-700 hover:border-amber-200/60'
                      }`}
                    >
                      <span className="material-symbols-outlined text-sm">pray</span>
                      <span>{prayer.hasInterceded ? 'Interceding' : 'Stand in Gap'} {prayer.intercessorCount > 0 && `(${prayer.intercessorCount})`}</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      )}
    </div>
  );
}