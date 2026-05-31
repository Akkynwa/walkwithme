import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { Resend } from 'resend'; // Import Resend
import crypto from 'crypto';

const prisma = new PrismaClient();
const resend = new Resend(process.env.RESEND_API_KEY); // Initialize

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

    // For security, don't reveal if a user doesn't exist
    if (!user) {
      return NextResponse.json({ message: 'If an account exists, a link has been sent.' }, { status: 200 });
    }

    // Generate token and expiry (1 hour)
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const tokenExpiry = new Date(Date.now() + 3600000); 

    // This updates your database!
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: hashedToken,
        passwordResetExpires: tokenExpiry,
      },
    });

    // Build the reset link
    const origin = request.headers.get('origin') || 'http://localhost:3000';
    const resetUrl = `${origin}/auth/reset-password/${resetToken}`;

    // Send the actual email
    await resend.emails.send({
      from: 'WalkWithMe Sanctuary <onboarding@resend.dev>', // Update this to your custom domain later
      to: normalizedEmail,
      subject: 'Reset Your WalkWithMe Password',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #3C3830;">
          <h2 style="color: #D4AF37; font-family: serif;">WalkWithMe</h2>
          <p>You requested a password reset for your digital sanctuary workspace.</p>
          <p>Click the golden button below to choose a new password. This link expires in 1 hour.</p>
          <div style="margin: 30px 0;">
            <a href="${resetUrl}" style="background-color: #D4AF37; color: white; padding: 12px 24px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px; letter-spacing: 0.1em; text-transform: uppercase;">Reset Password</a>
          </div>
          <p style="font-style: italic; color: #7C7565; font-size: 12px;">"In the quiet of your heart, you will find the way back home."</p>
        </div>
      `,
    });

    return NextResponse.json({ message: 'Reset link sent successfully' }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}