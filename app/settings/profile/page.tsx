'use client';

import { useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import Sidebar from '../../../app/layout-components/Sidebar';
import Header from '../../../app/layout-components/Header';
import { signOut } from 'next-auth/react';
import { useTheme } from '../../context/ThemeContext';
import Image from 'next/image';

export default function ProfileSettingsPage() {
  const { isDark } = useTheme();
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
  setLoading(false); // Clean execution, no call signature errors
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
    <div className={`flex min-h-screen antialiased selection:bg-orange-100 dark:selection:bg-orange-950/50 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'}`}>
      <Sidebar />
        

      {/* Main Single-Column Settings Feed Container */}
      <main className="flex-1 lg:ml-64 pt-24 px-4 md:px-8 pb-24 max-w-[720px] mx-auto w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-5 h-5 border-2 border-orange-600 dark:border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500 animate-pulse">
              Syncing Profile Parameters...
            </span>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-12">
            
            {/* Header Identity & Avatar Display */}
            <header className="pb-8 border-b border-zinc-100 dark:border-zinc-900 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              
              {/* Image Upload Core Wrapper */}
              <div className="relative group shrink-0">
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900 cursor-pointer relative"
                >
                  {profile.image ? (
                    <Image
                      src={profile.image} 
                      alt="Profile avatar" 
                      fill
                      className="object-cover transition-opacity group-hover:opacity-80 duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-400 dark:text-zinc-600">
                      <span className="material-symbols-outlined text-4xl">account_circle</span>
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <span className="text-[10px] text-white font-sans font-medium uppercase tracking-wider">Change</span>
                  </div>
                </div>
                
                <button 
                  type="button" 
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-orange-600 dark:bg-orange-500 p-1.5 rounded-full text-white hover:bg-orange-700 dark:hover:bg-orange-600 transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">photo_camera</span>
                </button>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-3xl font-serif font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                  {profile.name || 'Your Profile'}
                </h1>
                <div className="flex flex-wrap gap-3 items-center">
                  {profile.joinedDate && (
                    <p className="text-[12px] font-sans text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">calendar_today</span>
                      {profile.joinedDate}
                    </p>
                  )}
                  <div className="flex items-center gap-1 px-2.5 py-0.5 bg-zinc-100 dark:bg-zinc-900 rounded-full">
                    <span className="material-symbols-outlined text-orange-600 dark:text-orange-500 text-[14px]">local_fire_department</span>
                    <span className="text-[11px] font-sans font-medium text-zinc-600 dark:text-zinc-400">{profile.streak} Day Streak</span>
                  </div>
                </div>
              </div>
            </header>

            {/* Identity Input Sections */}
            <section className="space-y-6 pb-8 border-b border-zinc-100 dark:border-zinc-900/60">
              <div className="mb-4">
                <h3 className="text-sm font-sans font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                  Identity Parameters
                </h3>
                <p className="text-[13px] text-zinc-400 dark:text-zinc-500 font-sans mt-0.5">
                  Update your standard user details and sanctuary bio.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name Input */}
                <div className="space-y-2">
                  <label className="text-[11px] font-sans font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
                    Full Name
                  </label>
                  <input 
                    type="text"
                    required
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full px-3 py-2 bg-transparent border border-zinc-200 dark:border-zinc-800 focus:border-orange-600 dark:focus:border-orange-500 text-sm text-zinc-800 dark:text-zinc-200 rounded-lg transition-colors font-sans outline-none"
                  />
                </div>

                {/* Email Address Display */}
                <div className="space-y-2">
                  <label className="text-[11px] font-sans font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
                    Email Address
                  </label>
                  <input 
                    type="email"
                    disabled
                    value={profile.email}
                    className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm text-zinc-400 dark:text-zinc-500 cursor-not-allowed font-sans"
                  />
                </div>
              </div>

              {/* Bio Field Textarea */}
              <div className="space-y-2">
                <label className="text-[11px] font-sans font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 block">
                  Spiritual Bio
                </label>
                <textarea 
                  rows={4}
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  className="w-full px-3 py-2 bg-transparent border border-zinc-200 dark:border-zinc-800 focus:border-orange-600 dark:focus:border-orange-500 text-sm text-zinc-800 dark:text-zinc-200 rounded-lg transition-colors resize-none font-sans leading-relaxed outline-none"
                  placeholder="Express your spiritual objectives or daily focus metrics..."
                />
              </div>
            </section>

            {/* Flat Layout Action Controllers */}
            <div className="flex items-center gap-3 pt-4">
              <button 
                type="submit"
                disabled={saving}
                className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white font-medium text-[12px] px-4 py-2 rounded-full transition-colors shadow-sm disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[14px]">sync</span>
                    <span>Syncing...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[14px]">save</span>
                    <span>Save All Changes</span>
                  </>
                )}
              </button>
              <button 
                type="button"
                onClick={() => signOut({ callbackUrl: '/auth/signin' })}
                className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 hover:border-red-200 dark:hover:border-red-950/30 hover:text-red-600 dark:hover:text-red-400 rounded-full text-[12px] font-sans font-medium text-zinc-600 dark:text-zinc-400 transition-colors bg-transparent"
              >
                Sign Out
              </button>
            </div>

          </form>
        )}

        {/* Elegant Centered System Rule Dot Divider */}
        <div className="mt-24 flex justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </main>
    </div>
  );
}