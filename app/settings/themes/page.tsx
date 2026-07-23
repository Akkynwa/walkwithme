'use client';

import { useTheme } from '../../context/ThemeContext';
import Sidebar from '@/app/layout-components/Sidebar';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ThemeMode } from '@/lib/theme.config';

type FontOption = 'sm' | 'base' | 'lg' | 'xl';

export default function ThemesSettingsPage() {
  const router = useRouter();
  const { theme, setTheme, isDark } = useTheme();
  
  const [localTheme, setLocalTheme] = useState<ThemeMode>(theme as ThemeMode);
  const [localFontSize, setLocalFontSize] = useState<FontOption>('base');
  const [isSaving, setIsSaving] = useState(false);

  const themeOptions = [
    { value: 'light' as ThemeMode, label: 'Light Mode', description: 'Bright, high-contrast workspace environment.', icon: 'light_mode' },
    { value: 'dark' as ThemeMode, label: 'Dark Mode', description: 'Low luminosity, perfect for late reflections.', icon: 'dark_mode' },
    { value: 'auto' as ThemeMode, label: 'System Default', description: 'Coordinates instantly with your native device.', icon: 'contrast' },
  ];

  const fontOptions = [
    { value: 'sm' as FontOption, label: 'Compact', sizeLabel: 'A', desc: 'Dense architecture layout' },
    { value: 'base' as FontOption, label: 'Standard', sizeLabel: 'A', desc: 'Balanced default interface' },
    { value: 'lg' as FontOption, label: 'Expanded', sizeLabel: 'A', desc: 'Enhanced legibility framing' },
    { value: 'xl' as FontOption, label: 'Accessible', sizeLabel: 'A', desc: 'Maximum character scaling' },
  ];

  const handleLiveThemeChange = (val: ThemeMode) => {
    setLocalTheme(val);
    setTheme(val);
  };

  const handleLiveFontChange = (val: FontOption) => {
    setLocalFontSize(val);
    const root = document.documentElement;
    const fontSizes = { sm: '14px', base: '16px', lg: '18px', xl: '20px' };
    root.style.fontSize = fontSizes[val];
    localStorage.setItem('font-size', val);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      router.push('/settings');
    }, 400);
  };

  const handleCancel = () => {
    setTheme(localTheme);
    router.push('/settings');
  };

  useEffect(() => {
    const savedFontSize = localStorage.getItem('font-size') as FontOption | null;
    if (savedFontSize) {
      setLocalFontSize(savedFontSize);
      const fontSizes = { sm: '14px', base: '16px', lg: '18px', xl: '20px' };
      document.documentElement.style.fontSize = fontSizes[savedFontSize];
    }
  }, []);

  return (
    <div className={`flex min-h-screen antialiased selection:bg-orange-100 dark:selection:bg-orange-950/50 ${isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-white text-zinc-900'}`}>
      <Sidebar />

      {/* Main Single-Column Settings Area */}
      <main className="flex-1 lg:ml-64 pt-24 px-4 md:px-8 pb-24 max-w-[720px] mx-auto w-full">
        
        {/* Editorial Substack Header row */}
        <header className="mb-12 pb-4 border-b border-zinc-100 dark:border-zinc-900">
          <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-500 mb-2">
            <span className="material-symbols-outlined text-[14px]">palette</span>
            <span className="text-[10px] font-sans font-semibold uppercase tracking-wider">Workspace Customization</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-serif font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Appearance & Display
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400 font-sans mt-1.5">
            Customize how your sanctuary looks and feels.
          </p>
        </header>

        <div className="space-y-12">
          
          {/* Section 1: Theme Selection */}
          <section className="pb-8 border-b border-zinc-100 dark:border-zinc-900/60">
            <div className="mb-6">
              <h3 className="text-sm font-sans font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                Visual Scheme
              </h3>
              <p className="text-[13px] text-zinc-400 dark:text-zinc-500 font-sans mt-0.5">
                Choose how the application handles light and dark environments.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {themeOptions.map((t) => {
                const isSelected = localTheme === t.value;
                return (
                  <div
                    key={t.value}
                    onClick={() => handleLiveThemeChange(t.value)}
                    className={`group flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-colors select-none ${
                      isSelected
                        ? 'border-orange-600 dark:border-orange-500 bg-zinc-50 dark:bg-zinc-900/40'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-transparent'
                    }`}
                  >
                    <div className={`w-5 h-5 flex items-center justify-center transition-colors ${
                      isSelected ? 'text-orange-600 dark:text-orange-500' : 'text-zinc-400 dark:text-zinc-500'
                    }`}>
                      <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[13px] font-sans font-medium transition-colors ${
                        isSelected ? 'text-orange-600 dark:text-orange-500' : 'text-zinc-800 dark:text-zinc-200'
                      }`}>
                        {t.label}
                      </p>
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-1 leading-normal font-sans">
                        {t.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Section 2: Font Scaling Layout */}
          <section className="pb-4">
            <div className="mb-6">
              <h3 className="text-sm font-sans font-semibold text-zinc-800 dark:text-zinc-200 uppercase tracking-wider">
                Typography Scaling
              </h3>
              <p className="text-[13px] text-zinc-400 dark:text-zinc-500 font-sans mt-0.5">
                Adjust application typography scale across the workspace interface.
              </p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {fontOptions.map((f) => {
                const isSelected = localFontSize === f.value;
                return (
                  <div
                    key={f.value}
                    onClick={() => handleLiveFontChange(f.value)}
                    className={`group relative flex flex-col justify-between p-4 border rounded-xl cursor-pointer transition-colors select-none ${
                      isSelected
                        ? 'border-orange-600 dark:border-orange-500 bg-zinc-50 dark:bg-zinc-900/40'
                        : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 bg-transparent'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className={`font-serif font-bold ${
                        f.value === 'sm' ? 'text-xs' : f.value === 'base' ? 'text-sm' : f.value === 'lg' ? 'text-base' : 'text-lg'
                      } ${isSelected ? 'text-orange-600 dark:text-orange-500' : 'text-zinc-800 dark:text-zinc-200'}`}>
                        {f.sizeLabel}
                      </span>
                      {isSelected && (
                        <span className="material-symbols-outlined text-orange-600 dark:text-orange-500 text-sm">
                          check_circle
                        </span>
                      )}
                    </div>
                    <div>
                      <p className={`text-[12px] font-sans font-medium ${isSelected ? 'text-orange-600 dark:text-orange-500' : 'text-zinc-800 dark:text-zinc-200'}`}>
                        {f.label}
                      </p>
                      <p className="text-[11px] text-zinc-400 dark:text-zinc-500 mt-0.5 leading-normal font-sans">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Understated Save Form Controllers */}
          <div className="flex items-center gap-3 pt-6 border-t border-zinc-100 dark:border-zinc-900">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white font-medium text-[12px] px-4 py-2 rounded-full transition-colors shadow-sm"
            >
              {isSaving ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[14px]">sync</span>
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[14px]">save</span>
                  <span>Save Changes</span>
                </>
              )}
            </button>
            <button 
              onClick={handleCancel}
              className="px-4 py-2 border border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700 rounded-full text-[12px] font-sans font-medium text-zinc-600 dark:text-zinc-400 transition-colors bg-transparent"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Current Mode Indicator Footer */}
        <div className="mt-16 text-center">
          <p className="text-[11px] font-sans text-zinc-400 dark:text-zinc-500">
            Currently in {isDark ? '🌙 Dark' : '☀️ Light'} mode
          </p>
        </div>

        {/* Elegant Centered System Rule Dot Divider */}
        <div className="mt-8 flex justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800" />
        </div>
      </main>
    </div>
  );
}