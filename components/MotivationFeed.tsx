'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function MotivationFeed() {
  const [shares, setShares] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFeed() {
      try {
        const res = await fetch('/api/community/shares');
        if (res.ok) {
          const data = await res.json();
          setShares(data);
        }
      } catch (e) {
        console.error("Failed fetching mutual support feeds:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchFeed();
  }, []);

  if (loading) {
    return (
      <div className="space-y-2">
        {[1, 2].map((n) => (
          <div key={n} className="h-20 bg-gray-100/50 rounded-xl animate-pulse border border-gray-100" />
        ))}
      </div>
    );
  }

  if (shares.length === 0) {
    return (
      <p className="text-[11px] font-serif italic text-gray-400 text-center py-4">
        Silence reigns here. Be the first to share a moment of victory!
      </p>
    );
  }

  return (
    <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1 custom-scrollbar">
      <AnimatePresence mode="popLayout">
        {shares.map((share) => (
          <MotivationFeedCard key={share.id} share={share} />
        ))}
      </AnimatePresence>
    </div>
  );
}

export function MotivationFeedCard({ share }: { share: any }) {
  const [amens, setAmens] = useState(share.amens?.length || 0);
  const [hasAmened, setHasAmened] = useState(false);

  const handleAmen = async () => {
    if (hasAmened) return;
    setHasAmened(true);
    setAmens((prev: number) => prev + 1);
    
    try {
      await fetch(`/api/community/share/${share.id}/amen`, { method: 'POST' });
    } catch (e) {
      console.error("Could not register Amen:", e);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="bg-white/70 backdrop-blur-sm p-3 rounded-xl border border-amber-100/40 shadow-xs transition-all hover:border-amber-200/60"
    >
      <div className="flex items-center gap-2 mb-1.5">
        <div className="w-5 h-5 bg-gradient-to-br from-amber-500 to-orange-600 text-white text-[9px] font-bold rounded-md flex items-center justify-center uppercase shadow-xs">
          {share.user?.name?.[0] || 'S'}
        </div>
        <div>
          <h4 className="text-[11px] font-semibold text-slate-700 leading-tight">{share.user?.name || "A Companion"}</h4>
          <p className="text-[8px] text-amber-600/70 font-medium">Completed Quiet Time</p>
        </div>
      </div>
      
      <p className="text-[11px] text-gray-600 leading-normal bg-amber-50/20 p-2 rounded-lg border border-amber-50/50 mb-2 font-serif italic">
        "{share.content}"
      </p>

      <button 
        onClick={handleAmen}
        disabled={hasAmened}
        className={`flex items-center gap-1.5 text-[10px] font-medium px-2 py-1 rounded-md transition-all ${
          hasAmened 
            ? 'bg-amber-100 text-amber-800 font-bold' 
            : 'bg-slate-50 text-slate-500 hover:bg-amber-50 hover:text-amber-600'
        }`}
      >
        <span className="material-symbols-outlined text-xs">front_hand</span>
        <span>{amens} {amens === 1 ? 'Amen' : 'Amens'}</span>
      </button>
    </motion.div>
  );
}