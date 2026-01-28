'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { api } from '@/lib/api';
import { useCartStore } from '@/store/cart';
import { useAuthStore } from '@/store/auth';
import { formatPrice } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Lock, ShoppingBag } from 'lucide-react';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

function CheckoutForm({ clientSecret }: { clientSecret: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/orders/confirmation`,
        },
      });

      if (submitError) {
        setError(submitError.message || 'Erreur lors du paiement');
      }
    } catch (err: any) {
      setError(err.message || 'Erreur lors du paiement');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Informations de paiement
        </h2>
        <PaymentElement />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {processing ? 'Traitement en cours...' : 'Payer maintenant'}
      </button>

      <p className="text-xs text-center text-gray-500">
        🔒 Paiement 100% sécurisé via Stripe • Vos données bancaires ne transitent jamais par nos serveurs
      </p>
    </form>
  );
}

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, fetchCart } = useCartStore();
  const { isAuthenticated, isLoading: authLoading } = useAuthStore();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Vérifier l'authentification avant d'initialiser le checkout
  useEffect(() => {
    // Si l'authentification est en cours, attendre
    if (authLoading) {
      return;
    }

    // Si l'utilisateur n'est pas authentifié, le rediriger vers la connexion
    if (!isAuthenticated) {
      router.push('/login?redirect=checkout');
      return;
    }

    // Sinon, initialiser le checkout
    initializeCheckout();
  }, [isAuthenticated, authLoading, router]);

  const initializeCheckout = async () => {
    setLoading(true);
    try {
      // Récupérer le panier
      await fetchCart();

      // Créer la commande
      const order = await api.createOrder({});

      // Créer le payment intent
      const paymentData = await api.createPaymentIntent(order._id);
      setClientSecret(paymentData.clientSecret);
    } catch (err: any) {
      console.error('Erreur initialisation checkout:', err);
      setError(err.response?.data?.message || 'Erreur lors de l\'initialisation du paiement');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <ShoppingBag className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Erreur</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-x-4">
            <button
              onClick={() => router.push('/cart')}
              className="px-6 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300"
            >
              Retour au panier
            </button>
            <button
              onClick={initializeCheckout}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Panier vide</h1>
          <p className="text-gray-600 mb-6">Ajoutez des produits avant de passer commande</p>
          <a
            href="/marketplace"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Parcourir la marketplace
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Finaliser ma commande</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire de paiement */}
          <div className="lg:col-span-2">
            {clientSecret ? (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret,
                  appearance: {
                    theme: 'stripe',
                    variables: {
                      colorPrimary: '#16a34a',
                    },
                  },
                }}
              >
                <CheckoutForm clientSecret={clientSecret} />
              </Elements>
            ) : (
              <LoadingSpinner size="lg" />
            )}
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Récapitulatif</h2>

              {/* Boutiques */}
              <div className="space-y-3 mb-4">
                {Object.entries(cart.itemsByShop).map(([shopId, shopData]: [string, any]) => (
                  <div key={shopId} className="border-b pb-3">
                    <div className="font-medium text-sm mb-2">{shopData.shop.name}</div>
                    <div className="text-xs text-gray-600 space-y-1">
                      {shopData.items.map((item: any) => (
                        <div key={`${item.product._id}-${item.variant?._id || ''}`} className="flex justify-between">
                          <span>
                            {item.product.name} {item.variant ? `(${item.variant.name})` : ''} x{item.quantity}
                          </span>
                          <span>{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-gray-500">
                        <span>Livraison</span>
                        <span>
                          {shopData.shipping === 0 ? 'Gratuite' : formatPrice(shopData.shipping)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totaux */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total</span>
                  <span className="font-medium">{formatPrice(cart.totals.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Livraison totale</span>
                  <span className="font-medium">
                    {cart.totals.shipping === 0 ? 'Gratuite' : formatPrice(cart.totals.shipping)}
                  </span>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold">Total à payer</span>
                  <span className="text-2xl font-bold text-primary">
                    {formatPrice(cart.totals.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
