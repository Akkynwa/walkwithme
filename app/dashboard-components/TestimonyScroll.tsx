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
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="w-4 h-px bg-gray-400/40" />
          <h3 className="text-[9px] font-black text-gray-600 uppercase tracking-[0.2em]">
            Voices of the Sanctuary
          </h3>
        </div>
        <button className="text-[8px] font-bold text-indigo-500 uppercase tracking-wider hover:text-indigo-600 transition-colors">
          Share Reflection
        </button>
      </div>

      {/* Testimonies Container */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          // Elegant skeleton loader
          <div className="space-y-3">
            <div className="h-24 w-full bg-white/40 animate-pulse rounded-2xl" />
            <div className="h-24 w-full bg-white/40 animate-pulse rounded-2xl" />
          </div>
        ) : testimonies.length === 0 ? (
          <div className="text-center py-8">
            <span className="material-symbols-outlined text-gray-300 text-3xl">forum</span>
            <p className="text-xs text-gray-400 font-serif mt-2">No reflections shared yet.</p>
            <p className="text-[10px] text-gray-300 mt-1">Be the first to share</p>
          </div>
        ) : (
          testimonies.map((t) => (
            <div 
              key={t.id} 
              className="group bg-white/40 backdrop-blur-sm border border-white/60 rounded-2xl p-5 shadow-sm hover:shadow-md hover:bg-white/60 transition-all duration-300"
            >
              {/* Testimony Content */}
              <p className="text-sm font-serif text-gray-700 leading-relaxed mb-4">
                "{t.content}"
              </p>
              
              {/* Author Info */}
              <div className="flex items-center justify-between border-t border-gray-200/50 pt-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center">
                    <span className="material-symbols-outlined text-indigo-500 text-[12px]">person</span>
                  </div>
                  <span className="text-[11px] font-semibold text-gray-800">{t.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-gray-300 text-[10px]">location_on</span>
                  <span className="text-[8px] text-gray-400 uppercase tracking-wider font-medium">{t.location}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Subtle footer note */}
      <div className="text-center pt-2">
        <p className="text-[7px] text-gray-300 uppercase tracking-[0.2em]">
          A community of faith
        </p>
      </div>
    </section>
  );
}