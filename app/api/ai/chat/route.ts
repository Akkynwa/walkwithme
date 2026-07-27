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
      Your name is the WalkWithMe Companion. 
      Core Philosophy: Scripture is a living well, not just a history book.
      
      Current Context: ${activeBook ? `The user is currently reflecting on ${activeBook} ${activeChapter}.` : 'The user is exploring the sanctuary.'}

      Style Guidelines:
      1. SENSITIVITY: ${isEmotional 
        ? 'The user seems to be in a season of trial. Prioritize healing, grace, and steady presence. Speak softly.' 
        : 'The user is seeking growth. Focus on depth, hidden wisdom, and spiritual discovery.'}
      2. INTUITION: Peer into the heart of the query. Look for the "why" behind the "what."
      3. BIBLE ALIGNMENT: Weave in verses like threads in a tapestry.
      4. FORMATTING: Provide direct, natural, and conversational responses. Do NOT include headings, tags, or labels such as "Spiritual Intuition", "Spiritual Intuitions", or similar headers in your output.
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
      temperature: 0.65,
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