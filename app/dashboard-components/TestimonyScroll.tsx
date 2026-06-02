'use client';

import React, { useState, useEffect } from 'react';

interface Testimony {
  id: string;
  author: string;
  location: string;
  content: string;
}

export function TestimonyScroll() {
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTestimonies() {
      try {
        const response = await fetch('/api/testimonies');
        const data = await response.json();
        if (data.success) {
          setTestimonies(data.testimonies);
        }
      } catch (error) {
        console.error('Error loading testimonies:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchTestimonies();
  }, []);

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <h3 className="text-[10px] font-black text-[#4d6054] uppercase tracking-[0.2em]">
          Voices of the Sanctuary
        </h3>
        <button className="text-[9px] font-bold text-[#e0a96d] uppercase tracking-widest hover:underline">
          Share your shift
        </button>
      </div>

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          // Sleek pulse skeleton loader while fetching data
          <div className="space-y-3">
            <div className="h-24 w-full bg-white/40 animate-pulse rounded-2xl" />
            <div className="h-24 w-full bg-white/40 animate-pulse rounded-2xl" />
          </div>
        ) : testimonies.length === 0 ? (
          <p className="text-xs text-center text-gray-400 font-serif italic py-4">No reflections shared yet.</p>
        ) : (
          testimonies.map((t) => (
            <div key={t.id} className="bg-white/60 backdrop-blur-sm border border-white p-5 rounded-[24px] shadow-sm hover:shadow-md transition-all">
              <p className="text-sm font-serif italic text-[#434844] leading-relaxed mb-4">
                "{t.content}"
              </p>
              <div className="flex items-center justify-between border-t border-[#4d6054]/5 pt-3">
                <span className="text-[11px] font-bold text-[#161c22]">{t.author}</span>
                <span className="text-[9px] text-[#4d6054]/40 uppercase font-black tracking-widest">{t.location}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
}