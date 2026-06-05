'use client';

import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import Sidebar from '../../../app/layout-components/Sidebar';
import Header from '../../../app/layout-components/Header';
import { signOut } from 'next-auth/react';
import Image from 'next/image';

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
          image: profile.image
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
    <div className="relative flex min-h-screen">
      {/* Background Image */}
      <div className="fixed inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=2070"
          alt="Peaceful sanctuary background"
          fill
          className="object-cover scale-110 blur-xl opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-white/40 to-white/30"></div>
      </div>

      {/* Subtle Animated Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-20 right-20 w-96 h-96 bg-amber-200/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-20 left-20 w-80 h-80 bg-amber-300/8 rounded-full blur-[140px] animate-pulse" style={{ animationDelay: '-3s' }} />
      </div>

      <Sidebar />
      <Header />

      <main className="relative z-10 lg:ml-56 min-h-screen pb-20">
        <div className="max-w-3xl mx-auto px-6 md:px-10 pt-20">
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 gap-3">
              <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-[8px] font-black uppercase tracking-wider text-gray-500 animate-pulse">
                Syncing Profile Parameters...
              </span>
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-8">
              
              {/* Header Identity Display */}
              <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                  
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
                      className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-4 border-white shadow-xl bg-white/50 cursor-pointer relative group"
                    >
                      {profile.image ? (
                        <Image
                          src={profile.image} 
                          alt="Profile avatar" 
                          className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-500"
                          width={112}
                          height={112}  
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-amber-50">
                          <span className="material-symbols-outlined text-5xl">account_circle</span>
                        </div>
                      )}
                      
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full">
                        <span className="text-[8px] text-white font-black uppercase tracking-wider">Change</span>
                      </div>
                    </div>
                    
                    <button 
                      type="button" 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-1 right-1 bg-gradient-to-r from-amber-600 to-amber-700 p-1.5 rounded-full text-white shadow-lg hover:scale-110 transition-transform"
                    >
                      <span className="material-symbols-outlined text-[14px]">photo_camera</span>
                    </button>
                  </div>
                  
                  <div className="space-y-2">
                    <h2 className="text-2xl md:text-3xl font-serif tracking-tight font-bold text-gray-800">
                      {profile.name}
                    </h2>
                    <div className="flex flex-wrap gap-3 items-center">
                      {profile.joinedDate && (
                        <p className="text-[10px] font-semibold text-gray-500 flex items-center gap-1">
                          <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                          {profile.joinedDate}
                        </p>
                      )}
                      <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-100 rounded-full shadow-sm">
                        <span className="material-symbols-outlined text-amber-600 text-[12px]">local_fire_department</span>
                        <span className="text-[9px] font-bold text-amber-700">{profile.streak} Day Streak</span>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Identity Form Sections */}
              <section className="space-y-5">
                <div className="flex items-center gap-2 border-b border-gray-200/50 pb-3">
                  <span className="material-symbols-outlined text-amber-600 text-[18px]">badge</span>
                  <h3 className="text-lg md:text-xl font-serif font-semibold text-gray-800">Identity Parameters</h3>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-amber-500 text-[12px]">person</span>
                      <label className="text-[7px] font-black uppercase tracking-wider text-gray-500">Full Name</label>
                    </div>
                    <input 
                      type="text"
                      required
                      value={profile.name}
                      onChange={(e) => setProfile({...profile, name: e.target.value})}
                      className="w-full px-4 py-2.5 bg-white/50 border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 rounded-lg text-sm text-gray-800 transition-all font-medium outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-amber-500 text-[12px]">email</span>
                      <label className="text-[7px] font-black uppercase tracking-wider text-gray-500">Email Address</label>
                    </div>
                    <input 
                      type="email"
                      disabled
                      value={profile.email}
                      className="w-full px-4 py-2.5 bg-white/30 border border-gray-200 rounded-lg text-sm text-gray-500 cursor-not-allowed font-medium"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-amber-500 text-[12px]">edit_note</span>
                    <label className="text-[7px] font-black uppercase tracking-wider text-gray-500">Spiritual Bio</label>
                  </div>
                  <textarea 
                    rows={3}
                    value={profile.bio}
                    onChange={(e) => setProfile({...profile, bio: e.target.value})}
                    className="w-full px-4 py-2.5 bg-white/50 border border-gray-200 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 rounded-lg text-sm text-gray-800 transition-all resize-none font-medium leading-relaxed outline-none"
                    placeholder="Express your spiritual objectives or daily focus metrics..."
                  />
                </div>
              </section>

              {/* Actions Panel */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-gray-200/50">
                <button 
                  type="submit"
                  disabled={saving}
                  className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-700 text-white rounded-lg font-black text-[8px] uppercase tracking-wider shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                >
                  {saving ? (
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined animate-spin text-[12px]">sync</span>
                      Syncing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[12px]">save</span>
                      Save All Changes
                    </span>
                  )}
                </button>
                <button 
                  type="button"
                  onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                  className="w-full sm:w-auto px-6 py-2.5 border border-gray-300 text-gray-600 rounded-lg font-black text-[8px] uppercase tracking-wider hover:bg-red-50 hover:text-red-600 hover:border-red-300 transition-all"
                >
                  Sign Out
                </button>
              </div>

            </form>
          )}
        </div>

        {/* Decorative Footer */}
        <div className="mt-10 flex justify-center items-center gap-4 opacity-30">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400" />
          <span className="material-symbols-outlined text-amber-400 text-sm">account_circle</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400" />
        </div>
      </main>
    </div>
  );
}