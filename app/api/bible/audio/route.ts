import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_BIBLE_ID = 'de4e12af7f895f10-01';
const VERSION_MAP: Record<string, string> = {
  'eng-kjv': DEFAULT_BIBLE_ID,
  'en-kjv': DEFAULT_BIBLE_ID,
  'kjv': DEFAULT_BIBLE_ID,
  'de4e12af7f895f10-01': DEFAULT_BIBLE_ID,
  'eng-asv': 'de4e12af7f28f599-01',
  'en-asv': 'de4e12af7f28f599-01',
  'asv': 'de4e12af7f28f599-01',
  'niv': '06125ad3d5662098-01',
  'en-niv': '06125ad3d5662098-01',
  'eng-niv': '06125ad3d5662098-01',
  'oycb': 'b8d1feac6e94bd74-01',
  'yoruba': 'b8d1feac6e94bd74-01',
  'onen': '611f8eb23aec8f13-01',
  'swahili': '611f8eb23aec8f13-01',
};

const BOOK_MAP: Record<string, string> = {
  genesis: 'GEN',
  exodus: 'EXO',
  leviticus: 'LEV',
  numbers: 'NUM',
  deuteronomy: 'DEU',
  joshua: 'JOS',
  judges: 'JDG',
  ruth: 'RUT',
  '1samuel': '1SA',
  '2samuel': '2SA',
  '1kings': '1KI',
  '2kings': '2KI',
  '1chronicles': '1CH',
  '2chronicles': '2CH',
  ezra: 'EZR',
  nehemiah: 'NEH',
  esther: 'EST',
  job: 'JOB',
  psalms: 'PSA',
  proverbs: 'PRO',
  ecclesiastes: 'ECC',
  songofsolomon: 'SNG',
  isaiah: 'ISA',
  jeremiah: 'JER',
  lamentations: 'LAM',
  ezekiel: 'EZK',
  daniel: 'DAN',
  hosea: 'HOS',
  joel: 'JOL',
  amos: 'AMO',
  obadiah: 'OBA',
  jonah: 'JON',
  micah: 'MIC',
  nahum: 'NAM',
  habakkuk: 'HAB',
  zephaniah: 'ZEP',
  haggai: 'HAG',
  zechariah: 'ZEC',
  malachi: 'MAL',
  matthew: 'MAT',
  mark: 'MRK',
  luke: 'LUK',
  john: 'JHN',
  acts: 'ACT',
  romans: 'ROM',
  '1corinthians': '1CO',
  '2corinthians': '2CO',
  galatians: 'GAL',
  ephesians: 'EPH',
  philippians: 'PHP',
  colossians: 'COL',
  '1thessalonians': '1TH',
  '2thessalonians': '2TH',
  '1timothy': '1TI',
  '2timothy': '2TI',
  titus: 'TIT',
  philemon: 'PHM',
  hebrews: 'HEB',
  james: 'JAS',
  '1peter': '1PE',
  '2peter': '2PE',
  '1john': '1JN',
  '2john': '2JN',
  '3john': '3JN',
  jude: 'JUD',
  revelation: 'REV',
};

function normalizeVersionId(rawVersion: string | null): string {
  if (!rawVersion) return DEFAULT_BIBLE_ID;
  const cleaned = rawVersion.trim().toLowerCase();
  return VERSION_MAP[cleaned] || rawVersion.trim();
}

function normalizeBookCode(rawBook: string | null): string {
  if (!rawBook) return '';
  const normalizedKey = rawBook.trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
  return BOOK_MAP[normalizedKey] || rawBook.trim().toUpperCase();
}

function extractAudioUrl(payload: any): string | null {
  if (!payload) return null;
  return payload.data?.resourceUrl || payload.data?.url || payload.data?.audioUrl || payload.resourceUrl || payload.url || payload.audioUrl || null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const book = searchParams.get('book');
  const chapter = searchParams.get('chapter');
  const versionId = searchParams.get('versionId') || searchParams.get('version') || 'eng-KJV';

  if (!book || !chapter) {
    return NextResponse.json({ error: 'Book and Chapter are required' }, { status: 400 });
  }

  const chapterId = `${normalizeBookCode(book)}.${chapter}`;
  const normalizedVersionId = normalizeVersionId(versionId);
  const apiKey = process.env.BIBLE_API_KEY || process.env.NEXT_PUBLIC_BIBLE_API_KEY || process.env.NEXT_PUBLIC_AUDIO_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    const apiUrl = `https://api.scripture.api.bible/v1/bibles/${normalizedVersionId}/chapters/${chapterId}/audio`;
    const response = await fetch(apiUrl, {
      headers: {
        'api-key': apiKey,
      },
      next: { revalidate: 3600 },
    });

    if (response.ok) {
      const data = await response.json();
      const audioUrl = extractAudioUrl(data);
      if (audioUrl) {
        return NextResponse.json({
          success: true,
          url: audioUrl,
          expiresAt: data?.data?.expiresAt || null,
          provider: 'api.bible',
        });
      }
    } else {
      console.warn(`API.Bible audio lookup failed for ${chapterId} (${response.status})`);
    }

    const dbtKey = process.env.NEXT_PUBLIC_AUDIO_API_KEY || process.env.AUDIO_API_KEY;
    if (dbtKey) {
      const dbtCandidates = [
        `https://dbt.io/api/v1/audio?key=${dbtKey}&book_id=${normalizeBookCode(book)}&chapter=${chapter}`,
        `https://dbt.io/api/v1/audio?key=${dbtKey}&book_id=${normalizeBookCode(book).toLowerCase()}&chapter=${chapter}`,
        `https://dbt.io/api/v1/audio?key=${dbtKey}&book_id=${normalizeBookCode(book)}&chapter=${chapter}&bible_id=ENGKJV`,
      ];

      for (const candidateUrl of dbtCandidates) {
        try {
          const dbtResponse = await fetch(candidateUrl);
          if (!dbtResponse.ok) continue;
          const dbtData = await dbtResponse.json();
          const dbtAudioUrl = extractAudioUrl(dbtData);
          if (dbtAudioUrl) {
            return NextResponse.json({
              success: true,
              url: dbtAudioUrl,
              provider: 'dbt',
            });
          }
        } catch (dbtError) {
          console.warn('DBP4 audio fallback failed:', dbtError);
        }
      }
    }

    return NextResponse.json({ error: 'Audio resource not available for this version/chapter' }, { status: 404 });
  } catch (error) {
    console.error('Bible Audio Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}