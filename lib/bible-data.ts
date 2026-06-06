export const BIBLE_STRUCTURE = {
  oldTestament: [
    { name: 'GEN', chapters: 50 }, { name: 'EXO', chapters: 40 }, { name: 'LEV', chapters: 27 }, { name: 'NUM', chapters: 36 }, { name: 'DEU', chapters: 34 }, { name: 'JOS', chapters: 24 }, { name: 'JDG', chapters: 21 }, { name: 'RUT', chapters: 4 }, { name: '1SA', chapters: 31 }, { name: '2SA', chapters: 24 }, { name: '1KI', chapters: 22 }, { name: '2KI', chapters: 25 }, { name: '1CH', chapters: 29 }, { name: '2CH', chapters: 36 }, { name: 'EZR', chapters: 10 }, { name: 'NEH', chapters: 13 }, { name: 'EST', chapters: 10 }, { name: 'JOB', chapters: 42 }, { name: 'PSA', chapters: 150 }, { name: 'PRO', chapters: 31 }, { name: 'ECC', chapters: 12 }, { name: 'SNG', chapters: 8 }, { name: 'ISA', chapters: 66 }, { name: 'JER', chapters: 52 }, { name: 'LAM', chapters: 5 }, { name: 'EZK', chapters: 48 }, { name: 'DAN', chapters: 12 }, { name: 'HOS', chapters: 14 }, { name: 'JOL', chapters: 3 }, { name: 'AMO', chapters: 9 }, { name: 'OBA', chapters: 1 }, { name: 'JON', chapters: 4 }, { name: 'MIC', chapters: 7 }, { name: 'NAM', chapters: 3 }, { name: 'HAB', chapters: 3 }, { name: 'ZEP', chapters: 3 }, { name: 'HAG', chapters: 2 }, { name: 'ZEC', chapters: 14 }, { name: 'MAL', chapters: 4 }
  ],
  newTestament: [
    { name: 'MAT', chapters: 28 }, { name: 'MRK', chapters: 16 }, { name: 'LUK', chapters: 24 }, { name: 'JHN', chapters: 21 }, { name: 'ACT', chapters: 28 }, { name: 'ROM', chapters: 16 }, { name: '1CO', chapters: 16 }, { name: '2CO', chapters: 13 }, { name: 'GAL', chapters: 6 }, { name: 'EPH', chapters: 6 }, { name: 'PHP', chapters: 4 }, { name: 'COL', chapters: 4 }, { name: '1TH', chapters: 5 }, { name: '2TH', chapters: 3 }, { name: '1TI', chapters: 6 }, { name: '2TI', chapters: 4 }, { name: 'TIT', chapters: 3 }, { name: 'PHM', chapters: 1 }, { name: 'HEB', chapters: 13 }, { name: 'JAS', chapters: 5 }, { name: '1PE', chapters: 5 }, { name: '2PE', chapters: 3 }, { name: '1JO', chapters: 5 }, { name: '2JO', chapters: 1 }, { name: '3JO', chapters: 1 }, { name: 'JUD', chapters: 1 }, { name: 'REV', chapters: 22 }
  ]
};

