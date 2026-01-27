'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, ShoppingCart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { useCartStore } from '@/store/cart';
import { useState } from 'react';

interface ProductCardProps {
  product: {
    _id: string;
    slug: string;
    name: string;
    price: number;
    images: string[];
    // backend may populate shop under `shopId` or `shop`
    shop?: {
      _id: string;
      name: string;
      slug: string;
      shippingConfig?: {
        flatRate?: number;
        freeShippingThreshold?: number;
        estimatedDays?: number;
      };
    };
    shopId?: {
      _id: string;
      name: string;
      slug: string;
      shippingConfig?: {
        flatRate?: number;
        freeShippingThreshold?: number;
        estimatedDays?: number;
      };
    };
    averageRating?: number;
    totalReviews?: number;
    hasVariants?: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.hasVariants) {
      // Rediriger vers la page produit pour choisir la variante
      window.location.href = `/product/${product.slug}`;
      return;
    }

    setIsAdding(true);
    try {
      await addItem({
        productId: product._id,
        quantity: 1,
      });
    } catch (error) {
      console.error('Erreur ajout panier:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <Link href={`/product/${product.slug}`} className="group">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden hover:shadow-2xl transform hover:-translate-y-1 transition-all">
        {/* Image */}
        <div className="relative aspect-square bg-gray-100">
          <Image
            src={product.images[0] || '/placeholder-product.png'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Contenu */}
        <div className="p-4">
          {/* Shop */}
          <p className="text-xs text-gray-500 mb-1">
            {product.shop?.name || product.shopId?.name || ''}
          </p>

          {/* Nom */}
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600">
            {product.name}
          </h3>

          {/* Rating */}
          {product.averageRating && product.totalReviews ? (
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.averageRating.toFixed(1)}</span>
              <span className="text-xs text-gray-500">({product.totalReviews})</span>
            </div>
          ) : null}

          {/* Prix et Action */}
          <div className="flex items-center justify-between mt-3">
            <span className="text-lg font-bold text-pink-600">
              {formatPrice(product.price)}
            </span>
            
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="p-2 bg-pink-600 text-white rounded-full hover:bg-pink-600/90 transition-colors disabled:opacity-50"
              title={product.hasVariants ? "Voir les variantes" : "Ajouter au panier"}
            >
              {isAdding ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin block" />
              ) : (
                <ShoppingCart className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Informations de livraison */}
          {(product.shop?.shippingConfig || product.shopId?.shippingConfig) && (
            <div className="mt-2 text-xs text-gray-600">
              {(() => {
                const shippingConfig = product.shop?.shippingConfig || product.shopId?.shippingConfig;
                const freeThreshold = shippingConfig?.freeShippingThreshold;
                const flatRate = shippingConfig?.flatRate;
                const estimatedDays = shippingConfig?.estimatedDays || 3;

                if (freeThreshold && product.price >= freeThreshold) {
                  return (
                    <div className="flex items-center gap-1">
                      <span className="text-green-600 font-medium">Livraison gratuite</span>
                      <span>• {estimatedDays} jours</span>
                    </div>
                  );
                } else if (flatRate) {
                  return (
                    <div className="flex items-center gap-1">
                      <span>Livraison {formatPrice(flatRate)}</span>
                      <span>• {estimatedDays} jours</span>
                    </div>
                  );
                } else {
                  return (
                    <div className="flex items-center gap-1">
                      <span>Livraison calculée</span>
                      <span>• {estimatedDays} jours</span>
                    </div>
                  );
                }
              })()}
            </div>
          )}
