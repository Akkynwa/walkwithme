import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

const FREE_API_BASE = 'https://bible.helloao.org/api';
const PAID_API_BASE = 'https://api.scripture.api.bible/v1';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bibleId = searchParams.get('bibleId');
  const passageId = searchParams.get('passageId');
  
  if (!bibleId || !passageId) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  const session = await getServerSession();
  // const isPaidUser = !!session?.user?.isPaid;
const isPaidUser = !!(session?.user as any)?.isPaid;
  try {
    let url;
    let headers: HeadersInit = {};

    if (isPaidUser) {
      url = `${PAID_API_BASE}/bibles/${bibleId}/passages/${passageId}?content-type=text`;
      headers = { 'api-key': process.env.BIBLE_API_KEY_PAID as string };
    } else {
      url = `${FREE_API_BASE}/${bibleId}/${passageId}.json`;
    }

    const response = await fetch(url, { headers });
    if (!response.ok) throw new Error(`Upstream API failed: ${response.status}`);
    
    const rawData = await response.json();

    // --- NORMALIZATION STEP ---
    // This transforms the response into a unified format for your frontend
    const normalizedData = isPaidUser 
      ? { success: true, verses: rawData.data.content, audio: rawData.data.audio }
      : { success: true, verses: rawData.chapters[0].content, audio: null }; 
      // Note: check the Free API JSON to see if it's .content or .verses

    return NextResponse.json(normalizedData, {
      headers: {
        'Cache-Control': 'public, s-maxage=604800, stale-while-revalidate=86400',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}