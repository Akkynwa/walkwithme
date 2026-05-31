/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import Sidebar from '../layout-components/Sidebar';
import Header from '../layout-components/Header';

type Theme = 'light' | 'dark' | 'system';

export default function ProfileSettingsPage() {
  // --- Functional State ---
  const [profile, setProfile] = useState({
    name: 'Eleanor Woods',
    email: 'eleanor.woods@example.com',
    bio: 'Seeking stillness in the chaos. Walking daily with the Word as my lamp.',
    streak: 34
  });

  const [theme, setTheme] = useState<Theme>('light');
  const [fontSize, setFontSize] = useState(3); // 1 to 5 scale
  const [notifications, setNotifications] = useState({
    dailyVerse: true,
    prompts: true,
    summary: false
  });

  // --- Theme Logic ---
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const handleSave = () => {
    toast.success('Your sanctuary settings have been updated');
  };

  // Map slider value to descriptive text
  const getFontLabel = () => {
    const labels = ['Small', 'Default', 'Medium', 'Large', 'Extra Large'];
    return labels[fontSize - 1];
  };

  return (
    /* lg:ml-64 ensures it doesn't touch your updated Sidebar */
    <main className="lg:ml-64 min-h-screen bg-background text-on-background transition-colors duration-500 pb-20">
      <div className="max-w-[850px] mx-auto px-6 md:px-12 pt-12">
        <Sidebar />
      <Header />
        
        {/* 1. Header Section */}
        <section className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="relative group">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl">
                <img 
                  alt="Profile" 
                  className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&h=256&auto=format&fit=crop" 
                />
              </div>
              <button className="absolute bottom-1 right-1 bg-primary p-2 rounded-full text-on-primary shadow-lg hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-[18px]">photo_camera</span>
              </button>
            </div>
            
            <div className="space-y-2">
              <h2 className="font-display-lg text-4xl text-on-surface font-bold tracking-tight">{profile.name}</h2>
              <div className="flex flex-wrap gap-3 items-center">
                <p className="font-label-md text-on-surface-variant/70 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                  Joined Dec 2023
                </p>
                <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed rounded-full font-label-sm text-xs font-bold flex items-center gap-1.5 shadow-sm">
                  <span className="material-symbols-outlined text-[14px] fill-1">eco</span>
                  {profile.streak} Day Streak
                </span>
              </div>
            </div>
          </div>
        </section>

        <div className="space-y-12">
          {/* 2. Personal Information */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
              <span className="material-symbols-outlined text-primary">badge</span>
              <h3 className="font-display-lg text-2xl font-bold">Personal Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="font-label-sm text-xs font-black uppercase tracking-widest text-on-surface-variant/60 ml-1">Full Name</label>
                <input 
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  className="w-full px-5 py-4 bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-2xl text-on-surface transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="font-label-sm text-xs font-black uppercase tracking-widest text-on-surface-variant/60 ml-1">Email Address</label>
                <input 
                  type="email"
                  disabled
                  value={profile.email}
                  className="w-full px-5 py-4 bg-surface-container-low/50 border-none rounded-2xl text-on-surface-variant/50 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-label-sm text-xs font-black uppercase tracking-widest text-on-surface-variant/60 ml-1">Spiritual Bio</label>
              <textarea 
                rows={3}
                value={profile.bio}
                onChange={(e) => setProfile({...profile, bio: e.target.value})}
                className="w-full px-5 py-4 bg-surface-container-low border-none focus:ring-2 focus:ring-primary/20 rounded-2xl text-on-surface transition-all resize-none"
              />
            </div>
          </section>

          {/* 3. Theme & Customization */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
              <span className="material-symbols-outlined text-primary">palette</span>
              <h3 className="font-display-lg text-2xl font-bold">App Appearance</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Theme Picker */}
              <div className="p-6 bg-surface-container-lowest border border-outline-variant/30 rounded-[32px] space-y-4">
                <p className="font-label-md text-sm font-bold text-on-surface">Visual Theme</p>
                <div className="flex gap-3">
                  {(['light', 'dark', 'system'] as Theme[]).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTheme(t)}
                      className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                        theme === t ? 'border-primary bg-primary/5' : 'border-transparent bg-surface-container-low hover:bg-surface-container-high'
                      }`}
                    >
                      <div className={`w-full h-10 rounded-lg ${
                        t === 'light' ? 'bg-white border' : t === 'dark' ? 'bg-inverse-surface' : 'bg-gradient-to-r from-white to-inverse-surface'
                      }`} />
                      <span className="font-label-sm text-[10px] uppercase font-bold tracking-wider capitalize">{t}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Scaling */}
              <div className="p-6 bg-surface-container-lowest border border-outline-variant/30 rounded-[32px] space-y-6">
                <div className="flex justify-between items-center">
                  <p className="font-label-md text-sm font-bold text-on-surface">Reader Font Size</p>
                  <span className="font-label-sm text-xs text-primary font-bold">{getFontLabel()}</span>
                </div>
                <div className="px-2">
                  <input 
                    type="range" 
                    min="1" max="5" 
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-secondary-container rounded-lg appearance-none cursor-pointer accent-primary" 
                  />
                  <div className="flex justify-between mt-3 text-[10px] text-on-surface-variant font-black">
                    <span>A</span>
                    <span className="text-lg">A</span>
                  </div>
                </div>
                {/* Real-time Preview */}
                <p 
                  className="text-center italic text-on-surface-variant/60 transition-all duration-300"
                  style={{ fontSize: `${12 + (fontSize * 2)}px` }}
                >
                  "Thy word is a lamp unto my feet..."
                </p>
              </div>
            </div>
          </section>

          {/* 4. Notification Toggles */}
          <section className="space-y-6">
            <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
              <span className="material-symbols-outlined text-primary">notifications_active</span>
              <h3 className="font-display-lg text-2xl font-bold">Preferences</h3>
            </div>
            
            <div className="bg-surface-container-lowest rounded-[32px] border border-outline-variant/30 overflow-hidden divide-y divide-outline-variant/10">
              {[
                { key: 'dailyVerse', label: 'Daily Verse Reminders', desc: 'Inspired delivery every morning at 7:00 AM' },
                { key: 'prompts', label: 'Journaling Prompts', desc: 'Gentle nudges to reflect on your daily walk' },
                { key: 'summary', label: 'Weekly Summary', desc: 'A holistic view of your spiritual habits' }
              ].map((item) => (
                <div key={item.key} className="p-6 flex items-center justify-between hover:bg-surface-container-low/30 transition-colors">
                  <div>
                    <p className="font-label-md text-on-surface font-bold">{item.label}</p>
                    <p className="text-sm text-on-surface-variant/70">{item.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={notifications[item.key as keyof typeof notifications]}
                      onChange={(e) => setNotifications({...notifications, [item.key]: e.target.checked})}
                    />
                    <div className="w-12 h-7 bg-secondary-container rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-[20px] after:w-[20px] after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Actions */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6">
            <button 
              onClick={handleSave}
              className="w-full md:w-auto px-10 py-4 bg-primary text-on-primary rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
            >
              Save All Changes
            </button>
            <button className="w-full md:w-auto px-10 py-4 border border-outline/30 text-on-surface-variant rounded-2xl font-bold hover:bg-error/5 hover:text-error hover:border-error transition-all">
              Sign Out
            </button>
          </div>

          <div className="flex flex-col items-center gap-3 py-10 opacity-40">
            <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center animate-pulse">
              <span className="material-symbols-outlined text-primary text-xl">self_improvement</span>
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.4em]">Digital Sanctuary</span>
          </div>
        </div>
      </div>
    </main>
  );
}