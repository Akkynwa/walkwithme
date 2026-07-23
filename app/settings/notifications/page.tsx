'use client';

import { useState, useEffect } from 'react';
import Sidebar from '@/app/layout-components/Sidebar';
import { useRouter } from 'next/navigation';
import { useTheme } from '../../context/ThemeContext';

interface NotificationConfig {
  emailNotifications: boolean;
  pushNotifications: boolean;
  dailyReminder: boolean;
  prayerReminder: boolean;
  newContent: boolean;
}

export default function NotificationsSettingsPage() {
  const router = useRouter();
  const { isDark } = useTheme();
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
    <div className={`flex min-h-screen antialiased selection:bg-orange-100 dark:selection:bg-orange-950/50 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'}`}>
      <Sidebar />

      {/* Main Single-Column Settings Area */}
      <main className="flex-1 lg:ml-64 pt-24 px-4 md:px-8 pb-24 max-w-[720px] mx-auto w-full">
        
        {/* Editorial Substack Header Row */}
        <header className="mb-12 pb-4 border-b border-zinc-100 dark:border-zinc-900">
          <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-500 mb-2">
            <span className="material-symbols-outlined text-[14px]">communications</span>
            <span className="text-[10px] font-sans font-semibold uppercase tracking-wider">Preferences Configuration</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Notification Rules
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-sans mt-1.5">
            Configure how and when you receive ecosystem updates, summaries, and reminders.
          </p>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4">
            <div className="w-5 h-5 border-2 border-orange-600 dark:border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[11px] font-sans font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500 animate-pulse">
              Retrieving configurations...
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-12">
            
            {/* List Row Flow Container */}
            <div className="border border-zinc-100 dark:border-zinc-900 rounded-xl overflow-hidden divide-y divide-zinc-100 dark:divide-zinc-900">
              {Object.entries(notifications).map(([key, value]) => {
                const configKey = key as keyof NotificationConfig;
                const meta = metadataMap[configKey] || { title: key, desc: '', icon: 'notifications' };

                return (
                  <div 
                    key={key} 
                    onClick={() => handleToggle(configKey)}
                    className="flex items-center justify-between p-5 hover:bg-zinc-50 dark:hover:bg-zinc-900/40 transition-colors cursor-pointer select-none"
                  >
                    <div className="flex items-start gap-4 pr-6">
                      <div className="w-8 h-8 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-transparent flex items-center justify-center text-zinc-400 dark:text-zinc-500 mt-0.5 group-hover:text-zinc-900">
                        <span className="material-symbols-outlined text-[16px]">{meta.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-[13px] font-sans font-medium text-zinc-800 dark:text-zinc-200">
                          {meta.title}
                        </h4>
                        <p className="text-[11px] text-zinc-400 dark:text-zinc-500 font-sans leading-normal mt-0.5 max-w-lg">
                          {meta.desc}
                        </p>
                      </div>
                    </div>

                    {/* Architectural Accent Switch Toggle */}
                    <div className="relative shrink-0">
                      <div className={`w-8 h-4 rounded-full transition-colors duration-200 ${
                        value ? 'bg-orange-600 dark:bg-orange-500' : 'bg-zinc-200 dark:bg-zinc-800'
                      }`} />
                      <div className={`absolute top-0.5 left-0.5 bg-white dark:bg-zinc-100 w-3 h-3 rounded-full transition-transform duration-200 transform ${
                        value ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Structured Save/Form Action Row */}
            <div className="flex items-center gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-900">
              <button 
                type="submit"
                disabled={saving}
                className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white font-medium text-[12px] px-4 py-2 rounded-full transition-colors shadow-sm disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <span className="material-symbols-outlined animate-spin text-[14px]">sync</span>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[14px]">save</span>
                    <span>Save Preferences</span>
                  </>
                )}
              </button>
              <button 
                type="button"
                onClick={() => router.push('/settings')}
                className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-full text-[12px] font-sans font-medium text-zinc-600 dark:text-zinc-400 transition-colors bg-transparent"
              >
                Cancel
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