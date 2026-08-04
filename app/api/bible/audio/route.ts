import { NextRequest, NextResponse } from 'next/server';

const DEFAULT_BIBLE_ID = 'de4e12af7f895f10-01';

// API.Bible Audio Version IDs mapped to standard translation keys
const AUDIO_VERSION_MAP: Record<string, string> = {
  'eng-kjv': '179568874139209d-01', // KJV Audio
  'en-kjv': '179568874139209d-01',
  'kjv': '179568874139209d-01',
  'de4e12af7f29f59f-01': '179568874139209d-01',
  'de4e12af7f895f10-01': '179568874139209d-01',
};

const DBT_VERSION_MAP: Record<string, { filesetId: string; testaments: { old: string; new: string } }> = {
  'eng-kjv': { filesetId: 'ENGKJVO2DA', testaments: { old: 'ENGKJVO2DA', new: 'ENGKJVN2DA' } },
  'en-kjv': { filesetId: 'ENGKJVO2DA', testaments: { old: 'ENGKJVO2DA', new: 'ENGKJVN2DA' } },
  'kjv': { filesetId: 'ENGKJVO2DA', testaments: { old: 'ENGKJVO2DA', new: 'ENGKJVN2DA' } },
  'de4e12af7f29f59f-01': { filesetId: 'ENGKJVO2DA', testaments: { old: 'ENGKJVO2DA', new: 'ENGKJVN2DA' } },
  'de4e12af7f895f10-01': { filesetId: 'ENGKJVO2DA', testaments: { old: 'ENGKJVO2DA', new: 'ENGKJVN2DA' } },
  'eng-asv': { filesetId: 'ENGASVO2DA', testaments: { old: 'ENGASVO2DA', new: 'ENGASVN2DA' } },
  'en-asv': { filesetId: 'ENGASVO2DA', testaments: { old: 'ENGASVO2DA', new: 'ENGASVN2DA' } },
  'asv': { filesetId: 'ENGASVO2DA', testaments: { old: 'ENGASVO2DA', new: 'ENGASVN2DA' } },
  '06125ad3d5662098-01': { filesetId: 'ENGNIVO2DA', testaments: { old: 'ENGNIVO2DA', new: 'ENGNIVN2DA' } },
  'niv': { filesetId: 'ENGNIVO2DA', testaments: { old: 'ENGNIVO2DA', new: 'ENGNIVN2DA' } },
  'en-niv': { filesetId: 'ENGNIVO2DA', testaments: { old: 'ENGNIVO2DA', new: 'ENGNIVN2DA' } },
  'eng-niv': { filesetId: 'ENGNIVO2DA', testaments: { old: 'ENGNIVO2DA', new: 'ENGNIVN2DA' } },
  'oycb': { filesetId: 'ENGOYCB', testaments: { old: 'ENGOYCB', new: 'ENGOYCB' } },
  'yoruba': { filesetId: 'ENGOYCB', testaments: { old: 'ENGOYCB', new: 'ENGOYCB' } },
  'onen': { filesetId: 'ENGONEN', testaments: { old: 'ENGONEN', new: 'ENGONEN' } },
  'swahili': { filesetId: 'ENGONEN', testaments: { old: 'ENGONEN', new: 'ENGONEN' } },
};

