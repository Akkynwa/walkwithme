'use client';

import { useAppSettings } from '../../context/AppSettingsContext';
import Sidebar from '@/app/layout-components/Sidebar';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

type ThemeOption = 'light' | 'dark' | 'auto';
type FontOption = 'sm' | 'base' | 'lg' | 'xl';

export default function ThemesSettingsPage() {
  const router = useRouter();
  const { theme, fontSize, setTheme, setFontSize, saveSettings } = useAppSettings();
  
  const [localTheme, setLocalTheme] = useState<ThemeOption>(theme);
  const [localFontSize, setLocalFontSize] = useState<FontOption>(fontSize);
  const [isSaving, setIsSaving] = useState(false);

  const themeOptions = [
    { value: 'light' as ThemeOption, label: 'Light Mode', description: 'Bright, high-contrast workspace environment.', icon: 'light_mode' },
    { value: 'dark' as ThemeOption, label: 'Dark Mode', description: 'Low luminosity, perfect for late reflections.', icon: 'dark_mode' },
    { value: 'auto' as ThemeOption, label: 'System Default', description: 'Coordinates instantly with your native device.', icon: 'contrast' },
  ];

  const fontOptions = [
    { value: 'sm' as FontOption, label: 'Compact', sizeLabel: 'A', desc: 'Dense architecture layout' },
    { value: 'base' as FontOption, label: 'Standard', sizeLabel: 'A', desc: 'Balanced default interface' },
    { value: 'lg' as FontOption, label: 'Expanded', sizeLabel: 'A', desc: 'Enhanced legibility framing' },
    { value: 'xl' as FontOption, label: 'Accessible', sizeLabel: 'A', desc: 'Maximum character scaling' },
  ];

  const handleLiveThemeChange = (val: ThemeOption) => {
    setLocalTheme(val);
    setTheme(val);
  };

  const handleLiveFontChange = (val: FontOption) => {
    setLocalFontSize(val);
    setFontSize(val);
  };

  const handleSave = async () => {
    setIsSaving(true);
    saveSettings();
    setTimeout(() => {
      setIsSaving(false);
      router.push('/settings');
    }, 400);
  };

  const handleCancel = () => {
    setTheme(theme);
    setFontSize(fontSize);
    router.push('/settings');
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

      <main className="relative z-10 flex-1 lg:ml-56 pt-20 px-6 md:px-10 pb-16 max-w-4xl mx-auto w-full">
        {/* Header section */}
        <header className="mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-6 h-px bg-amber-400/40" />
            <span className="text-[8px] font-black uppercase tracking-wider text-amber-600">Workspace Customization</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif text-gray-800 tracking-tight">
            Appearance & <span className="italic font-serif text-amber-600">Display</span>
          </h1>
          <p className="text-sm text-gray-500 italic border-l-2 border-amber-400 pl-4 mt-2">
            Customize how your sanctuary looks and feels.
          </p>
        </header>

        <div className="space-y-5">
          {/* Card 1: Theme Selection */}
          <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-xl p-5 shadow-lg">
            <div className="mb-4">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="material-symbols-outlined text-amber-500 text-[14px]">palette</span>
                <h3 className="text-[10px] font-serif font-bold text-gray-800">Visual Scheme</h3>
              </div>
              <p className="text-[8px] text-gray-500">Choose how the application handles light and dark environments.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {themeOptions.map((t) => {
                const isSelected = localTheme === t.value;
                return (
                  <div
                    key={t.value}
                    onClick={() => handleLiveThemeChange(t.value)}
                    className={`group flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-all duration-200 select-none ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/30 shadow-sm'
                        : 'border-gray-200 bg-white/40 hover:border-amber-300 hover:bg-white/60'
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-amber-100 text-amber-600' : 'bg-gray-100 text-gray-400 group-hover:text-amber-500'
                    }`}>
                      <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[9px] font-bold tracking-tight transition-colors ${
                        isSelected ? 'text-amber-700' : 'text-gray-700'
                      }`}>
                        {t.label}
                      </p>
                      <p className="text-[7px] text-gray-500 mt-0.5 leading-tight">
                        {t.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 2: Font Scaling Layout */}
          <div className="bg-white/40 backdrop-blur-xl border border-white/60 rounded-xl p-5 shadow-lg">
            <div className="mb-4">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="material-symbols-outlined text-amber-500 text-[14px]">text_fields</span>
                <h3 className="text-[10px] font-serif font-bold text-gray-800">Typography Scaling</h3>
              </div>
              <p className="text-[8px] text-gray-500">Adjust application typography scale across the workspace interface.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {fontOptions.map((f) => {
                const isSelected = localFontSize === f.value;
                return (
                  <div
                    key={f.value}
                    onClick={() => handleLiveFontChange(f.value)}
                    className={`group relative flex flex-col justify-between p-3 border rounded-lg cursor-pointer transition-all duration-200 select-none ${
                      isSelected
                        ? 'border-amber-500 bg-amber-50/30 shadow-sm'
                        : 'border-gray-200 bg-white/40 hover:border-amber-300 hover:bg-white/60'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className={`font-serif font-black transition-all ${
                        f.value === 'sm' ? 'text-xs' : f.value === 'base' ? 'text-sm' : f.value === 'lg' ? 'text-base' : 'text-lg'
                      } ${isSelected ? 'text-amber-600' : 'text-gray-700'}`}>
                        {f.sizeLabel}
                      </span>
                      {isSelected && (
                        <span className="material-symbols-outlined text-amber-500 text-sm animate-scale-in">
                          check_circle
                        </span>
                      )}
                    </div>
                    <div>
                      <p className={`text-[8px] font-bold tracking-tight ${isSelected ? 'text-amber-700' : 'text-gray-700'}`}>
                        {f.label}
                      </p>
                      <p className="text-[6px] text-gray-500 mt-0.5 leading-tight">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Persistent Save Form Controllers */}
          <div className="flex items-center gap-3 pt-2">
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-gradient-to-r from-amber-600 to-amber-700 hover:shadow-lg hover:shadow-amber-500/25 hover:scale-[1.02] text-white rounded-lg text-[8px] font-black uppercase tracking-wider px-6 py-2.5 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-[12px]">sync</span>
                  Syncing...
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-[12px]">save</span>
                  Save Theme
                </>
              )}
            </button>
            <button 
              onClick={handleCancel}
              className="bg-white/50 backdrop-blur-sm border border-gray-200 text-gray-600 rounded-lg text-[8px] font-black uppercase tracking-wider px-5 py-2.5 hover:bg-white/80 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* Decorative Footer */}
        <div className="mt-10 flex justify-center items-center gap-4 opacity-30">
          <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-400" />
          <span className="material-symbols-outlined text-amber-400 text-sm">palette</span>
          <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-400" />
        </div>
      </main>
    </div>
  );
}