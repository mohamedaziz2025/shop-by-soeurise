'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    // Check if we have tokens in localStorage and validate them
    const accessToken = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;

    if (accessToken && refreshToken) {
      // If we have tokens, validate them asynchronously
      initializeAuth();
    } else {
      // If no tokens, ensure auth state is cleared
      useAuthStore.getState().logout();
    }
  }, [initializeAuth]);

  return <>{children}</>;
}