const VERSION_MAP: Record<string, string> = {
  'eng-kjv': DEFAULT_BIBLE_ID,
  'en-kjv': DEFAULT_BIBLE_ID,
  'kjv': DEFAULT_BIBLE_ID,
  'de4e12af7f29f59f-01': DEFAULT_BIBLE_ID,
  'de4e12af7f895f10-01': DEFAULT_BIBLE_ID,
  'eng-asv': 'de4e12af7f28f599-01',
  'en-asv': 'de4e12af7f28f599-01',
  'asv': 'de4e12af7f28f599-01',
  '06125ad3d5662098-01': '06125ad3d5662098-01',
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

function getAudioVersionId(rawVersion: string | null): string | null {
  if (!rawVersion) return null;
  const cleaned = rawVersion.trim().toLowerCase();
  return AUDIO_VERSION_MAP[cleaned] || null;
}

function normalizeBookCode(rawBook: string | null): string {
  if (!rawBook) return '';
  const normalizedKey = rawBook.trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
  return BOOK_MAP[normalizedKey] || rawBook.trim().toUpperCase();
}

function getDbtFilesetId(rawVersion: string | null, rawBook: string | null): string | null {
  const versionKey = (rawVersion || 'eng-kjv').trim().toLowerCase();
  const config = DBT_VERSION_MAP[versionKey];
  if (!config) return null;

  const normalizedBookCode = normalizeBookCode(rawBook);
  const oldTestamentBooks = new Set([
    'GEN', 'EXO', 'LEV', 'NUM', 'DEU', 'JOS', 'JDG', 'RUT', '1SA', '2SA', 
    '1KI', '2KI', '1CH', '2CH', 'EZR', 'NEH', 'EST', 'JOB', 'PSA', 'PRO', 
    'ECC', 'SNG', 'ISA', 'JER', 'LAM', 'EZK', 'DAN', 'HOS', 'JOL', 'AMO', 
    'OBA', 'JON', 'MIC', 'NAM', 'HAB', 'ZEP', 'HAG', 'ZEC', 'MAL'
  ]);
  const isNewTestament = !oldTestamentBooks.has(normalizedBookCode);

  return (isNewTestament ? config.testaments.new : config.testaments.old) || config.filesetId;
}

function extractAudioUrl(payload: any): string | null {
  if (!payload) return null;

  const candidate =
    payload.data?.resourceUrl ||
    payload.data?.url ||
    payload.data?.audioUrl ||
    payload.resourceUrl ||
    payload.url ||
    payload.audioUrl ||
    null;

  if (typeof candidate === 'string' && candidate.trim()) return candidate;

  const items =
    payload.data?.files ||
    payload.files ||
    payload.data?.results ||
    payload.results ||
    payload.data ||
    [];

  if (Array.isArray(items)) {
    for (const item of items) {
      const nested =
        item?.path ||
        item?.url ||
        item?.resourceUrl ||
        item?.audioUrl ||
        item?.file?.url ||
        item?.file?.path ||
        item?.file?.resourceUrl;

      if (typeof nested === 'string' && nested.trim()) {
        return nested;
      }
    }
  }

  if (payload?.data?.fileset?.files?.length) {
    const file = payload.data.fileset.files[0];
    return file?.path || file?.url || file?.resourceUrl || file?.audioUrl || null;
  }

  return null;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const book = searchParams.get('book');
  const chapter = searchParams.get('chapter');
  const versionId = searchParams.get('versionId') || searchParams.get('version') || 'eng-KJV';

  if (!book || !chapter) {
    return NextResponse.json({ error: 'Book and Chapter are required' }, { status: 400 });
  }

  const normalizedBook = normalizeBookCode(book);
  const chapterId = `${normalizedBook}.${chapter}`;
  const apiKey = process.env.BIBLE_API_KEY || process.env.NEXT_PUBLIC_BIBLE_API_KEY;
  const dbtKey = process.env.NEXT_PUBLIC_AUDIO_API_KEY || process.env.AUDIO_API_KEY;

  if (!apiKey && !dbtKey) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

  try {
    // Strategy 1: DBT Fast Parallel Resolution
    if (dbtKey) {
      const filesetId = getDbtFilesetId(versionId, book);
      if (filesetId) {
        const candidateUrls = [
          `https://4.dbt.io/api/bibles/filesets/${filesetId}/${normalizedBook}/${chapter}?key=${dbtKey}&v=4`,
          `https://4.dbt.io/api/bibles/filesets/${filesetId}?key=${dbtKey}&v=4`,
        ];

        const results = await Promise.allSettled(
          candidateUrls.map((url) => fetch(url).then((res) => (res.ok ? res.json() : null)))
        );

        for (const result of results) {
          if (result.status === 'fulfilled' && result.value) {
            const url = extractAudioUrl(result.value);
            if (url) {
              return NextResponse.json({
                success: true,
                url,
                provider: 'dbt',
              });
            }
          }
        }
      }
    }

    // Strategy 2: API.Bible Resolution using Audio Bibles ID
    const audioVersionId = getAudioVersionId(versionId) || normalizeVersionId(versionId);

    if (apiKey && audioVersionId) {
      const apiUrl = `https://api.scripture.api.bible/v1/bibles/${audioVersionId}/chapters/${chapterId}/audio`;
      const response = await fetch(apiUrl, {
        headers: { 'api-key': apiKey },
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
      }
    }

    return NextResponse.json(
      { error: 'Audio resource not available for this version/chapter' },
      { status: 404 }
    );
  } catch (error) {
    console.error('Bible Audio Route Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}