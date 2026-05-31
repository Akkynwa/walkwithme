import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    // 1. Hash the incoming token to match the database version
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // 2. Find user with this token and ensure it hasn't expired
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: hashedToken,
        passwordResetExpires: { gt: new Date() },
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'Token is invalid or has expired.' }, { status: 400 });
    }

    // 3. Hash the NEW password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 4. Update the user and clear the reset fields
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
      },
    });

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}