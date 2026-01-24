'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import Link from 'next/link';

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    loadFavorites();
  }, [isAuthenticated]);

  const loadFavorites = async () => {
    try {
      const data = await api.getFavorites();
      setFavorites(data);
    } catch (error: any) {
      if (error.response?.status === 401) {
        router.push('/login');
      }
      console.error('Erreur chargement favoris:', error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (productId: string) => {
    try {
      await api.removeFromFavorites(productId);
      setFavorites(favorites.filter(f => f._id !== productId));
    } catch (error) {
      console.error('Erreur suppression favori:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de vos favoris...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Mes Favoris</h1>

        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">Aucun produit dans vos favoris</p>
            <Link
              href="/marketplace"
              className="inline-block bg-pink-600 text-white px-6 py-3 rounded-md hover:bg-pink-700 transition-colors"
            >
              Découvrir des produits
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {favorites.map((product) => (
              <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <Link href={`/product/${product.slug || product._id}`}>
                  <div className="aspect-square relative">
                    {product.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">Pas d'image</span>
                      </div>
                    )}
                  </div>
                </Link>
                <div className="p-4">
                  <Link href={`/product/${product.slug || product._id}`}>
                    <h3 className="font-semibold text-gray-900 mb-2 hover:text-pink-600">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-pink-600 font-bold mb-3">
                    {product.price?.toFixed(2)} €
                  </p>
                  <button
                    onClick={() => removeFromFavorites(product._id)}
                    className="w-full bg-red-50 text-red-600 px-4 py-2 rounded-md hover:bg-red-100 transition-colors text-sm font-medium"
                  >
                    Retirer des favoris
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
