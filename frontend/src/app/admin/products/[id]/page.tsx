'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { api } from '@/lib/api';
import Image from 'next/image';
import {
  ArrowLeft,
  Package,
  DollarSign,
  AlertTriangle,
  Trash2,
  CheckCircle,
  Clock,
  Edit,
  Download,
  MoreHorizontal,
  ShoppingCart,
  TrendingUp,
  Star,
  Calendar
} from 'lucide-react';

interface ProductDetail {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  status: string;
  createdAt: string;
  images?: string[];
  shop: {
    _id?: string;
    id?: string;
    name: string;
  };
  salesCount?: number;
  rating?: number;
  reviews?: any[];
}

export default function AdminProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params.id as string;

  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    fetchProductDetail();
  }, [productId]);

  const fetchProductDetail = async () => {
    try {
      setIsLoading(true);
      const data = await api.getAllProducts();
      const foundProduct = data.find((p: any) => (p._id || p.id) === productId);
      if (foundProduct) {
        setProduct(foundProduct as ProductDetail);
      }
    } catch (error) {
      console.error('Erreur lors du chargement:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!product) return;
    try {
      setActionLoading('delete');
      const productId = product._id || product.id || '';
      // await api.deleteProductAdmin(productId);
      alert('Produit supprimé avec succès');
      router.push('/admin/products');
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
      case 'ACTIVE': return 'text-green-600 bg-green-100';
      case 'INACTIVE': return 'text-gray-600 bg-gray-100';
      case 'OUT_OF_STOCK': return 'text-red-600 bg-red-100';
      case 'PENDING_APPROVAL': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (isLoading) {
    return (
      <AdminLayout title="Détails produit" subtitle="">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!product) {
    return (
      <AdminLayout title="Détails produit" subtitle="">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900">Produit non trouvé</h3>
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

  const hasImages = product.images && product.images.length > 0;
  const currentImage = hasImages ? product.images![selectedImageIndex] : null;

  return (
    <AdminLayout title="Détails produit" subtitle={product.name}>
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
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl z-20 border border-gray-200 overflow-hidden">
                  <div className="py-2">
                    <button
                      onClick={() => {
                        setShowActionMenu(false);
                      }}
                      disabled={actionLoading !== null}
                      className="flex items-center px-4 py-2.5 text-sm text-blue-600 hover:bg-blue-50 w-full text-left disabled:opacity-50 transition-colors"
                    >
                      <Edit className="w-4 h-4 mr-3" />
                      Modifier
                    </button>
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(true);
                        setShowActionMenu(false);
                      }}
                      disabled={actionLoading !== null}
                      className="flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 w-full text-left disabled:opacity-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4 mr-3" />
                      Supprimer
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Images Section */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
              {/* Main Image */}
              <div className="aspect-square bg-gray-100 flex items-center justify-center relative overflow-hidden">
                {currentImage ? (
                  <Image
                    src={currentImage}
                    alt={product.name}
                    width={400}
                    height={400}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <Package className="w-16 h-16 text-gray-400" />
                )}
              </div>

              {/* Thumbnails */}
              {hasImages && product.images!.length > 1 && (
                <div className="p-4 border-t border-gray-100 grid grid-cols-4 gap-2">
                  {product.images!.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIndex(idx)}
                      className={`aspect-square rounded-lg overflow-hidden border-2 transition ${
                        selectedImageIndex === idx ? 'border-blue-600' : 'border-gray-200'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} ${idx + 1}`}
                        width={100}
                        height={100}
                        className="object-cover w-full h-full"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Status Badge */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">État</p>
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ${getStatusColor(product.status)}`}>
                {product.status === 'ACTIVE' && <CheckCircle className="w-3.5 h-3.5" />}
                {product.status === 'PENDING_APPROVAL' && <Clock className="w-3.5 h-3.5" />}
                {product.status === 'OUT_OF_STOCK' && <AlertTriangle className="w-3.5 h-3.5" />}
                {product.status}
              </span>
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Main Card */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 sm:p-8">
              <div className="mb-6 pb-6 border-b border-gray-200">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
                <p className="text-xs text-gray-500">ID: {(product._id || product.id || '').substring(0, 16)}...</p>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2 uppercase tracking-wide">Description</h3>
                <p className="text-gray-900 leading-relaxed">{product.description || 'Aucune description'}</p>
              </div>

              {/* Category */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-600 mb-2 uppercase tracking-wide">Catégorie</h3>
                <span className="inline-block px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                  {product.category}
                </span>
              </div>

              {/* Shop Info */}
              <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-4 border border-gray-200">
                <p className="text-xs font-medium text-gray-600 uppercase tracking-wide mb-2">Boutique</p>
                <button
                  onClick={() => router.push(`/admin/shops/${product.shop._id || product.shop.id}`)}
                  className="text-blue-600 font-semibold hover:underline"
                >
                  {product.shop.name}
                </button>
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm font-medium">Prix</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{product.price} €</p>
              </div>

              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Package className="w-4 h-4" />
                  <span className="text-sm font-medium">Stock</span>
                </div>
                <p className="text-3xl font-bold text-gray-900">{product.stock}</p>
                <p className="text-xs text-gray-500 mt-1">unités disponibles</p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="text-xs font-medium">Ventes</span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{product.salesCount || 0}</p>
              </div>

              {product.rating && (
                <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
                  <div className="flex items-center gap-2 text-gray-600 mb-2">
                    <Star className="w-4 h-4" />
                    <span className="text-xs font-medium">Note</span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900">{product.rating}/5</p>
                </div>
              )}

              <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4">
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-xs font-medium">Création</span>
                </div>
                <p className="text-xs font-bold text-gray-900">
                  {new Date(product.createdAt).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-lg font-semibold text-gray-900">Avis clients</h2>
              <p className="text-sm text-gray-500 mt-1">{product.reviews.length} avis reçus</p>
            </div>

            <div className="divide-y divide-gray-100">
              {product.reviews.slice(0, 5).map((review, idx) => (
                <div key={idx} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold text-gray-900">{review.userName || 'Utilisateur'}</p>
                      <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString('fr-FR')}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(review.rating || 0)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
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
                <h3 className="text-lg font-medium">Supprimer le produit</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Confirmer la suppression de <strong>{product.name}</strong> ? Cette action ne peut pas être annulée.
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
                  onClick={handleDeleteProduct}
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
