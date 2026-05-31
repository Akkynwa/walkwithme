'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Sidebar from '@/app/layout-components/Sidebar';
import { useRouter } from 'next/navigation';

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

  // Descriptive text and icons mapping keys to semantic terminology
  const metadataMap: Record<keyof NotificationConfig, { title: string; desc: string; icon: string }> = {
    emailNotifications: { title: 'Email Digests', desc: 'Receive weekly summaries, notes, and activity highlights in your inbox.', icon: 'mail' },
    pushNotifications: { title: 'Push Alerts', desc: 'Get direct device updates for real-time interactions and reflections.', icon: 'phonelink_ring' },
    dailyReminder: { title: 'Daily Remembrance', desc: 'An morning nudge to sustain consistency along your spiritual path.', icon: 'alarm' },
    prayerReminder: { title: 'Prayer Circle Alerts', desc: 'Immediate notification when someone requests or updates a prayer.', icon: 'auto_awesome' },
    newContent: { title: 'Sanctuary Releases', desc: 'Be notified when fresh text expansions, devotionals, or updates drop.', icon: 'menu_book' },
  };

  // Fetch saved configuration settings on mount
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
    <div className="flex min-h-screen bg-[#FDFDFF] relative overflow-hidden">
      {/* Background blurs */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[15%] right-[10%] w-[350px] h-[350px] rounded-full bg-primary/5 blur-[100px]"></div>
        <div className="absolute bottom-[15%] left-[15%] w-[300px] h-[300px] rounded-full bg-[#D4AF37]/5 blur-[90px]"></div>
      </div>

      <Sidebar />

      <main className="flex-1 lg:ml-64 pt-24 px-6 md:px-10 pb-32 max-w-3xl mx-auto w-full z-10 relative">
        
        {/* Header Section */}
        <header className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1 h-1 rounded-full bg-primary"></span>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Communications</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif text-[#3C3830] tracking-tight">
            Notification <span className="italic font-serif text-primary">Rules</span>
          </h1>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <span className="text-[11px] font-black uppercase tracking-widest text-gray-400 animate-pulse">
              Retrieving configurations...
            </span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-500">
            <Card className="border-gray-100/60 bg-white/70 backdrop-blur-md p-2 rounded-[24px] divide-y divide-gray-100/50">
              {Object.entries(notifications).map(([key, value]) => {
                const configKey = key as keyof NotificationConfig;
                const meta = metadataMap[configKey] || { title: key, desc: '', icon: 'notifications' };

                return (
                  <div 
                    key={key} 
                    onClick={() => handleToggle(configKey)}
                    className="flex items-center justify-between p-4 sm:p-5 hover:bg-gray-50/40 transition-colors cursor-pointer select-none first:rounded-t-[22px] last:rounded-b-[22px]"
                  >
                    <div className="flex items-start gap-4 pr-4">
                      <div className="w-9 h-9 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 mt-0.5">
                        <span className="material-symbols-outlined text-[18px]">{meta.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-[12px] font-bold text-[#3C3830] tracking-tight">
                          {meta.title}
                        </h4>
                        <p className="text-[10px] text-[#7C7565] leading-normal mt-0.5 max-w-md opacity-80">
                          {meta.desc}
                        </p>
                      </div>
                    </div>

                    {/* Custom Minimalist Toggle Switch */}
                    <div className="relative pointer-events-none">
                      <div className={`w-9 h-5 rounded-full transition-colors duration-200 ${
                        value ? 'bg-primary' : 'bg-gray-200'
                      }`} />
                      <div className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-200 transform ${
                        value ? 'translate-x-4' : 'translate-x-0'
                      }`} />
                    </div>
                  </div>
                );
              })}
            </Card>

            {/* Actions Bar */}
            <div className="flex items-center gap-3 pt-2">
              <Button 
                type="submit"
                disabled={saving}
                className="bg-primary hover:bg-primary-dark text-white rounded-full text-[10px] font-black uppercase tracking-widest px-8 py-3 shadow-sm min-w-[140px]"
              >
                {saving ? 'Saving...' : 'Save Preferences'}
              </Button>
              <Button 
                type="button"
                variant="outline" 
                onClick={() => router.push('/settings')}
                className="bg-white/80 backdrop-blur-sm border-gray-200 text-[#3C3830] hover:bg-gray-50 rounded-full text-[10px] font-black uppercase tracking-widest px-8 py-3"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}