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

export default function AdminPendingShopsPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [filteredShops, setFilteredShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null);

  useEffect(() => {
    fetchPendingShops();
  }, []);

  useEffect(() => {
    filterShops();
  }, [shops, searchTerm]);

  const fetchPendingShops = async () => {
    try {
      // TODO: Remplacer par l'appel API réel - seulement les boutiques en attente
      const mockShops: Shop[] = [
        {
          id: '1',
          name: 'Mode & Style',
          description: 'Boutique de vêtements tendance pour femmes',
          owner: {
            id: '2',
            firstName: 'Jean',
            lastName: 'Martin',
            email: 'jean.martin@email.com'
          },
          status: 'pending',
          category: 'Mode',
          location: 'Paris, France',
          createdAt: '2024-01-15',
          productsCount: 25,
          totalSales: 0,
          rating: 0
        },
        {
          id: '2',
          name: 'Artisanat Local',
          description: 'Produits artisanaux faits main',
          owner: {
            id: '3',
            firstName: 'Marie',
            lastName: 'Dubois',
            email: 'marie.dubois@email.com'
          },
          status: 'pending',
          category: 'Artisanat',
          location: 'Lyon, France',
          createdAt: '2024-01-14',
          productsCount: 12,
          totalSales: 0,
          rating: 0
        },
        {
          id: '3',
          name: 'Bio & Nature',
          description: 'Produits naturels et biologiques',
          owner: {
            id: '4',
            firstName: 'Pierre',
            lastName: 'Leroy',
            email: 'pierre.leroy@email.com'
          },
          status: 'pending',
          category: 'Bio',
          location: 'Bordeaux, France',
          createdAt: '2024-01-13',
          productsCount: 8,
          totalSales: 0,
          rating: 0
        }
      ];

      setShops(mockShops);
    } catch (error) {
      console.error('Erreur lors du chargement des boutiques en attente:', error);
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

    setFilteredShops(filtered);
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

      // Supprimer de la liste des boutiques en attente (puisqu'elle sera approuvée/rejetée)
      setShops(prev => prev.filter(shop => shop.id !== selectedShop.id));

      setShowApprovalModal(false);
      setSelectedShop(null);
      setApprovalAction(null);
    } catch (error) {
      console.error('Erreur lors de l\'approbation/rejet:', error);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Boutiques en attente" subtitle="Approuver ou rejeter les nouvelles demandes de boutiques">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Boutiques en attente" subtitle="Approuver ou rejeter les nouvelles demandes de boutiques">
      <div className="space-y-6">
        {/* Alert */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                {filteredShops.length} boutique(s) en attente d'approbation
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Ces boutiques ont été soumises récemment et nécessitent votre validation avant de pouvoir vendre sur la plateforme.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex-1 max-w-md">
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
        </div>

        {/* Pending Shops List */}
        <div className="space-y-4">
          {filteredShops.map((shop) => (
            <div key={shop.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Shop Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <Store className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{shop.name}</h3>
                      <p className="text-sm text-gray-500">{shop.category} • Soumise le {new Date(shop.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-yellow-600 bg-yellow-100">
                      <Clock className="w-3 h-3 mr-1" />
                      En attente
                    </span>
                    <div className="relative">
                      <button
                        onClick={() => setShowActionMenu(showActionMenu === shop.id ? null : shop.id)}
                        className="text-gray-400 hover:text-gray-600 p-2"
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
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Shop Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Description */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Description</h4>
                    <p className="text-sm text-gray-600">{shop.description}</p>
                  </div>

                  {/* Owner Info */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Propriétaire</h4>
                    <div className="flex items-center space-x-2 mb-1">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{shop.owner.firstName} {shop.owner.lastName}</span>
                    </div>
                    <div className="text-sm text-gray-500 ml-6">{shop.owner.email}</div>
                  </div>

                  {/* Location */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Localisation</h4>
                    <div className="flex items-center space-x-2">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{shop.location}</span>
                    </div>
                  </div>

                  {/* Products Count */}
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Produits prévus</h4>
                    <div className="flex items-center space-x-2">
                      <Package className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{shop.productsCount} produits</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => handleShopAction(shop.id, 'reject')}
                    className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rejeter
                  </button>
                  <button
                    onClick={() => handleShopAction(shop.id, 'approve')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approuver
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredShops.length === 0 && (
          <div className="text-center py-12">
            <Store className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune boutique en attente</h3>
            <p className="mt-1 text-sm text-gray-500">
              Toutes les demandes de boutiques ont été traitées.
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

