// Global type definitions for the app

export type Language = 'en' | 'es' | 'fr' | 'de' | 'pt' | 'ja' | 'zh';
export type BibleTranslation = 'KJV' | 'ESV' | 'NIV' | 'NASB' | 'MSG';

export interface Bible {
  id: string;
  name: string;
  translation: BibleTranslation;
  language: Language;
  book: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface JournalEntry {
  id: string;
  title: string;
  content: string;
  mood?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Prayer {
  id: string;
  title: string;
  description: string;
  category: string;
  status: 'pending' | 'answered' | 'archived';
  createdAt: Date;
  answeredAt?: Date;
}

export interface AIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  preferences: UserPreferences;
  createdAt: Date;
}

export interface UserPreferences {
  language: Language;
  bibleTranslation: BibleTranslation;
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  dailyReminder: boolean;
}

export interface Streak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: Date;
}

export interface Community {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  createdAt: Date;
}

export interface CommunityGroup {
  id: string;
  name: string;
  description: string;
  communityId: string;
  memberCount: number;
  createdAt: Date;
}
