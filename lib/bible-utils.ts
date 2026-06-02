/**
 * Bible name mapping utilities for converting between different formats
 * CDN API uses lowercase book names (e.g., 'genesis', 'exodus')
 * Frontend uses abbreviations (e.g., 'GEN', 'EXO')
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
  'ZEP': 'zephaniah',
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
 * Convert book abbreviation (e.g., 'GEN') to CDN API format (e.g., 'genesis')
 */
export function convertBookToCDNFormat(bookCode: string): string {
  return BOOK_ABBREVIATIONS[bookCode.toUpperCase()] || bookCode.toLowerCase();
}

/**
 * Convert CDN API book format to abbreviation
 */
export function convertCDNFormatToAbbreviation(book: string): string {
  const upperBook = book.toUpperCase();
  for (const [abbr, cdnFormat] of Object.entries(BOOK_ABBREVIATIONS)) {
    if (cdnFormat.toUpperCase() === upperBook) {
      return abbr;
    }
  }
  return upperBook;
}

/**
 * Get Bible version mapping for different APIs
 * Maps custom version IDs to CDN API version codes
 */
export const VERSION_MAPPING: Record<string, Record<string, string>> = {
  en: {
    'de4e12af7f29f59f-01': 'en-kjv', // KJV
    '06125ad3d5662098-01': 'en-asv', // NIV alternative (using ASV for CDN)
  },
  fr: {
    '01b17f8a70e2842c-01': 'fr-lsg', // French LSG
  },
  es: {
    '592420522e16040d-01': 'es-rvr', // Spanish
  },
  de: {
    'b17e01658803510c-01': 'de-elberfelder', // German
  },
};

/**
 * Get CDN version code from language and version ID
 */
export function getCDNVersion(langCode: string, versionId: string): string {
  return VERSION_MAPPING[langCode]?.[versionId] || `${langCode}-asv`;
}
