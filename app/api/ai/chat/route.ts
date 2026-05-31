import { OpenAI } from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';
import { NextResponse } from 'next/server';

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages, activeBook, activeChapter } = await req.json();

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: 'No messages provided' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1].content.toLowerCase();
    const isEmotional = /sad|tired|failed|lonely|worried|anxious|help|hurt|pain|broken/.test(lastMessage);

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

    // const response = await openai.chat.completions.create({
    //   model: 'gpt-4o', // This is faster, cheaper, and more reliable,
    //   stream: true,
    //   messages: [systemMessage, ...messages],
    //   temperature: 0.65,
    //   max_tokens: 1000,
    // });

    const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1", // Just add this line!
});

// ... then use their model name
const response = await openai.chat.completions.create({
  // Using the new stable Llama 3.3 model on Groq
  model: 'llama-3.3-70b-versatile', 
  stream: true,
  messages: [systemMessage, ...messages],
  temperature: 0.65,
  max_tokens: 1024, // Groq likes power-of-two token limits
});

    const stream = OpenAIStream(response as any);
    return new StreamingTextResponse(stream);

  } catch (error: any) {
    console.error('Chat Sanctuary Error:', error);
    return NextResponse.json({ error: 'Silent reflection...' }, { status: 500 });
  }
}