// Application constants

export const BIBLE_TRANSLATIONS = {
  KJV: 'King James Version',
  ESV: 'English Standard Version',
  NIV: 'New International Version',
  NASB: 'New American Standard Bible',
  MSG: 'The Message',
} as const;

export const LANGUAGES = {
  en: 'English',
  es: 'Español',
  fr: 'Français',
  de: 'Deutsch',
  pt: 'Português',
  ja: '日本語',
  zh: '中文',
} as const;

export const PRAYER_CATEGORIES = [
  'Health',
  'Family',
  'Work',
  'Finances',
  'Relationships',
  'Spiritual Growth',
  'Guidance',
  'Thanksgiving',
  'Other',
] as const;

export const MOODS = [
  'Happy',
  'Sad',
  'Peaceful',
  'Anxious',
  'Grateful',
  'Hopeful',
  'Confused',
  'Frustrated',
  'Inspired',
] as const;

export const QUIET_TIME_TYPES = [
  'reading',
  'reflection',
  'audio',
  'summary',
] as const;

export const API_ENDPOINTS = {
  AI: {
    CHAT: '/ai/chat',
    DEVOTIONAL: '/ai/devotional',
    INSIGHT: '/ai/insight',
  },
  BIBLE: {
    DAILY: '/bible/daily',
    SEARCH: '/bible/search',
    CROSSREF: '/bible/crossref',
  },
  JOURNAL: {
    CREATE: '/journal/create',
    LIST: '/journal/list',
    UPDATE: '/journal/update',
  },
  PRAYERS: {
    CREATE: '/prayers/create',
    UPDATE: '/prayers/update',
  },
  AUDIO: {
    STREAM: '/audio/stream',
  },
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized. Please log in.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  GENERIC: 'An error occurred. Please try again.',
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

export const CACHE_DURATION = {
  VERY_SHORT: 5 * 60 * 1000, // 5 minutes
  SHORT: 15 * 60 * 1000, // 15 minutes
  MEDIUM: 60 * 60 * 1000, // 1 hour
  LONG: 24 * 60 * 60 * 1000, // 24 hours
} as const;
