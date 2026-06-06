// Add this line to the top of the file
import { OpenAI } from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; // Adjust path based on your Prisma setup
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

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

    const systemMessage = {
      role: 'system',
      content: `
        Your name is the WalkWithMe Companion. 
        Core Philosophy: Scripture is a living well, not just a history book.
        Context: ${activeBook ? `Reflecting on ${activeBook} ${activeChapter}.` : 'Exploring the sanctuary.'}
        Style: ${isEmotional ? 'Healing, grace, soft presence.' : 'Depth, hidden wisdom, spiritual discovery.'}
        Wrap answers in "Spiritual Intuitions" and use metaphors of light and living water.
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
      `
    };

    const openai = new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    });

    const response = await openai.chat.completions.create({
      model: 'llama-3.3-70b-versatile', 
      stream: true,
      messages: [systemMessage, ...messages],
      temperature: 0.65,
      max_tokens: 2048, // Bumped to 2048 to prevent cutting off fluid stream deliveries
    });

    // 3. Initialize OpenAI Stream with Non-Blocking Callbacks
    const stream = OpenAIStream(response as any, {
      onStart: async () => {
        if (!userId) return;
        // Fire-and-forget: background thread execution keeps token rendering unblocked
        prisma.message.create({
          data: {
            content: lastUserMessage,
            role: 'user',
            userId: userId,
          },
        }).catch((err) => console.error("Error storing user message:", err));
      },
      onCompletion: async (completion) => {
        if (!userId) return;
        // Fire-and-forget: stores final response in background safely
        prisma.message.create({
          data: {
            content: completion,
            role: 'assistant',
            userId: userId,
          },
        }).catch((err) => console.error("Error storing assistant message:", err));
      },
    });

    // 4. Return stream with optimization headers to avoid proxy buffering jitter
    return new StreamingTextResponse(stream, {
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