'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/app/layout-components/Sidebar';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface NotificationConfig {
  emailNotifications: boolean;
  pushNotifications: boolean;
  dailyReminder: boolean;
  prayerReminder: boolean;
  newContent: boolean;
}

export default function NotificationsSettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notifications, setNotifications] = useState<NotificationConfig>({
    emailNotifications: true,
    pushNotifications: true,
    dailyReminder: true,
    prayerReminder: true,
    newContent: false,
  });

  const metadataMap: Record<keyof NotificationConfig, { title: string; desc: string; icon: string }> = {
    emailNotifications: { title: 'Email Digests', desc: 'Receive weekly summaries, notes, and activity highlights in your inbox.', icon: 'mail' },
    pushNotifications: { title: 'Push Alerts', desc: 'Get direct device updates for real-time interactions and reflections.', icon: 'notifications_active' },
    dailyReminder: { title: 'Daily Remembrance', desc: 'A morning nudge to sustain consistency along your spiritual path.', icon: 'alarm' },
    prayerReminder: { title: 'Prayer Circle Alerts', desc: 'Immediate notification when someone requests or updates a prayer.', icon: 'self_improvement' },
    newContent: { title: 'Sanctuary Releases', desc: 'Be notified when fresh text expansions, devotionals, or updates drop.', icon: 'menu_book' },
  };

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await fetch('/api/settings/notifications');
        if (res.ok) {
          const data = await res.json();
          if (data) setNotifications(data);
        }
      } catch (err) {
        console.error('Failed fetching preference configurations:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  const handleToggle = (key: keyof NotificationConfig) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const response = await fetch('/api/settings/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notifications),
      });

      if (response.ok) {
        router.push('/settings');
      } else {
        console.error('Failed parsing update confirmation status.');
      }
    } catch (err) {
      console.error('Error writing preferences payload to endpoint:', err);
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

      <main className="relative z-10 flex-1 lg:ml-56 pt-20 px-6 md:px-10 pb-16 max-w-2xl mx-auto w-full">
        
        {/* Header Section */}
        <header className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-px bg-amber-400/40" />
            <span className="text-[8px] font-black uppercase tracking-wider text-amber-600">Communications</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif text-gray-800 tracking-tight">
            Notification <span className="italic font-serif text-amber-600">Rules</span>
          </h1>
          <p className="text-sm text-gray-500 italic border-l-2 border-amber-400 pl-4 mt-2">
            Configure how you receive updates and reminders.
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[8px] font-black uppercase tracking-wider text-gray-500 animate-pulse">
              Retrieving configurations...
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in duration-500">
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-xl overflow-hidden shadow-lg divide-y divide-gray-200/50">
              {Object.entries(notifications).map(([key, value]) => {
                const configKey = key as keyof NotificationConfig;
                const meta = metadataMap[configKey] || { title: key, desc: '', icon: 'notifications' };

                return (
                  <div 
                    key={key} 
                    onClick={() => handleToggle(configKey)}
                    className="flex items-center justify-between p-4 hover:bg-white/40 transition-colors cursor-pointer select-none"
                  >
                    <div className="flex items-start gap-3 pr-4">
                      <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 mt-0.5">
                        <span className="material-symbols-outlined text-[16px]">{meta.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-[10px] font-bold text-gray-800 tracking-tight">
                          {meta.title}
                        </h4>
                        <p className="text-[8px] text-gray-500 leading-normal mt-0.5 max-w-md">
                          {meta.desc}
                        </p>
                      </div>
                    </div>

                    {/* Custom Minimalist Toggle Switch */}
                    <div className="relative pointer-events-none">
                      <div className={`w-8 h-4 rounded-full transition-colors duration-200 ${
                        value ? 'bg-amber-600' : 'bg-gray-300'
                      }`} />
                      <div className={`absolute top-0.5 left-0.5 bg-white w-3 h-3 rounded-full shadow-sm transition-transform duration-200 transform ${
                        value ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Actions Bar */}
            <div className="flex items-center gap-3 pt-2">
              <button 
                type="submit"
                disabled={saving}
                className="bg-gradient-to-r from-amber-600 to-amber-700 hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.02] text-white rounded-lg text-[8px] font-black uppercase tracking-wider px-6 py-2.5 transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[12px]">sync</span>
                    Saving...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[12px]">save</span>
                    Save Preferences
                  </>
                )}
              </button>
              <button 
                type="button"
                onClick={() => router.push('/settings')}
                className="bg-white/50 backdrop-blur-sm border border-gray-200 text-gray-600 rounded-lg text-[8px] font-black uppercase tracking-wider px-5 py-2.5 hover:bg-white/80 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Decorative Footer */}
        <div className="mt-10 flex justify-center items-center gap-4 opacity-30">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400" />
          <span className="material-symbols-outlined text-amber-400 text-sm">notifications</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400" />
        </div>
      </main>
    </div>
  );
}