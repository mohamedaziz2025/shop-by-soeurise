'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { formatPrice, formatDate } from '@/lib/utils';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Package, Truck, CheckCircle, XCircle, Eye, AlertCircle } from 'lucide-react';

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await api.getSellerOrders();
      setOrders(data);
    } catch (error) {
      console.error('Erreur chargement commandes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.updateOrderStatus(orderId, newStatus);
      fetchOrders();
    } catch (error) {
      console.error('Erreur mise à jour statut:', error);
      alert('Erreur lors de la mise à jour du statut');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; color: string; icon: any }> = {
      PENDING: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800', icon: AlertCircle },
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

  const filteredOrders = filter === 'ALL'
    ? orders
    : orders.filter((order) => order.status === filter);

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen">
          <div className="p-6">
            <img src="/logo-soeurise/logo-main.svg" alt="Soeurise" className="h-8 mb-6" />
            <nav className="space-y-2">
              <a href="/seller/dashboard" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
                📊 Dashboard
              </a>
              <a href="/seller/products" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
                📦 Mes Produits
              </a>
              <a
                href="/seller/orders"
                className="block px-4 py-2 bg-pink-50 text-pink-600 rounded-lg font-medium"
              >
                🛒 Commandes
              </a>
              <a href="/seller/settings" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
                ⚙️ Paramètres
              </a>
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">Mes Commandes</h1>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex gap-2 overflow-x-auto">
              {['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                    filter === status
                      ? 'bg-pink-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'ALL' ? 'Toutes' : getStatusBadge(status).props.children[1]}
                  <span className="ml-2 text-sm">
                    ({status === 'ALL' ? orders.length : orders.filter((o) => o.status === status).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Aucune commande</h2>
              <p className="text-gray-600">
                {filter === 'ALL'
                  ? 'Vous n\'avez pas encore de commandes'
                  : `Aucune commande avec le statut "${getStatusBadge(filter).props.children[1]}"`}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {Array.isArray(filteredOrders) && filteredOrders.map((order) => (
                <div key={order._id} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  {/* Order Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono font-semibold text-lg">
                            #{order.orderNumber}
                          </span>
                          {getStatusBadge(order.status)}
                        </div>
                        <p className="text-sm text-gray-600">
                          Commande passée le {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">
                          {formatPrice(order.total)}
                        </div>
                        <p className="text-sm text-gray-600">{order.items?.length || 0} articles</p>
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h3 className="font-medium text-gray-900 mb-2">Client</h3>
                      <div className="text-sm text-gray-700">
                        <p className="font-medium">
                          {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                        </p>
                        <p>{order.shippingAddress?.address}</p>
                        <p>
                          {order.shippingAddress?.postalCode} {order.shippingAddress?.city}
                        </p>
                        {order.shippingAddress?.phone && (
                          <p className="mt-1">Tél : {order.shippingAddress.phone}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-3 mb-4">
                      {order.items?.map((item: any, index: number) => (
                        <div key={index} className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0">
                            {item.product?.images?.[0] && (
                              <img
                                src={item.product.images[0]}
                                alt={item.product.name}
                                className="w-full h-full object-cover rounded-lg"
                              />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900">{item.product?.name}</h4>
                            {item.variant && (
                              <p className="text-sm text-gray-600">{item.variant.name}</p>
                            )}
                            <p className="text-sm text-gray-500">Quantité : {item.quantity}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    {order.status === 'PENDING' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleUpdateStatus(order._id, 'CONFIRMED')}
                          className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
                        >
                          <CheckCircle className="w-4 h-4 inline mr-2" />
                          Confirmer
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Annuler cette commande ?')) {
                              handleUpdateStatus(order._id, 'CANCELLED');
                            }
                          }}
                          className="px-4 py-2 bg-white border-2 border-red-500 text-red-500 rounded-lg font-medium hover:bg-red-50"
                        >
                          <XCircle className="w-4 h-4 inline mr-2" />
                          Annuler
                        </button>
                      </div>
                    )}

                    {order.status === 'CONFIRMED' && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'PROCESSING')}
                        className="w-full px-4 py-2 bg-purple-500 text-white rounded-lg font-medium hover:bg-purple-600"
                      >
                        <Package className="w-4 h-4 inline mr-2" />
                        Commencer la préparation
                      </button>
                    )}

                    {order.status === 'PROCESSING' && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, 'SHIPPED')}
                        className="w-full px-4 py-2 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600"
                      >
                        <Truck className="w-4 h-4 inline mr-2" />
                        Marquer comme expédiée
                      </button>
                    )}

                    {order.status === 'SHIPPED' && (
                      <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 text-center">
                        <Truck className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                        <p className="text-sm text-indigo-800">
                          Commande expédiée - En attente de livraison
                        </p>
                      </div>
                    )}

                    {order.status === 'DELIVERED' && (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                        <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
                        <p className="text-sm text-green-800">Commande livrée avec succès</p>
                      </div>
                    )}

                    {order.status === 'CANCELLED' && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                        <XCircle className="w-6 h-6 text-red-600 mx-auto mb-2" />
                        <p className="text-sm text-red-800">Commande annulée</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
