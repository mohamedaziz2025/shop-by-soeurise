'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { api } from '@/lib/api';
import {
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Eye,
  Store,
  User,
  AlertTriangle,
  Clock,
  Trash2,
  Edit,
  MapPin,
  Package,
  Plus
} from 'lucide-react';
import Image from 'next/image';

interface Shop {
  _id?: string;
  id?: string;
  slug?: string;
  name: string;
  description: string;
  owner: {
    _id?: string;
    id?: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  status: string;
  category: string;
  location?: string;
  createdAt: string;
  productsCount?: number;
  totalSales?: number;
  rating?: number;
  logo?: string;
}

export default function AdminShopsPage() {
  const router = useRouter();
  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    filterShops();
  }, [shops, searchTerm, statusFilter, categoryFilter]);

  const fetchShops = async () => {
    try {
      setIsLoading(true);
      const data = await api.getAllShops();
      setShops(data);
    } catch (error) {
      console.error('Erreur lors du chargement des boutiques:', error);
      setShops([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterShops = () => {
    let filtered = Array.isArray(shops) ? shops : [];

    if (searchTerm) {
      filtered = filtered.filter(shop =>
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.owner?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(shop => shop.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(shop => shop.category === categoryFilter);
    }

    setFilteredShops(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'text-green-600 bg-green-100';
      case 'PENDING_APPROVAL': return 'text-yellow-600 bg-yellow-100';
      case 'REJECTED': return 'text-red-600 bg-red-100';
      case 'SUSPENDED': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'PENDING_APPROVAL': return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'REJECTED': return <XCircle className="w-3 h-3 sm:w-4 sm:h-4" />;
      case 'SUSPENDED': return <AlertTriangle className="w-3 h-3 sm:w-4 sm:h-4" />;
      default: return <Clock className="w-3 h-3 sm:w-4 sm:h-4" />;
    }
  };

  const handleApprove = async (shopId: string) => {
    try {
      setActionLoading(shopId);
      await api.approveShopAdmin(shopId);
      await fetchShops();
      setShowActionMenu(null);
      alert('Boutique approuvée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
      alert('Erreur lors de l\'approbation');
    } finally {
      setActionLoading(null);
    }
  };

  const handleRejectClick = (shopId: string) => {
    setSelectedShop(shops.find(s => (s._id || s.id) === shopId) || null);
    setRejectReason('');
    setShowRejectModal(true);
    setShowActionMenu(null);
  };

  const handleRejectSubmit = async () => {
    if (!selectedShop) return;
    try {
      setActionLoading(selectedShop._id || selectedShop.id || '');
      await api.rejectShopAdmin(selectedShop._id || selectedShop.id || '', rejectReason || 'Rejeté par l\'administrateur');
      await fetchShops();
      setShowRejectModal(false);
      setSelectedShop(null);
      setRejectReason('');
      alert('Boutique rejetée avec succès');
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
      alert('Erreur lors du rejet');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspend = async (shopId: string) => {
    try {
      setActionLoading(shopId);
      await api.suspendShopAdmin(shopId);
      await fetchShops();
      setShowActionMenu(null);
      alert('Boutique suspendue avec succès');
    } catch (error) {
      console.error('Erreur lors de la suspension:', error);
      alert('Erreur lors de la suspension');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async () => {
    if (!selectedShop) return;
    try {
      setActionLoading(selectedShop._id || selectedShop.id || '');
      const shopId = selectedShop._id || selectedShop.id || '';
      await api.deleteShopAdmin(shopId);
      await fetchShops();
      setShowDeleteConfirm(false);
      setSelectedShop(null);
      alert('Boutique supprimée avec succès');
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setActionLoading(null);
    }
  };

  const handleActivate = async (shopId: string) => {
    try {
      setActionLoading(shopId);
      await api.approveShopAdmin(shopId);
      await fetchShops();
      setShowActionMenu(null);
      alert('Boutique activée avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'activation:', error);
      alert('Erreur lors de l\'activation');
    } finally {
      setActionLoading(null);
    }
  };

  const handleViewShop = (shop: Shop) => {
    window.open(`/shops/${shop.slug || shop._id}`, '_blank');
  };

  const handleEditShop = (shop: Shop) => {
    router.push(`/admin/shops/${shop._id || shop.id}/edit`);
  };

  if (isLoading) {
    return (
      <AdminLayout title="Gestion des boutiques" subtitle="Gérer les boutiques">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gestion des boutiques" subtitle="Gérer les boutiques">
      <div className="space-y-4 sm:space-y-6">
        {/* Header with Create Button */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900">Toutes les boutiques</h2>
          <button
            onClick={() => router.push('/admin/shops/create')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium whitespace-nowrap"
          >
            <Plus className="w-5 h-5" />
            Créer une boutique
          </button>
        </div>

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
              <option value="APPROVED">Approuvé</option>
              <option value="PENDING_APPROVAL">En attente</option>
              <option value="REJECTED">Rejeté</option>
              <option value="SUSPENDED">Suspendu</option>
            </select>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="sm:w-44 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toutes catégories</option>
              <option value="Mode">Mode</option>
              <option value="Cosmétiques">Cosmétiques</option>
            </select>
          </div>
        </div>

        {/* Shops List */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
              {filteredShops.length} boutique{filteredShops.length > 1 ? 's' : ''}
            </h3>
            <p className="text-sm text-gray-500 mt-1">Gestion complète des boutiques vendeurs</p>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Boutique</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Propriétaire</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Statut</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Produits</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Ventes</th>
                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredShops.map((shop) => {
                  const shopId = shop._id || shop.id || '';
                  return (
                    <tr key={shopId} className="hover:bg-slate-50 transition-colors duration-150 border-b border-gray-100 last:border-b-0">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-14 h-14 bg-gradient-to-br from-pink-50 to-orange-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                            {shop.logo ? (
                              <img
                                src={shop.logo.startsWith('http') ? shop.logo : `http://72.62.71.97:3001${shop.logo}`}
                                alt={shop.name}
                                className="object-contain h-full w-full p-2"
                                onError={(e) => {
                                  const container = (e.target as HTMLImageElement).parentElement;
                                  if (container) {
                                    container.innerHTML = `
                                      <div class="w-10 h-10 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full flex items-center justify-center text-sm font-bold text-pink-700">
                                        ${shop.name.charAt(0).toUpperCase()}
                                      </div>
                                    `;
                                  }
                                }}
                              />
                            ) : (
                              <div className="w-10 h-10 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full flex items-center justify-center">
                                <span className="text-sm font-bold text-pink-700">
                                  {shop.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">{shop.name}</div>
                            <div className="text-xs text-gray-500">{shop.category}</div>
                            {shop.location && (
                              <div className="text-xs text-gray-500 flex items-center mt-1">
                                <MapPin className="w-3 h-3 mr-1" />
                                {shop.location}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm font-medium text-gray-900">
                          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center mr-2 flex-shrink-0">
                            <User className="w-4 h-4 text-gray-600" />
                          </div>
                          <div>
                            <div>{shop.owner?.firstName} {shop.owner?.lastName}</div>
                            <div className="text-xs text-gray-500 font-normal">{shop.owner?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${getStatusColor(shop.status)} border-0`}>
                          {getStatusIcon(shop.status)}
                          <span>{shop.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-sm font-medium text-gray-900">
                          <Package className="w-4 h-4 text-gray-400" />
                          {shop.productsCount || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {shop.totalSales || 0} €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="relative inline-block">
                          <button
                            onClick={() => setShowActionMenu(showActionMenu === shopId ? null : shopId)}
                            className="text-gray-400 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                          {showActionMenu === shopId && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setShowActionMenu(null)} />
                              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl z-20 border border-gray-200 overflow-hidden">
                                <div className="py-2">
                                  <button 
                                    onClick={() => handleViewShop(shop)}
                                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-slate-50 w-full text-left transition-colors"
                                  >
                                    <Eye className="w-4 h-4 mr-3 text-gray-400" />Voir la boutique
                                  </button>
                                  <button 
                                    onClick={() => handleEditShop(shop)}
                                    className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-slate-50 w-full text-left transition-colors"
                                  >
                                    <Edit className="w-4 h-4 mr-3 text-gray-400" />Modifier
                                  </button>
                                  <div className="border-t border-gray-100 my-1"></div>
                                  {shop.status === 'PENDING_APPROVAL' && (
                                    <>
                                      <button
                                        onClick={() => handleApprove(shopId)}
                                        disabled={actionLoading !== null}
                                        className="flex items-center px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 w-full text-left disabled:opacity-50 transition-colors"
                                      >
                                        <CheckCircle className="w-4 h-4 mr-3" />
                                        {actionLoading === shopId ? 'Approbation...' : 'Approuver'}
                                      </button>
                                      <button
                                        onClick={() => handleRejectClick(shopId)}
                                        disabled={actionLoading !== null}
                                        className="flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left disabled:opacity-50 transition-colors"
                                      >
                                        <XCircle className="w-4 h-4 mr-3" />
                                        {actionLoading === shopId ? 'Rejet...' : 'Rejeter'}
                                      </button>
                                    </>
                                  )}
                                  {shop.status === 'APPROVED' && (
                                    <button
                                      onClick={() => handleSuspend(shopId)}
                                      disabled={actionLoading !== null}
                                      className="flex items-center px-4 py-2.5 text-sm text-orange-600 hover:bg-orange-50 w-full text-left disabled:opacity-50 transition-colors"
                                    >
                                      <AlertTriangle className="w-4 h-4 mr-3" />
                                      {actionLoading === shopId ? 'Suspension...' : 'Suspendre'}
                                    </button>
                                  )}
                                  {shop.status === 'SUSPENDED' && (
                                    <button
                                      onClick={() => handleActivate(shopId)}
                                      disabled={actionLoading !== null}
                                      className="flex items-center px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 w-full text-left disabled:opacity-50 transition-colors"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-3" />
                                      {actionLoading === shopId ? 'Activation...' : 'Activer'}
                                    </button>
                                  )}
                                  <button
                                    onClick={() => {
                                      setSelectedShop(shop);
                                      setShowDeleteConfirm(true);
                                      setShowActionMenu(null);
                                    }}
                                    disabled={actionLoading !== null}
                                    className="flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left disabled:opacity-50 transition-colors"
                                  >
                                    <Trash2 className="w-4 h-4 mr-3" />Supprimer
                                  </button>
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
          <div className="lg:hidden divide-y divide-gray-100">
            {filteredShops.map((shop) => {
              const shopId = shop._id || shop.id || '';
              return (
                <div key={shopId} className="p-4 hover:bg-slate-50 transition-colors duration-150">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-14 h-14 bg-gradient-to-br from-pink-50 to-orange-50 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                        {shop.logo ? (
                          <img
                            src={shop.logo.startsWith('http') ? shop.logo : `http://72.62.71.97:3001${shop.logo}`}
                            alt={shop.name}
                            className="object-contain h-full w-full p-2"
                            onError={(e) => {
                              const container = (e.target as HTMLImageElement).parentElement;
                              if (container) {
                                container.innerHTML = `
                                  <div class="w-10 h-10 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full flex items-center justify-center text-sm font-bold text-pink-700">
                                    ${shop.name.charAt(0).toUpperCase()}
                                  </div>
                                `;
                              }
                            }}
                          />
                        ) : (
                          <div className="w-10 h-10 bg-gradient-to-br from-pink-200 to-rose-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-bold text-pink-700">
                              {shop.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">{shop.name}</p>
                        <p className="text-xs text-gray-500">{shop.category}</p>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <User className="w-3 h-3 mr-1" />
                          {shop.owner?.firstName} {shop.owner?.lastName}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowActionMenu(showActionMenu === shopId ? null : shopId)}
                      className="ml-2 text-gray-400 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${getStatusColor(shop.status)}`}>
                      {getStatusIcon(shop.status)}
                      <span>{shop.status}</span>
                    </span>
                    <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg font-medium">{shop.productsCount || 0} produits</span>
                  </div>

                  <div className="text-xs text-gray-600 space-y-1 mb-3">
                    {shop.location && <div><span className="font-medium">Lieu:</span> {shop.location}</div>}
                    <div><span className="font-medium">Ventes:</span> {shop.totalSales || 0}€</div>
                  </div>

                  {showActionMenu === shopId && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowActionMenu(null)} />
                      <div className="absolute right-4 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border">
                        <div className="py-1">
                          <button 
                            onClick={() => handleViewShop(shop)}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <Eye className="w-4 h-4 mr-2" />Voir la boutique
                          </button>
                          {shop.status === 'PENDING_APPROVAL' && (
                            <>
                              <button 
                                onClick={() => handleApprove(shopId)}
                                disabled={actionLoading !== null}
                                className="flex items-center px-4 py-2 text-sm text-green-600 hover:bg-green-50 w-full text-left disabled:opacity-50"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                {actionLoading === shopId ? 'Approbation...' : 'Approuver'}
                              </button>
                              <button
                                onClick={() => handleRejectClick(shopId)}
                                disabled={actionLoading !== null}
                                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left disabled:opacity-50"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                {actionLoading === shopId ? 'Rejet...' : 'Rejeter'}
                              </button>
                            </>
                          )}
                          {shop.status === 'APPROVED' && (
                            <button onClick={() => handleSuspend(shopId)} className="flex items-center px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 w-full text-left">
                              <AlertTriangle className="w-4 h-4 mr-2" />Suspendre
                            </button>
                          )}
                          {shop.status === 'SUSPENDED' && (
                            <button onClick={() => handleActivate(shopId)} className="flex items-center px-4 py-2 text-sm text-green-600 hover:bg-green-50 w-full text-left">
                              <CheckCircle className="w-4 h-4 mr-2" />Activer
                            </button>
                          )}
                          <button onClick={() => {
                            setSelectedShop(shop);
                            setShowDeleteConfirm(true);
                            setShowActionMenu(null);
                          }} className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                            <Trash2 className="w-4 h-4 mr-2" />Supprimer
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {filteredShops.length === 0 && (
            <div className="text-center py-12">
              <Store className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune boutique</h3>
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {/* Delete Modal */}
      {showDeleteConfirm && selectedShop && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => !actionLoading && setShowDeleteConfirm(false)} />
            <div className="relative bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
                <h3 className="text-lg font-medium">Supprimer la boutique</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Confirmer la suppression de <strong>{selectedShop.name}</strong> ? Cette action ne peut pas être annulée.
              </p>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={actionLoading !== null}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleDelete}
                  disabled={actionLoading !== null}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {showRejectModal && selectedShop && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => !actionLoading && setShowRejectModal(false)} />
            <div className="relative bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center mb-4">
                <XCircle className="h-6 w-6 text-red-600 mr-2" />
                <h3 className="text-lg font-medium">Rejeter la boutique</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Rejeter <strong>{selectedShop.name}</strong>. Veuillez indiquer une raison (facultatif).
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Raison du rejet</label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Ex: Documents invalides, description inadequate..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  disabled={actionLoading !== null}
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowRejectModal(false)}
                  disabled={actionLoading !== null}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
                >
                  Annuler
                </button>
                <button
                  onClick={handleRejectSubmit}
                  disabled={actionLoading !== null}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading ? 'Rejet en cours...' : 'Rejeter'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
