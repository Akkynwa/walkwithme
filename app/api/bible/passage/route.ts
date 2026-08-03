import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Ensure this path points to your NextAuth options file

const FREE_API_BASE = 'https://bible.helloao.org/api';
const PAID_API_BASE = 'https://api.scripture.api.bible/v1';

// Default mappings for Free translation IDs
const FREE_TRANSLATION_MAP: Record<string, string> = {
  KJV: 'BSB', // Default fallback to Berean Standard Bible or KJV on helloao
  NIV: 'BSB',
  RVR09: 'RVR09',
};

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

  // 1. Get user session with custom NextAuth config
  const session = await getServerSession(authOptions);
  const isPaidUser = !!(session?.user as any)?.isPaid;

  try {
    let url = '';
    let headers: HeadersInit = {};

    if (isPaidUser) {
      url = `${PAID_API_BASE}/bibles/${rawBibleId}/passages/${passageId}?content-type=json`;
      headers = { 'api-key': process.env.BIBLE_API_KEY_PAID || '' };
    } else {
      // 2. Parse passage format (e.g. "Genesis.1" or "GEN.1" -> book: "GEN", chapter: "1")
      const [book, chapter] = passageId.split('.');
      const freeTranslation = FREE_TRANSLATION_MAP[rawBibleId.toUpperCase()] || rawBibleId;
      
      url = `${FREE_API_BASE}/${freeTranslation}/${book}/${chapter || 1}.json`;
    }

    const response = await fetch(url, {
      headers,
      next: { revalidate: 86400 }, // Next.js fetch caching layer
    });

    if (!response.ok) {
      throw new Error(`Upstream API failed with status ${response.status}`);
    }

    const rawData = await response.json();

    // 3. Normalization Step
    let normalizedVerses: Array<{ verse: number; text: string }> = [];
    let audioUrl: string | null = null;

    if (isPaidUser) {
      // API.Bible format
      const content = rawData?.data?.content || [];
      normalizedVerses = Array.isArray(content)
        ? content.map((v: any, idx: number) => ({
            verse: Number(v.number || idx + 1),
            text: (v.text || v.value || '').trim(),
          }))
        : [];
      audioUrl = rawData?.data?.audio || null;
    } else {
      // helloao.org format
      const chapterContent = rawData?.chapter?.content || rawData?.verses || [];
      normalizedVerses = chapterContent
        .filter((item: any) => item.type === 'verse' || item.text)
        .map((v: any, idx: number) => ({
          verse: Number(v.number || idx + 1),
          text: (v.text || (Array.isArray(v.content) ? v.content.join(' ') : '')).trim(),
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
    console.error('Bible Route Error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch passage' },
      { status: 500 }
    );
  }
}