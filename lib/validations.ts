// Validation schemas using Zod
import { z } from 'zod';

export const JournalEntrySchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  mood: z.string().optional(),
  tags: z.array(z.string()).optional(),
});

export const PrayerSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title too long'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(1, 'Category is required'),
});

export const UpdatePrayerSchema = z.object({
  status: z.enum(['pending', 'answered', 'archived']),
});

export const SearchQuerySchema = z.object({
  query: z.string().min(1, 'Search query required').max(100),
  limit: z.number().min(1).max(100).optional(),
  offset: z.number().min(0).optional(),
});

export const BibleSearchSchema = z.object({
  keyword: z.string().min(1, 'Keyword required'),
  translation: z.string().optional(),
  limit: z.number().min(1).max(50).optional(),
});

export const ChatMessageSchema = z.object({
  message: z.string().min(1, 'Message is required'),
  conversationId: z.string().optional(),
});

export const UserPreferencesSchema = z.object({
  language: z.enum(['en', 'es', 'fr', 'de', 'pt', 'ja', 'zh']),
  bibleTranslation: z.enum(['KJV', 'ESV', 'NIV', 'NASB', 'MSG']),
  theme: z.enum(['light', 'dark', 'auto']),
  notifications: z.boolean(),
  dailyReminder: z.boolean(),
});

// Type exports for use throughout the app
export type JournalEntry = z.infer<typeof JournalEntrySchema>;
export type Prayer = z.infer<typeof PrayerSchema>;
export type SearchQuery = z.infer<typeof SearchQuerySchema>;
export type BibleSearch = z.infer<typeof BibleSearchSchema>;
export type ChatMessage = z.infer<typeof ChatMessageSchema>;
export type UserPreferences = z.infer<typeof UserPreferencesSchema>;
