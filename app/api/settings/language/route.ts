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
      select: { language: true }
    });
    return NextResponse.json({ language: prefs?.language || 'en' });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return new NextResponse('Unauthorized', { status: 401 });

  try {
    const { language } = await req.json();

    await prisma.userPreferences.upsert({
      where: { userId: session.user.id },
      update: { language },
      create: {
        userId: session.user.id,
        language
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse('Database write error updating language structural properties', { status: 500 });
  }
}