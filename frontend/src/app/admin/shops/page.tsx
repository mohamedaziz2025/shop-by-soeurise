'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import {
  Search,
  Filter,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Eye,
  Edit,
  Store,
  User,
  MapPin,
  Calendar,
  Package,
  Star,
  AlertTriangle,
  Clock
} from 'lucide-react';

interface Shop {
  id: string;
  name: string;
  description: string;
  owner: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  category: string;
  location: string;
  createdAt: string;
  productsCount: number;
  totalSales: number;
  rating: number;
  logo?: string;
}

export default function AdminShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null);

  useEffect(() => {
    fetchShops();
  }, []);

  useEffect(() => {
    filterShops();
  }, [shops, searchTerm, statusFilter]);

  const fetchShops = async () => {
    try {
      const response = await fetch('/api/shops', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors du chargement des boutiques');
      }

      const data = await response.json();

      // Transformer les données pour correspondre à l'interface Shop
      const transformedShops: Shop[] = data.map((shop: any) => ({
        id: shop._id || shop.id,
        name: shop.name,
        description: shop.description,
        owner: {
          id: shop.owner?._id || shop.owner?.id,
          firstName: shop.owner?.firstName || '',
          lastName: shop.owner?.lastName || '',
          email: shop.owner?.email || ''
        },
        status: shop.status === 'APPROVED' ? 'approved' : shop.status === 'PENDING_APPROVAL' ? 'pending' : shop.status === 'REJECTED' ? 'rejected' : 'suspended',
        category: shop.category || 'Non catégorisé',
        location: shop.location || 'Non spécifié',
        createdAt: shop.createdAt,
        productsCount: shop.productsCount || 0,
        totalSales: shop.totalSales || 0,
        rating: shop.rating || 0,
        logo: shop.logo
      }));

      setShops(transformedShops);
    } catch (error) {
      console.error('Erreur lors du chargement des boutiques:', error);
      setShops([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterShops = () => {
    let filtered = shops;

    if (searchTerm) {
      filtered = filtered.filter(shop =>
        shop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.owner.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.owner.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shop.owner.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(shop => shop.status === statusFilter);
    }

    setFilteredShops(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'suspended': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'rejected': return <XCircle className="w-4 h-4" />;
      case 'suspended': return <AlertTriangle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const handleShopAction = async (shopId: string, action: string) => {
    try {
      if (action === 'approve' || action === 'reject') {
        setSelectedShop(shops.find(s => s.id === shopId) || null);
        setApprovalAction(action as 'approve' | 'reject');
        setShowApprovalModal(true);
      } else {
        // TODO: Implémenter les autres actions
        console.log(`Action ${action} pour la boutique ${shopId}`);
      }
      setShowActionMenu(null);
    } catch (error) {
      console.error('Erreur lors de l\'action boutique:', error);
    }
  };

  const confirmApprovalAction = async () => {
    if (!selectedShop || !approvalAction) return;

    try {
      // TODO: Implémenter l'appel API pour approuver/rejeter la boutique
      console.log(`${approvalAction === 'approve' ? 'Approbation' : 'Rejet'} de la boutique ${selectedShop.id}`);

      // Mettre à jour le statut localement
      setShops(prev => prev.map(shop =>
        shop.id === selectedShop.id
          ? { ...shop, status: approvalAction === 'approve' ? 'approved' : 'rejected' }
          : shop
      ));

      setShowApprovalModal(false);
      setSelectedShop(null);
      setApprovalAction(null);
    } catch (error) {
      console.error('Erreur lors de l\'approbation/rejet:', error);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Gestion des boutiques" subtitle="Approuver et gérer les boutiques de la plateforme">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gestion des boutiques" subtitle="Approuver et gérer les boutiques de la plateforme">
      <div className="space-y-6">
        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par nom de boutique ou propriétaire..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="sm:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="approved">Approuvé</option>
                <option value="rejected">Rejeté</option>
                <option value="suspended">Suspendu</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pending Approvals Alert */}
        {shops.filter(s => s.status === 'pending').length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  {shops.filter(s => s.status === 'pending').length} boutique(s) en attente d'approbation
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Ces boutiques nécessitent votre attention pour être approuvées ou rejetées.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Shops Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShops.map((shop) => (
            <div key={shop.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Shop Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <Store className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{shop.name}</h3>
                      <p className="text-sm text-gray-500">{shop.category}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => setShowActionMenu(showActionMenu === shop.id ? null : shop.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                    {showActionMenu === shop.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <div className="py-1">
                          <button
                            onClick={() => handleShopAction(shop.id, 'view')}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Voir détails
                          </button>
                          <button
                            onClick={() => handleShopAction(shop.id, 'edit')}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </button>
                          {shop.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleShopAction(shop.id, 'approve')}
                                className="flex items-center px-4 py-2 text-sm text-green-600 hover:bg-green-50 w-full text-left"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approuver
                              </button>
                              <button
                                onClick={() => handleShopAction(shop.id, 'reject')}
                                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                              >
                                <XCircle className="w-4 h-4 mr-2" />
                                Rejeter
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Shop Content */}
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-600 line-clamp-2">{shop.description}</p>

                {/* Owner */}
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    {shop.owner.firstName} {shop.owner.lastName}
                  </span>
                </div>

                {/* Location */}
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{shop.location}</span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{shop.productsCount}</div>
                    <div className="text-xs text-gray-500">Produits</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-semibold text-gray-900">{shop.totalSales} €</div>
                    <div className="text-xs text-gray-500">Ventes</div>
                  </div>
                </div>

                {/* Rating */}
                {shop.rating > 0 && (
                  <div className="flex items-center justify-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{shop.rating}</span>
                  </div>
                )}
              </div>

              {/* Status Badge */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(shop.status)}`}>
                  {getStatusIcon(shop.status)}
                  <span className="ml-1 capitalize">{shop.status}</span>
                </span>
                <span className="ml-2 text-xs text-gray-500">
                  Créée le {new Date(shop.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredShops.length === 0 && (
          <div className="text-center py-12">
            <Store className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune boutique trouvée</h3>
            <p className="mt-1 text-sm text-gray-500">
              Aucune boutique ne correspond à vos critères de recherche.
            </p>
          </div>
        )}

        {/* Approval Modal */}
        {showApprovalModal && selectedShop && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center mb-4">
                  {approvalAction === 'approve' ? (
                    <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-500 mr-3" />
                  )}
                  <h3 className="text-lg font-medium text-gray-900">
                    {approvalAction === 'approve' ? 'Approuver' : 'Rejeter'} la boutique
                  </h3>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Êtes-vous sûr de vouloir {approvalAction === 'approve' ? 'approuver' : 'rejeter'} la boutique <strong>{selectedShop.name}</strong> ?
                  </p>
                  {approvalAction === 'reject' && (
                    <p className="text-sm text-red-600 mt-2">
                      Cette action empêchera le propriétaire de vendre sur la plateforme.
                    </p>
                  )}
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowApprovalModal(false);
                      setSelectedShop(null);
                      setApprovalAction(null);
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={confirmApprovalAction}
                    className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                      approvalAction === 'approve'
                        ? 'bg-green-600 hover:bg-green-700'
                        : 'bg-red-600 hover:bg-red-700'
                    }`}
                  >
                    {approvalAction === 'approve' ? 'Approuver' : 'Rejeter'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}