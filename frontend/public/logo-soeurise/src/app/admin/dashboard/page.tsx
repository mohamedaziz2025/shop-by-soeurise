'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { BarChart3, ShoppingBag, CheckCircle, AlertCircle, Users, Package } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await api.getAdminStats();
      setStats(data);
    } catch (error) {
      console.error('Erreur chargement stats admin:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="flex">
        <aside className="w-64 bg-white border-r min-h-screen">
          <div className="p-6">
            <img src="/logo-soeurise/logo-main.svg" alt="Soeurise Admin" className="h-8 mb-6" />
            <nav className="space-y-2">
              <a
                href="/admin/dashboard"
                className="block px-4 py-2 bg-blue-50 text-blue-600 rounded-lg font-medium"
              >
                <BarChart3 className="w-5 h-5 inline mr-2" />
                Dashboard
              </a>
              <a href="/admin/shops" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
                🏪 Boutiques
              </a>
              <a href="/admin/products" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
                📦 Produits
              </a>
              <a href="/admin/users" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
                👥 Utilisateurs
              </a>
              <a href="/admin/commissions" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
                💰 Commissions
              </a>
              <a href="/admin/operations" className="block px-4 py-2 hover:bg-gray-100 rounded-lg">
                ⚙️ Opérations
              </a>
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Revenue */}
            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-90">Revenus totaux</span>
                <BarChart3 className="w-6 h-6 opacity-80" />
              </div>
              <div className="text-3xl font-bold mb-1">{formatPrice(stats?.totalRevenue || 0)}</div>
              <div className="text-xs opacity-80">+15% vs mois dernier</div>
            </div>

            {/* Total Orders */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-90">Commandes</span>
                <ShoppingBag className="w-6 h-6 opacity-80" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats?.totalOrders || 0}</div>
              <div className="text-xs opacity-80">{stats?.pendingOrders || 0} en attente</div>
            </div>

            {/* Active Shops */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-90">Boutiques actives</span>
                <CheckCircle className="w-6 h-6 opacity-80" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats?.activeShops || 0}</div>
              <div className="text-xs opacity-80">
                {stats?.pendingValidation || 0} en attente de validation
              </div>
            </div>

            {/* Total Users */}
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-90">Utilisateurs</span>
                <Users className="w-6 h-6 opacity-80" />
              </div>
              <div className="text-3xl font-bold mb-1">{stats?.totalUsers || 0}</div>
              <div className="text-xs opacity-80">{stats?.newUsersThisMonth || 0} ce mois-ci</div>
            </div>
          </div>

          {/* Two Columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Pending Shops Validation */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Boutiques à valider</h2>
                <AlertCircle className="w-5 h-5 text-orange-500" />
              </div>
              <div className="space-y-3">
                {stats?.pendingShops?.length > 0 ? (
                  stats.pendingShops.map((shop: any) => (
                    <div
                      key={shop._id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div>
                        <div className="font-medium">{shop.name}</div>
                        <div className="text-sm text-gray-600">{shop.sellerName}</div>
                      </div>
                      <a
                        href={`/admin/shops/${shop._id}`}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
                      >
                        Valider
                      </a>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">Aucune boutique en attente</p>
                )}
              </div>
            </div>

            {/* Recent Products */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Produits récents</h2>
                <Package className="w-5 h-5 text-purple-500" />
              </div>
              <div className="space-y-3">
                {stats?.recentProducts?.length > 0 ? (
                  stats.recentProducts.map((product: any) => (
                    <div key={product._id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded" />
                        <div>
                          <div className="font-medium">{product.name}</div>
                          <div className="text-sm text-gray-600">{product.shopName}</div>
                        </div>
                      </div>
                      <div className="text-sm">
                        <div className="font-semibold">{formatPrice(product.price)}</div>
                        <div
                          className={`text-xs ${
                            product.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-500'
                          }`}
                        >
                          {product.status}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-center py-8">Aucun produit récent</p>
                )}
              </div>
            </div>
          </div>

          {/* Commission Report */}
          <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
            <h2 className="text-xl font-bold mb-4">Rapport des commissions</h2>
            <div className="grid grid-cols-3 gap-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {formatPrice(stats?.commissionsThisMonth || 0)}
                </div>
                <div className="text-sm text-gray-600 mt-1">Commissions ce mois</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {formatPrice(stats?.payoutsThisMonth || 0)}
                </div>
                <div className="text-sm text-gray-600 mt-1">Reversements vendeurs</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {stats?.commissionRate || 20}%
                </div>
                <div className="text-sm text-gray-600 mt-1">Taux de commission</div>
              </div>
            </div>
            <a
              href="/admin/commissions"
              className="block text-center mt-4 text-blue-600 hover:underline"
            >
              Voir le rapport détaillé →
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}
