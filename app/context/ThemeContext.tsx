// context/ThemeContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { ThemeMode, ColorScheme, colorSchemes, defaultTheme, defaultColorScheme } from '@/lib/theme.config';

interface ThemeContextType {
  theme: ThemeMode;
  colorScheme: ColorScheme;
  setTheme: (theme: ThemeMode) => void;
  setColorScheme: (scheme: ColorScheme) => void;
  isDark: boolean;
  colors: typeof colorSchemes[ColorScheme];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<ThemeMode>(defaultTheme);
  const [colorScheme, setColorScheme] = useState<ColorScheme>(defaultColorScheme);
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Get system preference
  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  }, []);

  // Apply theme to document
  const applyTheme = useCallback((mode: ThemeMode) => {
    const root = document.documentElement;
    const isDarkMode = mode === 'dark' || (mode === 'auto' && getSystemTheme() === 'dark');
    
    setIsDark(isDarkMode);
    
    if (isDarkMode) {
      root.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [getSystemTheme]);

  // Apply color scheme CSS variables
  const applyColorScheme = useCallback((scheme: ColorScheme) => {
    const colors = colorSchemes[scheme];
    const root = document.documentElement;
    
    // Set CSS custom properties for dynamic styling
    Object.entries(colors.primary).forEach(([key, value]) => {
      root.style.setProperty(`--color-primary-${key}`, value);
    });
    
    root.style.setProperty('--color-primary', colors.primary[500]);
    root.style.setProperty('--color-primary-hover', colors.primary[600]);
    root.style.setProperty('--color-primary-active', colors.primary[700]);
    
    Object.entries(colors.accent).forEach(([key, value]) => {
      root.style.setProperty(`--color-accent-${key}`, value);
    });
    
    root.style.setProperty('--color-accent', colors.accent[500]);
    
    root.style.setProperty('--bg-light', colors.background.light);
    root.style.setProperty('--bg-dark', colors.background.dark);
    root.style.setProperty('--bg-card', colors.background.card);
    root.style.setProperty('--bg-elevated', colors.background.elevated);
    root.style.setProperty('--bg-surface', colors.background.surface);
    
    root.style.setProperty('--text-primary', colors.text.primary);
    root.style.setProperty('--text-secondary', colors.text.secondary);
    root.style.setProperty('--text-tertiary', colors.text.tertiary);
    root.style.setProperty('--text-inverse', colors.text.inverse);
    
    root.style.setProperty('--border-light', colors.border.light);
    root.style.setProperty('--border-dark', colors.border.dark);
    root.style.setProperty('--border-default', colors.border.default);
  }, []);

  // Load saved preferences
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme-mode') as ThemeMode | null;
    const savedColorScheme = localStorage.getItem('color-scheme') as ColorScheme | null;
    
    if (savedTheme) setTheme(savedTheme);
    if (savedColorScheme) setColorScheme(savedColorScheme);
    
    setMounted(true);
  }, []);

  // Apply theme when it changes
  useEffect(() => {
    if (!mounted) return;
    applyTheme(theme);
  }, [theme, mounted, applyTheme]);

  // Apply color scheme when it changes
  useEffect(() => {
    if (!mounted) return;
    applyColorScheme(colorScheme);
  }, [colorScheme, mounted, applyColorScheme]);

  // Listen to system preference changes for auto mode
  useEffect(() => {
    if (!mounted) return;
    
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'auto') {
        applyTheme('auto');
      }
    };
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted, applyTheme]);

  // Save preferences to localStorage when they change
  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('theme-mode', theme);
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('color-scheme', colorScheme);
  }, [colorScheme, mounted]);

  if (!mounted) {
    return <div style={{ visibility: 'hidden' }}>{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{
      theme,
      colorScheme,
      setTheme,
      setColorScheme,
      isDark,
      colors: colorSchemes[colorScheme]
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  
  // If context is missing temporarily, return a safe fallback instead of crashing
  if (!context) {
    return {
      isDark: false,
      setTheme: () => {},
      theme: 'light'
    };
  }
  
  return context;
}