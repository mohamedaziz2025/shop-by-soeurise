'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Store, CheckCircle, XCircle, Eye, AlertCircle } from 'lucide-react';

export default function AdminShopsPage() {
  const [shops, setShops] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');

  useEffect(() => {
    fetchShops();
  }, []);

  const fetchShops = async () => {
    try {
      const data = await api.getAllShops();
      setShops(data);
    } catch (error) {
      console.error('Erreur chargement boutiques:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (shopId: string) => {
    try {
      await api.approveShop(shopId);
      fetchShops();
    } catch (error) {
      console.error('Erreur approbation:', error);
      alert('Erreur lors de l\'approbation');
    }
  };

  const handleReject = async (shopId: string) => {
    const reason = prompt('Raison du rejet :');
    if (!reason) return;

    try {
      await api.rejectShop(shopId, reason);
      fetchShops();
    } catch (error) {
      console.error('Erreur rejet:', error);
      alert('Erreur lors du rejet');
    }
  };

  const handleSuspend = async (shopId: string) => {
    if (!confirm('Suspendre cette boutique ?')) return;

    try {
      await api.suspendShop(shopId);
      fetchShops();
    } catch (error) {
      console.error('Erreur suspension:', error);
      alert('Erreur lors de la suspension');
    }
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; color: string }> = {
      PENDING: { label: 'En attente', color: 'bg-yellow-100 text-yellow-800' },
      ACTIVE: { label: 'Active', color: 'bg-green-100 text-green-800' },
      SUSPENDED: { label: 'Suspendue', color: 'bg-red-100 text-red-800' },
      REJECTED: { label: 'Rejetée', color: 'bg-gray-100 text-gray-800' },
    };

    const { label, color } = config[status] || config.PENDING;
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>{label}</span>;
  };

  const filteredShops = filter === 'ALL' ? shops : shops.filter((s) => s.status === filter);

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white border-r min-h-screen">
          <div className="p-6">
            <img src="/logo-soeurise/logo-main.svg" alt="Soeurise Admin" className="h-8 mb-6" />
            <nav className="space-y-2">
              <a href="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
                📊 Dashboard
              </a>
              <a
                href="/admin/shops"
                className="block px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium"
              >
                🏪 Boutiques
              </a>
              <a href="/admin/products" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
                📦 Produits
              </a>
              <a href="/admin/users" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
                👥 Utilisateurs
              </a>
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">Gestion des Boutiques</h1>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex gap-2 overflow-x-auto">
              {['ALL', 'PENDING', 'ACTIVE', 'SUSPENDED', 'REJECTED'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap ${
                    filter === status
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status === 'ALL' ? 'Toutes' : getStatusBadge(status).props.children}
                  <span className="ml-2 text-sm">
                    ({status === 'ALL' ? shops.length : shops.filter((s) => s.status === status).length})
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Shops List */}
          {filteredShops.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm p-12 text-center">
              <Store className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600">Aucune boutique trouvée</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredShops.map((shop) => (
                <div key={shop._id} className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start gap-6">
                    {/* Logo */}
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center">
                      {shop.logo ? (
                        <img src={shop.logo} alt={shop.name} className="w-full h-full object-contain p-2" />
                      ) : (
                        <Store className="w-10 h-10 text-gray-400" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">{shop.name}</h3>
                          <p className="text-gray-600 text-sm mb-2">{shop.description}</p>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span>Vendeuse : {shop.seller?.firstName} {shop.seller?.lastName}</span>
                            <span>•</span>
                            <span>{shop.seller?.email}</span>
                          </div>
                        </div>
                        {getStatusBadge(shop.status)}
                      </div>

                      {/* Stats */}
                      <div className="flex items-center gap-6 text-sm text-gray-600 mb-4">
                        <span>📦 {shop.productsCount || 0} produits</span>
                        <span>🛒 {shop.ordersCount || 0} commandes</span>
                        {shop.averageRating && (
                          <span>⭐ {shop.averageRating.toFixed(1)} ({shop.totalReviews} avis)</span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        {shop.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() => handleApprove(shop._id)}
                              className="px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 flex items-center gap-2"
                            >
                              <CheckCircle className="w-4 h-4" />
                              Approuver
                            </button>
                            <button
                              onClick={() => handleReject(shop._id)}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 flex items-center gap-2"
                            >
                              <XCircle className="w-4 h-4" />
                              Rejeter
                            </button>
                          </>
                        )}

                        {shop.status === 'ACTIVE' && (
                          <button
                            onClick={() => handleSuspend(shop._id)}
                            className="px-4 py-2 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 flex items-center gap-2"
                          >
                            <AlertCircle className="w-4 h-4" />
                            Suspendre
                          </button>
                        )}

                        <a
                          href={`/shops/${shop.slug}`}
                          target="_blank"
                          className="px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          Voir la boutique
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
