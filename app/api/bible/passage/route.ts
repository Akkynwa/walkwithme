import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const FREE_API_BASE = 'https://bible.helloao.org/api';
const PAID_API_BASE = 'https://api.scripture.api.bible/v1';

const DEFAULT_FREE_TRANSLATION = 'BSB';

const FREE_TRANSLATION_MAP: Record<string, string> = {
  KJV: 'BSB',
  NIV: 'BSB',
  RVR09: 'RVR09',
  BSB: 'BSB',
  'DE4E12AF7F29F59F-01': 'BSB',
  'DE4E12AF7F895F10-01': 'BSB',
  '06125AD3D5662098-01': 'BSB',
};

function getFreeTranslationCode(rawBibleId: string): string {
  const upper = rawBibleId.trim().toUpperCase();
  return FREE_TRANSLATION_MAP[upper] || DEFAULT_FREE_TRANSLATION;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawBibleId = searchParams.get('bibleId');
  const passageId = searchParams.get('passageId');

  if (!rawBibleId || !passageId) {
    return NextResponse.json(
      { success: false, error: 'Missing parameters: bibleId and passageId are required' },
      { status: 400 }
    );
  }

  const session = await getServerSession(authOptions);
  const isPaidUser = !!(session?.user as any)?.isPaid;

  try {
    let url = '';
    let headers: HeadersInit = {};

    if (isPaidUser) {
      const apiKey = process.env.BIBLE_API_KEY_PAID || process.env.BIBLE_API_KEY;
      if (!apiKey) {
        throw new Error('API key missing for paid tier request');
      }
      url = `${PAID_API_BASE}/bibles/${rawBibleId}/passages/${passageId}?content-type=html&include-notes=false&include-titles=false&include-verse-numbers=true`;
      headers = { 'api-key': apiKey };
    } else {
      const [book, chapter] = passageId.split('.');
      const freeTranslation = getFreeTranslationCode(rawBibleId);
      url = `${FREE_API_BASE}/${freeTranslation}/${book.toUpperCase()}/${chapter || 1}.json`;
    }

    const response = await fetch(url, {
      headers,
      next: { revalidate: 86400 },
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => '');
      console.error(`Upstream API status ${response.status}:`, errorText.slice(0, 200));
      return NextResponse.json(
        {
          success: false,
          error: `Upstream service error (${response.status})`,
        },
        { status: response.status }
      );
    }

    const rawData = await response.json();

    let normalizedVerses: Array<{ verse: number; text: string }> = [];
    let audioUrl: string | null = null;

    if (isPaidUser) {
      const content = rawData?.data?.content || '';
      audioUrl = rawData?.data?.audio || null;

      if (typeof content === 'string') {
        const textOnly = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        normalizedVerses = [{ verse: 1, text: textOnly }];
      }
    } else {
      const chapterContent = rawData?.chapter?.content || rawData?.verses || [];
      normalizedVerses = chapterContent
        .filter((item: any) => item.type === 'verse' || item.text)
        .map((v: any, idx: number) => ({
          verse: Number(v.number || idx + 1),
          text: (
            v.text || (Array.isArray(v.content) ? v.content.join(' ') : '')
          ).trim(),
        }));
    }

    return NextResponse.json(
      {
        success: true,
        passage: passageId,
        verses: normalizedVerses,
        audio: audioUrl,
        isPaid: isPaidUser,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=604800, stale-while-revalidate=86400',
        },
      }
    );
  } catch (error: any) {
    console.error('Bible Passage Route Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch passage' },
      { status: 500 }
    );
  }
}