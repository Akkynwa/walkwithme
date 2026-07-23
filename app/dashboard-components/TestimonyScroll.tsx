'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

interface Testimony {
  id: string;
  author: string;
  location: string;
  content: string;
}

export function TestimonyScroll() {
  const { isDark } = useTheme();
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
          <div className={`w-4 h-px ${isDark ? 'bg-white/20' : 'bg-gray-400/40'}`} />
          <h3 className={`text-[9px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Voices of the Sanctuary
          </h3>
        </div>
        <button className={`text-[8px] font-bold uppercase tracking-wider transition-colors ${
          isDark 
            ? 'text-primary-400 hover:text-primary-300' 
            : 'text-primary-600 hover:text-primary-700'
        }`}>
          Share Reflection
        </button>
      </div>

      {/* Testimonies Container */}
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {loading ? (
          // Elegant skeleton loader
          <div className="space-y-3">
            <div className={`h-24 w-full animate-pulse rounded-2xl ${isDark ? 'bg-white/10' : 'bg-white/40'}`} />
            <div className={`h-24 w-full animate-pulse rounded-2xl ${isDark ? 'bg-white/10' : 'bg-white/40'}`} />
          </div>
        ) : testimonies.length === 0 ? (
          <div className="text-center py-8">
            <span className={`material-symbols-outlined text-3xl ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>forum</span>
            <p className={`text-xs font-serif mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>No reflections shared yet.</p>
            <p className={`text-[10px] mt-1 ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>Be the first to share</p>
          </div>
        ) : (
          testimonies.map((t) => (
            <div 
              key={t.id} 
              className={`group backdrop-blur-sm border rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 ${
                isDark 
                  ? 'bg-black/40 border-white/10 hover:bg-black/60' 
                  : 'bg-white/40 border-white/60 hover:bg-white/60'
              }`}
            >
              {/* Testimony Content */}
              <p className={`text-sm font-serif leading-relaxed mb-4 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                "{t.content}"
              </p>
              
              {/* Author Info */}
              <div className={`flex items-center justify-between border-t pt-3 ${isDark ? 'border-white/10' : 'border-gray-200/50'}`}>
                <div className="flex items-center gap-2">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                    isDark 
                      ? 'bg-primary-900/30' 
                      : 'bg-gradient-to-br from-indigo-100 to-indigo-200'
                  }`}>
                    <span className={`material-symbols-outlined text-[12px] ${isDark ? 'text-primary-400' : 'text-indigo-500'}`}>person</span>
                  </div>
                  <span className={`text-[11px] font-semibold ${isDark ? 'text-gray-200' : 'text-gray-800'}`}>{t.author}</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={`material-symbols-outlined text-[10px] ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>location_on</span>
                  <span className={`text-[8px] uppercase tracking-wider font-medium ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>{t.location}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Subtle footer note */}
      <div className="text-center pt-2">
        <p className={`text-[7px] uppercase tracking-[0.2em] ${isDark ? 'text-gray-600' : 'text-gray-300'}`}>
          A community of faith
        </p>
      </div>
    </section>
  );
}