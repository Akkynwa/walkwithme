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
    // Lookup user preference configs
    // Remove explicit select to avoid specifying unknown properties on the User model.
    // If your settings live on a related model (e.g., user.settings), adjust accordingly.
    const userSettings = await prisma.user.findUnique({
      where: { id: session.user.id },
    });

    return NextResponse.json(userSettings);
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
    const body = await req.json();
    const { emailNotifications, pushNotifications, dailyReminder, prayerReminder, newContent } = body;

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        emailNotifications,
        pushNotifications,
        dailyReminder,
        prayerReminder,
        newContent,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return new NextResponse('Failed to update settings', { status: 500 });
  }
}