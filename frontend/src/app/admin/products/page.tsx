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
  Package,
  Store,
  User,
  Calendar,
  Star,
  AlertTriangle,
  Clock,
  DollarSign,
  Tag
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  status: 'pending' | 'approved' | 'rejected' | 'suspended';
  shop: {
    id: string;
    name: string;
    owner: {
      firstName: string;
      lastName: string;
    };
  };
  images: string[];
  createdAt: string;
  salesCount: number;
  rating: number;
  stock: number;
  tags: string[];
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, statusFilter, categoryFilter]);

  const fetchProducts = async () => {
    try {
      // TODO: Remplacer par l'appel API réel
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Robe d\'été fleurie',
          description: 'Belle robe légère parfaite pour l\'été',
          price: 45.99,
          category: 'Vêtements',
          status: 'pending',
          shop: {
            id: '1',
            name: 'Mode & Style',
            owner: {
              firstName: 'Jean',
              lastName: 'Martin'
            }
          },
          images: ['/images/product1.jpg'],
          createdAt: '2024-01-15',
          salesCount: 0,
          rating: 0,
          stock: 10,
          tags: ['été', 'fleur', 'robe']
        },
        {
          id: '2',
          name: 'Sac à main cuir',
          description: 'Sac élégant en cuir véritable',
          price: 89.99,
          category: 'Accessoires',
          status: 'approved',
          shop: {
            id: '2',
            name: 'Bijoux Créatifs',
            owner: {
              firstName: 'Sophie',
              lastName: 'Bernard'
            }
          },
          images: ['/images/product2.jpg'],
          createdAt: '2024-01-10',
          salesCount: 15,
          rating: 4.5,
          stock: 5,
          tags: ['cuir', 'élégant', 'sac']
        },
        {
          id: '3',
          name: 'Collier fantaisie',
          description: 'Collier coloré avec pendentif',
          price: 25.50,
          category: 'Bijoux',
          status: 'rejected',
          shop: {
            id: '2',
            name: 'Bijoux Créatifs',
            owner: {
              firstName: 'Sophie',
              lastName: 'Bernard'
            }
          },
          images: ['/images/product3.jpg'],
          createdAt: '2024-01-05',
          salesCount: 0,
          rating: 0,
          stock: 0,
          tags: ['collier', 'fantaisie', 'coloré']
        }
      ];

      setProducts(mockProducts);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.shop.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(product => product.status === statusFilter);
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    setFilteredProducts(filtered);
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

  const handleProductAction = async (productId: string, action: string) => {
    try {
      if (action === 'approve' || action === 'reject') {
        setSelectedProduct(products.find(p => p.id === productId) || null);
        setApprovalAction(action as 'approve' | 'reject');
        setShowApprovalModal(true);
      } else {
        // TODO: Implémenter les autres actions
        console.log(`Action ${action} pour le produit ${productId}`);
      }
      setShowActionMenu(null);
    } catch (error) {
      console.error('Erreur lors de l\'action produit:', error);
    }
  };

  const confirmApprovalAction = async () => {
    if (!selectedProduct || !approvalAction) return;

    try {
      // TODO: Implémenter l'appel API pour approuver/rejeter le produit
      console.log(`${approvalAction === 'approve' ? 'Approbation' : 'Rejet'} du produit ${selectedProduct.id}`);

      // Mettre à jour le statut localement
      setProducts(prev => prev.map(product =>
        product.id === selectedProduct.id
          ? { ...product, status: approvalAction === 'approve' ? 'approved' : 'rejected' }
          : product
      ));

      setShowApprovalModal(false);
      setSelectedProduct(null);
      setApprovalAction(null);
    } catch (error) {
      console.error('Erreur lors de l\'approbation/rejet:', error);
    }
  };

  const categories = [...new Set(products.map(p => p.category))];

  if (isLoading) {
    return (
      <AdminLayout title="Gestion des produits" subtitle="Approuver et gérer les produits de la plateforme">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gestion des produits" subtitle="Approuver et gérer les produits de la plateforme">
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
                  placeholder="Rechercher par nom, description ou boutique..."
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

            {/* Category Filter */}
            <div className="sm:w-48">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">Toutes les catégories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pending Approvals Alert */}
        {products.filter(p => p.status === 'pending').length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  {products.filter(p => p.status === 'pending').length} produit(s) en attente d'approbation
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p>Ces produits nécessitent votre attention pour être approuvés ou rejetés.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Product Image */}
              <div className="aspect-w-1 aspect-h-1 bg-gray-200">
                <div className="w-full h-48 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <Package className="w-12 h-12 text-gray-500" />
                </div>
              </div>

              {/* Product Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-lg font-medium text-gray-900 line-clamp-1">{product.name}</h3>
                  <div className="relative">
                    <button
                      onClick={() => setShowActionMenu(showActionMenu === product.id ? null : product.id)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                    {showActionMenu === product.id && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                        <div className="py-1">
                          <button
                            onClick={() => handleProductAction(product.id, 'view')}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            Voir détails
                          </button>
                          <button
                            onClick={() => handleProductAction(product.id, 'edit')}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Modifier
                          </button>
                          {product.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleProductAction(product.id, 'approve')}
                                className="flex items-center px-4 py-2 text-sm text-green-600 hover:bg-green-50 w-full text-left"
                              >
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Approuver
                              </button>
                              <button
                                onClick={() => handleProductAction(product.id, 'reject')}
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

                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{product.description}</p>

                {/* Price */}
                <div className="flex items-center mb-3">
                  <DollarSign className="w-4 h-4 text-gray-400 mr-1" />
                  <span className="text-lg font-semibold text-gray-900">{product.price} €</span>
                </div>

                {/* Shop */}
                <div className="flex items-center space-x-2 mb-3">
                  <Store className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{product.shop.name}</span>
                  <span className="text-xs text-gray-500">
                    ({product.shop.owner.firstName} {product.shop.owner.lastName})
                  </span>
                </div>

                {/* Category & Tags */}
                <div className="mb-3">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    <Tag className="w-3 h-3 mr-1" />
                    {product.category}
                  </span>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 pt-3 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-900">{product.salesCount}</div>
                    <div className="text-xs text-gray-500">Ventes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-semibold text-gray-900">{product.stock}</div>
                    <div className="text-xs text-gray-500">Stock</div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center">
                      <Star className="w-3 h-3 text-yellow-400 fill-current mr-1" />
                      <span className="text-sm font-semibold text-gray-900">
                        {product.rating > 0 ? product.rating : '-'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500">Note</div>
                  </div>
                </div>
              </div>

              {/* Status Badge */}
              <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                  {getStatusIcon(product.status)}
                  <span className="ml-1 capitalize">{product.status}</span>
                </span>
                <span className="ml-2 text-xs text-gray-500">
                  Créé le {new Date(product.createdAt).toLocaleDateString('fr-FR')}
                </span>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun produit trouvé</h3>
            <p className="mt-1 text-sm text-gray-500">
              Aucun produit ne correspond à vos critères de recherche.
            </p>
          </div>
        )}

        {/* Approval Modal */}
        {showApprovalModal && selectedProduct && (
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
                    {approvalAction === 'approve' ? 'Approuver' : 'Rejeter'} le produit
                  </h3>
                </div>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    Êtes-vous sûr de vouloir {approvalAction === 'approve' ? 'approuver' : 'rejeter'} le produit <strong>{selectedProduct.name}</strong> ?
                  </p>
                  {approvalAction === 'reject' && (
                    <p className="text-sm text-red-600 mt-2">
                      Cette action empêchera le produit d'être visible sur la plateforme.
                    </p>
                  )}
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setShowApprovalModal(false);
                      setSelectedProduct(null);
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