'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import { Trash2, Plus, Minus, ShoppingBag, Truck } from 'lucide-react';
import Image from 'next/image';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function CartPage() {
  const router = useRouter();
  const { cart, loading, fetchCart, updateItemQuantity, removeItem } = useCartStore();
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (productId: string, variantId: string | undefined, newQuantity: number) => {
    setUpdating(productId);
    try {
      await updateItemQuantity(productId, variantId, newQuantity);
    } finally {
      setUpdating(null);
    }
  };

  const handleRemoveItem = async (productId: string, variantId: string | undefined) => {
    if (confirm('Retirer ce produit du panier ?')) {
      await removeItem(productId, variantId);
    }
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Votre panier est vide</h1>
          <p className="text-gray-600 mb-6">Découvrez nos produits premium</p>
          <a
            href="/marketplace"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90"
          >
            Parcourir la marketplace
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mon Panier</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Produits */}
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(cart.itemsByShop).map(([shopId, shopData]: [string, any]) => (
              <div key={shopId} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Shop header */}
                <div className="bg-gray-50 px-6 py-3 border-b">
                  <a
                    href={`/shops/${shopData.shop.slug}`}
                    className="font-semibold text-lg hover:text-primary"
                  >
                    {shopData.shop.name}
                  </a>
                </div>

                {/* Items */}
                <div className="divide-y">
                  {shopData.items.map((item: any) => (
                    <div key={`${item.product._id}-${item.variant?._id || ''}`} className="p-6">
                      <div className="flex gap-4">
                        {/* Image */}
                        <div className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={item.product.images?.[0] || '/placeholder-product.png'}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                          <h3 className="font-medium text-lg mb-1">{item.product.name}</h3>
                          {item.variant && (
                            <p className="text-sm text-gray-600 mb-2">{item.variant.name}</p>
                          )}
                          <p className="font-semibold text-primary">{formatPrice(item.price)}</p>
                        </div>

                        {/* Quantity */}
                        <div className="flex flex-col items-end gap-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.product._id,
                                  item.variant?._id,
                                  item.quantity - 1
                                )
                              }
                              disabled={updating === item.product._id || item.quantity <= 1}
                              className="w-8 h-8 border rounded hover:bg-gray-100 disabled:opacity-50"
                            >
                              <Minus className="w-4 h-4 mx-auto" />
                            </button>
                            <span className="w-12 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.product._id,
                                  item.variant?._id,
                                  item.quantity + 1
                                )
                              }
                              disabled={updating === item.product._id}
                              className="w-8 h-8 border rounded hover:bg-gray-100 disabled:opacity-50"
                            >
                              <Plus className="w-4 h-4 mx-auto" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.product._id, item.variant?._id)}
                            className="text-red-500 hover:text-red-700 text-sm flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" />
                            Retirer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shop total */}
                <div className="bg-gray-50 px-6 py-4 border-t">
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Sous-total</span>
                    <span className="font-medium">{formatPrice(shopData.subtotal)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Truck className="w-4 h-4" />
                      <span>Livraison</span>
                    </div>
                    <span className="font-medium">
                      {shopData.shipping === 0 ? (
                        <span className="text-green-600">Gratuite</span>
                      ) : (
                        formatPrice(shopData.shipping)
                      )}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3 pt-3 border-t">
                    <span className="font-semibold">Total boutique</span>
                    <span className="font-bold text-lg text-primary">
                      {formatPrice(shopData.total)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Récapitulatif</h2>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium">{formatPrice(cart.totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-medium">
                    {cart.totals.shipping === 0 ? (
                      <span className="text-green-600">Gratuite</span>
                    ) : (
                      formatPrice(cart.totals.shipping)
                    )}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(cart.totals.total)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Passer la commande
              </button>

              <a
                href="/marketplace"
                className="block text-center mt-4 text-sm text-gray-600 hover:text-primary"
              >
                Continuer mes achats
              </a>

              {/* Info sécurité */}
              <div className="mt-6 pt-6 border-t text-xs text-gray-500 space-y-2">
                <div className="flex items-center gap-2">
                  <span>🔒</span>
                  <span>Paiement 100% sécurisé via Stripe</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>✅</span>
                  <span>Label de Confiance Soeurise</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
