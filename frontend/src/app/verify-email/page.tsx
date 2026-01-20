'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, XCircle, Mail, Loader2 } from 'lucide-react';

export default function VerifyEmailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token de vérification manquant');
      return;
    }

    verifyEmail();
  }, [token]);

  const verifyEmail = async () => {
    if (!token) return;

    try {
      const response = await api.verifyEmail(token);
      setStatus('success');
      setMessage(response.message);

      // Rediriger vers la page de connexion après 3 secondes
      setTimeout(() => {
        router.push('/login?verified=true');
      }, 3000);
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Erreur lors de la vérification');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <Image
              src="/logo-soeurise/logo-main.svg"
              alt="Shop By Soeurise"
              width={150}
              height={50}
              className="mx-auto mb-4"
            />
          </Link>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <div className="text-center">
            {status === 'loading' && (
              <>
                <Loader2 className="w-16 h-16 mx-auto mb-4 text-blue-600 animate-spin" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Vérification en cours...
                </h2>
                <p className="text-gray-600">
                  Nous vérifions votre email, veuillez patienter.
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Email vérifié !
                </h2>
                <p className="text-gray-600 mb-6">
                  {message}
                </p>
                <p className="text-sm text-gray-500">
                  Vous allez être redirigé vers la page de connexion...
                </p>
                <div className="mt-6">
                  <Link
                    href="/login"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    Se connecter maintenant
                  </Link>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <XCircle className="w-16 h-16 mx-auto mb-4 text-red-600" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Erreur de vérification
                </h2>
                <p className="text-gray-600 mb-6">
                  {message}
                </p>
                <div className="space-y-4">
                  <button
                    onClick={verifyEmail}
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <Mail className="w-4 h-4 mr-2" />
                    Réessayer
                  </button>
                  <Link
                    href="/login"
                    className="block text-center text-blue-600 hover:underline"
                  >
                    Retour à la connexion
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Besoin d'aide ?{' '}
            <Link href="/contact" className="text-blue-600 hover:underline">
              Contactez-nous
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
