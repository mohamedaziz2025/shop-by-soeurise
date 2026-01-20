'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, Package } from 'lucide-react';

interface ShopCardProps {
  shop: {
    slug: string;
    name: string;
    logo?: string;
    description: string;
    averageRating?: number;
    totalReviews?: number;
    totalProducts?: number;
    category: string;
  };
}

export default function ShopCard({ shop }: ShopCardProps) {
  return (
    <Link href={`/shops/${shop.slug}`} className="group">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        {/* Logo */}
        <div className="relative h-32 bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
          {shop.logo ? (
            <Image
              src={shop.logo}
              alt={shop.name}
              width={80}
              height={80}
              className="object-contain"
            />
          ) : (
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {shop.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Contenu */}
        <div className="p-4">
          {/* Nom */}
          <h3 className="font-semibold text-lg text-gray-900 mb-1 group-hover:text-primary">
            {shop.name}
          </h3>

          {/* Catégorie */}
          <p className="text-xs text-gray-500 mb-2">{shop.category}</p>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {shop.description}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm">
            {/* Rating */}
            {shop.averageRating && shop.totalReviews ? (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{shop.averageRating.toFixed(1)}</span>
                <span className="text-gray-500">({shop.totalReviews})</span>
              </div>
            ) : (
              <span className="text-gray-500">Nouvelle boutique</span>
            )}

            {/* Produits */}
            {shop.totalProducts ? (
              <div className="flex items-center gap-1 text-gray-600">
                <Package className="w-4 h-4" />
                <span>{shop.totalProducts} produits</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}
