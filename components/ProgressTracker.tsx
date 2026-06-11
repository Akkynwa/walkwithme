'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function ProgressTracker() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProgress() {
      try {
        const res = await fetch('/api/user/progress');
        if (res.ok) {
          const progressData = await res.json();
          setData(progressData);
        }
      } catch (e) {
        console.error("Failed to load progress parameters:", e);
      } finally {
        setLoading(false);
      }
    }
    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-[1600px] mx-auto">
        {[1, 2, 3].map((n) => (
          <div key={n} className="h-16 bg-gray-100/60 rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-[1600px] mx-auto">
      
      {/* STREAK */}
      <motion.div 
        whileHover={{ y: -1 }}
        className="bg-gradient-to-br from-amber-600 to-orange-600 p-3.5 rounded-xl text-white shadow-sm flex items-center justify-between"
      >
        <div>
          <p className="text-[9px] uppercase font-bold opacity-75 tracking-wider">Devotional Streak</p>
          <h3 className="text-xl font-bold tracking-tight">{data?.streak?.current || 0} Days</h3>
        </div>
        <span className="material-symbols-outlined text-3xl opacity-80">local_fire_department</span>
      </motion.div>

      {/* TOTAL MINUTES */}
      <motion.div 
        whileHover={{ y: -1 }}
        className="bg-white/70 backdrop-blur-md p-3.5 rounded-xl border border-white/60 shadow-xs flex items-center justify-between"
      >
        <div>
          <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Sacred Sanctuary Time</p>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">
            {data?.stats?.totalMinutes || 0} <span className="text-[10px] font-normal text-slate-500">mins</span>
          </h3>
        </div>
        <span className="material-symbols-outlined text-3xl text-amber-600">schedule</span>
      </motion.div>

      {/* MILESTONES */}
      <motion.div 
        whileHover={{ y: -1 }}
        className="bg-white/70 backdrop-blur-md p-3.5 rounded-xl border border-white/60 shadow-xs flex items-center justify-between"
      >
        <div>
          <p className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Milestones Met</p>
          <h3 className="text-xl font-bold text-slate-800 tracking-tight">{data?.completedMilestones?.length || 0} Achievements</h3>
        </div>
        <span className="material-symbols-outlined text-3xl text-emerald-600">military_tech</span>
      </motion.div>

    </div>
  );
}