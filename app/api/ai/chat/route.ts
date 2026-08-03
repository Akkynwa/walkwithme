import { google } from '@ai-sdk/google';
import { streamText } from 'ai'; 
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { randomUUID } from 'crypto';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const { messages, activeBook, activeChapter } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    const lastUserMessage = messages[messages.length - 1].content;
    const lastMessageLower = lastUserMessage.toLowerCase();
    const isEmotional = /sad|tired|failed|lonely|worried|anxious|help|hurt|pain|broken/.test(lastMessageLower);

    const systemMessage = `
      You are the WalkWithMe Companion.
      Context: ${activeBook ? `Reflecting on ${activeBook} ${activeChapter}.` : 'Exploring the sanctuary.'}

      Core Directive:
      - Be extremely concise, direct, and conversational. Keep responses brief without fluff.
      - ${isEmotional ? 'Tone: Gentle, comforting, and steady.' : 'Tone: Insightful, grounded, and clear.'}
      - WEAVE relevant Scripture naturally into response without overwhelming quotes.
      - ABSOLUTELY NO headers, labels, markdown tags (e.g. "Spiritual Intuition:"), or preambles.
    `;

    const cleanMessages = messages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));

    if (userId) {
      await prisma.message.create({
        data: {
          id: randomUUID(),
          content: lastUserMessage,
          role: 'user',
          userId: userId,
        },
      }).catch((err) => console.error("Error storing user message:", err));
    }

    const result = await streamText({
      model: google('gemini-2.5-flash'),
      system: systemMessage,
      messages: cleanMessages,
      temperature: 0.5, // Reduced slightly for tighter, focused outputs
      onFinish: async ({ text }) => {
        if (!userId) return;
        await prisma.message.create({
          data: {
            id: randomUUID(),
            content: text,
            role: 'assistant',
            userId: userId,
          },
        }).catch((err) => console.error("Error storing assistant message:", err));
      },
    });

    return result.toTextStreamResponse();

  } catch (error: any) {
    console.error('Chat Sanctuary Error:', error);
    return NextResponse.json({ error: 'Silent reflection...' }, { status: 500 });
  }
}