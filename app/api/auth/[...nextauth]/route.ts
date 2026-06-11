
import NextAuth from 'next-auth';
import { authOptions } from '@/lib/auth';


const handler = NextAuth(authOptions);

// 🌟 Clear and safe: ONLY export GET and POST
export { handler as GET, handler as POST };