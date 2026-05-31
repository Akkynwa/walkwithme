import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const dataMatrix = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        bio: true,
        image: true,
        createdAt: true,
        streakData: {
          select: {
            currentStreak: true,
          }
        }
      },
    });

    if (!dataMatrix) return new NextResponse('User Not Found', { status: 404 });

    // Format fields seamlessly for consumption inside your profile screen state hook
    return NextResponse.json({
      name: dataMatrix.name,
      email: dataMatrix.email,
      bio: dataMatrix.bio,
      image: dataMatrix.image,
      createdAt: dataMatrix.createdAt,
      streak: dataMatrix.streakData?.currentStreak || 0
    });
  } catch (error) {
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  try {
    const { name, bio, image } = await req.json();

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name,
        bio,
        image // Handles incoming Base64 string payload natively
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse('Failed to process incoming updates', { status: 500 });
  }
}