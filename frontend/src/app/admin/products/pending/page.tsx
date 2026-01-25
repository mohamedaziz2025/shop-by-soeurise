'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { api } from '@/lib/api';
import { Package, CheckCircle, XCircle, Store, Clock, Tag } from 'lucide-react';
import { formatDate, formatPrice } from '@/lib/utils';
import Image from 'next/image';

interface PendingProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  mainImage?: string;
  price: number;
  category?: string;
  stock: number;
  shopId: {
    _id: string;
    name: string;
    slug: string;
  };
  sellerId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  isApproved: boolean;
}

export default function AdminProductsPendingPage() {
  const [products, setProducts] = useState<PendingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingProducts();
  }, []);

  const fetchPendingProducts = async () => {
    try {
      const data = await api.getPendingProducts();
      setProducts(data);
    } catch (error) {
      console.error('Erreur chargement produits en attente:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (productId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir approuver ce produit ?')) return;

    setProcessing(productId);
    try {
      await api.approveProduct(productId);
      setProducts(products.filter(p => p._id !== productId));
      alert('Produit approuvé avec succès !');
    } catch (error) {
      console.error('Erreur approbation produit:', error);
      alert('Erreur lors de l\'approbation');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (productId: string) => {
    const note = prompt('Raison du rejet (optionnel):');
    if (note === null) return; // User cancelled

    setProcessing(productId);
    try {
      await api.rejectProduct(productId, note || undefined);
      setProducts(products.filter(p => p._id !== productId));
      alert('Produit rejeté');
    } catch (error) {
      console.error('Erreur rejet produit:', error);
      alert('Erreur lors du rejet');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Produits à approuver" subtitle="Chargement...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Produits à approuver" subtitle={`${products.length} produit(s) en attente`}>
      <div className="space-y-6">
        {products.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Tous les produits validés</h3>
            <p className="text-gray-600">Aucun produit en attente d'approbation</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {products.map((product) => (
              <div key={product._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Image */}
                <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                  {product.mainImage ? (
                    <Image 
                      src={product.mainImage} 
                      alt={product.name} 
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Package className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-orange-500 text-white rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                      <Clock className="w-4 h-4" />
                      En attente
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-3">{product.description}</p>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {formatPrice(product.price)}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Package className="w-4 h-4" />
                      <span>{product.stock} en stock</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4 pb-4 border-b border-gray-200">
                    <div className="flex items-center gap-2 text-sm">
                      <Store className="w-4 h-4 text-gray-400" />
                      <span className="font-medium text-gray-900">{product.shopId.name}</span>
                    </div>
                    {product.category && (
                      <div className="flex items-center gap-2 text-sm">
                        <Tag className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{product.category}</span>
                      </div>
                    )}
                    <div className="text-xs text-gray-500">
                      Ajouté le {formatDate(product.createdAt)}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleApprove(product._id)}
                      disabled={processing === product._id}
                      className="flex-1 px-4 py-2.5 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
                    >
                      {processing === product._id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          <span className="text-sm">Traitement...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm">Approuver</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleReject(product._id)}
                      disabled={processing === product._id}
                      className="flex-1 px-4 py-2.5 bg-white border-2 border-red-200 text-red-600 rounded-lg font-semibold hover:bg-red-50 hover:border-red-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <XCircle className="w-4 h-4" />
                      <span className="text-sm">Rejeter</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

