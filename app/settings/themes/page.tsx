'use client';

import { useAppSettings } from '../../context/AppSettingsContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Sidebar from '@/app/layout-components/Sidebar';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

type ThemeOption = 'light' | 'dark' | 'auto';
type FontOption = 'sm' | 'base' | 'lg' | 'xl';

export default function ThemesSettingsPage() {
  const router = useRouter();
  const { theme, fontSize, setTheme, setFontSize, saveSettings } = useAppSettings();
  
  // Local state initialized from global settings for dynamic cancellations
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
    setTheme(val); // Applies change instantly across app
  };

  const handleLiveFontChange = (val: FontOption) => {
    setLocalFontSize(val);
    setFontSize(val); // App scales instantly on choice
  };

  const handleSave = async () => {
    setIsSaving(true);
    saveSettings();
    // Simulate minor layout sync verification time
    setTimeout(() => {
      setIsSaving(false);
      router.push('/settings');
    }, 400);
  };

  const handleCancel = () => {
    // Revert structural modifications back to saved global constants
    setTheme(theme);
    setFontSize(fontSize);
    router.push('/settings');
  };

  return (
    <div className="flex min-h-screen bg-[#FDFDFF] relative overflow-hidden">
      {/* Ambient background decoration matching dashboard */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <div className="absolute top-[15%] right-[10%] w-[350px] h-[350px] rounded-full bg-primary/5 blur-[100px]"></div>
        <div className="absolute bottom-[15%] left-[15%] w-[300px] h-[300px] rounded-full bg-[#D4AF37]/5 blur-[90px]"></div>
      </div>

      <Sidebar />

      <main className="flex-1 lg:ml-64 pt-24 px-6 md:px-10 pb-32 max-w-4xl mx-auto w-full z-10 relative">
        {/* Header section */}
        <header className="mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1 h-1 rounded-full bg-primary"></span>
            <span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary">Workspace Customization</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-serif text-[#3C3830] tracking-tight">
            Appearance & <span className="italic font-serif text-primary">Display</span>
          </h1>
        </header>

        <div className="space-y-6">
          {/* Card 1: Theme Selection */}
          <Card className="border-gray-100/60 bg-white/70 backdrop-blur-md p-6 rounded-[24px]">
            <div className="mb-4">
              <h3 className="text-sm font-serif font-bold text-[#3C3830]">Visual Scheme</h3>
              <p className="text-[11px] text-[#7C7565] opacity-80">Choose how the application layer handles light and dark environments.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {themeOptions.map((t) => {
                const isSelected = localTheme === t.value;
                return (
                  <div
                    key={t.value}
                    onClick={() => handleLiveThemeChange(t.value)}
                    className={`group flex items-start gap-3 p-4 border rounded-xl cursor-pointer transition-all duration-200 select-none ${
                      isSelected
                        ? 'border-primary bg-primary/[0.02] shadow-sm'
                        : 'border-gray-100 bg-white/40 hover:border-gray-200 hover:bg-white/90'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-primary/10 text-primary' : 'bg-gray-50 text-gray-400 group-hover:text-gray-600'
                    }`}>
                      <span className="material-symbols-outlined text-[18px]">{t.icon}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[12px] font-bold tracking-tight transition-colors ${
                        isSelected ? 'text-primary' : 'text-[#3C3830]'
                      }`}>
                        {t.label}
                      </p>
                      <p className="text-[10px] text-[#7C7565] mt-0.5 leading-tight opacity-80">
                        {t.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Card 2: Font Scaling Layout */}
          <Card className="border-gray-100/60 bg-white/70 backdrop-blur-md p-6 rounded-[24px]">
            <div className="mb-4">
              <h3 className="text-sm font-serif font-bold text-[#3C3830]">Typography Scaling</h3>
              <p className="text-[11px] text-[#7C7565] opacity-80">Adjust application typography scale dynamically across the workspace interface.</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {fontOptions.map((f) => {
                const isSelected = localFontSize === f.value;
                return (
                  <div
                    key={f.value}
                    onClick={() => handleLiveFontChange(f.value)}
                    className={`group relative flex flex-col justify-between p-4 border rounded-xl cursor-pointer transition-all duration-200 select-none ${
                      isSelected
                        ? 'border-primary bg-primary/[0.02] shadow-sm'
                        : 'border-gray-100 bg-white/40 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <span className={`font-serif font-black transition-all ${
                        f.value === 'sm' ? 'text-xs' : f.value === 'base' ? 'text-sm' : f.value === 'lg' ? 'text-base' : 'text-lg'
                      } ${isSelected ? 'text-primary' : 'text-[#3C3830]'}`}>
                        {f.sizeLabel}
                      </span>
                      {isSelected && (
                        <span className="material-symbols-outlined text-primary text-sm animate-scale-in">
                          check_circle
                        </span>
                      )}
                    </div>
                    <div>
                      <p className={`text-[11px] font-bold tracking-tight ${isSelected ? 'text-primary' : 'text-[#3C3830]'}`}>
                        {f.label}
                      </p>
                      <p className="text-[9px] text-[#7C7565] mt-0.5 leading-tight opacity-70">
                        {f.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Persistent Save Form Controllers */}
          <div className="flex items-center gap-3 pt-2">
            <Button 
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary hover:bg-primary-dark text-white rounded-full text-[10px] font-black uppercase tracking-widest px-8 py-3 shadow-sm min-w-[120px]"
            >
              {isSaving ? 'Syncing...' : 'Save Theme'}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleCancel}
              className="bg-white/80 backdrop-blur-sm border-gray-200 text-[#3C3830] hover:bg-gray-50 rounded-full text-[10px] font-black uppercase tracking-widest px-8 py-3"
            >
              Cancel
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}