export const runtime = 'nodejs';

import { createOpenAI } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust path based on your Prisma setup
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { randomUUID } from 'crypto';


export async function POST(req: Request) {
  try {
    // 1. Fetch user session to bind chat data
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
      3. PACKAGING: Wrap your answers in "Spiritual Intuitions."
      4. BIBLE ALIGNMENT: Weave in verses like threads in a tapestry.
      5. POETICS: Use metaphors of light, paths, shepherds, and living water.
    `;

    // Initialize the official Groq/OpenAI compatible client instance
    const groqProvider = createOpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    // Clean up incoming messages array to match expected AI Core formats
    const formattedMessages = messages.map((msg: any) => ({
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: msg.content,
    }));

    // 2. Safe 'onStart' placement: Write the user message BEFORE streaming starts
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

    // Call streamText using your exact v3 syntax
    const result = await streamText({
      model: groqProvider('llama-3.3-70b-versatile'),
      system: systemMessage,
      messages: formattedMessages,
      temperature: 0.65,
      // inside v3.0.35, onFinish is the valid way to handle final generation steps
      onFinish: async ({ text }) => {
        if (!userId) return;
        // Save the AI's fully generated response when the stream finishes
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

    // 3. Convert the text stream response using your exact package method
    return result.toTextStreamResponse({
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'no-cache, no-transform',
      },
    });

  } catch (error: any) {
    console.error('Chat Sanctuary Error:', error);
    return NextResponse.json({ error: 'Silent reflection...' }, { status: 500 });
  }
}