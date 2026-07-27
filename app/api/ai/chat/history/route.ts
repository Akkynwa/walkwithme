import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { randomUUID } from 'crypto';

/**
 * GET: Retrieve the authenticated user's message history
 */
export async function GET() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const messages = await prisma.message.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'asc' },
      take: 100, // Limit to reasonable context length
    });
    
    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
  }
}

/**
 * POST: Sync and persist the full chat message array across sessions
 */
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { messages } = body;

    if (!Array.isArray(messages)) {
      return NextResponse.json({ error: 'Invalid payload format' }, { status: 400 });
    }

    // Execute message upserts safely with validated fallback IDs
    const saveOperations = messages.map((msg: any) => {
      const messageId = msg.id || randomUUID();

      return prisma.message.upsert({
        where: {
          id: messageId,
        },
        update: {
          content: msg.content,
          role: msg.role,
        },
        create: {
          id: messageId,
          userId: session.user.id,
          content: msg.content,
          role: msg.role,
        },
      });
    });

    await prisma.$transaction(saveOperations);

    return NextResponse.json({ success: true, count: messages.length });
  } catch (error) {
    console.error('Error saving chat history:', error);
    return NextResponse.json({ error: 'Failed to save chat history' }, { status: 500 });
  }
}