'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import { CheckCircle, Package, Truck, Mail } from 'lucide-react';

function OrderConfirmationPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderId = searchParams.get('order_id');
    const paymentIntent = searchParams.get('payment_intent');

    const id = orderId || paymentIntent;
    if (id) {
      fetchOrder(id);
    } else {
      router.push('/marketplace');
    }
  }, [searchParams]);

  const fetchOrder = async (id: string) => {
    try {
      const data = await api.getOrder(id);
      setOrder(data);
    } catch (error) {
      console.error('Erreur chargement commande:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Commande introuvable</h1>
          <a href="/marketplace" className="text-primary hover:underline">
            Retour à la marketplace
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4">
        {/* Success Banner */}
        <div className="bg-white rounded-lg shadow-sm p-8 mb-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Commande confirmée !</h1>
          <p className="text-gray-600 mb-4">
            Merci pour votre achat sur Soeurise. Votre commande a été validée avec succès.
          </p>
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-pink-50 rounded-lg">
            <span className="text-sm text-gray-600">Numéro de commande :</span>
            <span className="font-mono font-semibold text-pink-600">#{order.orderNumber}</span>
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Détails de la commande</h2>
          
          <div className="space-y-4">
            {/* Items */}
            {order.items?.map((item: any, index: number) => (
              <div key={index} className="flex items-start gap-4 pb-4 border-b last:border-0">
                <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0">
                  {item.product?.images?.[0] && (
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{item.product?.name}</h3>
                  {item.variant && (
                    <p className="text-sm text-gray-600">{item.variant.name}</p>
                  )}
                  <p className="text-sm text-gray-500">Quantité : {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                  <p className="text-sm text-gray-500">{formatPrice(item.price)} / unité</p>
                </div>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="mt-6 pt-6 border-t space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Sous-total</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Frais de livraison</span>
              <span>{formatPrice(order.shippingCost)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Réduction</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
              <span>Total</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Truck className="w-5 h-5 text-pink-500" />
            <h2 className="text-xl font-semibold">Adresse de livraison</h2>
          </div>
          <div className="text-gray-600">
            <p className="font-medium text-gray-900">
              {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
            </p>
            <p>{order.shippingAddress?.address}</p>
            <p>
              {order.shippingAddress?.postalCode} {order.shippingAddress?.city}
            </p>
            <p>{order.shippingAddress?.country}</p>
            {order.shippingAddress?.phone && (
              <p className="mt-2">Tél : {order.shippingAddress.phone}</p>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-gradient-to-br from-pink-50 to-orange-50 rounded-lg p-6 mb-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
              <Mail className="w-6 h-6 text-pink-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Et maintenant ?</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                  Un email de confirmation vous a été envoyé
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                  Vous pouvez suivre votre commande depuis votre compte
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                  Les vendeuses vont préparer vos articles
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-pink-500 rounded-full"></div>
                  Vous recevrez une notification lors de l'expédition
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href="/account/orders"
            className="flex-1 px-6 py-3 bg-pink-500 text-white rounded-lg font-semibold hover:bg-pink-600 text-center"
          >
            <Package className="w-5 h-5 inline mr-2" />
            Voir mes commandes
          </a>
          <a
            href="/marketplace"
            className="flex-1 px-6 py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 text-center"
          >
            Continuer mes achats
          </a>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <OrderConfirmationPageContent />
    </Suspense>
  );
}
