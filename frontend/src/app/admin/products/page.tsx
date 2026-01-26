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
  Package,
  Store,
  AlertTriangle,
  Clock,
  Trash2,
  Edit,
  Star
} from 'lucide-react';
import Image from 'next/image';

interface Product {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  status: string;
  shop: {
    _id?: string;
    id?: string;
    name: string;
    owner?: {
      firstName: string;
      lastName: string;
    };
  };
  images: string[];
  createdAt: string;
  salesCount?: number;
  rating?: number;
  stock?: number;
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, statusFilter, categoryFilter]);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      const data = await api.getAllProducts();
      setProducts(data);
    } catch (error) {
      console.error('Erreur lors du chargement des produits:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = Array.isArray(products) ? products : [];

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.shop?.name?.toLowerCase().includes(searchTerm.toLowerCase())
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

  const handleApprove = async (productId: string) => {
    try {
      await api.approveProductAdmin(productId);
      await fetchProducts();
      setShowActionMenu(null);
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error);
    }
  };

  const handleReject = async (productId: string) => {
    try {
      await api.rejectProductAdmin(productId);
      await fetchProducts();
      setShowActionMenu(null);
    } catch (error) {
      console.error('Erreur lors du rejet:', error);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    try {
      const productId = selectedProduct._id || selectedProduct.id || '';
      await api.deleteProductAdmin(productId);
      await fetchProducts();
      setShowDeleteConfirm(false);
      setSelectedProduct(null);
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
    }
  };

  const categories = [...new Set(Array.isArray(products) ? products.map(p => p.category) : [])];

  if (isLoading) {
    return (
      <AdminLayout title="Gestion des produits" subtitle="Gérer les produits">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gestion des produits" subtitle="Gérer les produits">
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

            <div className="flex gap-2 sm:gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="flex-1 sm:w-44 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="flex-1 sm:w-44 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Toutes catégories</option>
                {Array.isArray(categories) && categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-medium text-gray-900">
              {filteredProducts.length} produit{filteredProducts.length > 1 ? 's' : ''}
            </h3>
          </div>

          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Produit</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Boutique</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Prix</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {Array.isArray(filteredProducts) && filteredProducts.map((product) => {
                  const productId = product._id || product.id || '';
                  return (
                    <tr key={productId} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                            {product.images && product.images[0] ? (
                              <Image src={product.images[0]} alt={product.name} width={48} height={48} className="object-cover" />
                            ) : (
                              <Package className="w-6 h-6 text-gray-400" />
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                            <div className="text-xs text-gray-500">{product.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-900">
                          <Store className="w-4 h-4 mr-2 text-gray-400" />
                          {product.shop?.name || 'N/A'}
                        </div>
                        {product.shop?.owner && (
                          <div className="text-xs text-gray-500">
                            {product.shop.owner.firstName} {product.shop.owner.lastName}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{product.price} €</div>
                        {product.rating !== undefined && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Star className="w-3 h-3 text-yellow-400 mr-1" />
                            {product.rating.toFixed(1)}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                          {getStatusIcon(product.status)}
                          <span className="ml-1">{product.status}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {product.stock || 0} unités
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="relative inline-block">
                          <button
                            onClick={() => setShowActionMenu(showActionMenu === productId ? null : productId)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                          {showActionMenu === productId && (
                            <>
                              <div className="fixed inset-0 z-10" onClick={() => setShowActionMenu(null)} />
                              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border">
                                <div className="py-1">
                                  <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                    <Eye className="w-4 h-4 mr-2" />Voir
                                  </button>
                                  <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                                    <Edit className="w-4 h-4 mr-2" />Modifier
                                  </button>
                                  {product.status === 'PENDING_APPROVAL' && (
                                    <>
                                      <button
                                        onClick={() => handleApprove(productId)}
                                        className="flex items-center px-4 py-2 text-sm text-green-600 hover:bg-green-50 w-full text-left"
                                      >
                                        <CheckCircle className="w-4 h-4 mr-2" />Approuver
                                      </button>
                                      <button
                                        onClick={() => handleReject(productId)}
                                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                                      >
                                        <XCircle className="w-4 h-4 mr-2" />Rejeter
                                      </button>
                                    </>
                                  )}
                                  <button
                                    onClick={() => {
                                      setSelectedProduct(product);
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
            {Array.isArray(filteredProducts) && filteredProducts.map((product) => {
              const productId = product._id || product.id || '';
              return (
                <div key={productId} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                        {product.images && product.images[0] ? (
                          <Image src={product.images[0]} alt={product.name} width={48} height={48} className="object-cover" />
                        ) : (
                          <Package className="w-6 h-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.price} € • {product.category}</p>
                        <p className="text-xs text-gray-500 flex items-center mt-1">
                          <Store className="w-3 h-3 mr-1" />
                          {product.shop?.name || 'N/A'}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowActionMenu(showActionMenu === productId ? null : productId)}
                      className="ml-2 text-gray-400"
                    >
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                      {getStatusIcon(product.status)}
                      <span className="ml-1">{product.status}</span>
                    </span>
                    <span className="text-xs text-gray-500">Stock: {product.stock || 0}</span>
                  </div>

                  {showActionMenu === productId && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowActionMenu(null)} />
                      <div className="absolute right-4 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border">
                        <div className="py-1">
                          <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                            <Eye className="w-4 h-4 mr-2" />Voir
                          </button>
                          {product.status === 'PENDING_APPROVAL' && (
                            <>
                              <button onClick={() => handleApprove(productId)} className="flex items-center px-4 py-2 text-sm text-green-600 hover:bg-green-50 w-full text-left">
                                <CheckCircle className="w-4 h-4 mr-2" />Approuver
                              </button>
                              <button onClick={() => handleReject(productId)} className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                                <XCircle className="w-4 h-4 mr-2" />Rejeter
                              </button>
                            </>
                          )}
                          <button onClick={() => {
                            setSelectedProduct(product);
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

          {filteredProducts.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun produit</h3>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteConfirm && selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => setShowDeleteConfirm(false)} />
            <div className="relative bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
                <h3 className="text-lg font-medium">Supprimer le produit</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Confirmer la suppression de <strong>{selectedProduct.name}</strong> ?
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
