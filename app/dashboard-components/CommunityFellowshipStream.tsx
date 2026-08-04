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
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Stream Header */}
      <div className={`flex items-center gap-2.5 pb-4 border-b ${isDark ? 'border-zinc-800/60' : 'border-slate-200/60'}`}>
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-sm shadow-amber-500/20">
          <span className="text-white text-sm font-bold">⛪</span>
        </div>
        <h2 className={`text-sm font-semibold tracking-tight ${isDark ? 'text-zinc-100' : 'text-slate-800'}`}>
          Sanctuary Fellowship
        </h2>
        <span className={`ml-auto text-[10px] font-medium px-2 py-0.5 rounded-full ${isDark ? 'bg-zinc-800 text-zinc-400' : 'bg-slate-100 text-slate-500'}`}>
          Live
        </span>
      </div>

      {fetchingFeeds ? (
        <div className={`flex flex-col items-center justify-center py-20 gap-3 rounded-2xl ${isDark ? 'bg-zinc-900/30' : 'bg-slate-50/50'}`}>
          <div className="w-6 h-6 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className={`text-xs font-medium ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>Loading fellowship stream...</span>
        </div>
      ) : (
        <div className="space-y-8">
          
          {/* ================= REVELATIONS BLOCK ================= */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${isDark ? 'text-amber-400 bg-amber-500/10' : 'text-amber-700 bg-amber-50'}`}>
                Reflections
              </span>
              <span className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                • {revelations.length} {revelations.length === 1 ? 'post' : 'posts'}
              </span>
            </div>

            {revelations.length === 0 ? (
              <div className={`py-12 text-center ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>
                <p className="text-xs">No reflections shared yet</p>
                <p className="text-[10px] mt-0.5 opacity-60">Be the first to share</p>
              </div>
            ) : (
              <div className={`space-y-3`}>
                {revelations.map((post) => {
                  const isMyPost = session?.user?.email === post.user?.email || session?.user?.name === post.user?.name;
                  const isMenuOpen = activeMenuId === post.id;

                  return (
                    <article 
                      key={post.id} 
                      className={`group p-4 rounded-xl transition-all duration-200 ${
                        isDark 
                          ? 'bg-zinc-900/40 hover:bg-zinc-900/70 border border-zinc-800/50' 
                          : 'bg-white hover:bg-slate-50/80 border border-slate-200/60'
                      }`}
                    >
                      <div className="flex gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-sm shadow-amber-500/10">
                          {post.user?.isAnonymous ? '✝' : post.user?.name?.slice(0, 2).toUpperCase()}
                        </div>

                        {/* Content Container */}
                        <div className="flex-1 min-w-0">
                          {/* Top Row */}
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-semibold truncate ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                              {post.user?.isAnonymous ? 'Seeking Soul' : post.user?.name}
                            </span>
                            <span className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>•</span>
                            <span className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                              {formatTimeAgo(post.createdAt)}
                            </span>

                            {/* Verse Badge - moved to inline */}
                            <span className={`ml-auto text-[9px] font-medium px-2 py-0.5 rounded-full ${isDark ? 'text-amber-400 bg-amber-500/10' : 'text-amber-700 bg-amber-50'}`}>
                              {post.book} {post.chapter}
                            </span>

                            {/* Menu Button */}
                            <div 
                              ref={isMenuOpen ? activeMenuRef : null}
                              className="relative shrink-0"
                              onClick={(e) => e.nativeEvent.stopImmediatePropagation()}
                            >
                              <button 
                                onClick={() => setActiveMenuId(isMenuOpen ? null : post.id)}
                                className={`p-1 rounded-md transition-all ${
                                  isDark 
                                    ? 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800' 
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                              </button>

                              {isMenuOpen && (
                                <div className={`absolute right-0 mt-1 w-40 rounded-lg shadow-2xl z-30 py-1 border ${
                                  isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-slate-200'
                                }`}>
                                  {isMyPost ? (
                                    <>
                                      <button 
                                        onClick={() => { startEditing(post.id, post.content); setActiveMenuId(null); }}
                                        className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center gap-2 ${
                                          isDark ? 'text-zinc-300 hover:bg-zinc-800' : 'text-slate-700 hover:bg-slate-50'
                                        }`}
                                      >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                      </button>
                                      <button 
                                        onClick={() => { handleDeletePost(post.id, 'revelation'); setActiveMenuId(null); }}
                                        className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center gap-2 border-t ${
                                          isDark 
                                            ? 'text-red-400 border-zinc-800 hover:bg-red-950/30' 
                                            : 'text-red-500 border-slate-100 hover:bg-red-50'
                                        }`}
                                      >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete
                                      </button>
                                    </>
                                  ) : (
                                    <button className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center gap-2 ${
                                      isDark ? 'text-zinc-400 hover:bg-zinc-800' : 'text-slate-600 hover:bg-slate-50'
                                    }`}>
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                      </svg>
                                      Report
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Content Body */}
                          {editingItemId === post.id ? (
                            <div className="space-y-2 mt-2">
                              <textarea 
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className={`w-full p-2.5 text-sm rounded-lg border-2 focus:outline-none ${
                                  isDark ? 'text-zinc-100 bg-zinc-800 border-amber-500/50' : 'text-slate-800 bg-white border-amber-400'
                                }`}
                                rows={3}
                                autoFocus
                              />
                              <div className="flex justify-end gap-1.5">
                                <button onClick={() => setEditingItemId(null)} className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
                                  isDark ? 'text-zinc-400 hover:bg-zinc-800' : 'text-slate-500 hover:bg-slate-100'
                                }`}>Cancel</button>
                                <button onClick={() => handleSaveEdit(post.id, 'revelation')} className="px-3 py-1 text-xs text-white bg-amber-500 rounded-lg font-semibold hover:bg-amber-600 transition shadow-sm shadow-amber-500/25">Save</button>
                              </div>
                            </div>
                          ) : (
                            <p className={`text-sm leading-relaxed mt-1 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                              {post.content}
                            </p>
                          )}

                          {/* Action Bar - All icons to the right */}
                          <div className="flex items-center justify-end gap-5 mt-3 pt-3 border-t border-zinc-800/20">
                            <button className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                              isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-400 hover:text-slate-600'
                            }`}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              <span>Reply</span>
                            </button>
                            
                            <button className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                              isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-400 hover:text-slate-600'
                            }`}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                              </svg>
                              <span>Share</span>
                            </button>

                            <button 
                              onClick={() => handleAmenPulse(post.id)}
                              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                                post.hasAmened 
                                  ? 'text-rose-500' 
                                  : isDark ? 'text-zinc-500 hover:text-rose-400' : 'text-slate-400 hover:text-rose-500'
                              }`}
                            >
                              <svg className="w-4 h-4" fill={post.hasAmened ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                              </svg>
                              <span>Amen {post.amenCount > 0 && `(${post.amenCount})`}</span>
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
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full ${isDark ? 'text-orange-400 bg-orange-500/10' : 'text-orange-700 bg-orange-50'}`}>
                Prayer Requests
              </span>
              <span className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                • {prayers.length} {prayers.length === 1 ? 'request' : 'requests'}
              </span>
            </div>

            {prayers.length === 0 ? (
              <div className={`py-12 text-center ${isDark ? 'text-zinc-600' : 'text-slate-400'}`}>
                <p className="text-xs">No prayer requests</p>
                <p className="text-[10px] mt-0.5 opacity-60">Share your prayer need</p>
              </div>
            ) : (
              <div className={`space-y-3`}>
                {prayers.map((prayer) => {
                  const isMyPrayer = session?.user?.email === prayer.user?.email || session?.user?.name === prayer.user?.name;
                  const isMenuOpen = activeMenuId === prayer.id;

                  return (
                    <article 
                      key={prayer.id} 
                      className={`group p-4 rounded-xl transition-all duration-200 ${
                        isDark 
                          ? 'bg-zinc-900/40 hover:bg-zinc-900/70 border border-zinc-800/50' 
                          : 'bg-white hover:bg-slate-50/80 border border-slate-200/60'
                      } ${prayer.status === 'ANSWERED' ? (isDark ? 'border-emerald-500/20' : 'border-emerald-200') : ''}`}
                    >
                      <div className="flex gap-3">
                        {/* Avatar */}
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center shrink-0 text-white font-bold text-xs shadow-sm shadow-orange-500/10">
                          {prayer.user?.isAnonymous ? '🙏' : prayer.user?.name?.slice(0, 2).toUpperCase()}
                        </div>

                        {/* Content Container */}
                        <div className="flex-1 min-w-0">
                          {/* Top Row */}
                          <div className="flex items-center gap-2">
                            <span className={`text-sm font-semibold truncate ${isDark ? 'text-zinc-100' : 'text-slate-900'}`}>
                              {prayer.user?.isAnonymous ? 'Anonymous' : prayer.user?.name}
                            </span>
                            <span className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>•</span>
                            <span className={`text-[10px] ${isDark ? 'text-zinc-500' : 'text-slate-400'}`}>
                              {formatTimeAgo(prayer.createdAt)}
                            </span>

                            {/* Status Badge */}
                            <span className={`ml-auto text-[9px] font-medium px-2 py-0.5 rounded-full ${
                              prayer.status === 'ANSWERED' 
                                ? (isDark ? 'text-emerald-400 bg-emerald-500/10' : 'text-emerald-700 bg-emerald-50') 
                                : (isDark ? 'text-orange-400 bg-orange-500/10' : 'text-orange-700 bg-orange-50')
                            }`}>
                              {prayer.status}
                            </span>

                            {/* Menu Button */}
                            <div 
                              ref={isMenuOpen ? activeMenuRef : null}
                              className="relative shrink-0"
                              onClick={(e) => e.nativeEvent.stopImmediatePropagation()}
                            >
                              <button 
                                onClick={() => setActiveMenuId(isMenuOpen ? null : prayer.id)}
                                className={`p-1 rounded-md transition-all ${
                                  isDark 
                                    ? 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800' 
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                                }`}
                              >
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                </svg>
                              </button>

                              {isMenuOpen && (
                                <div className={`absolute right-0 mt-1 w-40 rounded-lg shadow-2xl z-30 py-1 border ${
                                  isDark ? 'bg-zinc-900 border-zinc-700' : 'bg-white border-slate-200'
                                }`}>
                                  {isMyPrayer ? (
                                    <>
                                      <button 
                                        onClick={() => { startEditing(prayer.id, prayer.content); setActiveMenuId(null); }}
                                        className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center gap-2 ${
                                          isDark ? 'text-zinc-300 hover:bg-zinc-800' : 'text-slate-700 hover:bg-slate-50'
                                        }`}
                                      >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                      </button>
                                      <button 
                                        onClick={() => { handleDeletePost(prayer.id, 'prayer'); setActiveMenuId(null); }}
                                        className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center gap-2 border-t ${
                                          isDark 
                                            ? 'text-red-400 border-zinc-800 hover:bg-red-950/30' 
                                            : 'text-red-500 border-slate-100 hover:bg-red-50'
                                        }`}
                                      >
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete
                                      </button>
                                    </>
                                  ) : (
                                    <button className={`w-full text-left px-4 py-2 text-xs font-medium flex items-center gap-2 ${
                                      isDark ? 'text-zinc-400 hover:bg-zinc-800' : 'text-slate-600 hover:bg-slate-50'
                                    }`}>
                                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                      </svg>
                                      Report
                                    </button>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Content Body */}
                          {editingItemId === prayer.id ? (
                            <div className="space-y-2 mt-2">
                              <textarea 
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                className={`w-full p-2.5 text-sm rounded-lg border-2 focus:outline-none ${
                                  isDark ? 'text-zinc-100 bg-zinc-800 border-orange-500/50' : 'text-slate-800 bg-white border-orange-400'
                                }`}
                                rows={3}
                                autoFocus
                              />
                              <div className="flex justify-end gap-1.5">
                                <button onClick={() => setEditingItemId(null)} className={`px-3 py-1 text-xs rounded-lg font-medium transition ${
                                  isDark ? 'text-zinc-400 hover:bg-zinc-800' : 'text-slate-500 hover:bg-slate-100'
                                }`}>Cancel</button>
                                <button onClick={() => handleSaveEdit(prayer.id, 'prayer')} className="px-3 py-1 text-xs text-white bg-orange-500 rounded-lg font-semibold hover:bg-orange-600 transition shadow-sm shadow-orange-500/25">Save</button>
                              </div>
                            </div>
                          ) : (
                            <p className={`text-sm leading-relaxed mt-1 ${isDark ? 'text-zinc-300' : 'text-slate-700'}`}>
                              {prayer.content}
                            </p>
                          )}

                          {/* Action Bar - All icons to the right */}
                          <div className="flex items-center justify-end gap-5 mt-3 pt-3 border-t border-zinc-800/20">
                            <button 
                              onClick={() => handleIntercedePulse(prayer.id)}
                              className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                                prayer.hasInterceded 
                                  ? 'text-orange-500' 
                                  : isDark ? 'text-zinc-500 hover:text-orange-400' : 'text-slate-400 hover:text-orange-500'
                              }`}
                            >
                              <svg className="w-4 h-4" fill={prayer.hasInterceded ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <span>Intercede {prayer.intercessorCount > 0 && `(${prayer.intercessorCount})`}</span>
                            </button>

                            <button className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                              isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-400 hover:text-slate-600'
                            }`}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              <span>Reply</span>
                            </button>

                            <button className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
                              isDark ? 'text-zinc-500 hover:text-zinc-300' : 'text-slate-400 hover:text-slate-600'
                            }`}>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                              </svg>
                              <span>Share</span>
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