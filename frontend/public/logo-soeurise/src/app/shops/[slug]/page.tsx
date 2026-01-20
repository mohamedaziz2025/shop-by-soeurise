'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Star, Package, MapPin, Truck } from 'lucide-react';
import Image from 'next/image';

export default function ShopDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [shop, setShop] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchShopData();
    }
  }, [slug]);

  const fetchShopData = async () => {
    setLoading(true);
    try {
      const [shopData, productsData] = await Promise.all([
        api.getShopBySlug(slug),
        api.getProducts({ shopSlug: slug, status: 'ACTIVE' }),
      ]);
      setShop(shopData);
      setProducts(productsData);
    } catch (error) {
      console.error('Erreur chargement boutique:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (!shop) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Boutique introuvable</h1>
          <p className="text-gray-600">Cette boutique n'existe pas ou a été supprimée.</p>
          <a href="/marketplace" className="text-primary hover:underline mt-4 inline-block">
            Retour à la marketplace
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header boutique */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-start gap-6">
            {/* Logo */}
            <div className="relative w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0">
              {shop.logo ? (
                <Image src={shop.logo} alt={shop.name} fill className="object-contain p-2" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary">
                    {shop.name.charAt(0)}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{shop.name}</h1>
              <p className="text-gray-600 mb-4">{shop.description}</p>

              {/* Stats */}
              <div className="flex items-center gap-6 text-sm">
                {shop.averageRating && shop.totalReviews ? (
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{shop.averageRating.toFixed(1)}</span>
                    <span className="text-gray-500">({shop.totalReviews} avis)</span>
                  </div>
                ) : null}

                <div className="flex items-center gap-1 text-gray-600">
                  <Package className="w-5 h-5" />
                  <span>{products.length} produits</span>
                </div>

                {shop.seller?.city && (
                  <div className="flex items-center gap-1 text-gray-600">
                    <MapPin className="w-5 h-5" />
                    <span>{shop.seller.city}</span>
                  </div>
                )}
              </div>

              {/* Shipping info */}
              {shop.shippingConfig && (
                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg inline-block">
                  <div className="flex items-center gap-2 text-sm text-green-800">
                    <Truck className="w-4 h-4" />
                    <span>
                      Livraison à partir de {shop.shippingConfig.flatRate}€
                      {shop.shippingConfig.freeShippingThreshold && (
                        <> • Gratuite dès {shop.shippingConfig.freeShippingThreshold}€</>
                      )}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Produits */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Produits de la boutique</h2>

        {products.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">Aucun produit disponible pour le moment</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
