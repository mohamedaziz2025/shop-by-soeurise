'use client';

import { useState, useEffect } from 'react';
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
  Package
} from 'lucide-react';
import Image from 'next/image';

interface Shop {
  _id?: string;
  id?: string;
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
  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingShop, setEditingShop] = useState<Shop | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    category: '',
    location: ''
  });
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

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
      await api.approveShopAdmin(shopId);
      await fetchShops();
      setShowActionMenu(null);
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
    }
  };

  const handleReject = async (shopId: string) => {
    try {
      await api.rejectShopAdmin(shopId, 'Rejeté par l\'administrateur');
      await fetchShops();
      setShowActionMenu(null);
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
    }
  };

  const handleSuspend = async (shopId: string) => {
    try {
      await api.suspendShopAdmin(shopId);
      await fetchShops();
      setShowActionMenu(null);
    } catch (error) {
      console.error('Erreur lors de la suspension:', error);
    }
  };

  const handleActivate = async (shopId: string) => {
    try {
      await api.approveShopAdmin(shopId);
      await fetchShops();
      setShowActionMenu(null);
    } catch (error) {
      console.error('Erreur lors de l\'activation:', error);
    }
  };

  const handleViewShop = (shop: Shop) => {
    window.open(`/shops/${shop.slug || shop._id}`, '_blank');
  };

  const handleEditShop = (shop: Shop) => {
    setEditingShop(shop);
    setEditForm({
      name: shop.name,
      description: shop.description || '',
      category: shop.category,
      location: shop.location || ''
    });
    setShowEditModal(true);
    setShowActionMenu(null);
  };

  const handleUpdateShop = async () => {
    if (!editingShop) return;
    try {
      const shopId = editingShop._id || editingShop.id || '';
      await api.updateShopAdmin(shopId, editForm);
      await fetchShops();
      setShowEditModal(false);
      setEditingShop(null);
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
    }
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
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-medium text-gray-900">
              {filteredShops.length} boutique{filteredShops.length > 1 ? 's' : ''}
            </h3>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Boutique</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Propriétaire</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produits</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ventes</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredShops.map((shop) => {
                  const shopId = shop._id || shop.id || '';
                  return (
                    <tr key={shopId} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                            {shop.logo ? (
                              <Image src={shop.logo} alt={shop.name} width={48} height={48} className="object-cover" />
                            ) : (
                              <Store className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{shop.name}</div>
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
                        <div className="flex items-center text-sm text-gray-900">
                          <User className="w-4 h-4 mr-2 text-gray-400" />
                          {shop.owner?.firstName} {shop.owner?.lastName}
                        </div>
                        <div className="text-xs text-gray-500">{shop.owner?.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(shop.status)}`}>
                          {getStatusIcon(shop.status)}
                          <span className="ml-1">{shop.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Package className="w-4 h-4 mr-1 text-gray-400" />
                          {shop.productsCount || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {shop.totalSales || 0} €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="relative inline-block">
                          <button
                            onClick={() => setShowActionMenu(showActionMenu === shopId ? null : shopId)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                          {showActionMenu === shopId && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setShowActionMenu(null)} />
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border">
                                <div className="py-1">
                                  <button 
                                    onClick={() => handleViewShop(shop)}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  >
                                    <Eye className="w-4 h-4 mr-2" />Voir la boutique
                                  </button>
                                  <button 
                                    onClick={() => handleEditShop(shop)}
                                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                                  >
                                    <Edit className="w-4 h-4 mr-2" />Modifier
                                  </button>
                                  {shop.status === 'PENDING_APPROVAL' && (
                                    <>
                                      <button
                                        onClick={() => handleApprove(shopId)}
                                        className="flex items-center px-4 py-2 text-sm text-green-600 hover:bg-green-50 w-full text-left"
                                      >
                                        <CheckCircle className="w-4 h-4 mr-2" />Approuver
                                      </button>
                                      <button
                                        onClick={() => handleReject(shopId)}
                                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                      >
                                        <XCircle className="w-4 h-4 mr-2" />Rejeter
                                      </button>
                                    </>
                                  )}
                                  {shop.status === 'APPROVED' && (
                                    <button
                                      onClick={() => handleSuspend(shopId)}
                                      className="flex items-center px-4 py-2 text-sm text-orange-600 hover:bg-orange-50 w-full text-left"
                                    >
                                      <AlertTriangle className="w-4 h-4 mr-2" />Suspendre
                                    </button>
                                  )}
                                  {shop.status === 'SUSPENDED' && (
                                    <button
                                      onClick={() => handleActivate(shopId)}
                                      className="flex items-center px-4 py-2 text-sm text-green-600 hover:bg-green-50 w-full text-left"
                                    >
                                      <CheckCircle className="w-4 h-4 mr-2" />Activer
                                    </button>
                                  )}
                                  <button
                                    onClick={() => {
                                      setSelectedShop(shop);
                                      setShowDeleteConfirm(true);
                                      setShowActionMenu(null);
                                    }}
                                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                  >
                                    <Trash2 className="w-4 h-4 mr-2" />Supprimer
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
          <div className="lg:hidden divide-y divide-gray-200">
            {filteredShops.map((shop) => {
              const shopId = shop._id || shop.id || '';
              return (
                <div key={shopId} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {shop.logo ? (
                          <Image src={shop.logo} alt={shop.name} width={48} height={48} className="object-cover" />
                        ) : (
                          <Store className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{shop.name}</p>
                        <p className="text-xs text-gray-500">{shop.category}</p>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <User className="w-3 h-3 mr-1" />
                          {shop.owner?.firstName} {shop.owner?.lastName}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowActionMenu(showActionMenu === shopId ? null : shopId)}
                      className="ml-2 text-gray-400"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(shop.status)}`}>
                      {getStatusIcon(shop.status)}
                      <span className="ml-1">{shop.status}</span>
                    </span>
                    <span className="text-xs text-gray-500">{shop.productsCount || 0} produits</span>
                    <span className="text-xs text-gray-500">{shop.totalSales || 0} €</span>
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
                              <button onClick={() => handleApprove(shopId)} className="flex items-center px-4 py-2 text-sm text-green-600 hover:bg-green-50 w-full text-left">
                                <CheckCircle className="w-4 h-4 mr-2" />Approuver
                              </button>
                              <button onClick={() => handleReject(shopId)} className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                                <XCircle className="w-4 h-4 mr-2" />Rejeter
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
      {showEditModal && editingShop && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowEditModal(false)} />
            <div className="relative bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center mb-4">
                <Edit className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="text-lg font-medium">Modifier la boutique</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                  <select
                    value={editForm.category}
                    onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Mode">Mode</option>
                    <option value="Cosmétiques">Cosmétiques</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Localisation</label>
                  <input
                    type="text"
                    value={editForm.location}
                    onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-2 justify-end mt-6">
                <button onClick={() => setShowEditModal(false)} className="px-4 py-2 border rounded-md hover:bg-gray-50">
                  Annuler
                </button>
                <button onClick={handleUpdateShop} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  Mettre à jour
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteConfirm && selectedShop && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowDeleteConfirm(false)} />
            <div className="relative bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
                <h3 className="text-lg font-medium">Supprimer la boutique</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Confirmer la suppression de <strong>{selectedShop.name}</strong> ?
              </p>
              <div className="flex gap-2 justify-end">
                <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 border rounded-md hover:bg-gray-50">
                  Annuler
                </button>
                <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
