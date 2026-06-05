// config/bible.ts

export interface BibleVersionConfig {
  id: string;       // Path matching ID (e.g., 'en-kjv')
  name: string;     // Display name (e.g., 'King James Version')
  language: string; // Display language
}

export const SUPPORTED_TRANSLATIONS: BibleVersionConfig[] = [
  { id: 'en-kjv', name: 'King James Version', language: 'English' },
  { id: 'en-asv', name: 'American Standard Version', language: 'English' },
  { id: 'es-rvr', name: 'Reina-Valera 1902', language: 'Español' },
  { id: 'fr-lsg', name: 'Louis Segond 1910', language: 'Français' },
  { id: 'pt-aa', name: 'Almeida Atualizada', language: 'Português' }
];

// Quick lookup list for client-side drop-downs
export const COMMON_BOOKS = [
  'genesis', 'exodus', 'levitcus', 'numbers', 'deuteronomy',
  'joshua', 'judges', 'ruth', '1samuel', '2samuel', '1kings', '2kings',
  'isaiah', 'jeremiah', 'lamentations', 'ezekiel', 'daniel',
  'matthew', 'mark', 'lucas', 'john', 'acts', 'romans', 
  '1corinthians', '2corinthians', 'galatians', 'ephesians', 'philippians',
  'colossians', '1thessalonians', '2thessalonians', '1timothy', '2timothy',
  'titus', 'philemon', 'hebrews', 'james', '1peter', '2peter', 
  '1john', '2john', '3john', 'jude', 'revelation'
];