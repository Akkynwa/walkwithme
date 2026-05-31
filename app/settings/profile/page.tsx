'use client';

import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import Sidebar from '../../../app/layout-components/Sidebar';
import Header from '../../../app/layout-components/Header';
import { signOut } from 'next-auth/react';

export default function ProfileSettingsPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    bio: '',
    image: '',
    streak: 0,
    joinedDate: ''
  });

  // --- Read Persisted Configuration on Mount ---
  useEffect(() => {
    async function loadProfileData() {
      try {
        const res = await fetch('/api/settings/profile');
        if (res.ok) {
          const data = await res.json();
          if (data) {
            setProfile({
              name: data.name || '',
              email: data.email || '',
              bio: data.bio || '',
              image: data.image || '',
              streak: data.streak || 0,
              joinedDate: data.createdAt 
                ? `Joined ${new Date(data.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` 
                : ''
            });
          }
        }
      } catch (err) {
        console.error('Error fetching profile values:', err);
      } finally {
        setLoading(false);
      }
    }
    loadProfileData();
  }, []);

  // --- Handle Avatar Image Selection & Base64 Generation ---
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Image must be under 2MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProfile((prev) => ({ ...prev, image: reader.result as string }));
      toast.success('New profile image staged');
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/settings/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: profile.name, 
          bio: profile.bio,
          image: profile.image // Pass base64 back to server destination
        }),
      });

      if (response.ok) {
        toast.success('Your sanctuary settings have been updated');
      } else {
        toast.error('Could not save profile updates.');
      }
    } catch (err) {
      console.error('Network crash updating profile setup:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="lg:ml-64 min-h-screen bg-background text-on-background transition-colors duration-500 pb-20">
      <div className="max-w-[850px] mx-auto px-6 md:px-12 pt-12">
        <Sidebar />
        <Header />
        
        {loading ? (
          <div className="flex items-center justify-center py-32">
            <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/40 animate-pulse">
              Syncing Profile Parameters...
            </span>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-12">
            
            {/* Header Identity Display */}
            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
                
                {/* Image Upload Core Wrapper */}
                <div className="relative group">
                  <input 
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-white shadow-xl bg-surface-container-high cursor-pointer relative group"
                  >
                    {profile.image ? (
                      <img 
                        src={profile.image} 
                        alt="Profile avatar" 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-on-surface-variant/40 bg-gray-100">
                        <span className="material-symbols-outlined text-5xl">account_circle</span>
                      </div>
                    )}
                    
                    {/* Hover overlay design hint */}
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="text-[10px] text-white font-black uppercase tracking-widest">Change</span>
                    </div>
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 bg-primary p-2 rounded-full text-on-primary shadow-lg hover:scale-110 transition-transform"
                  >
                    <span className="material-symbols-outlined text-[18px]">photo_camera</span>
                  </button>
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-4xl text-on-surface font-serif tracking-tight font-bold">
                    {profile.name}
                  </h2>
                  <div className="flex flex-wrap gap-3 items-center">
                    {profile.joinedDate && (
                      <p className="text-xs font-semibold text-on-surface-variant/70 flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                        {profile.joinedDate}
                      </p>
                    )}
                    <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed rounded-full text-xs font-bold flex items-center gap-1.5 shadow-sm">
                      <span className="material-symbols-outlined text-[14px] fill-1">eco</span>
                      {profile.streak} Day Streak
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Identity Form Sections */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 border-b border-outline-variant/30 pb-4">
                <span className="material-symbols-outlined text-primary">badge</span>
                <h3 className="text-xl md:text-2xl font-serif font-bold text-on-surface">Identity Parameters</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant/80 ml-1">Full Name</label>
                  <input 
                    type="text"
                    required
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full px-5 py-4 bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-primary/20 rounded-2xl text-sm text-on-surface transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant/80 ml-1">Email Address</label>
                  <input 
                    type="email"
                    disabled
                    value={profile.email}
                    className="w-full px-5 py-4 bg-surface-container-low/50 border border-outline-variant/10 rounded-2xl text-sm text-on-surface-variant/60 cursor-not-allowed font-medium"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-on-surface-variant/80 ml-1">Spiritual Bio</label>
                <textarea 
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  className="w-full px-5 py-4 bg-surface-container-low border border-outline-variant/20 focus:ring-2 focus:ring-primary/20 rounded-2xl text-sm text-on-surface transition-all resize-none font-medium leading-relaxed"
                  placeholder="Express your spiritual objectives or daily focus metrics..."
                />
              </div>
            </section>

            {/* Actions Panel */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6">
              <button 
                type="submit"
                disabled={saving}
                className="w-full md:w-auto px-10 py-4 bg-primary text-on-primary rounded-2xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all text-xs font-black uppercase tracking-widest"
              >
                {saving ? 'Syncing...' : 'Save All Changes'}
              </button>
              <button 
                type="button"
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                className="w-full md:w-auto px-10 py-4 border border-outline/30 text-on-surface-variant rounded-2xl font-bold hover:bg-error/5 hover:text-error hover:border-error transition-all text-xs font-black uppercase tracking-widest"
              >
                Sign Out
              </button>
            </div>

          </form>
        )}
      </div>
    </main>
  );
}