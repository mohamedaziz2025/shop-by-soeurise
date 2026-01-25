import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  setAuth: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      login: async (email, password) => {
        try {
          const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (!response.ok) {
            return { success: false, error: data.message || 'Erreur de connexion' };
          }

          // Utiliser setAuth pour mettre à jour l'état
          const { accessToken, refreshToken, user } = data;
          if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
          }
          set({ user, accessToken, refreshToken, isAuthenticated: true });

          return { success: true };
        } catch (error) {
          return { success: false, error: 'Erreur réseau' };
        }
      },
      setAuth: (accessToken, refreshToken, user) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
        }
        set({ user, accessToken, refreshToken, isAuthenticated: true });
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
        set({ user: null, accessToken: null, refreshToken: null, isAuthenticated: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
