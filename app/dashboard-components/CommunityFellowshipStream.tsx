'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useTheme } from '../context/ThemeContext';

interface RevelationPost {
  id: string;
  book: string;
  chapter: number;
  content: string;
  userId: string;
  user: { name: string; email: string; isAnonymous: boolean };
  createdAt: string;
  amenCount: number;
  hasAmened: boolean;
}

interface PrayerRequest {
  id: string;
  content: string;
  userId: string;
  user: { name: string; email: string; isAnonymous: boolean };
  createdAt: string;
  intercessorCount: number;
  hasInterceded: boolean;
  status: 'ACTIVE' | 'ANSWERED';
}

interface CommunityStreamProps {
  status: string;
}

export function CommunityFellowshipStream({ status }: CommunityStreamProps) {
  const { data: session } = useSession();
  const { isDark } = useTheme();
  const [revelations, setRevelations] = useState<RevelationPost[]>([]);
  const [prayers, setPrayers] = useState<PrayerRequest[]>([]);
  const [fetchingFeeds, setFetchingFeeds] = useState(true);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  // Keeps tracking instances localized to avoid window propagation collisions
  const activeMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (status !== 'authenticated') return;

    const pullSanctuaryFeeds = async () => {
      setFetchingFeeds(true);
      try {
        const [revelationsRes, prayersRes] = await Promise.all([
          fetch('/api/community/revelations'),
          fetch('/api/intercede')
        ]);

        if (revelationsRes.ok) setRevelations(await revelationsRes.json());
        if (prayersRes.ok) setPrayers(await prayersRes.json());
      } catch (err) {
        console.error("Failed synchronization with sanctuary streams:", err);
      } finally {
        setFetchingFeeds(false);
      }
    };

    pullSanctuaryFeeds();
  }, [status]);

  // Robust target verification for outside click handling
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (activeMenuRef.current && !activeMenuRef.current.contains(event.target as Node)) {
        setActiveMenuId(null);
      }
    };

    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  const handleAmenPulse = async (id: string) => {
    setRevelations(prev => prev.map(item => item.id === id ? {
      ...item,
      amenCount: item.hasAmened ? item.amenCount - 1 : item.amenCount + 1,
      hasAmened: !item.hasAmened
    } : item));
    try {
      await fetch(`/api/community/revelations/amen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ postId: id })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleIntercedePulse = async (id: string) => {
    setPrayers(prev => prev.map(item => item.id === id ? {
      ...item,
      intercessorCount: item.hasInterceded ? item.intercessorCount - 1 : item.intercessorCount + 1,
      hasInterceded: !item.hasInterceded
    } : item));
    try {
      await fetch(`/api/intercede/pulse`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prayerId: id })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async (id: string, type: 'revelation' | 'prayer') => {
    if (!confirm('Are you sure you want to permanently delete this from the Sanctuary stream?')) return;

    if (type === 'revelation') {
      setRevelations(prev => prev.filter(item => item.id !== id));
    } else {
      setPrayers(prev => prev.filter(item => item.id !== id));
    }

    try {
      const endpoint = type === 'revelation' ? `/api/community/revelations/${id}` : `/api/intercede/${id}`;
      await fetch(endpoint, { method: 'DELETE' });
    } catch (err) {
      console.error("Failed to delete item:", err);
    }
  };

  const startEditing = (id: string, currentContent: string) => {
    setEditingItemId(id);
    setEditContent(currentContent);
  };

  const handleSaveEdit = async (id: string, type: 'revelation' | 'prayer') => {
    if (type === 'revelation') {
      setRevelations(prev => prev.map(item => item.id === id ? { ...item, content: editContent } : item));
    } else {
      setPrayers(prev => prev.map(item => item.id === id ? { ...item, content: editContent } : item));
    }
    setEditingItemId(null);

    try {
      const endpoint = type === 'revelation' ? `/api/community/revelations/${id}` : `/api/intercede/${id}`;
      await fetch(endpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent })
      });
    } catch (err) {
      console.error("Failed to save adjustments:", err);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <div className="pt-4 space-y-8">
      <div className={`flex items-center gap-2 pb-2 border-b ${isDark ? 'border-gray-800' : 'border-slate-100'}`}>
        <span className={`material-symbols-outlined text-xl ${isDark ? 'text-amber-400' : 'text-amber-600'}`}>workspace_premium</span>
        <h2 className={`font-serif italic text-base font-bold ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>Sanctuary Fellowship Stream</h2>
      </div>

      {fetchingFeeds ? (
        <div className={`flex flex-col items-center justify-center py-12 gap-2 text-xs rounded-2xl ${
          isDark 
            ? 'bg-black/20 border-white/5 text-gray-500' 
            : 'bg-white/40 border-white/60 text-slate-400'
        } backdrop-blur-md border`}>
          <div className="w-5 h-5 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
          <span className="font-serif italic">Gathering Fellowship Stream...</span>
        </div>
      ) : (
        <div className="space-y-10">
          
          {/* ================= REVELATIONS BLOCK ================= */}
          <div className="space-y-6">
            <p className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-md w-fit border ${
              isDark 
                ? 'text-amber-400 bg-amber-950/40 border-amber-900/30' 
                : 'text-amber-800/80 bg-amber-100/60 border-amber-200/40'
            } backdrop-blur-sm`}>
              Latest Reflections
            </p>
            
            {revelations.length === 0 ? (
              <div className={`p-8 text-center text-[11px] italic ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>No recent reflections.</div>
            ) : (
              revelations.map((post) => {
                const isMyPost = session?.user?.email === post.user?.email || session?.user?.name === post.user?.name;
                const isMenuOpen = activeMenuId === post.id;

                return (
                  <div key={post.id} className="group max-w-2xl transition-all duration-300 relative">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center border font-bold text-xs uppercase ${
                          isDark 
                            ? 'from-amber-950 to-gray-800 border-gray-700 text-amber-400 bg-gradient-to-tr' 
                            : 'from-amber-100 to-orange-100 border-slate-200/60 text-amber-800 bg-gradient-to-tr'
                        }`}>
                          {post.user?.isAnonymous ? 'SS' : post.user?.name?.slice(0, 2)}
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className={`text-xs font-semibold ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>
                            {post.user?.isAnonymous ? 'A Seeking Soul' : post.user?.name}
                          </span>
                          <span className="text-[11px] text-slate-400">•</span>
                          <span className="text-[11px] text-slate-400">{formatTimeAgo(post.createdAt)}</span>
                        </div>
                      </div>

                      {/* Explicitly managed contextual node wrapper */}
                      <div 
                        ref={isMenuOpen ? activeMenuRef : null}
                        className="relative" 
                        onClick={(e) => e.nativeEvent.stopImmediatePropagation()}
                      >
                        <button 
                          onClick={() => setActiveMenuId(isMenuOpen ? null : post.id)}
                          className={`p-1 rounded-full transition-all ${
                            isDark 
                              ? 'text-slate-400 hover:text-gray-300 hover:bg-white/5' 
                              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <span className="material-symbols-outlined text-lg">more_horiz</span>
                        </button>

                        {isMenuOpen && (
                          <div className={`absolute right-0 mt-1 w-36 rounded-xl shadow-xl z-30 py-1.5 border ${
                            isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-slate-200'
                          }`}>
                            {isMyPost ? (
                              <>
                                <button 
                                  onClick={() => { startEditing(post.id, post.content); setActiveMenuId(null); }}
                                  className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center gap-2 ${
                                    isDark ? 'text-gray-300 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50'
                                  }`}
                                >
                                  <span className="material-symbols-outlined text-sm">edit</span> Edit Post
                                </button>
                                <button 
                                  onClick={() => { handleDeletePost(post.id, 'revelation'); setActiveMenuId(null); }}
                                  className={`w-full text-left px-3 py-2 text-xs font-medium text-red-600 flex items-center gap-2 border-t ${
                                    isDark ? 'border-gray-800 hover:bg-red-950/20' : 'border-slate-100 hover:bg-red-50'
                                  }`}
                                >
                                  <span className="material-symbols-outlined text-sm text-red-600">delete</span> Delete
                                </button>
                              </>
                            ) : (
                              <button className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center gap-2 ${
                                isDark ? 'text-gray-500 hover:bg-white/5' : 'text-slate-500 hover:bg-slate-50'
                              }`}>
                                <span className="material-symbols-outlined text-sm">flag</span> Report Post
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl border transition-all duration-200 ${
                      isDark 
                        ? 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06]' 
                        : 'bg-slate-50 border-slate-200/60 hover:bg-slate-100/60'
                    }`}>
                      <div className="flex items-center gap-1.5 mb-2.5">
                        <span className="material-symbols-outlined text-amber-600 text-sm">menu_book</span>
                        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          isDark 
                            ? 'text-amber-400 bg-amber-950/60 border-amber-900/40' 
                            : 'text-amber-800 bg-amber-100/80 border-amber-200/40'
                        }`}>
                          {post.book} {post.chapter}
                        </span>
                      </div>
                      
                      {editingItemId === post.id ? (
                        <div className="space-y-2 mt-1">
                          <textarea 
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className={`w-full p-2 text-sm font-serif rounded-lg border focus:outline-none ${
                              isDark 
                                ? 'text-gray-100 bg-gray-900 border-amber-500' 
                                : 'text-slate-800 bg-white border-amber-500'
                            }`}
                            rows={3}
                          />
                          <div className="flex justify-end gap-1.5">
                            <button onClick={() => setEditingItemId(null)} className={`px-2.5 py-1 text-[10px] rounded-md font-medium ${
                              isDark 
                                ? 'text-gray-400 bg-white/10 hover:bg-white/20' 
                                : 'text-slate-500 bg-slate-200 hover:bg-slate-300'
                            }`}>Cancel</button>
                            <button onClick={() => handleSaveEdit(post.id, 'revelation')} className="px-2.5 py-1 text-[10px] text-white bg-amber-600 rounded-md font-medium hover:bg-amber-700">Save</button>
                          </div>
                        </div>
                      ) : (
                        <p className={`text-sm font-serif leading-relaxed line-clamp-3 ${isDark ? 'text-gray-400' : 'text-slate-600'}`}>
                          "{post.content}"
                        </p>
                      )}
                      
                      <span className={`text-[10px] block mt-3 font-serif italic ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>— {post.user?.isAnonymous ? 'Seeking Soul' : post.user?.name}</span>
                    </div>

                    <div className={`flex items-center gap-5 pt-3 pl-1 border-b pb-5 ${isDark ? 'border-gray-800/60' : 'border-slate-100'}`}>
                      <button onClick={() => handleAmenPulse(post.id)} className={`flex items-center gap-1 text-[11px] font-medium ${post.hasAmened ? 'text-amber-600 font-bold' : 'text-slate-400 hover:text-amber-600'}`}>
                        <span className="material-symbols-outlined text-base">favorite</span>
                        <span>{post.amenCount > 0 ? post.amenCount : 'Amen'}</span>
                      </button>
                      <button className={`flex items-center gap-1 text-[11px] font-medium transition-colors ${
                        isDark ? 'text-slate-400 hover:text-gray-300' : 'text-slate-400 hover:text-slate-600'
                      }`}>
                        <span className="material-symbols-outlined text-base">chat_bubble</span> Reply
                      </button>
                      <button className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                        <span className="material-symbols-outlined text-base">sync</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* ================= PRAYERS BLOCK ================= */}
          <div className="space-y-6">
            <p className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-md w-fit border ${
              isDark 
                ? 'text-orange-400 bg-orange-950/40 border-orange-900/30' 
                : 'text-orange-800/80 bg-orange-100/60 border-orange-200/40'
            } backdrop-blur-sm`}>
              Intercession Loop Requests
            </p>

            {prayers.length === 0 ? (
              <div className={`p-8 text-center text-[11px] italic ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>No active requests circle.</div>
            ) : (
              prayers.map((prayer) => {
                const isMyPrayer = session?.user?.email === prayer.user?.email || session?.user?.name === prayer.user?.name;
                const isMenuOpen = activeMenuId === prayer.id;

                return (
                  <div key={prayer.id} className="group max-w-2xl transition-all duration-300 relative">
                    <div className="flex items-center justify-between mb-2.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full flex items-center justify-center border font-bold text-xs uppercase ${
                          isDark 
                            ? 'from-orange-950 to-gray-800 border-gray-700 text-orange-400 bg-gradient-to-tr' 
                            : 'from-orange-100 to-red-100 border-slate-200/60 text-orange-800 bg-gradient-to-tr'
                        }`}>
                          {prayer.user?.isAnonymous ? 'AN' : prayer.user?.name?.slice(0, 2)}
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className={`text-xs font-semibold ${isDark ? 'text-gray-200' : 'text-slate-800'}`}>
                            {prayer.user?.isAnonymous ? 'Anonymous Intercessor' : prayer.user?.name}
                          </span>
                          <span className="text-[11px] text-slate-400">•</span>
                          <span className="text-[11px] text-slate-400">{formatTimeAgo(prayer.createdAt)}</span>
                        </div>
                      </div>

                      <div 
                        ref={isMenuOpen ? activeMenuRef : null}
                        className="relative" 
                        onClick={(e) => e.nativeEvent.stopImmediatePropagation()}
                      >
                        <button 
                          onClick={() => setActiveMenuId(isMenuOpen ? null : prayer.id)}
                          className={`p-1 rounded-full transition-all ${
                            isDark 
                              ? 'text-slate-400 hover:text-gray-300 hover:bg-white/5' 
                              : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <span className="material-symbols-outlined text-lg">more_horiz</span>
                        </button>

                        {isMenuOpen && (
                          <div className={`absolute right-0 mt-1 w-36 rounded-xl shadow-xl z-30 py-1.5 border ${
                            isDark ? 'bg-gray-900 border-gray-800' : 'bg-white border-slate-200'
                          }`}>
                            {isMyPrayer ? (
                              <>
                                <button 
                                  onClick={() => { startEditing(prayer.id, prayer.content); setActiveMenuId(null); }}
                                  className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center gap-2 ${
                                    isDark ? 'text-gray-300 hover:bg-white/5' : 'text-slate-700 hover:bg-slate-50'
                                  }`}
                                >
                                  <span className="material-symbols-outlined text-sm">edit</span> Edit Request
                                </button>
                                <button 
                                  onClick={() => { handleDeletePost(prayer.id, 'prayer'); setActiveMenuId(null); }}
                                  className={`w-full text-left px-3 py-2 text-xs font-medium text-red-600 flex items-center gap-2 border-t ${
                                    isDark ? 'border-gray-800 hover:bg-red-950/20' : 'border-slate-100 hover:bg-red-50'
                                  }`}
                                >
                                  <span className="material-symbols-outlined text-sm text-red-600">delete</span> Delete
                                </button>
                              </>
                            ) : (
                              <button className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center gap-2 ${
                                isDark ? 'text-gray-500 hover:bg-white/5' : 'text-slate-500 hover:bg-slate-50'
                              }`}>
                                <span className="material-symbols-outlined text-sm">flag</span> Report
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className={`p-4 rounded-xl border transition-all duration-200 ${
                      isDark 
                        ? 'bg-white/[0.03] border-white/5 hover:bg-white/[0.06]' 
                        : 'bg-slate-50 border-slate-200/60 hover:bg-slate-100/60'
                    }`}>
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${prayer.status === 'ANSWERED' ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'}`} />
                        <span className={`text-[8px] font-bold tracking-wider uppercase ${isDark ? 'text-gray-500' : 'text-slate-400'}`}>{prayer.status}</span>
                      </div>

                      {editingItemId === prayer.id ? (
                        <div className="space-y-2 mt-1">
                          <textarea 
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className={`w-full p-2 text-sm font-serif rounded-lg border focus:outline-none ${
                              isDark 
                                ? 'text-gray-100 bg-gray-900 border-amber-500' 
                                : 'text-slate-800 bg-white border-amber-500'
                            }`}
                            rows={3}
                          />
                          <div className="flex justify-end gap-1.5">
                            <button onClick={() => setEditingItemId(null)} className={`px-2.5 py-1 text-[10px] rounded-md font-medium ${
                              isDark 
                                ? 'text-gray-400 bg-white/10 hover:bg-white/20' 
                                : 'text-slate-500 bg-slate-200 hover:bg-slate-300'
                            }`}>Cancel</button>
                            <button onClick={() => handleSaveEdit(prayer.id, 'prayer')} className="px-2.5 py-1 text-[10px] text-white bg-amber-600 rounded-md font-medium hover:bg-amber-700">Save</button>
                          </div>
                        </div>
                      ) : (
                        <p className={`text-sm font-serif leading-relaxed line-clamp-3 ${isDark ? 'text-gray-400' : 'text-slate-700'}`}>
                          {prayer.content}
                        </p>
                      )}
                    </div>

                    <div className={`flex items-center gap-5 pt-3 pl-1 border-b pb-5 ${isDark ? 'border-gray-800/60' : 'border-slate-100'}`}>
                      <button onClick={() => handleIntercedePulse(prayer.id)} className={`flex items-center gap-1 text-[11px] font-medium ${prayer.hasInterceded ? 'text-amber-600 font-bold' : 'text-slate-400 hover:text-amber-600'}`}>
                        <span className="material-symbols-outlined text-base">front_hand</span>
                        <span>{prayer.intercessorCount > 0 ? prayer.intercessorCount : 'Stand in Gap'}</span>
                      </button>
                      <button className={`flex items-center gap-1 text-[11px] font-medium transition-colors ${
                        isDark ? 'text-slate-400 hover:text-gray-300' : 'text-slate-400 hover:text-slate-600'
                      }`}>
                        <span className="material-symbols-outlined text-base">chat_bubble</span> Support
                      </button>
                      <button className="flex items-center gap-1 text-[11px] font-medium text-slate-400">
                        <span className="material-symbols-outlined text-base">sync</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}
    </div>
  );
}