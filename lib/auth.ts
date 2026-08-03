import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || '')
  .split(',')
  .map((email) => email.trim().toLowerCase())
  .filter(Boolean);

const resolveUserRole = (
  userOrEmail?: { role?: string; email?: string | null } | string | null,
  fallback = 'USER'
) => {
  if (typeof userOrEmail === 'string') {
    return ADMIN_EMAILS.includes(userOrEmail.toLowerCase()) ? 'ADMIN' : fallback;
  }

  if (!userOrEmail) {
    return fallback;
  }

  if ((userOrEmail as { role?: string }).role === 'ADMIN') {
    return 'ADMIN';
  }

  const email = (userOrEmail as { email?: string | null }).email;
  if (email && ADMIN_EMAILS.includes(email.toLowerCase())) {
    return 'ADMIN';
  }

  return (userOrEmail as { role?: string }).role === 'USER' ? 'USER' : fallback;
};

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'your@email.com' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Invalid credentials');
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error('Invalid credentials');
        }

        const userRole = resolveUserRole(user, 'USER');

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: userRole,
        };
      },
    }),

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
  ],

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    verifyRequest: '/auth/verify',
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = resolveUserRole(user, typeof token.role === 'string' ? token.role : 'USER') as string;
      }

      if (!token.role && token.sub) {
        token.role = 'USER';
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = (token.id || token.sub || '') as string;
        session.user.role = resolveUserRole(
          { email: session.user.email, role: token.role as string | undefined },
          'USER'
        ) as string;
      }
      return session;
    },
  },

  events: {
    async signIn({ user }) {
      if (user?.id) {
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: 'USER_SIGNIN',
            details: `User signed in: ${user.email || 'OAuth User'}`,
          },
        }).catch((err) => console.error("Sign-in audit log failure:", err));
      }
    },

    async signOut({ token }) {
      const activeUserId = token?.sub || token?.id;
      if (activeUserId) {
        await prisma.auditLog.create({
          data: {
            userId: activeUserId,
            action: 'USER_SIGNOUT',
            details: 'User signed out',
          },
        }).catch((err) => console.error("Sign-out audit log failure:", err));
      }
    },
  },

  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};