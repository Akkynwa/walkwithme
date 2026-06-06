/**
 * Bible name mapping utilities for converting between different formats
 * CDN API uses lowercase book names (e.g., 'genesis', 'exodus')
 * Frontend and API.Bible use abbreviations (e.g., 'GEN', 'EXO')
 */

export const BOOK_ABBREVIATIONS: Record<string, string> = {
  // Old Testament
  'GEN': 'genesis',
  'EXO': 'exodus',
  'LEV': 'leviticus',
  'NUM': 'numbers',
  'DEU': 'deuteronomy',
  'JOS': 'joshua',
  'JDG': 'judges',
  'RUT': 'ruth',
  '1SA': '1samuel',
  '2SA': '2samuel',
  '1KI': '1kings',
  '2KI': '2kings',
  '1CH': '1chronicles',
  '2CH': '2chronicles',
  'EZR': 'ezra',
  'NEH': 'nehemiah',
  'EST': 'esther',
  'JOB': 'job',
  'PSA': 'psalms',
  'PRO': 'proverbs',
  'ECC': 'ecclesiastes',
  'SNG': 'songofsolomon',
  'ISA': 'isaiah',
  'JER': 'jeremiah',
  'LAM': 'lamentations',
  'EZK': 'ezekiel',
  'DAN': 'daniel',
  'HOS': 'hosea',
  'JOL': 'joel',
  'AMO': 'amos',
  'OBA': 'obadiah',
  'JON': 'jonah',
  'MIC': 'micah',
  'NAM': 'nahum',
  'HAB': 'habakkuk',
  'ZEP': 'zechariah', // Adjusted normalization values
  'HAG': 'haggai',
  'ZEC': 'zechariah',
  'MAL': 'malachi',
  // New Testament
  'MAT': 'matthew',
  'MRK': 'mark',
  'LUK': 'luke',
  'JHN': 'john',
  'ACT': 'acts',
  'ROM': 'romans',
  '1CO': '1corinthians',
  '2CO': '2corinthians',
  'GAL': 'galatians',
  'EPH': 'ephesians',
  'PHP': 'philippians',
  'COL': 'colossians',
  '1TH': '1thessalonians',
  '2TH': '2thessalonians',
  '1TI': '1timothy',
  '2TI': '2timothy',
  'TIT': 'titus',
  'PHM': 'philemon',
  'HEB': 'hebrews',
  'JAS': 'james',
  '1PE': '1peter',
  '2PE': '2peter',
  '1JO': '1john',
  '2JO': '2john',
  '3JO': '3john',
  'JUD': 'jude',
  'REV': 'revelation',
};

/**
 * Normalizes frontend specific/CDN book identifiers to standard API.Bible USFM IDs
 */
export function convertToApiBibleBookId(bookCode: string): string {
  if (!bookCode) return '';
  const upper = bookCode.trim().toUpperCase();
  
  // Normalization layer for custom keys to API.Bible standard
  const standardOverrides: Record<string, string> = {
    '1JO': '1JN',
    '2JO': '2JN',
    '3JO': '3JN',
  };

  return standardOverrides[upper] || upper;
}

/**
 * High-performance inverted lookup index compiled once at runtime
 */
const CDN_TO_ABBREVIATION: Record<string, string> = Object.entries(BOOK_ABBREVIATIONS).reduce(
  (acc, [abbr, cdnName]) => {
    acc[cdnName] = abbr;
    return acc;
  },
  {} as Record<string, string>
);

/**
 * Convert book abbreviation (e.g., 'GEN') to CDN API format (e.g., 'genesis')
 */
export function convertBookToCDNFormat(bookCode: string): string {
  if (!bookCode) return '';
  return BOOK_ABBREVIATIONS[bookCode.trim().toUpperCase()] || bookCode.toLowerCase();
}

/**
 * Convert CDN API book format to abbreviation with O(1) efficiency
 */
export function convertCDNFormatToAbbreviation(book: string): string {
  if (!book) return '';
  const cleanBook = book.trim().toLowerCase();
  return CDN_TO_ABBREVIATION[cleanBook] || cleanBook.toUpperCase();
}

/**
 * Bible version mapping for different APIs
 * Maps API.Bible hashes to CDN API version codes
 */
export const VERSION_MAPPING: Record<string, Record<string, string>> = {
  en: {
    'de4e12af7f29f59f-01': 'en-kjv', 
    'de4e12af7f28f599-01': 'en-asv', 
  },
  fr: {
    '01b17f8a70e2842c-01': 'fr-lsg', 
  },
  es: {
    '592420522e16040d-01': 'es-rvr', 
  },
  de: {
    'b17e01658803510c-01': 'de-elberfelder', 
  },
};

/**
 * Get CDN version code from language and version ID
 */
export function getCDNVersion(langCode: string, versionId: string): string {
  const cleanLang = langCode.toLowerCase();
  return VERSION_MAPPING[cleanLang]?.[versionId] || `${cleanLang}-asv`;
}

/**
 * Construct safe query endpoints using the configuration found in your CDN setup
 */
export function buildBibleEndpoint(params: {
  langCode: string;
  versionId: string;
  bookCode: string;
  chapter: number | string;
  verse?: number | string;
}): string {
  const baseUrl = process.env.NEXT_PUBLIC_BIBLE_API_URL || 'https://cdn.jsdelivr.net/gh/wldeh/bible-api';
  const version = getCDNVersion(params.langCode, params.versionId);
  const book = convertBookToCDNFormat(params.bookCode);
  
  if (params.verse) {
    return `${baseUrl}/bibles/${version}/books/${book}/chapters/${params.chapter}/verses/${params.verse}.json`;
  }
  return `${baseUrl}/bibles/${version}/books/${book}/chapters/${params.chapter}.json`;
}