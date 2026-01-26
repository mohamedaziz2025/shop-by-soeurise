'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/auth';
import { formatPrice, formatDate } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Package, Truck, CheckCircle, XCircle } from 'lucide-react';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await api.getMyOrders();
      setOrders(data);
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
      PENDING: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: Package },
      CONFIRMED: { label: 'Confirmée', color: 'bg-blue-100 text-blue-800', icon: CheckCircle },
      PROCESSING: { label: 'En préparation', color: 'bg-purple-100 text-purple-800', icon: Package },
      SHIPPED: { label: 'Expédiée', color: 'bg-indigo-100 text-indigo-800', icon: Truck },
      DELIVERED: { label: 'Livrée', color: 'bg-green-100 text-green-800', icon: CheckCircle },
      CANCELLED: { label: 'Annulée', color: 'bg-red-100 text-red-800', icon: XCircle },
    };

    const config = statusConfig[status] || statusConfig.PENDING;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Mes Commandes</h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Aucune commande</h2>
            <p className="text-gray-600 mb-6">Vous n'avez pas encore passé de commande</p>
            <a
              href="/marketplace"
              className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90"
            >
              Parcourir la marketplace
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {Array.isArray(orders) && orders.map((order) => (
              <div key={order._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                {/* Header */}
                <div className="bg-gray-50 px-6 py-4 border-b flex items-center justify-between">
                  <div>
                    <div className="font-semibold">Commande #{order.orderNumber}</div>
                    <div className="text-sm text-gray-600">
                      Passée le {formatDate(order.createdAt)}
                    </div>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(order.status)}
                    <div className="text-lg font-bold text-primary mt-1">
                      {formatPrice(order.totalAmount)}
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="p-6">
                  {order.items?.map((item: any) => (
                    <div key={item._id} className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0" />
                      <div className="flex-1">
                        <div className="font-medium">{item.productName}</div>
                        {item.variantName && (
                          <div className="text-sm text-gray-600">{item.variantName}</div>
                        )}
                        <div className="text-sm text-gray-500">Quantité: {item.quantity}</div>
                      </div>
                      <div className="font-semibold">{formatPrice(item.price * item.quantity)}</div>
                    </div>
                  ))}

                  {/* Tracking */}
                  {order.shipment?.trackingNumber && (
                    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <Truck className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">Numéro de suivi:</span>
                        <span className="text-blue-600">{order.shipment.trackingNumber}</span>
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex gap-3">
                    <a
                      href={`/account/orders/${order._id}`}
                      className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm font-medium"
                    >
                      Voir les détails
                    </a>
                    {order.status === 'DELIVERED' && (
                      <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm font-medium">
                        Laisser un avis
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
