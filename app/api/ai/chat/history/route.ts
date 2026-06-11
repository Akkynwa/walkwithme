import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Ensure this points to your NextAuth configuration
import { prisma } from '@/lib/prisma';

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
      orderBy: { createdAt: 'asc' }, // Orders the conversation sequentially
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

    // Use a transaction or upsert loop to store message elements safely
    const saveOperations = messages.map((msg: any) => {
      return prisma.message.upsert({
        where: {
          // Relies on a unique string 'id' from useChat hook items to avoid duplication
          id: msg.id || `${session.user.id}-${Date.now()}-${Math.random()}`,
        },
        update: {
          content: msg.content,
          role: msg.role,
        },
        create: {
          id: msg.id,
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