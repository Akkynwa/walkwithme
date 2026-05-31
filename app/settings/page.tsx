'use client';

import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import Sidebar from '@/app/layout-components/Sidebar';

export default function SettingsPage() {
  const sections = [
    { title: 'Profile', href: '/settings/profile', icon: 'person' },
    { title: 'Bible Preferences', href: '/settings/bible-preferences', icon: 'auto_stories' },
    { title: 'Language', href: '/settings/language', icon: 'translate' },
    { title: 'Themes', href: '/settings/themes', icon: 'dark_mode' },
    { title: 'Notifications', href: '/settings/notifications', icon: 'notifications' },
    { title: 'Security', href: '/settings/security', icon: 'shield_lock' },
  ];

  return (
    <div className="flex min-h-screen bg-[#FDFDFF] relative overflow-hidden">
      {/* Ambient background decoration */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[10%] right-[5%] w-[400px] h-[400px] rounded-full bg-primary/5 blur-[120px]"></div>
        <div className="absolute bottom-[10%] left-[10%] w-[300px] h-[300px] rounded-full bg-[#D4AF37]/5 blur-[100px]"></div>
      </div>

      <Sidebar />

      <main className="flex-1 lg:ml-64 pt-24 px-6 md:px-10 pb-32 max-w-6xl mx-auto w-full z-10 relative">
        
        {/* Header */}
        <header className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1 h-1 rounded-full bg-primary"></span>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Preferences</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif text-[#3C3830] tracking-tight">
            System <span className="italic font-serif text-primary">Settings</span>
          </h1>
        </header>

        {/* Compact Settings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {sections.map((section) => (
            <Link 
              key={section.href} 
              href={section.href}
              className="group"
            >
              <Card className="border-gray-100/60 bg-white/70 backdrop-blur-md p-4 hover:border-primary/20 hover:shadow-sm transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-primary/5 transition-colors">
                    <span className="material-symbols-outlined text-gray-400 group-hover:text-primary text-[20px] transition-colors">
                      {section.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[13px] font-bold text-[#3C3830] tracking-tight group-hover:text-primary transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-[10px] text-[#7C7565] font-medium opacity-70">
                      Manage {section.title.split(' ')[0]} settings
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-gray-300 text-sm group-hover:translate-x-1 transition-transform">
                    chevron_right
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Compressed Danger Zone */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          <div className="bg-white border border-gray-100 p-6 rounded-[24px] shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-rose-500 text-xl">gpp_maybe</span>
              </div>
              <div>
                <h3 className="text-xs font-black text-[#3C3830] uppercase tracking-wider">Account Security</h3>
                <p className="text-[10px] text-[#7C7565] font-medium">Permanent data deletion and data export options.</p>
              </div>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-5 py-2.5 rounded-full border border-gray-100 text-[9px] font-black uppercase tracking-widest text-[#3C3830] hover:bg-gray-50 transition-all">
                Export
              </button>
              <button className="flex-1 md:flex-none px-5 py-2.5 rounded-full bg-rose-50 text-rose-600 text-[9px] font-black uppercase tracking-widest hover:bg-rose-100 transition-all">
                Delete Account
              </button>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}