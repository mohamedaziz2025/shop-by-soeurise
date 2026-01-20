'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { api } from '@/lib/api';
import LoadingSpinner from '@/components/LoadingSpinner';
import { BarChart3, Package, ShoppingBag, TrendingUp, Euro } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export default function SellerDashboardPage() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'SELLER') {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      const data = await api.getSellerStats();
      setStats(data);
    } catch (error) {
      console.error('Erreur chargement stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'SELLER') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Accès réservé aux vendeuses</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="flex">
        <aside className="w-64 bg-white border-r min-h-screen">
          <div className="p-6">
            <img src="/logo-soeurise/logo-main.svg" alt="Soeurise" className="h-8 mb-6" />
            <nav className="space-y-2">
              <a
                href="/seller/dashboard"
                className="block px-4 py-2 bg-primary/10 text-primary rounded-lg font-medium"
              >
                <BarChart3 className="w-5 h-5 inline mr-2" />
                Dashboard
              </a>
              <a
                href="/seller/products"
                className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
              >
                <Package className="w-5 h-5 inline mr-2" />
                Mes Produits
              </a>
              <a
                href="/seller/orders"
                className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
              >
                <ShoppingBag className="w-5 h-5 inline mr-2" />
                Commandes
              </a>
              <a
                href="/seller/settings"
                className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
              >
                ⚙️ Paramètres
              </a>
            </nav>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 p-8">
          <h1 className="text-3xl font-bold mb-8">Dashboard Vendeuse</h1>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Ventes du mois</span>
                <Euro className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {formatPrice(stats?.revenue || 0)}
              </div>
              <div className="text-xs text-green-600 mt-1">+12% vs mois dernier</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Commandes</span>
                <ShoppingBag className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats?.ordersCount || 0}</div>
              <div className="text-xs text-gray-500 mt-1">{stats?.pendingOrders || 0} en attente</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Produits actifs</span>
                <Package className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{stats?.activeProducts || 0}</div>
              <div className="text-xs text-gray-500 mt-1">{stats?.totalProducts || 0} au total</div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600 text-sm">Note moyenne</span>
                <TrendingUp className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {stats?.averageRating?.toFixed(1) || '0.0'} ⭐
              </div>
              <div className="text-xs text-gray-500 mt-1">{stats?.totalReviews || 0} avis</div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-bold mb-4">Commandes récentes</h2>
            <div className="space-y-3">
              {stats?.recentOrders?.length > 0 ? (
                stats.recentOrders.map((order: any) => (
                  <div key={order._id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div>
                      <div className="font-medium">Commande #{order.orderNumber}</div>
                      <div className="text-sm text-gray-600">{order.customerName}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatPrice(order.totalAmount)}</div>
                      <div className="text-xs text-gray-500">{order.status}</div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-8">Aucune commande récente</p>
              )}
            </div>
            <a href="/seller/orders" className="block text-center mt-4 text-primary hover:underline">
              Voir toutes les commandes →
            </a>
          </div>
        </main>
      </div>
    </div>
  );
}
