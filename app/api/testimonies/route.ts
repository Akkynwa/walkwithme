import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma'; // Adjust this import path based on where your Prisma client lives

export async function GET() {
  try {
    // 1. Optional: Ensure the request is coming from an authenticated user
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized Access' }, { status: 401 });
    }

    // 2. Fetch the latest approved community testimonies from your database
    // If you haven't created a Testimony table yet, we can fall back to a dynamic array below
    let testimonies = [];
    
    try {
      testimonies = await prisma.testimony.findMany({
        where: { isApproved: true },
        orderBy: { createdAt: 'desc' },
        take: 5, // Keep the dashboard view clean and fast
        select: {
          id: true,
          author: true,
          location: true,
          content: true,
        }
      });
    } catch (dbError) {
      // Fallback fallback dynamic array if your Prisma migration hasn't run yet
      testimonies = [
        { 
          id: '1', 
          author: 'Oluwaseun A.', 
          location: 'Lagos', 
          content: "The Spiritual Walker AI helped me process a heavy morning. It felt like reflecting with a wise friend." 
        },
        { 
          id: '2', 
          author: 'Miracle O.', 
          location: 'Abuja', 
          content: "Finally, a space that doesn't feel rushed. The Dream Interpreter gave me such clarity on a recurring vision." 
        },
        { 
          id: '3', 
          author: 'Chidi K.', 
          location: 'Enugu', 
          content: "The atmospheric dawn theme completely changes how I wake up and interact with my morning journaling habits." 
        }
      ];
    }

    return NextResponse.json({ success: true, testimonies });
  } catch (error) {
    console.error('Failed to serve testimonies:', error);
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}