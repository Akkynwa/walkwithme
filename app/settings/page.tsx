'use client';

import Link from 'next/link';
import Sidebar from '@/app/layout-components/Sidebar';
import Image from 'next/image';

export default function SettingsPage() {
  const sections = [
    { title: 'Profile', href: '/settings/profile', icon: 'person', description: 'Manage your personal information' },
    { title: 'Bible Preferences', href: '/settings/bible-preferences', icon: 'auto_stories', description: 'Customize your reading experience' },
    { title: 'Language', href: '/settings/language', icon: 'translate', description: 'Choose your preferred language' },
    { title: 'Themes', href: '/settings/themes', icon: 'dark_mode', description: 'Adjust appearance and display' },
    { title: 'Notifications', href: '/settings/notifications', icon: 'notifications', description: 'Configure alert preferences' },
    { title: 'Security', href: '/settings/security', icon: 'shield_lock', description: 'Manage account protection' },
  ];

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

      <main className="relative z-10 flex-1 lg:ml-56 pt-20 px-6 md:px-10 pb-16 max-w-6xl mx-auto w-full">
        
        {/* Header */}
        <header className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-px bg-amber-400/40" />
            <span className="text-[8px] font-black uppercase tracking-wider text-amber-600">Preferences</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif text-gray-800 tracking-tight">
            System <span className="italic font-serif text-amber-600">Settings</span>
          </h1>
          <p className="text-sm text-gray-500 italic border-l-2 border-amber-400 pl-4 mt-2">
            Configure your sanctuary experience.
          </p>
        </header>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {sections.map((section) => (
            <Link 
              key={section.href} 
              href={section.href}
              className="group"
            >
              <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-xl p-4 hover:bg-white/60 hover:border-amber-200 hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center group-hover:bg-amber-100 transition-colors">
                    <span className="material-symbols-outlined text-amber-600 text-[18px] group-hover:text-amber-700 transition-colors">
                      {section.icon}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-[10px] font-bold text-gray-800 tracking-tight group-hover:text-amber-700 transition-colors">
                      {section.title}
                    </h3>
                    <p className="text-[7px] text-gray-500 font-medium">
                      {section.description}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-gray-300 text-sm group-hover:translate-x-0.5 group-hover:text-amber-500 transition-all">
                    chevron_right
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Danger Zone */}
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
          <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-xl p-5 flex flex-col md:flex-row items-center justify-between gap-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-rose-500 text-[16px]">gpp_maybe</span>
              </div>
              <div>
                <h3 className="text-[9px] font-black text-gray-800 uppercase tracking-wider">Account Security</h3>
                <p className="text-[7px] text-gray-500 font-medium">Permanent data deletion and export options.</p>
              </div>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-4 py-1.5 rounded-lg border border-gray-200 text-[7px] font-black uppercase tracking-wider text-gray-600 hover:bg-white/50 hover:border-amber-300 transition-all">
                Export Data
              </button>
              <button className="flex-1 md:flex-none px-4 py-1.5 rounded-lg bg-rose-50 text-rose-600 text-[7px] font-black uppercase tracking-wider hover:bg-rose-100 transition-all">
                Delete Account
              </button>
            </div>
          </div>
        </section>

        {/* Decorative Footer */}
        <div className="mt-10 flex justify-center items-center gap-4 opacity-30">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400" />
          <span className="material-symbols-outlined text-amber-400 text-sm">settings</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400" />
        </div>
      </main>
    </div>
  );
}