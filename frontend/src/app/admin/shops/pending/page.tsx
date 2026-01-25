'use client';

import { useEffect, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { api } from '@/lib/api';
import { Store, CheckCircle, XCircle, Eye, Clock, Mail, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';

interface PendingShop {
  _id: string;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  category?: string;
  sellerId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  createdAt: string;
  status: string;
}

export default function AdminShopsPendingPage() {
  const [shops, setShops] = useState<PendingShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  const [selectedShop, setSelectedShop] = useState<PendingShop | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    fetchPendingShops();
  }, []);

  const fetchPendingShops = async () => {
    try {
      const data = await api.getPendingShops();
      setShops(data);
    } catch (error) {
      console.error('Erreur chargement boutiques en attente:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (shopId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir approuver cette boutique ?')) return;

    setProcessing(shopId);
    try {
      await api.updateShopStatus(shopId, 'ACTIVE');
      setShops(shops.filter(s => s._id !== shopId));
      alert('Boutique approuvée avec succès !');
    } catch (error) {
      console.error('Erreur approbation boutique:', error);
      alert('Erreur lors de l\'approbation');
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (shopId: string) => {
    const reason = prompt('Raison du rejet (optionnel):');
    if (reason === null) return; // User cancelled

    setProcessing(shopId);
    try {
      await api.updateShopStatus(shopId, 'REJECTED', reason || undefined);
      setShops(shops.filter(s => s._id !== shopId));
      alert('Boutique rejetée');
    } catch (error) {
      console.error('Erreur rejet boutique:', error);
      alert('Erreur lors du rejet');
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <AdminLayout title="Boutiques à valider" subtitle="Chargement...">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Boutiques à valider" subtitle={`${shops.length} demande(s) en attente`}>
      <div className="space-y-6">
        {shops.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">Toutes les demandes traitées</h3>
            <p className="text-gray-600">Aucune boutique en attente d'approbation</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {shops.map((shop) => (
              <div key={shop._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-6">
                  <div className="flex items-start gap-6">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                      <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center overflow-hidden">
                        {shop.logo ? (
                          <Image src={shop.logo} alt={shop.name} width={96} height={96} className="object-cover" />
                        ) : (
                          <Store className="w-12 h-12 text-blue-600" />
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900 mb-1">{shop.name}</h3>
                          <p className="text-sm text-gray-500">@{shop.slug}</p>
                        </div>
                        <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          En attente
                        </span>
                      </div>

                      <p className="text-gray-700 mb-4 line-clamp-2">{shop.description}</p>

                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{shop.sellerId.firstName} {shop.sellerId.lastName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span>{formatDate(shop.createdAt)}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <a href={`mailto:${shop.sellerId.email}`} className="text-blue-600 hover:underline">
                          {shop.sellerId.email}
                        </a>
                      </div>

                      {shop.category && (
                        <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                          {shop.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => handleApprove(shop._id)}
                      disabled={processing === shop._id}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow"
                    >
                      {processing === shop._id ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          <span>Traitement...</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-5 h-5" />
                          <span>Approuver la boutique</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleReject(shop._id)}
                      disabled={processing === shop._id}
                      className="flex-1 px-4 py-3 bg-white border-2 border-red-200 text-red-600 rounded-lg font-semibold hover:bg-red-50 hover:border-red-300 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <XCircle className="w-5 h-5" />
                      <span>Rejeter</span>
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

