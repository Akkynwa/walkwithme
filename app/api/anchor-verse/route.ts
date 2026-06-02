import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    // Ensure the user is authenticated to protect your backend resources
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // A curated pool of architectural, grounding scriptures for a Sanctuary atmosphere
    const versePool = [
      {
        verse: "He who dwells in the secret place of the Most High shall abide under the shadow of the Almighty.",
        reference: "Psalm 91:1",
        bgImage: "https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5" // Soft morning mist through trees
      },
      {
        verse: "The Lord will guide you continually, and satisfy your soul in drought, and strengthen your bones; you shall be like a watered garden.",
        reference: "Isaiah 58:11",
        bgImage: "https://images.unsplash.com/photo-1466692476868-aef1dfb1e735" // Sunlit garden greenery
      },
      {
        verse: "In the morning, Lord, you hear my voice; in the morning I lay my requests before you and wait expectantly.",
        reference: "Psalm 5:3",
        bgImage: "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b" // Soft sunburst over hills
      }
    ];

    // Automatically cycle to a new verse every day based on the calendar date
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    const selectedVerse = versePool[dayOfYear % versePool.length];

    return NextResponse.json({ success: true, data: selectedVerse });
  } catch (error) {
    console.error('Error fetching anchor verse:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}