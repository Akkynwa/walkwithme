// Global state management using Zustand
'use client';

import { create } from 'zustand';
import { UserPreferences, User } from '@/types';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

interface UIStore {
  sidebarOpen: boolean;
  theme: 'light' | 'dark' | 'auto';
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark' | 'auto') => void;
}

interface PreferencesStore {
  preferences: UserPreferences | null;
  setPreferences: (prefs: UserPreferences) => void;
}

export const useAuthStore = create<AuthStore>(set => ({
  user: null,
  isAuthenticated: false,
  setUser: (user: User | null) =>
    set({
      user,
      isAuthenticated: !!user,
    }),
  logout: () =>
    set({
      user: null,
      isAuthenticated: false,
    }),
}));

export const useUIStore = create<UIStore>(set => ({
  sidebarOpen: true,
  theme: 'auto',
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  setTheme: (theme: 'light' | 'dark' | 'auto') => set({ theme }),
}));

export const usePreferencesStore = create<PreferencesStore>(set => ({
  preferences: null,
  setPreferences: (preferences: UserPreferences) => set({ preferences }),
}));
