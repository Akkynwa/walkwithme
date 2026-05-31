'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function useAuth() {
  const { data: session, status, update } = useSession();

  return {
    user: session?.user,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    status,
    session,
    updateSession: update,
  };
}

export function useRequireAuth() {
  const router = useRouter();
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      router.push('/auth/signin');
    }
  }, [auth.isLoading, auth.isAuthenticated, router]);

  return auth;
}

export function useProtectedRoute() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/signin?callbackUrl=' + window.location.pathname);
    }
  }, [isAuthenticated, isLoading, router]);

  return { isAuthenticated, isLoading };
}
