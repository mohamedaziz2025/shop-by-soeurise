'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import ModernLayout from '@/components/ModernLayout';
import { Sparkles, LogIn, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, setAuth } = useAuthStore();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    if (user) {
      // Rediriger vers le dashboard approprié selon le rôle
      if (user.role === 'SELLER') {
        router.push('/seller/dashboard');
      } else if (user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    }
  }, [user, router]);

  useEffect(() => {
    // Vérifier les paramètres d'URL
    if (searchParams.get('registered') === 'true') {
      setSuccessMessage('Compte créé avec succès ! Vérifiez votre email pour activer votre compte avant de vous connecter.');
    } else if (searchParams.get('verified') === 'true') {
      setSuccessMessage('Email vérifié avec succès ! Vous pouvez maintenant vous connecter.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.login(formData.email, formData.password);
      setAuth(response.accessToken, response.refreshToken, response.user);
        // If a guest cart exists, merge it into the authenticated user's cart
        if (typeof window !== 'undefined') {
          const guestId = localStorage.getItem('guestId');
          if (guestId) {
            try {
              await api.mergeGuestCart(guestId);
            } catch (err) {
              console.warn('Impossible de fusionner le panier invité:', err);
            }
          }
        }
      // Rediriger vers le dashboard approprié
      if (response.user.role === 'SELLER') {
        router.push('/seller/dashboard');
      } else if (response.user.role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erreur lors de la connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModernLayout showFooter={false}>
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md w-full"
        >
          {/* Logo */}
          <div className="text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-3 group mb-6">
              <div className="w-14 h-14 bg-gradient-to-tr from-pink-500 to-rose-400 rounded-[18px] flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                <Sparkles className="text-white w-7 h-7" />
              </div>
              <span className="text-3xl font-black tracking-tighter bg-gradient-to-r from-pink-600 to-rose-600 bg-clip-text text-transparent">
                SHOP BY SOEURISE
              </span>
            </Link>
            <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Connexion</h2>
            <p className="text-gray-600 text-lg">Accédez à votre espace personnel</p>
          </div>

          {/* Form */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-[32px] shadow-2xl p-10 border border-pink-50"
          >
            {successMessage && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 border-2 border-green-200 text-green-700 rounded-2xl text-sm flex items-start gap-3"
              >
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </motion.div>
            )}

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-2xl text-sm flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-lg"
                  placeholder="votre@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                  Mot de passe
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-5 py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-lg"
                  placeholder="••••••••"
                />
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-pink-600 focus:ring-pink-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-gray-700 font-medium">
                    Se souvenir de moi
                  </label>
                </div>

                <Link href="/forgot-password" className="text-pink-600 hover:text-pink-700 font-semibold">
                  Mot de passe oublié ?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 px-6 bg-gradient-to-r from-pink-600 to-rose-600 text-white font-black rounded-2xl hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-lg flex items-center justify-center gap-3 group"
              >
                {loading ? (
                  'Connexion...'
                ) : (
                  <>
                    Se connecter
                    <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t-2 border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-semibold">Nouveau sur Shop By Soeurise ?</span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/register"
                  className="w-full flex justify-center py-4 px-6 border-2 border-pink-600 rounded-2xl text-pink-600 font-bold hover:bg-pink-50 transition-all"
                >
                  Créer un compte
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm text-gray-500">
            En vous connectant, vous acceptez nos{' '}
            <Link href="/terms" className="text-pink-600 hover:underline font-semibold">
              Conditions d'utilisation
            </Link>
          </p>
        </motion.div>
      </div>
    </ModernLayout>
  );
}
