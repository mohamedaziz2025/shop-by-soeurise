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
  const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://72.62.71.97:3001';
  
  return (
    <Link href={`/shops/${shop.slug}`} className="group">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-lg hover:border-pink-200 transition-all border border-gray-200/50">
        {/* Logo */}
        <div className="relative h-32 bg-gradient-to-br from-pink-50 to-orange-50 flex items-center justify-center overflow-hidden">
          {shop.logo ? (
            <img
              src={shop.logo.startsWith('http') ? shop.logo : `${API_BASE}${shop.logo}`}
              alt={shop.name}
              className="object-contain h-full w-full p-3 group-hover:scale-110 transition-transform duration-300"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                const container = e.currentTarget.parentElement;
                if (container) {
                  container.innerHTML = `<div class="w-20 h-20 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full flex items-center justify-center text-2xl font-bold text-pink-700">${shop.name.charAt(0)}</div>`;
                }
              }}
            />
          ) : (
            <div className="w-20 h-20 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-pink-700">
                {shop.name.charAt(0)}
              </span>
            </div>
          )}
        </div>

        {/* Contenu */}
        <div className="p-4">
          {/* Nom */}
          <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-pink-600 transition-colors">
            {shop.name}
          </h3>

          {/* Catégorie */}
          <p className="text-xs text-gray-500 font-medium mb-2">{shop.category}</p>

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {shop.description || 'Découvrez notre sélection exclusive'}
          </p>

          {/* Stats */}
          <div className="flex items-center justify-between text-sm">
            {/* Rating */}
            {shop.averageRating && shop.totalReviews ? (
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{shop.averageRating.toFixed(1)}</span>
                <span className="text-gray-500">({shop.totalReviews})</span>
              </div>
            ) : (
              <span className="text-gray-500 text-xs">Nouvelle boutique</span>
            )}

            {/* Produits */}
            {shop.totalProducts ? (
              <div className="flex items-center gap-1 text-gray-600 font-medium">
                <Package className="w-4 h-4" />
                <span>{shop.totalProducts}</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Link>
  );
}
