'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { api } from '@/lib/api';
import {
  Search,
  MoreHorizontal,
  Eye,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Package,
  User,
  DollarSign,
  AlertTriangle,
  Edit
} from 'lucide-react';

interface Order {
  _id?: string;
  id?: string;
  user: {
    _id?: string;
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  status: string;
  totalAmount: number;
  items: Array<{
    product: {
      name: string;
    };
    quantity: number;
    price: number;
  }>;
  shippingAddress?: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  createdAt: string;
  paymentStatus: string;
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [orders, searchTerm, statusFilter]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const data = await api.getAllOrders();
      setOrders(data);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = () => {
    let filtered = Array.isArray(orders) ? orders : [];

    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (order._id || order.id || '')?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'DELIVERED': return 'text-green-600 bg-green-100';
      case 'CONFIRMED': return 'text-blue-600 bg-blue-100';
      case 'SHIPPED': return 'text-purple-600 bg-purple-100';
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      case 'CANCELLED': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'DELIVERED': return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'CONFIRMED': return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'SHIPPED': return <Truck className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'PENDING': return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'CANCELLED': return <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
      default: return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'PAID': return 'text-green-600 bg-green-100';
      case 'PENDING': return 'text-yellow-600 bg-yellow-100';
      case 'FAILED': return 'text-red-600 bg-red-100';
      case 'REFUNDED': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      await api.updateOrderStatusAdmin(orderId, newStatus);
      await fetchOrders();
      setShowActionMenu(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Gestion des commandes" subtitle="Gérer les commandes">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gestion des commandes" subtitle="Gérer les commandes">
      <div className="space-y-4 sm:space-y-6">
        {/* Filters */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="w-4 h-4 sm:w-5 sm:h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 sm:pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="sm:w-44 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tous</option>
              <option value="PENDING">En attente</option>
              <option value="CONFIRMED">Confirmé</option>
              <option value="SHIPPED">Expédié</option>
              <option value="DELIVERED">Livré</option>
              <option value="CANCELLED">Annulé</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-medium text-gray-900">
              {filteredOrders.length} commande{filteredOrders.length > 1 ? 's' : ''}
            </h3>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Commande</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paiement</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Array.isArray(filteredOrders) && filteredOrders.map((order) => {
                  const orderId = order._id || order.id || '';
                  return (
                    <tr key={orderId} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Package className="w-5 h-5 text-gray-400 mr-3" />
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              #{orderId.substring(0, 8)}...
                            </div>
                            <div className="text-xs text-gray-500">
                              {order.items?.length || 0} article{(order.items?.length || 0) > 1 ? 's' : ''}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-900">
                          <User className="w-4 h-4 mr-2 text-gray-400" />
                          {order.user?.firstName} {order.user?.lastName}
                        </div>
                        <div className="text-xs text-gray-500">{order.user?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm font-medium text-gray-900">
                          <DollarSign className="w-4 h-4 mr-1 text-gray-400" />
                          {order.totalAmount?.toFixed(2)} €
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{order.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="relative inline-block">
                          <button
                            onClick={() => setShowActionMenu(showActionMenu === orderId ? null : orderId)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                          {showActionMenu === orderId && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setShowActionMenu(null)} />
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border">
                                <div className="py-1">
                                  <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                    <Eye className="w-4 h-4 mr-2" />Voir détails
                                  </button>
                                  <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                    <Edit className="w-4 h-4 mr-2" />Modifier
                                  </button>
                                  {order.status === 'PENDING' && (
                                    <button
                                      onClick={() => handleUpdateStatus(orderId, 'CONFIRMED')}
                                      className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 w-full text-left"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2" />Confirmer
                                    </button>
                                  )}
                                  {order.status === 'CONFIRMED' && (
                                    <button
                                      onClick={() => handleUpdateStatus(orderId, 'SHIPPED')}
                                      className="flex items-center px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 w-full text-left"
                                    >
                                      <Truck className="w-4 h-4 mr-2" />Expédier
                                    </button>
                                  )}
                                  {order.status === 'SHIPPED' && (
                                    <button
                                      onClick={() => handleUpdateStatus(orderId, 'DELIVERED')}
                                      className="flex items-center px-4 py-2 text-sm text-green-600 hover:bg-green-50 w-full text-left"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2" />Marquer livré
                                    </button>
                                  )}
                                  {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                                    <button
                                      onClick={() => handleUpdateStatus(orderId, 'CANCELLED')}
                                      className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                    >
                                      <XCircle className="w-4 h-4 mr-2" />Annuler
                                    </button>
                                  )}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden divide-y divide-gray-200">
            {Array.isArray(filteredOrders) && filteredOrders.map((order) => {
              const orderId = order._id || order.id || '';
              return (
                <div key={orderId} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <Package className="w-10 h-10 text-gray-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          #{orderId.substring(0, 8)}...
                        </p>
                        <p className="text-xs text-gray-500">
                          {order.user?.firstName} {order.user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{order.user?.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowActionMenu(showActionMenu === orderId ? null : orderId)}
                      className="ml-2 text-gray-400"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1">{order.status}</span>
                    </span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                      {order.paymentStatus}
                    </span>
                  </div>

                  <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <span>{order.totalAmount?.toFixed(2)} €</span>
                    <span>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</span>
                  </div>

                  {showActionMenu === orderId && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowActionMenu(null)} />
                      <div className="absolute right-4 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border">
                        <div className="py-1">
                          <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                            <Eye className="w-4 h-4 mr-2" />Voir
                          </button>
                          {order.status === 'PENDING' && (
                            <button onClick={() => handleUpdateStatus(orderId, 'CONFIRMED')} className="flex items-center px-4 py-2 text-sm text-blue-600 hover:bg-blue-50 w-full text-left">
                              <CheckCircle className="w-4 h-4 mr-2" />Confirmer
                            </button>
                          )}
                          {order.status === 'CONFIRMED' && (
                            <button onClick={() => handleUpdateStatus(orderId, 'SHIPPED')} className="flex items-center px-4 py-2 text-sm text-purple-600 hover:bg-purple-50 w-full text-left">
                              <Truck className="w-4 h-4 mr-2" />Expédier
                            </button>
                          )}
                          {order.status === 'SHIPPED' && (
                            <button onClick={() => handleUpdateStatus(orderId, 'DELIVERED')} className="flex items-center px-4 py-2 text-sm text-green-600 hover:bg-green-50 w-full text-left">
                              <CheckCircle className="w-4 h-4 mr-2" />Livrer
                            </button>
                          )}
                          {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                            <button onClick={() => handleUpdateStatus(orderId, 'CANCELLED')} className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                              <XCircle className="w-4 h-4 mr-2" />Annuler
                            </button>
                          )}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune commande</h3>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}
