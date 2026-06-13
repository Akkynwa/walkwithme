import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    // 1. Destructure the combined 'name' property passed from your frontend
    const { email, password, name } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const trimmedEmail = email.trim().toLowerCase();

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters' },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // 2. Pass only the arguments recognized by your actual Prisma schema model
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: trimmedEmail,
          name: name?.trim() || 'User', // Matches schema parameter exactly
          password: hashedPassword,
        },
      });

      await tx.userPreferences.create({
        data: {
          userId: newUser.id,
          language: 'en',
          bibleTranslation: 'KJV',
          theme: 'light',
        },
      });

      await tx.streakData.create({
        data: {
          userId: newUser.id,
          currentStreak: 0,
          longestStreak: 0,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: newUser.id,
          action: 'USER_SIGNUP',
          details: `New user registered: ${trimmedEmail}`,
        },
      });

      return newUser;
    });

    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Signup execution track error:', error);
    return NextResponse.json(
      { error: 'Failed to create user profile setup', details: error?.message || '' },
      { status: 500 }
    );
  }
}