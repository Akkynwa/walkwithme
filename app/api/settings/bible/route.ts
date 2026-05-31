import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

  try {
    const prefs = await prisma.userPreferences.findUnique({
      where: { userId: session.user.id },
    });
    return NextResponse.json(prefs);
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

  try {
    const body = await req.json();
    
    await prisma.userPreferences.upsert({
      where: { userId: session.user.id },
      update: {
        bibleTranslation: body.defaultTranslation,
        readingMode: body.readingMode,
        showCrossReferences: body.showCrossReferences,
        showCommentary: body.showCommentary,
      },
      create: {
        userId: session.user.id,
        bibleTranslation: body.defaultTranslation,
        readingMode: body.readingMode,
        showCrossReferences: body.showCrossReferences,
        showCommentary: body.showCommentary,
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse('Failed to record preferences parameters', { status: 500 });
  }
}