'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCartStore } from '@/store/cart';
import { formatPrice } from '@/lib/utils';
import { Trash2, Plus, Minus, ShoppingBag, Truck, Store, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import LoadingSpinner from '@/components/LoadingSpinner';
import { motion } from 'framer-motion';

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
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!cart || !cart.itemsByShop || cart.itemsByShop.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="w-32 h-32 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-16 h-16 text-pink-600" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
            Votre panier est vide
          </h1>
          <p className="text-gray-600 mb-8 text-lg">
            Découvrez nos boutiques et produits premium
          </p>
          <a
            href="/marketplace"
            className="inline-block px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-full font-bold hover:shadow-lg transition-all"
          >
            Explorer la marketplace
          </a>
        </motion.div>
      </div>
    );
  }

  const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://72.62.71.97:4000';

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-5xl font-black text-gray-900 mb-2 tracking-tight">Mon Panier</h1>
          <p className="text-gray-600 text-lg">
            {cart.totals.shopCount} boutique{cart.totals.shopCount > 1 ? 's' : ''} • {cart.totals.itemCount} article{cart.totals.itemCount > 1 ? 's' : ''}
          </p>
        </motion.div>

        {/* Alert: Paniers séparés */}
        {cart.totals.shopCount > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-[2.5rem] flex items-start gap-3"
          >
            <AlertCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-black text-blue-900 mb-1">Paniers indépendants</h3>
              <p className="text-sm text-blue-700">
                Vos articles proviennent de <strong>{cart.totals.shopCount} boutiques différentes</strong>. 
                Chaque boutique aura son propre panier et vous effectuerez un paiement séparé pour chacune.
              </p>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Produits par boutique */}
          <div className="lg:col-span-2 space-y-6">
            {cart.itemsByShop.map((shopCart: any, index: number) => (
              <motion.div
                key={shopCart.shopId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-[2.5rem] shadow-lg overflow-hidden border-2 border-gray-100"
              >
                {/* Shop header */}
                <div className="bg-gradient-to-r from-indigo-50 to-rose-50 px-8 py-5 border-b-2 border-gray-100">
                  <div className="flex items-center justify-between">
                    <a
                      href={`/shops/${shopCart.shop.slug}`}
                      className="flex items-center gap-3 group"
                    >
                      {shopCart.shop.logo && (
                        <div className="w-12 h-12 rounded-xl bg-white border-2 border-gray-200 overflow-hidden flex items-center justify-center p-1">
                          <img
                            src={shopCart.shop.logo.startsWith('http') ? shopCart.shop.logo : `${API_BASE}${shopCart.shop.logo}`}
                            alt={shopCart.shop.name}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      )}
                      <div>
                        <div className="flex items-center gap-2">
                          <Store className="w-5 h-5 text-indigo-600" />
                          <span className="font-black text-xl text-gray-900 group-hover:text-indigo-600 transition-colors">
                            {shopCart.shop.name}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 uppercase tracking-widest">
                          Panier indépendant
                        </p>
                      </div>
                    </a>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">
                        Total boutique
                      </p>
                      <p className="text-2xl font-black text-indigo-600">
                        {formatPrice(shopCart.total)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y divide-gray-100">
                  {shopCart.items.map((item: any) => (
                    <div
                      key={`${item.product._id}-${item.variant?._id || ''}`}
                      className="p-6 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex gap-6">
                        {/* Image */}
                        <div className="relative w-28 h-28 bg-gray-100 rounded-[2.5rem] overflow-hidden flex-shrink-0 border-2 border-gray-100">
                          <Image
                            src={item.product.mainImage || '/placeholder-product.png'}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg mb-1 truncate">{item.product.name}</h3>
                          {item.variant && (
                            <p className="text-sm text-gray-600 mb-2">{item.variant.name}</p>
                          )}
                          <p className="font-black text-xl text-indigo-600">{formatPrice(item.price)}</p>
                        </div>

                        {/* Quantity & Actions */}
                        <div className="flex flex-col items-end gap-4">
                          <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.product._id,
                                  item.variant?._id,
                                  item.quantity - 1
                                )
                              }
                              disabled={updating === item.product._id || item.quantity <= 1}
                              className="w-10 h-10 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 transition-all flex items-center justify-center"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-12 text-center font-black text-lg">{item.quantity}</span>
                            <button
                              onClick={() =>
                                handleUpdateQuantity(
                                  item.product._id,
                                  item.variant?._id,
                                  item.quantity + 1
                                )
                              }
                              disabled={updating === item.product._id}
                              className="w-10 h-10 rounded-lg bg-white hover:bg-gray-50 disabled:opacity-50 transition-all flex items-center justify-center"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.product._id, item.variant?._id)}
                            className="text-red-500 hover:text-red-700 font-bold text-sm flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-red-50 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                            Retirer
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shop total breakdown */}
                <div className="bg-gray-50 px-8 py-6 border-t-2 border-gray-100">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 font-medium">Sous-total boutique</span>
                      <span className="font-bold">{formatPrice(shopCart.subtotal)}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Truck className="w-4 h-4" />
                        <span className="font-medium">Livraison</span>
                      </div>
                      <span className="font-bold">
                        {shopCart.shipping === 0 ? (
                          <span className="text-green-600">Gratuite ✓</span>
                        ) : (
                          formatPrice(shopCart.shipping)
                        )}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t-2 border-gray-200">
                      <span className="font-black text-lg">Total à payer</span>
                      <span className="font-black text-2xl text-indigo-600">
                        {formatPrice(shopCart.total)}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Récapitulatif global */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-[2.5rem] shadow-lg p-8 sticky top-4 border-2 border-gray-100"
            >
              <h2 className="text-2xl font-black mb-6 tracking-tight">Récapitulatif Global</h2>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 uppercase tracking-widest">Boutiques</span>
                  <span className="font-black text-lg">{cart.totals.shopCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600 uppercase tracking-widest">Articles</span>
                  <span className="font-black text-lg">{cart.totals.itemCount}</span>
                </div>
              </div>

              <div className="space-y-3 mb-6 pt-6 border-t-2 border-gray-100">
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Sous-total</span>
                  <span className="font-bold">{formatPrice(cart.totals.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 font-medium">Livraison totale</span>
                  <span className="font-bold">
                    {cart.totals.shipping === 0 ? (
                      <span className="text-green-600">Gratuite</span>
                    ) : (
                      formatPrice(cart.totals.shipping)
                    )}
                  </span>
                </div>
              </div>

              <div className="border-t-2 border-gray-200 pt-6 mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl font-black">Total Général</span>
                  <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-indigo-600">
                    {formatPrice(cart.totals.total)}
                  </span>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  Paiements séparés par boutique
                </p>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-full font-black text-lg hover:shadow-xl transition-all mb-4"
              >
                Procéder au paiement
              </button>

              <a
                href="/marketplace"
                className="block text-center text-sm font-bold text-gray-600 hover:text-indigo-600 transition-colors"
              >
                ← Continuer mes achats
              </a>

              {/* Info sécurité */}
              <div className="mt-8 pt-8 border-t-2 border-gray-100 space-y-3">
                <div className="flex items-start gap-3 text-xs text-gray-600">
                  <span className="text-xl">🔒</span>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">Paiement 100% sécurisé</p>
                    <p>Transactions protégées via Stripe</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-xs text-gray-600">
                  <span className="text-xl">✅</span>
                  <div>
                    <p className="font-bold text-gray-900 mb-1">Label de Confiance</p>
                    <p>Boutiques vérifiées par Shop By Soeurise</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
