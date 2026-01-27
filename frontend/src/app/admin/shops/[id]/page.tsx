'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { api } from '@/lib/api';
import Image from 'next/image';
import {
  ArrowLeft,
  Store,
  User,
  Calendar,
  MapPin,
  Package,
  DollarSign,
  Star,
  AlertTriangle,
  Trash2,
  Ban,
  CheckCircle,
  Clock,
  Edit,
  Download,
  MoreHorizontal,
  Globe
} from 'lucide-react';

interface Product {
  _id: string;
  id?: string;
  name: string;
  price: number;
  stock: number;
  status: string;
  salesCount?: number;
  category: string;
}

interface ShopDetail {
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
  logo?: string;
  productsCount: number;
  ordersCount: number;
  totalSales: number;
  recentProducts: Product[];
  recentOrders: any[];
  rating?: number;
}

export default function AdminShopDetailPage() {
  const params = useParams();
  const router = useRouter();
  const shopId = params.id as string;

  const [shop, setShop] = useState<ShopDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);

  useEffect(() => {
    fetchShopDetail();
  }, [shopId]);

  const fetchShopDetail = async () => {
    try {
      setIsLoading(true);
      const data = await api.getAllShops();
      const foundShop = data.find((s: any) => (s._id || s.id) === shopId);
      if (foundShop) {
        setShop(foundShop as ShopDetail);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveShop = async () => {
    if (!shop) return;
    try {
      setActionLoading('approve');
      const shopId = shop._id || shop.id || '';
      await api.approveShopAdmin(shopId);
      alert('Boutique approuvée avec succès');
      await fetchShopDetail();
      setShowActionMenu(false);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'approbation');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSuspendShop = async () => {
    if (!shop) return;
    try {
      setActionLoading('suspend');
      const shopId = shop._id || shop.id || '';
      await api.suspendShopAdmin(shopId);
      alert('Boutique suspendue avec succès');
      await fetchShopDetail();
      setShowActionMenu(false);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suspension');
    } finally {
      setActionLoading(null);
    }
  };

  const handleActivateShop = async () => {
    if (!shop) return;
    try {
      setActionLoading('activate');
      const shopId = shop._id || shop.id || '';
      await api.approveShopAdmin(shopId);
      alert('Boutique activée avec succès');
      await fetchShopDetail();
      setShowActionMenu(false);
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de l\'activation');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteShop = async () => {
    if (!shop) return;
    try {
      setActionLoading('delete');
      const shopId = shop._id || shop.id || '';
      await api.deleteShopAdmin(shopId);
      alert('Boutique supprimée avec succès');
      router.push('/admin/shops');
    } catch (error) {
      console.error('Erreur:', error);
      alert('Erreur lors de la suppression');
    } finally {
      setActionLoading(null);
      setShowDeleteConfirm(false);
    }
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

  if (isLoading) {
    return (
      <AdminLayout title="Détails boutique" subtitle="">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!shop) {
    return (
      <AdminLayout title="Détails boutique" subtitle="">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">Boutique non trouvée</h3>
          <button
            onClick={() => router.back()}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Détails boutique" subtitle={shop.name}>
      <div className="space-y-6">
        {/* Header with back button */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour
          </button>
          <div className="relative">
            <button
              onClick={() => setShowActionMenu(!showActionMenu)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <MoreHorizontal className="w-5 h-5 text-gray-600" />
            </button>
            {showActionMenu && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setShowActionMenu(false)} />
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl z-20 border border-gray-200 overflow-hidden">
                  <div className="py-2">
                    {shop.status === 'PENDING_APPROVAL' && (
                      <>
                        <button
                          onClick={handleApproveShop}
                          disabled={actionLoading !== null}
                          className="flex items-center px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 w-full text-left disabled:opacity-50 transition-colors"
                        >
                          <CheckCircle className="w-4 h-4 mr-3" />
                          {actionLoading === 'approve' ? 'Approbation...' : 'Approuver'}
                        </button>
                      </>
                    )}
                    {shop.status === 'APPROVED' && (
                      <button
                        onClick={handleSuspendShop}
                        disabled={actionLoading !== null}
                        className="flex items-center px-4 py-2.5 text-sm text-orange-600 hover:bg-orange-50 w-full text-left disabled:opacity-50 transition-colors"
                      >
                        <AlertTriangle className="w-4 h-4 mr-3" />
                        {actionLoading === 'suspend' ? 'Suspension...' : 'Suspendre'}
                      </button>
                    )}
                    {shop.status === 'SUSPENDED' && (
                      <button
                        onClick={handleActivateShop}
                        disabled={actionLoading !== null}
                        className="flex items-center px-4 py-2.5 text-sm text-green-600 hover:bg-green-50 w-full text-left disabled:opacity-50 transition-colors"
                      >
                        <CheckCircle className="w-4 h-4 mr-3" />
                        {actionLoading === 'activate' ? 'Activation...' : 'Activer'}
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(true);
                        setShowActionMenu(false);
                      }}
                      disabled={actionLoading !== null}
                      className="flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left disabled:opacity-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-3" />
                      Supprimer la boutique
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Shop Card */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 pb-6 border-b border-gray-200">
            <div className="flex items-start gap-4 mb-4 sm:mb-0">
              <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm">
                {shop.logo ? (
                  <Image src={shop.logo} alt={shop.name} width={80} height={80} className="object-cover" />
                ) : (
                  <Store className="w-10 h-10 text-gray-400" />
                )}
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {shop.name}
                </h1>
                <p className="text-sm text-gray-500 mt-1">ID: {(shop._id || shop.id || '').substring(0, 16)}...</p>
              </div>
            </div>
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${getStatusColor(shop.status)}`}>
              {shop.status === 'APPROVED' && <CheckCircle className="w-3.5 h-3.5" />}
              {shop.status === 'SUSPENDED' && <AlertTriangle className="w-3.5 h-3.5" />}
              {shop.status === 'PENDING_APPROVAL' && <Clock className="w-3.5 h-3.5" />}
              {shop.status}
            </span>
          </div>

          {/* Description */}
          {shop.description && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-600 mb-2">Description</h3>
              <p className="text-gray-900">{shop.description}</p>
            </div>
          )}

          {/* Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <User className="w-4 h-4" />
                <span className="text-sm font-medium">Propriétaire</span>
              </div>
              <div>
                <p className="text-gray-900 font-medium">{shop.owner?.firstName} {shop.owner?.lastName}</p>
                <p className="text-xs text-gray-500 break-all">{shop.owner?.email}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Création</span>
              </div>
              <p className="text-gray-900 font-medium">
                {new Date(shop.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>

            {shop.location && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm font-medium">Localisation</span>
                </div>
                <p className="text-gray-900 font-medium">{shop.location}</p>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Globe className="w-4 h-4" />
                <span className="text-sm font-medium">Catégorie</span>
              </div>
              <p className="text-gray-900 font-medium">{shop.category}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Package className="w-4 h-4" />
                <span className="text-sm font-medium">Produits</span>
              </div>
              <p className="text-gray-900 font-semibold text-lg">{shop.productsCount}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <DollarSign className="w-4 h-4" />
                <span className="text-sm font-medium">Total ventes</span>
              </div>
              <p className="text-gray-900 font-semibold text-lg">{shop.totalSales} €</p>
            </div>

            {shop.rating && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <Star className="w-4 h-4" />
                  <span className="text-sm font-medium">Note</span>
                </div>
                <p className="text-gray-900 font-semibold text-lg">{shop.rating}/5</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Products */}
        {shop.recentProducts && shop.recentProducts.length > 0 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-lg font-semibold text-gray-900">Produits récents</h2>
              <p className="text-sm text-gray-500 mt-1">{shop.recentProducts.length} derniers produits</p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-900 to-slate-800 text-white">
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Produit</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Catégorie</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Prix</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Stock</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Ventes</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider">Statut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {shop.recentProducts.map((product) => (
                    <tr key={product._id || product.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {product.category}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {product.price} €
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                        {product.stock} unités
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {product.salesCount || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold ${
                          product.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {product.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Export Section */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <button className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition">
            <Download className="w-4 h-4" />
            Exporter les données
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75" onClick={() => !actionLoading && setShowDeleteConfirm(false)} />
            <div className="relative bg-white rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
                <h3 className="text-lg font-medium">Supprimer la boutique</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Confirmer la suppression de <strong>{shop.name}</strong> ? Cette action ne peut pas être annulée.
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
                  onClick={handleDeleteShop}
                  disabled={actionLoading !== null}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading === 'delete' ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
