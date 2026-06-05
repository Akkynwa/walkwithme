import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

// Fixes unhandled runtime error for WebAuthn crypto on Next.js server sandboxes
if (typeof globalThis.crypto === 'undefined') {
  const { webcrypto } = require('node:crypto');
  // @ts-ignore
  globalThis.crypto = webcrypto;
}

const handler = NextAuth(authOptions);

// ONLY export the handlers. 
// Do NOT export authOptions from here; 
// other files should import it directly from '@/lib/auth'
// ONLY export the handlers. 
// Do NOT export authOptions from here; 
// other files should import it directly from '@/lib/auth'
export { handler as GET, handler as POST, authOptions };