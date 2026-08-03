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
    if (!confirm('Are you sure you want to permanently delete this entry?')) return;

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
    <div className="w-full max-w-xl mx-auto space-y-8">
      {/* Stream Header */}
      <div className={`flex items-center gap-2 pb-3 border-b ${isDark ? 'border-zinc-800' : 'border-slate-200'}`}>
        <span className="material-symbols-outlined text-lg text-[#FF6221]">workspace_premium</span>
        <h2 className={`text-sm font-bold tracking-wide ${isDark ? 'text-zinc-200' : 'text-slate-800'}`}>
          Sanctuary Fellowship Stream
        </h2>
      </div>

      {fetchingFeeds ? (
        <div className={`flex flex-col items-center justify-center py-16 gap-3 rounded-2xl border ${
          isDark ? 'bg-zinc-900/40 border-zinc-800 text-zinc-500' : 'bg-slate-50 border-slate-200 text-slate-400'
        }`}>
          <div className="w-5 h-5 border-2 border-[#FF6221] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-medium">Gathering Fellowship Stream...</span>
        </div>
      ) : (
        <div className="space-y-10">
          
          {/* ================= REVELATIONS BLOCK ================= */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                isDark ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' : 'text-amber-700 bg-amber-50 border-amber-200'
              }`}>
                Latest Reflections
              </span>
            </div>

            {revelations.length === 0 ? (
              <div className={`p-8 text-center text-xs italic ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>
                No recent reflections shared.
              </div>
            ) : (
              <div className={`divide-y rounded-2xl border overflow-hidden ${
                isDark ? 'divide-zinc-800/80 border-zinc-800 bg-black/40' : 'divide-slate-100 border-slate-200 bg-white'
              }`}>
                {revelations.map((post) => {
                  const isMyPost = session?.user?.email === post.user?.email || session?.user?.name === post.user?.name;
                  const isMenuOpen = activeMenuId === post.id;

                  return (
                    <article key={post.id} className="p-4 transition-colors hover:bg-zinc-500/5">
                      <div className="flex gap-3">
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-sm">
                          {post.user?.isAnonymous ? 'SS' : post.user?.name?.slice(0, 2).toUpperCase()}
                        </div>

                        {/* Content Container */}
                        <div className="flex-1 min-w-0">
                          {/* Top Author Line & Menu */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-1.5 truncate">
                              <span className={`text-xs font-bold truncate ${isDark ? 'text-zinc-200' : 'text-slate-900'}`}>
                                {post.user?.isAnonymous ? 'A Seeking Soul' : post.user?.name}
                              </span>
                              <span className={`text-xs ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>•</span>
                              <span className={`text-xs ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                                {formatTimeAgo(post.createdAt)}
                              </span>
                            </div>

                            {/* Options Dropdown Trigger */}
                            <div 
                              ref={isMenuOpen ? activeMenuRef : null}
                              className="relative"
                              onClick={(e) => e.nativeEvent.stopImmediatePropagation()}
                            >
                              <button 
                                onClick={() => setActiveMenuId(isMenuOpen ? null : post.id)}
                                className={`p-1 rounded-full transition-colors ${
                                  isDark ? 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                <span className="material-symbols-outlined text-lg block">more_horiz</span>
                              </button>

                              {isMenuOpen && (
                                <div className={`absolute right-0 mt-1 w-36 rounded-xl shadow-xl z-30 py-1 border ${
                                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
                                }`}>
                                  {isMyPost ? (
                                    <>
                                      <button 
                                        onClick={() => { startEditing(post.id, post.content); setActiveMenuId(null); }}
                                        className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center gap-2 ${
                                          isDark ? 'text-zinc-300 hover:bg-zinc-800' : 'text-slate-700 hover:bg-slate-50'
                                        }`}
                                      >
                                        <span className="material-symbols-outlined text-sm">edit</span> Edit
                                      </button>
                                      <button 
                                        onClick={() => { handleDeletePost(post.id, 'revelation'); setActiveMenuId(null); }}
                                        className={`w-full text-left px-3 py-2 text-xs font-medium text-red-500 flex items-center gap-2 border-t ${
                                          isDark ? 'border-zinc-800 hover:bg-red-950/30' : 'border-slate-100 hover:bg-red-50'
                                        }`}
                                      >
                                        <span className="material-symbols-outlined text-sm">delete</span> Delete
                                      </button>
                                    </>
                                  ) : (
                                    <button className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center gap-2 ${
                                      isDark ? 'text-zinc-400 hover:bg-zinc-800' : 'text-slate-600 hover:bg-slate-50'
                                    }`}>
                                      <span className="material-symbols-outlined text-sm">flag</span> Report
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Verse Badge */}
                          <div className="mt-1 mb-2">
                            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded border ${
                              isDark ? 'text-amber-400 border-amber-500/30 bg-amber-500/10' : 'text-amber-800 border-amber-200 bg-amber-50'
                            }`}>
                              <span className="material-symbols-outlined text-xs">book</span>
                              {post.book} {post.chapter}
                            </span>
                          </div>

                          {/* Content Body */}
                          {editingItemId === post.id ? (
                            <div className="space-y-2 my-2">
                              <textarea 
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className={`w-full p-2.5 text-sm rounded-xl border focus:outline-none ${
                                  isDark ? 'text-zinc-100 bg-zinc-900 border-[#FF6221]' : 'text-slate-800 bg-white border-[#FF6221]'
                                }`}
                                rows={3}
                              />
                              <div className="flex justify-end gap-2">
                                <button onClick={() => setEditingItemId(null)} className={`px-3 py-1 text-xs rounded-full font-medium ${
                                  isDark ? 'text-zinc-400 hover:bg-zinc-800' : 'text-slate-500 hover:bg-slate-100'
                                }`}>Cancel</button>
                                <button onClick={() => handleSaveEdit(post.id, 'revelation')} className="px-3 py-1 text-xs text-white bg-[#FF6221] rounded-full font-bold hover:bg-[#e55318]">Save</button>
                              </div>
                            </div>
                          ) : (
                            <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                              {post.content}
                            </p>
                          )}

                          {/* X-Style Interactive Toolbar */}
                          <div className="flex items-center justify-between pt-3 mt-1 max-w-xs text-zinc-500">
                            <button className="flex items-center gap-1.5 text-xs hover:text-[#FF6221] transition-colors">
                              <span className="material-symbols-outlined text-base">chat_bubble</span>
                            </button>
                            <button className="flex items-center gap-1.5 text-xs hover:text-green-500 transition-colors">
                              <span className="material-symbols-outlined text-base">repeat</span>
                            </button>
                            <button 
                              onClick={() => handleAmenPulse(post.id)}
                              className={`flex items-center gap-1.5 text-xs transition-colors ${
                                post.hasAmened ? 'text-red-500 font-bold' : 'hover:text-red-500'
                              }`}
                            >
                              <span className="material-symbols-outlined text-base">
                                {post.hasAmened ? 'favorite' : 'favorite'}
                              </span>
                              {post.amenCount > 0 && <span>{post.amenCount}</span>}
                            </button>
                          </div>

                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

          {/* ================= PRAYERS BLOCK ================= */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                isDark ? 'text-orange-400 bg-orange-500/10 border-orange-500/20' : 'text-orange-700 bg-orange-50 border-orange-200'
              }`}>
                Intercession Loop Requests
              </span>
            </div>

            {prayers.length === 0 ? (
              <div className={`p-8 text-center text-xs italic ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>
                No active prayer requests.
              </div>
            ) : (
              <div className={`divide-y rounded-2xl border overflow-hidden ${
                isDark ? 'divide-zinc-800/80 border-zinc-800 bg-black/40' : 'divide-slate-100 border-slate-200 bg-white'
              }`}>
                {prayers.map((prayer) => {
                  const isMyPrayer = session?.user?.email === prayer.user?.email || session?.user?.name === prayer.user?.name;
                  const isMenuOpen = activeMenuId === prayer.id;

                  return (
                    <article key={prayer.id} className="p-4 transition-colors hover:bg-zinc-500/5">
                      <div className="flex gap-3">
                        {/* Avatar */}
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-orange-500 to-red-500 flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-sm">
                          {prayer.user?.isAnonymous ? 'AN' : prayer.user?.name?.slice(0, 2).toUpperCase()}
                        </div>

                        {/* Content Container */}
                        <div className="flex-1 min-w-0">
                          {/* Top Author Line & Status */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-baseline gap-1.5 truncate">
                              <span className={`text-xs font-bold truncate ${isDark ? 'text-zinc-200' : 'text-slate-900'}`}>
                                {prayer.user?.isAnonymous ? 'Anonymous Intercessor' : prayer.user?.name}
                              </span>
                              <span className={`text-xs ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>•</span>
                              <span className={`text-xs ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                                {formatTimeAgo(prayer.createdAt)}
                              </span>
                            </div>

                            {/* Options Dropdown Trigger */}
                            <div 
                              ref={isMenuOpen ? activeMenuRef : null}
                              className="relative"
                              onClick={(e) => e.nativeEvent.stopImmediatePropagation()}
                            >
                              <button 
                                onClick={() => setActiveMenuId(isMenuOpen ? null : prayer.id)}
                                className={`p-1 rounded-full transition-colors ${
                                  isDark ? 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                <span className="material-symbols-outlined text-lg block">more_horiz</span>
                              </button>

                              {isMenuOpen && (
                                <div className={`absolute right-0 mt-1 w-36 rounded-xl shadow-xl z-30 py-1 border ${
                                  isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-slate-200'
                                }`}>
                                  {isMyPrayer ? (
                                    <>
                                      <button 
                                        onClick={() => { startEditing(prayer.id, prayer.content); setActiveMenuId(null); }}
                                        className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center gap-2 ${
                                          isDark ? 'text-zinc-300 hover:bg-zinc-800' : 'text-slate-700 hover:bg-slate-50'
                                        }`}
                                      >
                                        <span className="material-symbols-outlined text-sm">edit</span> Edit
                                      </button>
                                      <button 
                                        onClick={() => { handleDeletePost(prayer.id, 'prayer'); setActiveMenuId(null); }}
                                        className={`w-full text-left px-3 py-2 text-xs font-medium text-red-500 flex items-center gap-2 border-t ${
                                          isDark ? 'border-zinc-800 hover:bg-red-950/30' : 'border-slate-100 hover:bg-red-50'
                                        }`}
                                      >
                                        <span className="material-symbols-outlined text-sm">delete</span> Delete
                                      </button>
                                    </>
                                  ) : (
                                    <button className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center gap-2 ${
                                      isDark ? 'text-zinc-400 hover:bg-zinc-800' : 'text-slate-600 hover:bg-slate-50'
                                    }`}>
                                      <span className="material-symbols-outlined text-sm">flag</span> Report
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Status Indicator Pill */}
                          <div className="mt-1 mb-2 flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${prayer.status === 'ANSWERED' ? 'bg-emerald-500' : 'bg-[#FF6221] animate-pulse'}`} />
                            <span className={`text-[10px] font-bold tracking-wider uppercase ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                              {prayer.status}
                            </span>
                          </div>

                          {/* Content Body */}
                          {editingItemId === prayer.id ? (
                            <div className="space-y-2 my-2">
                              <textarea 
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className={`w-full p-2.5 text-sm rounded-xl border focus:outline-none ${
                                  isDark ? 'text-zinc-100 bg-zinc-900 border-[#FF6221]' : 'text-slate-800 bg-white border-[#FF6221]'
                                }`}
                                rows={3}
                              />
                              <div className="flex justify-end gap-2">
                                <button onClick={() => setEditingItemId(null)} className={`px-3 py-1 text-xs rounded-full font-medium ${
                                  isDark ? 'text-zinc-400 hover:bg-zinc-800' : 'text-slate-500 hover:bg-slate-100'
                                }`}>Cancel</button>
                                <button onClick={() => handleSaveEdit(prayer.id, 'prayer')} className="px-3 py-1 text-xs text-white bg-[#FF6221] rounded-full font-bold hover:bg-[#e55318]">Save</button>
                              </div>
                            </div>
                          ) : (
                            <p className={`text-sm leading-relaxed ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                              {prayer.content}
                            </p>
                          )}

                          {/* Interactive Gap-Standing Action Row */}
                          <div className="flex items-center justify-between pt-3 mt-1 max-w-xs text-zinc-500">
                            <button 
                              onClick={() => handleIntercedePulse(prayer.id)}
                              className={`flex items-center gap-1.5 text-xs transition-colors ${
                                prayer.hasInterceded ? 'text-[#FF6221] font-bold' : 'hover:text-[#FF6221]'
                              }`}
                            >
                              <span className="material-symbols-outlined text-base">front_hand</span>
                              <span>{prayer.intercessorCount > 0 ? prayer.intercessorCount : 'Stand in Gap'}</span>
                            </button>
                            <button className="flex items-center gap-1.5 text-xs hover:text-[#FF6221] transition-colors">
                              <span className="material-symbols-outlined text-base">chat_bubble</span>
                            </button>
                            <button className="flex items-center gap-1.5 text-xs hover:text-green-500 transition-colors">
                              <span className="material-symbols-outlined text-base">repeat</span>
                            </button>
                          </div>

                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}