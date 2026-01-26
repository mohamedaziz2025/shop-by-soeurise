import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';

interface User {
  userId: string;
  email: string;
  role: 'CLIENT' | 'SELLER' | 'ADMIN';
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
  country?: string;
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  setAuth: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
  initializeAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: true,
      login: async (email, password) => {
        try {
          const response = await api.login(email, password);

          // Utiliser setAuth pour mettre à jour l'état
          const { accessToken, refreshToken, user } = response;
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
          }
          set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false });

          return { success: true };
        } catch (error: any) {
          return { success: false, error: error.response?.data?.message || 'Erreur de connexion' };
        }
      },
      setAuth: (accessToken, refreshToken, user) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
        }
        set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false });
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, isLoading: false });
      },
      initializeAuth: async () => {
        try {
          // Check if we have tokens in localStorage
          if (typeof window !== 'undefined') {
            const accessToken = localStorage.getItem('accessToken');
            const refreshToken = localStorage.getItem('refreshToken');

            if (accessToken && refreshToken) {
              // Try to get current user to validate tokens
              const user = await api.getCurrentUser();
              set({ user, accessToken, refreshToken, isAuthenticated: true, isLoading: false });
              return;
            }
          }
          // No valid tokens
          set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, isLoading: false });
        } catch (error) {
          // Tokens are invalid, clear them
          if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
          }
          set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
