import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL: typeof window !== 'undefined' ? window.location.origin : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
});

export const { useSession, signIn, signOut } = authClient;
