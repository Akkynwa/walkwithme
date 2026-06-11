import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export const authOptions: NextAuthOptions = {
  // Keeps Prisma tracking your Google and Credentials user profiles safely
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

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
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
      // On initial login, bind the user's database ID directly to the JWT token instance
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    
    async session({ session, token }) {
      if (session.user && token) {
        // Correctly inject the true user database ID into the frontend session
        session.user.id = (token.id || token.sub || "") as string;
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

    // Safeguarded to prevent server-side crashes during session clearing
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
    strategy: "jwt", 
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  secret: process.env.NEXTAUTH_SECRET,
};