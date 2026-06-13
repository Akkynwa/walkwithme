import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: 'Invalid or empty request payload' }, { status: 400 });
    }

    // 1. Destructure firstName and lastName sent from your form
    const { email, password, firstName, lastName } = body;

    // 2. Strict key verification fallback
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

    // 3. Prevent duplicate users
    const existingUser = await prisma.user.findUnique({
      where: { email: trimmedEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    // 4. Combine names safely before database insertion
    const combinedName = [firstName?.trim(), lastName?.trim()].filter(Boolean).join(' ');

    // 5. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Create user within a stable transaction
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email: trimmedEmail,
          name: combinedName || 'User', // Falls back nicely if both are blank
          password: hashedPassword,
        },
      });

      // Matches your schema requirements perfectly
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
    console.error('Signup error:', error);
    return NextResponse.json(
      { error: 'Failed to create user', details: error?.message || '' },
      { status: 500 }
    );
  }
}