export const BIBLE_METADATA = {
  languages: [
    { code: "eng", name: "English", nativeName: "English", flag: "🇺🇸" },
    { code: "yor", name: "Yoruba", nativeName: "Yorùbá", flag: "🇳🇬" },
    { code: "swh", name: "Swahili", nativeName: "Kiswahili", flag: "🇹🇿" },
    { code: "sna", name: "Shona", nativeName: "chiShona", flag: "🇿🇼" },
    { code: "spa", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
    { code: "tha", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
    { code: "vie", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
    { code: "urd", name: "Urdu", nativeName: "اردو", flag: "🇵🇰" },
    { code: "luo", name: "Dholuo", nativeName: "Dholuo", flag: "🇰🇪" },
    { code: "mal", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
    { code: "mar", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
    { code: "pes", name: "Persian", nativeName: "فارسی", flag: "🇮🇷" },
    { code: "pol", name: "Polish", nativeName: "Polski", flag: "🇵🇱" },
    { code: "por", name: "Portuguese", nativeName: "Português", flag: "🇧🇷" },
    { code: "nob", name: "Norwegian", nativeName: "Norsk", flag: "🇳🇴" },
    { code: "nld", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" }
  ],
  translations: [
    { id: "de4e12af7f29f59f-01", name: "King James Version", lang: "eng", abbreviation: "KJV" },
    { id: "06125ad3d5662098-01", name: "New International Version", lang: "eng", abbreviation: "NIV" },
    { id: "b8d1feac6e94bd74-01", name: "Biblica® Open Yoruba Contemporary Bible", lang: "yor", abbreviation: "OYCB" },
    { id: "611f8eb23aec8f13-01", name: "Biblica® Open Kiswahili Contemporary Version (Neno)", lang: "swh", abbreviation: "ONEN" },
    { id: "e8d99085dcb83ab5-01", name: "Biblica® Open Shona Contemporary Bible", lang: "sna", abbreviation: "OSCB" },
    { id: "592420522e16049f-01", name: "Reina Valera 1909", lang: "spa", abbreviation: "RVR09" },
    { id: "2ce937c12ac62906-01", name: "Biblica® Open Thai New Contemporary Version", lang: "tha", abbreviation: "TNCV" },
    { id: "5cc7093967a0a392-01", name: "Biblica® Open Vietnamese Contemporary Bible", lang: "vie", abbreviation: "OVCB" },
    { id: "eecbca904435fce9-01", name: "Biblica® Open Urdu Contemporary Version", lang: "urd", abbreviation: "OUCV" },
    { id: "4d4df8722134c5ee-01", name: "Biblica® Open New Luo Translation 2020", lang: "luo", abbreviation: "ONLT" },
    { id: "de295e9ba65f6d0f-01", name: "Biblica® Open Malayalam Contemporary Version 2020", lang: "mal", abbreviation: "OMCV" },
    { id: "3ea0147e32eebe47-01", name: "Indian Revised Version (IRV) Malayalam - 2025", lang: "mal", abbreviation: "IRVMAL" },
    { id: "1c825c8591183bb0-01", name: "Biblica® Open Marathi Contemporary Version", lang: "mar", abbreviation: "OMRCV" },
    { id: "7cd100148df29c08-01", name: "Biblica® Open Persian Contemporary Bible", lang: "pes", abbreviation: "OPCB" },
    { id: "1c9761e0230da6e0-01", name: "Updated Gdansk Bible", lang: "pol", abbreviation: "UBG" },
    { id: "d63894c8d9a7a503-01", name: "Biblia Livre Para Todos", lang: "por", abbreviation: "BLT" },
    { id: "246ad95eade0d0a1-01", name: "Biblica® Open Norwegian Living New Testament", lang: "nob", abbreviation: "ONLNT" },
    { id: "ead7b4cc5007389c-01", name: "Dutch Bible 1939", lang: "nld", abbreviation: "NLD1939" }
  ]
};

export const BIBLE_NAMES: Record<string, Record<string, string>> = {
  eng: { GEN: 'Genesis', EXO: 'Exodus', LEV: 'Leviticus', NUM: 'Numbers', DEU: 'Deuteronomy', JOS: 'Joshua', JDG: 'Judges', RUT: 'Ruth', '1SA': '1 Samuel', '2SA': '2 Samuel', '1KI': '1 Kings', '2KI': '2 Kings', '1CH': '1 Chronicles', '2CH': '2 Chronicles', EZR: 'Ezra', NEH: 'Nehemiah', EST: 'Esther', JOB: 'Job', PSA: 'Psalms', PRO: 'Proverbs', ECC: 'Ecclesiastes', SNG: 'Song of Solomon', ISA: 'Isaiah', JER: 'Jeremiah', LAM: 'Lamentations', EZK: 'Ezekiel', DAN: 'Daniel', HOS: 'Hosea', JOL: 'Joel', AMO: 'Amos', OBA: 'Obadiah', JON: 'Jonah', MIC: 'Micah', NAM: 'Nahum', HAB: 'Habakkuk', ZEP: 'Zephaniah', HAG: 'Haggai', ZEC: 'Zechariah', MAL: 'Malachi', MAT: 'Matthew', MRK: 'Mark', LUK: 'Luke', JHN: 'John', ACT: 'Acts', ROM: 'Romans', '1CO': '1 Corinthians', '2CO': '2 Corinthians', GAL: 'Galatians', EPH: 'Ephesians', PHP: 'Philippians', COL: 'Colossians', '1TH': '1 Thessalonians', '2TH': '2 Thessalonians', '1TI': '1 Timothy', '2TI': '2 Timothy', TIT: 'Titus', PHM: 'Philemon', HEB: 'Hebrews', JAS: 'James', '1PE': '1 Peter', '2PE': '2 Peter', '1JO': '1 John', '2JO': '2 John', '3JO': '3 John', JUD: 'Jude', REV: 'Revelation' },
  yor: { GEN: 'Gẹnẹsisi', EXO: 'Eksodu', LEV: 'Lefitiku', NUM: 'Nombeli', DEU: 'Diutaronomi', JOS: 'Daisi', JDG: 'Domonuwali' }
};