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
  stock: number;
  tags: string[];
}

export default function AdminPendingProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showActionMenu, setShowActionMenu] = useState<string | null>(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null);

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, categoryFilter]);

  const fetchPendingProducts = async () => {
    try {
      // TODO: Remplacer par l'appel API réel - seulement les produits en attente
      const mockProducts: Product[] = [
        {
          id: '1',
          name: 'Robe d\'été fleurie',
          description: 'Belle robe légère parfaite pour l\'été, taille unique',
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
          stock: 10,
          tags: ['été', 'fleur', 'robe']
        },
        {
          id: '2',
          name: 'Collier artisanal',
          description: 'Collier unique créé à la main avec des pierres naturelles',
          price: 32.50,
          category: 'Bijoux',
          status: 'pending',
          shop: {
            id: '2',
            name: 'Artisanat Local',
            owner: {
              firstName: 'Marie',
              lastName: 'Dubois'
            }
          },
          images: ['/images/product2.jpg'],
          createdAt: '2024-01-14',
          stock: 5,
          tags: ['artisanal', 'pierre', 'unique']
        },
        {
          id: '3',
          name: 'Thé vert bio',
          description: 'Thé vert biologique cultivé de manière durable',
          price: 12.99,
          category: 'Alimentation',
          status: 'pending',
          shop: {
            id: '3',
            name: 'Bio & Nature',
            owner: {
              firstName: 'Pierre',
              lastName: 'Leroy'
            }
          },
          images: ['/images/product3.jpg'],
          createdAt: '2024-01-13',
          stock: 25,
          tags: ['bio', 'thé', 'durable']
        },
        {
          id: '4',
          name: 'Boucles d\'oreilles ethniques',
          description: 'Boucles d\'oreilles inspirées des motifs traditionnels africains',
          price: 28.00,
          category: 'Bijoux',
          status: 'pending',
          shop: {
            id: '2',
            name: 'Artisanat Local',
            owner: {
              firstName: 'Marie',
              lastName: 'Dubois'
            }
          },
          images: ['/images/product4.jpg'],
          createdAt: '2024-01-12',
          stock: 8,
          tags: ['ethnique', 'africain', 'traditionnel']
        }
      ];

      setProducts(mockProducts);
    } catch (error) {
      console.error('Erreur lors du chargement des produits en attente:', error);
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

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.category === categoryFilter);
    }

    setFilteredProducts(filtered);
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

      // Supprimer de la liste des produits en attente (puisqu'il sera approuvé/rejeté)
      setProducts(prev => prev.filter(product => product.id !== selectedProduct.id));

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
      <AdminLayout title="Produits en attente" subtitle="Approuver ou rejeter les nouveaux produits">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Produits en attente" subtitle="Approuver ou rejeter les nouveaux produits">
      <div className="space-y-6">
        {/* Alert */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
            <div className="ml-3">
              <h3 className="text-sm font-medium text-yellow-800">
                {filteredProducts.length} produit(s) en attente d'approbation
              </h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Ces produits ont été soumis récemment et nécessitent votre validation avant d'être visibles sur la plateforme.</p>
              </div>
            </div>
          </div>
        </div>

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

        {/* Pending Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Product Image */}
              <div className="aspect-w-1 aspect-h-1 bg-gray-200 relative">
                <div className="w-full h-48 bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <Package className="w-12 h-12 text-gray-500" />
                </div>
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-yellow-600 bg-yellow-100">
                    <Clock className="w-3 h-3 mr-1" />
                    En attente
                  </span>
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

                {/* Stock */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                  <div className="text-sm text-gray-600">
                    Stock: <span className="font-medium">{product.stock}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Soumis le {new Date(product.createdAt).toLocaleDateString('fr-FR')}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => handleProductAction(product.id, 'reject')}
                    className="inline-flex items-center px-4 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Rejeter
                  </button>
                  <button
                    onClick={() => handleProductAction(product.id, 'approve')}
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

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun produit en attente</h3>
            <p className="mt-1 text-sm text-gray-500">
              Tous les produits ont été approuvés ou rejetés.
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

