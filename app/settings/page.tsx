'use client';

import Link from 'next/link';
import Sidebar from '@/app/layout-components/Sidebar';
import { useTheme } from './../context/ThemeContext';

export default function SettingsPage() {
  const { isDark } = useTheme();

  const sections = [
    { title: 'Profile', href: '/settings/profile', icon: 'person', description: 'Manage your personal information' },
    { title: 'Bible Preferences', href: '/settings/bible-preferences', icon: 'auto_stories', description: 'Customize your reading experience' },
    { title: 'Language', href: '/settings/language', icon: 'translate', description: 'Choose your preferred language' },
    { title: 'Themes', href: '/settings/themes', icon: 'dark_mode', description: 'Adjust appearance and display' },
    { title: 'Notifications', href: '/settings/notifications', icon: 'notifications', description: 'Configure alert preferences' },
    { title: 'Security', href: '/settings/security', icon: 'shield_lock', description: 'Manage account protection' },
  ];

  return (
    <div className={`flex min-h-screen antialiased ${
      isDark ? 'bg-zinc-950 text-zinc-100 selection:bg-primary-950/50' : 'bg-white text-zinc-900 selection:bg-primary-100'
    }`}>
      <Sidebar />

      {/* Main Content Stream Container */}
      <main className="flex-1 lg:ml-64 pt-24 px-4 md:px-8 pb-24 max-w-[720px] mx-auto w-full">
        
        {/* Editorial Feed Header bar */}
        <header className={`mb-12 pb-4 ${
          isDark ? 'border-zinc-900' : 'border-zinc-100'
        } border-b`}>
          <div className={`flex items-center gap-1.5 mb-2 ${
            isDark ? 'text-primary-400' : 'text-primary-600'
          }`}>
            <span className="material-symbols-outlined text-[14px]">settings</span>
            <span className="text-[10px] font-sans font-semibold uppercase tracking-wider">Preferences</span>
          </div>
          <h1 className={`text-3xl md:text-4xl font-serif font-semibold tracking-tight ${
            isDark ? 'text-zinc-50' : 'text-zinc-900'
          }`}>
            System Settings
          </h1>
          <p className={`text-sm font-sans mt-1.5 ${
            isDark ? 'text-zinc-400' : 'text-zinc-500'
          }`}>
            Configure your sanctuary experience.
          </p>
        </header>

        {/* Settings Stream List */}
        <div className="space-y-0 mb-16">
          {sections.map((section) => (
            <Link 
              key={section.href} 
              href={section.href}
              className="group block py-5 first:pt-0 border-b ${
                isDark ? 'border-zinc-900/60' : 'border-zinc-100'
              }"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* Understated Minimal Icon Wrapper */}
                  <div className={`w-5 h-5 mt-0.5 flex items-center justify-center transition-colors ${
                    isDark 
                      ? 'text-zinc-500 group-hover:text-primary-400'
                      : 'text-zinc-400 group-hover:text-primary-600'
                  }`}>
                    <span className="material-symbols-outlined text-[20px]">
                      {section.icon}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className={`text-[15px] font-sans font-medium transition-colors ${
                      isDark
                        ? 'text-zinc-200 group-hover:text-primary-400'
                        : 'text-zinc-800 group-hover:text-primary-600'
                    }`}>
                      {section.title}
                    </h3>
                    <p className={`text-[13px] font-sans mt-0.5 leading-normal ${
                      isDark ? 'text-zinc-500' : 'text-zinc-400'
                    }`}>
                      {section.description}
                    </p>
                  </div>
                </div>

                <span className={`material-symbols-outlined text-lg transition-all ${
                  isDark
                    ? 'text-zinc-700 group-hover:text-primary-400 group-hover:translate-x-0.5'
                    : 'text-zinc-300 group-hover:text-primary-600 group-hover:translate-x-0.5'
                }`}>
                  chevron_right
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Danger Zone Section */}
        <section className={`pt-8 border-t ${
          isDark ? 'border-zinc-900' : 'border-zinc-100'
        }`}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-4">
            <div>
              <h3 className={`text-sm font-sans font-semibold uppercase tracking-wider ${
                isDark ? 'text-zinc-200' : 'text-zinc-800'
              }`}>
                Account Security
              </h3>
              <p className={`text-[13px] font-sans mt-1 ${
                isDark ? 'text-zinc-500' : 'text-zinc-400'
              }`}>
                Permanent data deletion and export options.
              </p>
            </div>
            
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button className={`flex-1 sm:flex-none px-4 py-2 rounded-full text-[12px] font-sans font-medium transition-colors border ${
                isDark
                  ? 'border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-zinc-300 bg-transparent'
                  : 'border-zinc-200 hover:border-zinc-300 text-zinc-600 bg-transparent'
              }`}>
                Export Data
              </button>
              <button className={`flex-1 sm:flex-none px-4 py-2 rounded-full text-[12px] font-sans font-medium transition-colors border ${
                isDark
                  ? 'bg-red-950/30 hover:bg-red-950/50 text-red-400 border-red-900/30'
                  : 'bg-red-50 hover:bg-red-100 text-red-600 border-transparent'
              }`}>
                Delete Account
              </button>
            </div>
          </div>
        </section>

        {/* Elegant Centered System Rule Dot Footer */}
        <div className="mt-24 flex justify-center">
          <div className={`w-1.5 h-1.5 rounded-full ${
            isDark ? 'bg-zinc-800' : 'bg-zinc-200'
          }`} />
        </div>
      </main>
    </div>
  );
}