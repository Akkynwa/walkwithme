export const runtime = 'nodejs';

import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

if (typeof globalThis.crypto === 'undefined') {
  const { webcrypto } = require('node:crypto');
  // @ts-ignore
  globalThis.crypto = webcrypto;
}

const handler = NextAuth(authOptions);

// 🌟 Clear and safe: ONLY export GET and POST
export { handler as GET, handler as POST };