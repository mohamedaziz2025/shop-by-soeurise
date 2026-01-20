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
    shop: {
      _id: string;
      name: string;
      slug: string;
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
      <div className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow">
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
            {product.shop.name}
          </p>

          {/* Nom */}
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 group-hover:text-primary">
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
            <span className="text-lg font-bold text-primary">
              {formatPrice(product.price)}
            </span>
            
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
              title={product.hasVariants ? "Voir les variantes" : "Ajouter au panier"}
            >
              {isAdding ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin block" />
              ) : (
                <ShoppingCart className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}
