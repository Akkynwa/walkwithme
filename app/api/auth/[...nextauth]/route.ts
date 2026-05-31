import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';

const handler = NextAuth(authOptions);

// ONLY export the handlers. 
// Do NOT export authOptions from here; 
// other files should import it directly from '@/lib/auth'
export { handler as GET, handler as POST };