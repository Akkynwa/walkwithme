import type { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name?: string;
      image?: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string;
    email: string;
    name?: string | null;
    image?: string | null;
    password?: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name?: string;
    image?: string;
  }
}
declare module "next-auth/providers/webauthn" {
  import { CommonProviderOptions } from "next-auth/providers";
  
  export interface WebAuthnProviderType extends CommonProviderOptions {
    id: "webauthn";
    name: "WebAuthn";
    type: "webauthn";
  }

  export default function WebAuthnProvider(options?: Record<string, any>): WebAuthnProviderType;
}
