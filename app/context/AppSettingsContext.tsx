'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'auto';
type FontSize = 'sm' | 'base' | 'lg' | 'xl';

interface AppSettingsContextType {
  theme: Theme;
  fontSize: FontSize;
  setTheme: (theme: Theme) => void;
  setFontSize: (size: FontSize) => void;
  saveSettings: () => void;
}

const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export function AppSettingsProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('auto');
  const [fontSize, setFontSizeState] = useState<FontSize>('base');

  // Load initial settings on mount
  useEffect(() => {
    const savedTheme = (localStorage.getItem('app-theme') as Theme) || 'auto';
    const savedSize = (localStorage.getItem('app-font-size') as FontSize) || 'base';
    setThemeState(savedTheme);
    setFontSizeState(savedSize);
    applyTheme(savedTheme);
    applyFontSize(savedSize);
  }, []);

  const applyTheme = (currentTheme: Theme) => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (currentTheme === 'auto') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(currentTheme);
    }
  };

  const applyFontSize = (size: FontSize) => {
    const root = window.document.documentElement;
    // Map font sizes to global root HTML document text classes
    root.classList.remove('text-sm', 'text-base', 'text-lg', 'text-xl');
    
    // Changing root text sizes dynamically changes Tailwind's relative scale (rem units)
    if (size === 'sm') root.style.fontSize = '14px';
    else if (size === 'base') root.style.fontSize = '16px';
    else if (size === 'lg') root.style.fontSize = '18px';
    else if (size === 'xl') root.style.fontSize = '20px';
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  const setFontSize = (newSize: FontSize) => {
    setFontSizeState(newSize);
    applyFontSize(newSize);
  };

  const saveSettings = () => {
    localStorage.setItem('app-theme', theme);
    localStorage.setItem('app-font-size', fontSize);
  };

  return (
    <AppSettingsContext.Provider value={{ theme, fontSize, setTheme, setFontSize, saveSettings }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (!context) throw new Error('useAppSettings must be used within an AppSettingsProvider');
  return context;
}