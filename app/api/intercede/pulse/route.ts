import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized operation environment' }, { status: 401 });
    }

    const body = await request.json();
    const { prayerId } = body;

    if (!prayerId) {
      return NextResponse.json({ error: 'Prayer node identifier missing' }, { status: 400 });
    }

    const userId = session.user.id;

    const existingIntercession = await prisma.intercession.findUnique({
      where: {
        prayerRequestId_userId: {
          prayerRequestId: prayerId,
          userId,
        },
      },
    });

    if (existingIntercession) {
      await prisma.intercession.delete({
        where: { id: existingIntercession.id },
      });
      return NextResponse.json({ status: 'DISENGAGED' });
    } else {
      await prisma.intercession.create({
        data: {
          prayerRequestId: prayerId,
          userId,
        },
      });
      return NextResponse.json({ status: 'ENGAGED' });
    }
  } catch (error) {
    console.error('INTERCESSION_PULSE_ERR:', error);
    return NextResponse.json({ error: 'Failed to link intercessor connection' }, { status: 500 });
  }
}